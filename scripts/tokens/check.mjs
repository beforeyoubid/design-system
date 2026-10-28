#!/usr/bin/env node
/**
 * Component-token checks. Fails the build when
 *   - a token file isn't compiled into src/tokens/components/index.css;
 *   - a token name doesn't parse, or names a part or cva key that no longer exists
 *     (the class edits themselves are checked by `apply.mjs --check`);
 *   - a private token is read in a component but declared in no token file, or a
 *     public or private name is declared twice;
 *   - an @ours token isn't read by any of our components;
 *   - one of our own components has the name of a shadcn registry component
 *     (scripts/tokens/registry-names.json; refresh with --update-registry);
 *   - a foreground token and the fill it sits on are under WCAG AA (4.5:1) and the
 *     pair isn't listed in scripts/tokens/contrast-exceptions.json. A listed pair is
 *     "accepted" (a decided exception) or "undecided" (a warning until Rey decides;
 *     --strict fails on it, for the release gate).
 */
import fs from 'node:fs'
import path from 'node:path'
import { findSites, parseTokenFile, parseTokenName, root, tokenDir, tokenFiles, uiDir } from './lib.mjs'
import { contrast, resolveColor, rootVars } from './color.mjs'

const errors = []
const fail = (msg) => errors.push(msg)

// ---------- registry snapshot ----------
const registryFile = path.join(root, 'scripts', 'tokens', 'registry-names.json')
if (process.argv.includes('--update-registry')) {
  const url = 'https://ui.shadcn.com/r/styles/base-maia/registry.json'
  const data = await (await fetch(url)).json()
  const names = [...new Set(data.items.map((i) => i.name))].sort()
  fs.writeFileSync(registryFile, JSON.stringify({ source: url, names }, null, 1) + '\n')
  console.log(`Updated ${names.length} registry names.`)
}

// ---------- index.css ----------
// index.css is compiled from the token files by build.mjs; `build.mjs --check` fails when it's stale.
const files = tokenFiles()
const indexFile = path.join(tokenDir, 'index.css')
const compiledIn = fs.existsSync(indexFile)
  ? [...fs.readFileSync(indexFile, 'utf8').matchAll(/\/\* ---- ([\w-]+)\.css ---- \*\//g)].map((m) => m[1])
  : []
for (const { component } of files) if (!compiledIn.includes(component)) fail(`index.css doesn't include ${component}.css (run node scripts/tokens/build.mjs)`)

// ---------- tokens ----------
const ourFiles = []
const walk = (dir) => {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    if (fs.statSync(p).isDirectory()) walk(p)
    else if (/\.tsx?$/.test(f)) ourFiles.push(p)
  }
}
walk(path.join(root, 'src', 'components'))
const allSource = ourFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n')
const ourSource = ourFiles.filter((f) => !f.startsWith(uiDir)).map((f) => fs.readFileSync(f, 'utf8')).join('\n')
const uiSources = new Map(fs.readdirSync(uiDir).filter((f) => f.endsWith('.tsx')).map((f) => [f, fs.readFileSync(path.join(uiDir, f), 'utf8')]))

const declared = new Map()
const publics = new Map()
const parsedTokens = []
for (const { component, file } of files) {
  let parsed
  try {
    parsed = parseTokenFile(file)
  } catch (e) {
    fail(e.message)
    continue
  }
  for (const rule of parsed.rules) {
    const ui = [...uiSources].find(([, src]) => findSites(src).slots.has(rule.slot))
    const keys = ui ? (() => {
      const { slots, cvas } = findSites(ui[1])
      const c = slots.get(rule.slot)?.cva
      return c ? [...(cvas.get(c)?.keys.keys() ?? [])] : []
    })() : []
    for (const t of rule.tokens) {
      const where = `${component}.css:${t.line}`
      if (declared.has(t.name)) fail(`${where}: ${t.name} is also declared in ${declared.get(t.name)}`)
      declared.set(t.name, where)
      if (rootVars.has(t.public)) fail(`${where}: ${t.public} is a brand or semantic token; a lever needs its own name (use -fill for a fill)`)
      if (publics.has(t.public)) fail(`${where}: ${t.public} is also read in ${publics.get(t.public)}`)
      publics.set(t.public, where)
      let p
      try {
        p = parseTokenName(t, rule, keys)
      } catch (e) {
        fail(`${where}: ${e.message}`)
        continue
      }
      if (!t.ours && !ui) fail(`${where}: no ui file renders data-slot="${rule.slot}" (mark the token @ours if our own component reads it)`)
      if (!t.ours && p.variant?.unresolved) fail(`${where}: "${p.variant.unresolved}" is not a cva key or @alias on data-slot="${rule.slot}"`)
      if (t.ours && !ourSource.includes(t.name)) fail(`${where}: ${t.name} is marked @ours but none of our components reads it`)
      if (!t.description) fail(`${where}: ${t.name} needs a comment saying what it's for`)
      parsedTokens.push({ ...t, ...p, slot: rule.slot, component, where })
    }
  }
}
for (const [, name] of allSource.matchAll(/\((--_[\w-]+)\)/g)) {
  if (!declared.has(name)) fail(`${name} is read in a component but declared in no token file`)
}

// ---------- registry names ----------
const registry = new Set(JSON.parse(fs.readFileSync(registryFile, 'utf8')).names)
const uiNames = new Set([...uiSources.keys()].map((f) => f.replace(/\.tsx$/, '')))
for (const f of fs.readdirSync(path.join(root, 'src', 'components'))) {
  if (!f.endsWith('.tsx')) continue
  const kebab = f.replace(/\.tsx$/, '').replace(/^BYB/, '').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
  // A wrapper of the stock component with the same name is intended.
  if (registry.has(kebab) && !uiNames.has(kebab)) fail(`src/components/${f}: "${kebab}" is a shadcn registry component; rename ours`)
}

// ---------- contrast ----------
const exceptions = JSON.parse(fs.readFileSync(path.join(root, 'scripts', 'tokens', 'contrast-exceptions.json'), 'utf8'))
const strict = process.argv.includes('--strict')
const warnings = []
const pairs = []
for (const t of parsedTokens) {
  if (t.property !== 'foreground' || t.state === 'disabled') continue
  // An @ours variant isn't a cva key; match it by its name instead.
  const variantOf = (x) => x.variant?.key ?? x.variant?.unresolved
  const same = (o) => o.slot === t.slot && ['', 'fill'].includes(o.property) && variantOf(o) === variantOf(t)
  const fill =
    parsedTokens.find((o) => same(o) && o.state === t.state) ??
    (t.state ? null : parsedTokens.find((o) => same(o) && !o.state))
  if (!fill) continue
  const fg = resolveColor(t.fallback)
  const bg = resolveColor(fill.fallback)
  if (!fg || !bg) continue
  const ratio = contrast(fg, bg)
  pairs.push({ fg: t.name, bg: fill.name, ratio })
  if (ratio < 4.5) {
    const ex = exceptions.find((e) => e.foreground === t.name && e.fill === fill.name)
    const msg = `${t.name} on ${fill.name} is ${ratio.toFixed(2)}:1, under WCAG AA 4.5:1`
    if (!ex) fail(`${t.where}: ${msg} (fix the default, or list the pair in contrast-exceptions.json)`)
    else if (ex.status !== 'accepted') (strict ? fail : (m) => warnings.push(m))(`${t.where}: ${msg} (undecided)`)
  }
}

if (warnings.length) console.warn(warnings.map((w) => `⚠ ${w}`).join('\n') + '\n')
if (errors.length) {
  console.error(errors.map((e) => `✖ ${e}`).join('\n'))
  console.error(`\n${errors.length} problem(s). ${parsedTokens.length} tokens in ${files.length} files; ${pairs.length} contrast pairs checked.`)
  process.exit(1)
}
console.log(`✅ ${parsedTokens.length} component tokens in ${files.length} files; ${pairs.length} contrast pairs checked${warnings.length ? `, ${warnings.length} undecided` : ''}.`)
