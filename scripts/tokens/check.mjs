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
 *   - a foreground token and the fill it sits on (its own part's fill, else the token its
 *     comment names with @on, else --background) are under WCAG AA (4.5:1 for text,
 *     3:1 for icon and spinner parts) and the
 *     pair isn't listed in scripts/tokens/contrast-exceptions.json. A listed pair is
 *     "accepted" (a decided exception) or "undecided" (a warning until it's decided;
 *     --strict fails on it, for the release gate). An entry whose pair now passes fails
 *     the check, so the list never hides a later regression.
 */
import fs from 'node:fs'
import path from 'node:path'
import { findSites, parseTokenFile, parseTokenName, breakpointPrefix, root, tokenDir, tokenFiles, uiDir } from './lib.mjs'
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
    // Prefer the file that defines the part's cva: another file can pass the same
    // data-slot to it (combobox renders an input-group-button).
    const withSlot = [...uiSources].filter(([, src]) => findSites(src).slots.has(rule.slot))
    const ui = withSlot.find(([, src]) => findSites(src).slots.get(rule.slot).cva) ?? withSlot[0]
    const keys = ui ? (() => {
      const { slots, cvas } = findSites(ui[1])
      const c = slots.get(rule.slot)?.cva
      return c ? [...(cvas.get(c)?.keys.keys() ?? [])] : []
    })() : []
    for (const t of rule.tokens) {
      const where = `${component}.css:${t.line}`
      if (declared.has(t.name)) fail(`${where}: ${t.name} is also declared in ${declared.get(t.name)}`)
      declared.set(t.name, where)
      if (rootVars.has(t.public)) fail(`${where}: ${t.public} is a brand or semantic token; a component token needs its own name (use -fill for a fill)`)
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
      // A component token an @add class reads names its own case (e.g. `with-icon`); it needn't be a cva key.
      const readByAdd = rule.add.some((d) => d.classes.some((c) => c.includes(`(${t.name})`)))
      if (!t.ours && !readByAdd && p.variant?.unresolved) fail(`${where}: "${p.variant.unresolved}" is not a cva key or @alias on data-slot="${rule.slot}"`)
      if (p.breakpoint) {
        const prefix = breakpointPrefix(p.breakpoint)
        const reads = rule.add.flatMap((d) => d.classes).filter((c) => c.includes(`(${t.name})`))
        if (!t.ours && !reads.length) fail(`${where}: ${t.name} is for a breakpoint, so an @add class must read it (under ${prefix})`)
        for (const c of reads) if (!c.startsWith(prefix)) fail(`${where}: ${c} reads a ${p.breakpoint} component token, so it must start with ${prefix}`)
      }
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
const unchecked = []
const failing = new Set()
// A default can point at another component token (`var(--_timeline-title-foreground)`); resolve those too.
for (const t of parsedTokens) if (!rootVars.has(t.name)) rootVars.set(t.name, t.fallback)
for (const t of parsedTokens) {
  // Disabled text is exempt from WCAG contrast.
  if (t.property !== 'foreground' || t.state === 'disabled' || /-disabled$/.test(t.slot)) continue
  // Icons and other non-text graphics need 3:1; text needs 4.5:1.
  const min = /(^|-)(icon|spinner)(-|$)/.test(t.slot) ? 3 : 4.5
  // An @ours variant isn't a cva key; match it by its name instead.
  const variantOf = (x) => x.variant?.key ?? x.variant?.unresolved
  const same = (o) => o.slot === t.slot && ['', 'fill'].includes(o.property) && variantOf(o) === variantOf(t)
  let fill =
    parsedTokens.find((o) => same(o) && o.state === t.state) ??
    (t.state ? null : parsedTokens.find((o) => same(o) && !o.state))
  if (!fill) {
    // Text with no fill of its own part sits on what is behind it: the page, unless its
    // comment names another token with @on (a parent part's fill, --card, …).
    const on = t.on ?? '--background'
    const owner = parsedTokens.find((o) => o.public === on || o.name === on)
    fill = { name: owner?.name ?? on, fallback: owner?.fallback ?? `var(${on})` }
  }
  const fg = resolveColor(t.fallback)
  const bg = resolveColor(fill.fallback)
  if (!fg || !bg) {
    // The browser picks system colours (a native <option>'s Canvas) and currentColor; nothing to check.
    if (/^(Canvas|CanvasText|Field|FieldText|currentColor|inherit)$/i.test(!fg ? t.fallback : fill.fallback)) continue
    unchecked.push(`${t.where}: couldn't work out the colour of ${!fg ? t.name : fill.name}, so ${t.name} on ${fill.name} wasn't checked for contrast`)
    continue
  }
  const ratio = contrast(fg, bg)
  pairs.push({ fg: t.name, bg: fill.name, ratio })
  if (ratio < min) {
    failing.add(`${t.name} on ${fill.name}`)
    const ex = exceptions.find((e) => e.foreground === t.name && e.fill === fill.name)
    const msg = `${t.name} on ${fill.name} is ${ratio.toFixed(2)}:1, under WCAG AA ${min}:1`
    if (!ex) fail(`${t.where}: ${msg} (fix the default, or list the pair in contrast-exceptions.json)`)
    else if (ex.status !== 'accepted') (strict ? fail : (m) => warnings.push(m))(`${t.where}: ${msg} (undecided)`)
  }
}

// An exception for a pair that now passes, or no longer exists, would hide a future failure.
for (const e of exceptions) {
  if (!failing.has(`${e.foreground} on ${e.fill}`)) fail(`contrast-exceptions.json: ${e.foreground} on ${e.fill} now passes WCAG AA (or no longer exists); remove its entry`)
}

if (warnings.length || unchecked.length) console.warn([...warnings, ...unchecked].map((w) => `⚠ ${w}`).join('\n') + '\n')
if (errors.length) {
  console.error(errors.map((e) => `✖ ${e}`).join('\n'))
  console.error(`\n${errors.length} problem(s). ${parsedTokens.length} tokens in ${files.length} files; ${pairs.length} contrast pairs checked.`)
  process.exit(1)
}
console.log(`✅ ${parsedTokens.length} component tokens in ${files.length} files; ${pairs.length} contrast pairs checked${warnings.length ? `, ${warnings.length} undecided` : ''}${unchecked.length ? `, ${unchecked.length} not checked` : ''}.`)
