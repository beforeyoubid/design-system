#!/usr/bin/env node
/**
 * Moves an app from @beforeyoubid/design-system 1.1.x to the role + step release.
 *
 *   npx design-system-migrate [paths…]            dry run: report what would change
 *   npx design-system-migrate [paths…] --write    apply the changes
 *   npx design-system-migrate --map text-xs=text-sm --write
 *
 *   npx design-system-migrate --check [paths…]   report guardrail findings (docs/README.md); changes nothing
 *   npx design-system-migrate --check --changed   only the lines changed since the last commit
 *
 * --check never fails a build: it lists what to fix, with what to use instead.
 *
 * Run it once per app, in the PR that upgrades the package. It swaps
 * rounded-xl ↔ rounded-2xl, so a second run would swap them back.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { migrateSource } from './rules.mjs'
import { CHECK_RULES, checkSource } from './check.mjs'

const EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.mdx', '.css', '.scss', '.html'])
const SKIP_DIRS = new Set(['node_modules', '.git', '.next', 'dist', 'build', 'out', 'coverage', 'storybook-static', '.turbo', '.vercel'])

function parseArgs(argv) {
  const options = { paths: [], write: false, allowDirty: false, check: false, changed: false, classRenames: {} }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--write') options.write = true
    else if (arg === '--allow-dirty') options.allowDirty = true
    else if (arg === '--check') options.check = true
    else if (arg === '--changed') options.changed = true
    else if (arg === '--map') {
      const [from, to] = (argv[++i] ?? '').split('=')
      if (!from || !to) fail('--map takes old=new, e.g. --map text-xs=text-sm')
      options.classRenames[from] = to.replace(/\+/g, ' ')
    } else if (arg === '--help' || arg === '-h') {
      console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').match(/\/\*\*([\s\S]*?)\*\//)[1].replace(/^ \* ?/gm, ''))
      process.exit(0)
    } else if (arg.startsWith('--')) fail(`Unknown option ${arg}`)
    else options.paths.push(arg)
  }
  if (options.changed && !options.check) fail('--changed goes with --check.')
  if (!options.paths.length && !options.changed) options.paths.push('.')
  return options
}

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

function uncommittedFiles(paths) {
  try {
    return execFileSync('git', ['status', '--porcelain', '--', ...paths], { encoding: 'utf8' }).trim()
  } catch {
    return '' // not a git repo
  }
}

const options = parseArgs(process.argv.slice(2))
if (options.check) {
  runCheck(options)
  process.exit(0)
}
for (const target of options.paths) if (!fs.existsSync(target)) fail(`${target} does not exist`)

if (options.write && !options.allowDirty && uncommittedFiles(options.paths)) {
  fail('Commit or stash your changes first so the migration is its own diff (or pass --allow-dirty).')
}

const ruleCounts = {}
const reviews = []
let filesChanged = 0

for (const target of options.paths) {
  for (const file of walk(target)) {
    const before = fs.readFileSync(file, 'utf8')
    const { text, changes, reviews: fileReviews } = migrateSource(before, options)
    for (const { rule } of changes) ruleCounts[rule] = (ruleCounts[rule] ?? 0) + 1
    for (const review of fileReviews) reviews.push({ file, ...review })
    if (text !== before) {
      filesChanged++
      if (options.write) fs.writeFileSync(file, text)
    }
  }
}

const total = Object.values(ruleCounts).reduce((a, b) => a + b, 0)
console.log(`${options.write ? 'Changed' : 'Would change'} ${total} uses in ${filesChanged} files:`)
for (const [rule, count] of Object.entries(ruleCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(count).padStart(5)}  ${rule}`)
}

if (Object.keys(ruleCounts).some((rule) => rule.endsWith('→ @beforeyoubid/form'))) {
  console.log('\nInputField and SelectField now come from @beforeyoubid/form: add "@beforeyoubid/form": "^2.0.0" to the app\'s dependencies,')
  console.log('and @import "@beforeyoubid/form/styles.css"; after the design system\'s globals.css.')
}

if (reviews.length) {
  console.log(`\nNeeds a person to decide (${reviews.length}):`)
  for (const { file, line, message } of reviews) console.log(`  ${file}:${line}  ${message}`)
}

if (!options.write && total) console.log('\nDry run. Re-run with --write to apply.')


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

function runCheck({ paths, changed }) {
  const scope = changed ? changedLines() : null
  const targets = changed ? [...scope.keys()] : paths
  const results = []
  for (const target of targets) {
    // A path from git diff may be a deleted file.
    if (!fs.existsSync(target)) continue
    for (const file of walk(target)) {
      const lines = scope?.get(file)
      for (const finding of checkSource(fs.readFileSync(file, 'utf8'), file)) {
        if (lines && !lines.has(finding.line)) continue
        results.push({ file, ...finding })
      }
    }
  }
  if (!results.length) {
    console.log(`✓ No guardrail findings${changed ? ' in the changed lines' : ''}.`)
    return
  }
  let current
  for (const { file, line, rule, found, use } of results) {
    if (file !== current) console.log(`\n${(current = file)}`)
    console.log(`  ${String(line).padStart(5)}  ${found}${use ? `  →  ${use}` : ''}   (${rule})`)
  }
  const counts = {}
  for (const { rule } of results) counts[rule] = (counts[rule] ?? 0) + 1
  console.log(`\n${results.length} findings:`)
  for (const [rule, count] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(`  ${String(count).padStart(5)}  ${rule}: ${CHECK_RULES[rule]}`)
  console.log('\nAdvisory: fix the ones on lines you changed. See node_modules/@beforeyoubid/design-system/docs/README.md.')
}
