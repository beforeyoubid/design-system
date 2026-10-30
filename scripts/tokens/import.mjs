#!/usr/bin/env node
/**
 * Makes a `:root { … }` block exported from the Design Console the shipped
 * defaults. Each variable goes to the file that owns it:
 *   - a component token   → its default in src/tokens/components/<component>.css
 *   - a semantic token    → its light value in globals.css
 *   - a brand token       → its value in globals.css (a colour takes a hex and is
 *                            written as OKLCH with the hex in a comment)
 * then regenerates everything derived from them.
 *
 *   pnpm tokens:import overrides.css            write the values and rebuild
 *   pnpm tokens:import overrides.css --dry-run  list what would change
 *   pbpaste | pnpm tokens:import -              read the block from stdin
 *
 * Exits non-zero, writing nothing, if a name isn't a known token.
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { parseTokenFile, root, tokenFiles } from './lib.mjs'

const argv = process.argv.slice(2)
const dryRun = argv.includes('--dry-run')
const source = argv.find((a) => !a.startsWith('--'))
if (!source) fail('Pass the exported CSS: pnpm tokens:import overrides.css (or - for stdin).')
const input = fs.readFileSync(source === '-' ? 0 : source, 'utf8')

const overrides = new Map()
for (const [, name, value] of input.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(--(?:[\w-]|\\:)+)\s*:\s*([^;{}]+);/g)) {
  overrides.set(name, value.trim())
}
if (!overrides.size) fail(`No --token: value; declarations found in ${source === '-' ? 'stdin' : source}.`)

// ---------- where each name lives ----------
const componentTokens = new Map()
for (const { file } of tokenFiles()) {
  for (const rule of parseTokenFile(file).rules) {
    for (const t of rule.tokens) componentTokens.set(t.public, { file, fallback: t.fallback })
  }
}

const globalsPath = path.join(root, 'globals.css')
const globals = fs.readFileSync(globalsPath, 'utf8').split('\n')
// The light theme: every :root block before .dark. Dark values aren't shipped to any app.
const darkStart = globals.findIndex((l) => /^\.dark\s*\{/.test(l))
const lightLines = new Map()
let inRoot = false
globals.forEach((line, i) => {
  if (darkStart !== -1 && i >= darkStart) return
  if (/^:root\s*\{/.test(line)) inRoot = true
  else if (inRoot && /^\}/.test(line)) inRoot = false
  else if (inRoot) {
    const m = line.match(/^\s*(--[\w-]+)\s*:/)
    if (m && !lightLines.has(m[1])) lightLines.set(m[1], i)
  }
})
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'console', 'src', 'generated', 'manifest.json'), 'utf8'))
const semanticNames = new Set(manifest.semantic.map((s) => s.name))

// ---------- plan ----------
const changes = []
const unknown = []
const problems = []
for (const [name, value] of overrides) {
  const component = componentTokens.get(name)
  if (component) {
    const line = fs.readFileSync(component.file, 'utf8').split('\n').findIndex((l) => l.includes(`var(${name}, `))
    changes.push({ kind: 'component', name, file: component.file, line, from: component.fallback, to: value })
    continue
  }
  const i = lightLines.get(name)
  if (i === undefined) {
    unknown.push(name)
    continue
  }
  const line = globals[i]
  const colour = line.match(/^(\s*--[\w-]+:\s*)oklch\([^)]*\);(\s*)\/\*\s*(#[0-9A-Fa-f]{6})(.*?)\*\/\s*$/)
  if (colour) {
    const hex = value.match(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/)
    if (!hex) {
      problems.push(`${name} is a brand colour: give it a hex value (#RRGGBB), not ${value}.`)
      continue
    }
    const full = '#' + (hex[1].length === 3 ? hex[1].split('').map((c) => c + c).join('') : hex[1]).toUpperCase()
    changes.push({ kind: 'brand', name, file: globalsPath, line: i, from: colour[3].toUpperCase(), to: full, text: `${colour[1]}${toOklch(full)};${colour[2]}/* ${full}${colour[4]}*/` })
    continue
  }
  const plain = line.match(/^(\s*--[\w-]+:\s*)([^;]+)(;.*)$/)
  if (!plain) fail(`globals.css:${i + 1}: can't read the value of ${name}.`)
  changes.push({ kind: semanticNames.has(name) ? 'semantic' : 'brand', name, file: globalsPath, line: i, from: plain[2].trim(), to: value, text: `${plain[1]}${value}${plain[3]}` })
}
if (unknown.length) problems.push(`Not a token in this design system:\n    ${unknown.join('\n    ')}`)
if (problems.length) fail(`Nothing was written.\n  ${problems.join('\n  ')}`)

// ---------- report ----------
const rel = (f) => path.relative(root, f)
const real = changes.filter((c) => c.from !== c.to)
for (const kind of ['brand', 'semantic', 'component']) {
  const rows = changes.filter((c) => c.kind === kind)
  if (!rows.length) continue
  console.log(`\n${kind[0].toUpperCase() + kind.slice(1)} tokens`)
  for (const c of rows) console.log(`  ${c.from === c.to ? '=' : '✎'} ${c.name}: ${c.from === c.to ? `${c.to} (already the default)` : `${c.from} → ${c.to}`}   ${rel(c.file)}:${c.line + 1}`)
}
console.log(`\n${real.length} of ${changes.length} values change.`)
if (dryRun || !real.length) process.exit(0)

// ---------- write ----------
const byFile = new Map()
for (const c of real) byFile.set(c.file, [...(byFile.get(c.file) ?? []), c])
for (const [file, list] of byFile) {
  const lines = file === globalsPath ? globals : fs.readFileSync(file, 'utf8').split('\n')
  for (const c of list) {
    if (c.text !== undefined) lines[c.line] = c.text
    else {
      const before = `var(${c.name}, ${c.from})`
      if (!lines[c.line].includes(before)) fail(`${rel(file)}:${c.line + 1}: expected ${before}`)
      lines[c.line] = lines[c.line].replace(before, `var(${c.name}, ${c.to})`)
    }
  }
  fs.writeFileSync(file, lines.join('\n'))
}

// ---------- rebuild ----------
const run = (args) => {
  const r = spawnSync(process.execPath, ['--experimental-strip-types', '--no-warnings', ...args], { cwd: root, stdio: 'inherit' })
  if (r.status !== 0) process.exit(r.status ?? 1)
}
if (byFile.has(globalsPath)) run([path.join(root, 'scripts', 'generate-tokens.mjs')])
run([path.join(root, 'scripts', 'tokens', 'build.mjs')])
console.log('\nNext: pnpm check-component-tokens, then update DESIGN.md prose and the CHANGELOG.')

function fail(message) {
  console.error(`✖ ${message}`)
  process.exit(1)
}

/** "#RRGGBB" → "oklch(L C H)", rounded like the rest of globals.css. */
function toOklch(hex) {
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  const [r, g, b] = [1, 3, 5].map((i) => lin(parseInt(hex.slice(i, i + 2), 16) / 255))
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const C = Math.hypot(A, B)
  const H = C < 1e-4 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360
  const n = (x, d) => String(+x.toFixed(d))
  return `oklch(${n(L, 4)} ${n(C, 4)} ${n(H, 2)})`
}
