#!/usr/bin/env node
/**
 * Checks app code against the design system's guardrails
 * (node_modules/@beforeyoubid/design-system/docs/README.md).
 *
 *   npx design-system-check [paths…]                report findings; changes nothing
 *   npx design-system-check --changed               only lines changed since the last commit
 *   npx design-system-check --commits abc123        only lines a commit changed
 *   npx design-system-check --commits abc..def      only lines changed after abc, up to and including def
 *   npx design-system-check --commits abc123,def456 several commits or ranges
 *   add --fix to any of these                       fix what has one safe answer, report the rest
 *   add --nearest as well                           also snap text sizes off the type scale to the nearest step
 *
 * Paths, --changed and --commits are alternatives: pass one.
 * It never fails a build. --fix only rewrites findings that look the same
 * afterwards, or as near as the scale allows: logical sides, size-*, arbitrary
 * values that are on a scale (spacing on the 2px grid, radius, opacity, z,
 * aspect, brand hex colours, tracking), Tailwind and px text sizes on the type
 * scale (and line-heights the type class already sets), brand colours with an
 * identical semantic token, design-system icon imports, and dropping dark:
 * classes. With
 * --commits it fixes the files on disk, and skips a file that has changed
 * since the commit it's checking.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { CHECK_RULES, checkSource, fixSource } from './check.mjs'

const EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.mdx', '.css', '.scss', '.html'])
const SKIP_DIRS = new Set(['node_modules', '.git', '.next', 'dist', 'build', 'out', 'coverage', 'storybook-static', '.turbo', '.vercel'])
const EMPTY_TREE = '4b825dc642cb6eb9a060e54bf8d69288fbee4904'

function fail(message) {
  console.error(`✖ ${message}`)
  process.exit(1)
}

function parseArgs(argv) {
  const options = { paths: [], changed: false, fix: false, nearest: false, commits: [] }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--help' || arg === '-h') {
      console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').match(/\/\*\*([\s\S]*?)\*\//)[1].replace(/^ \* ?/gm, ''))
      process.exit(0)
    } else if (arg === '--changed') options.changed = true
    else if (arg === '--fix') options.fix = true
    else if (arg === '--nearest') options.nearest = true
    else if (arg === '--commits' || arg.startsWith('--commits=')) {
      const value = arg.includes('=') ? arg.slice(arg.indexOf('=') + 1) : argv[++i]
      if (!value || value.startsWith('--')) fail('--commits takes a commit, a range (abc..def) or a comma-separated list.')
      options.commits.push(...value.split(',').map((s) => s.trim()).filter(Boolean))
    } else if (arg.startsWith('--')) fail(`Unknown option ${arg}`)
    else options.paths.push(arg)
  }
  const modes = [options.paths.length > 0, options.changed, options.commits.length > 0].filter(Boolean).length
  if (modes > 1) fail('Pass paths, --changed or --commits: only one of them.')
  return options
}

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] })
let top
function repoRoot() {
  try {
    return (top ??= git('rev-parse', '--show-toplevel').trim())
  } catch {
    fail('--changed and --commits need a git repository.')
  }
}
// git prints paths from the repository root; report them from here, and skip any outside here.
const fromHere = (name) => path.relative(process.cwd(), path.join(repoRoot(), name))

/** Changed line numbers per file in a `git diff -U0`: Map<path from here, Set<line>>. */
function linesFromDiff(diff) {
  const files = new Map()
  let file
  for (const line of diff.split('\n')) {
    const name = line.match(/^\+\+\+ b\/(.+)$/)
    if (name) {
      file = fromHere(name[1])
      if (!file.startsWith('..')) files.set(file, new Set())
    }
    const hunk = line.match(/^@@ -\S+ \+(\d+)(?:,(\d+))? @@/)
    if (hunk && files.has(file)) for (let i = 0; i < Number(hunk[2] ?? 1); i++) files.get(file).add(Number(hunk[1]) + i)
  }
  return files
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

/**
 * What to check: [{ file, label, text, lines (Set or null for every line), onDisk }].
 * `onDisk` says whether `text` is the file on disk, so --fix may write it.
 */
function units({ paths, changed, commits }) {
  const out = []
  const readable = (file) => EXTENSIONS.has(path.extname(file)) && fs.existsSync(file)
  if (changed) {
    repoRoot()
    for (const [file, lines] of linesFromDiff(git('diff', '--unified=0', '--no-color', 'HEAD'))) {
      if (readable(file)) out.push({ file, label: file, text: fs.readFileSync(file, 'utf8'), lines, onDisk: true })
    }
    for (const name of git('ls-files', '--others', '--exclude-standard', '--full-name', repoRoot()).split('\n').filter(Boolean)) {
      const file = fromHere(name)
      if (!file.startsWith('..') && readable(file)) out.push({ file, label: file, text: fs.readFileSync(file, 'utf8'), lines: null, onDisk: true })
    }
    return out
  }
  if (commits.length) {
    repoRoot()
    for (const spec of commits) {
      const range = spec.match(/^(.+?)\.\.(.+)$/)
      let base, end
      try {
        end = git('rev-parse', '--verify', `${range ? range[2] : spec}^{commit}`).trim()
        if (range) base = git('rev-parse', '--verify', `${range[1]}^{commit}`).trim()
        else base = git('rev-list', '--parents', '-n', '1', end).trim().split(' ')[1] ?? EMPTY_TREE
      } catch {
        fail(`${spec} isn't a commit or a range of commits in this repository.`)
      }
      const short = end.slice(0, 7)
      for (const [file, lines] of linesFromDiff(git('diff', '--unified=0', '--no-color', base, end))) {
        if (!EXTENSIONS.has(path.extname(file))) continue
        const name = path.relative(repoRoot(), path.resolve(file))
        const text = git('show', `${end}:${name}`)
        const onDisk = fs.existsSync(file) && fs.readFileSync(file, 'utf8') === text
        out.push({ file, label: `${file} @ ${short}`, text, lines, onDisk })
      }
    }
    return out
  }
  for (const target of paths.length ? paths : ['.']) {
    if (!fs.existsSync(target)) fail(`${target} does not exist`)
    for (const file of walk(target)) out.push({ file, label: file, text: fs.readFileSync(file, 'utf8'), lines: null, onDisk: true })
  }
  return out
}

const options = parseArgs(process.argv.slice(2))
const results = []
const fixedCounts = {}
const skipped = []
let filesFixed = 0
for (const unit of units(options)) {
  const inScope = (line) => !unit.lines || unit.lines.has(line)
  let text = unit.text
  if (options.fix) {
    const result = fixSource(text, unit.file, inScope, options)
    if (result.fixed.length && !unit.onDisk) skipped.push(unit.label)
    else if (result.fixed.length) {
      fs.writeFileSync(unit.file, result.text)
      text = result.text
      filesFixed++
      for (const { rule } of result.fixed) fixedCounts[rule] = (fixedCounts[rule] ?? 0) + 1
    }
  }
  for (const finding of checkSource(text, unit.file, options)) if (inScope(finding.line)) results.push({ label: unit.label, ...finding })
}

const where = options.changed ? ' in the changed lines' : options.commits.length ? ` in the lines ${options.commits.join(', ')} changed` : ''
const fixedTotal = Object.values(fixedCounts).reduce((a, b) => a + b, 0)
if (fixedTotal) {
  console.log(`Fixed ${fixedTotal} findings in ${filesFixed} files${where}:`)
  for (const [rule, count] of Object.entries(fixedCounts).sort((a, b) => b[1] - a[1])) console.log(`  ${String(count).padStart(5)}  ${rule}`)
  console.log('')
}
if (skipped.length) {
  console.log(`Not fixed, because the file has changed since that commit (fix these by hand):\n  ${skipped.join('\n  ')}\n`)
}
if (!results.length) {
  console.log(`✓ No guardrail findings${fixedTotal ? ' left' : ''}${where}.`)
  process.exit(0)
}
let current
for (const { label, line, rule, found, use, fixable } of results) {
  if (label !== current) console.log(`\n${(current = label)}`)
  console.log(`  ${String(line).padStart(5)}  ${found}${use ? `  →  ${use}` : ''}   (${rule}${fixable ? ', --fix' : ''})`)
}
const counts = {}
for (const { rule } of results) counts[rule] = (counts[rule] ?? 0) + 1
console.log(`\n${results.length} findings${where}:`)
for (const [rule, count] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(`  ${String(count).padStart(5)}  ${rule}: ${CHECK_RULES[rule]}`)
const fixableLeft = results.filter((r) => r.fixable && !r.superseded).length
if (fixableLeft && !options.fix) console.log(`\n${fixableLeft} of these have one safe answer: re-run with --fix to apply them.`)
console.log('\nAdvisory: fix the ones on lines you changed. See node_modules/@beforeyoubid/design-system/docs/README.md.')
