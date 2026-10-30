#!/usr/bin/env node
/**
 * Checks app code against the design system's guardrails
 * (node_modules/@beforeyoubid/design-system/docs/README.md).
 *
 *   npx design-system-check [paths…]          report findings; changes nothing
 *   npx design-system-check --changed         only lines changed since the last commit
 *   npx design-system-check --changed --fix   fix what has one safe answer, report the rest
 *
 * It never fails a build. --fix only rewrites findings that look the same
 * afterwards: logical sides, size-*, brand colours with an identical semantic
 * token, design-system icon imports, and dropping dark: classes.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { CHECK_RULES, checkSource, fixSource } from './check.mjs'

const EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.mdx', '.css', '.scss', '.html'])
const SKIP_DIRS = new Set(['node_modules', '.git', '.next', 'dist', 'build', 'out', 'coverage', 'storybook-static', '.turbo', '.vercel'])

const argv = process.argv.slice(2)
if (argv.includes('--help') || argv.includes('-h')) {
  console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').match(/\/\*\*([\s\S]*?)\*\//)[1].replace(/^ \* ?/gm, ''))
  process.exit(0)
}
const unknown = argv.filter((a) => a.startsWith('--') && !['--changed', '--fix'].includes(a))
if (unknown.length) fail(`Unknown option ${unknown[0]}`)
const changed = argv.includes('--changed')
const fix = argv.includes('--fix')
const paths = argv.filter((a) => !a.startsWith('--'))
if (changed && paths.length) fail('Pass paths or --changed, not both.')

function fail(message) {
  console.error(`✖ ${message}`)
  process.exit(1)
}

function* walk(target) {
  const stat = fs.statSync(target)
  if (stat.isFile()) {
    if (EXTENSIONS.has(path.extname(target))) yield target
    return
  }
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue
    yield* walk(path.join(target, entry.name))
  }
}

/** Lines changed since HEAD, per file: a Set of line numbers, or null for a new file (every line). */
function changedLines() {
  const git = (...args) => execFileSync('git', args, { encoding: 'utf8' })
  const files = new Map()
  // git prints paths from the repository root; report them from here, and skip any outside here.
  const add = (name, lines) => {
    const rel = path.relative(process.cwd(), path.join(top, name))
    if (!rel.startsWith('..')) files.set(rel, lines)
    return rel
  }
  let top
  try {
    top = git('rev-parse', '--show-toplevel').trim()
    let file
    for (const line of git('diff', '--unified=0', '--no-color', 'HEAD').split('\n')) {
      const name = line.match(/^\+\+\+ b\/(.+)$/)
      if (name) file = add(name[1], new Set())
      const hunk = line.match(/^@@ -\S+ \+(\d+)(?:,(\d+))? @@/)
      if (hunk && files.has(file)) for (let i = 0; i < Number(hunk[2] ?? 1); i++) files.get(file).add(Number(hunk[1]) + i)
    }
    for (const name of git('ls-files', '--others', '--exclude-standard', '--full-name', top).split('\n').filter(Boolean)) add(name, null)
  } catch {
    fail('--changed needs a git repository with at least one commit.')
  }
  return files
}

const scope = changed ? changedLines() : null
const targets = changed ? [...scope.keys()] : paths.length ? paths : ['.']
const results = []
const fixedCounts = {}
let filesFixed = 0
for (const target of targets) {
  // A path from git diff may be a deleted file.
  if (!fs.existsSync(target)) continue
  for (const file of walk(target)) {
    const lines = scope?.get(file)
    const inScope = (line) => !lines || lines.has(line)
    let text = fs.readFileSync(file, 'utf8')
    if (fix) {
      const result = fixSource(text, file, inScope)
      if (result.fixed.length) {
        fs.writeFileSync(file, result.text)
        text = result.text
        filesFixed++
        for (const { rule } of result.fixed) fixedCounts[rule] = (fixedCounts[rule] ?? 0) + 1
      }
    }
    for (const finding of checkSource(text, file)) if (inScope(finding.line)) results.push({ file, ...finding })
  }
}

const where = changed ? ' in the changed lines' : ''
const fixedTotal = Object.values(fixedCounts).reduce((a, b) => a + b, 0)
if (fixedTotal) {
  console.log(`Fixed ${fixedTotal} findings in ${filesFixed} files${where}:`)
  for (const [rule, count] of Object.entries(fixedCounts).sort((a, b) => b[1] - a[1])) console.log(`  ${String(count).padStart(5)}  ${rule}`)
  console.log('')
}
if (!results.length) {
  console.log(`✓ No guardrail findings${fixedTotal ? ' left' : ''}${where}.`)
  process.exit(0)
}
let current
for (const { file, line, rule, found, use, fixable } of results) {
  if (file !== current) console.log(`\n${(current = file)}`)
  console.log(`  ${String(line).padStart(5)}  ${found}${use ? `  →  ${use}` : ''}   (${rule}${fixable ? ', --fix' : ''})`)
}
const counts = {}
for (const { rule } of results) counts[rule] = (counts[rule] ?? 0) + 1
console.log(`\n${results.length} findings${where}:`)
for (const [rule, count] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(`  ${String(count).padStart(5)}  ${rule}: ${CHECK_RULES[rule]}`)
const fixableLeft = results.filter((r) => r.fixable).length
if (fixableLeft) console.log(`\n${fixableLeft} of these have one safe answer: re-run with --fix to apply them.`)
console.log('\nAdvisory: fix the ones on lines you changed. See node_modules/@beforeyoubid/design-system/docs/README.md.')
