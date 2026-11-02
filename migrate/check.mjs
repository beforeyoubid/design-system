/**
 * Advisory checks for app code against the design system's guardrails
 * (docs/README.md in the package). Each finding names the rule, what was found
 * and what to use instead. `fixSource` applies the findings marked `fixable`:
 * the ones with exactly one right answer that looks the same as before.
 */

import { readFileSync } from 'node:fs'
import { CLASS_RENAMES } from './rules.mjs'

const RULES = {
  'removed-class': 'This class was removed in 2.0 and does nothing: it generates no CSS',
  'logical-direction': 'Use logical sides (start/end) so layouts flip for right-to-left',
  'direction-review': "This has no logical twin: check it still reads right when the layout flips for right-to-left",
  'arbitrary-value': 'Use a token or utility instead of an arbitrary [value]',
  'type-scale': "Use the design system's type classes instead of Tailwind's sizes",
  'semantic-colour': 'Prefer the semantic token over its brand equivalent',
  'gap-not-space': 'Use flex or grid with gap instead of space-x / space-y',
  'size-shorthand': 'Use size-* when width and height match',
  'no-dark-variant': "Dark mode isn't configured or optimised yet; drop the dark: variant",
  'inline-style': 'Use classes or a component token instead of an inline style',
  'icon-import': 'Import icons from the design system',
  'render-not-as-child': 'Design system components take render={<… />}, not asChild',
}
export const CHECK_RULES = RULES

const DIRECTION = [
  [/^(-?)(m|p|scroll-m|scroll-p)(l|r)-(.+)$/, (_, neg, box, side, rest) => `${neg}${box}${side === 'l' ? 's' : 'e'}-${rest}`],
  [/^(-?)(left|right)-(.+)$/, (_, neg, side, rest) => `${neg}${side === 'left' ? 'start' : 'end'}-${rest}`],
  [/^text-(left|right)$/, (_, side) => `text-${side === 'left' ? 'start' : 'end'}`],
  [/^(float|clear)-(left|right)$/, (_, kind, side) => `${kind}-${side === 'left' ? 'start' : 'end'}`],
  [/^rounded-(l|r|tl|tr|bl|br)(-.+)?$/, (_, side, rest = '') => `rounded-${{ l: 's', r: 'e', tl: 'ss', tr: 'se', bl: 'es', br: 'ee' }[side]}${rest}`],
  [/^border-(l|r)(-.+)?$/, (_, side, rest = '') => `border-${side === 'l' ? 's' : 'e'}${rest}`],
]

// The scales the fixes snap to, read from the package's own globals.css so they can't drift.
const GLOBALS = readFileSync(new URL('../globals.css', import.meta.url), 'utf8')
const pxOf = (n, unit) => (unit === 'rem' ? +n * 16 : +n)
const TYPE_STEPS = [...GLOBALS.matchAll(/--text-((?:display-|h|body-|caption-)\d):\s*([\d.]+)px;/g)].map(([, name, px]) => ({
  name,
  px: +px,
  lineHeight: +GLOBALS.match(new RegExp(`--text-${name}--line-height:\\s*([\\d.]+)`))[1],
  heading: new RegExp(`--text-${name}--font-weight:`).test(GLOBALS),
}))
const STEP_BY_NAME = new Map(TYPE_STEPS.map((s) => [s.name, s]))
const STEP_PX = [...new Set(TYPE_STEPS.map((s) => s.px))].sort((a, b) => a - b)
const RADIUS_BY_PX = new Map([[0, 'none'], ...[...GLOBALS.matchAll(/--radius-(\w+):\s*([\d.]+)(px|rem);/g)].map(([, name, n, unit]) => [pxOf(n, unit), name])])
const TRACKING = Object.fromEntries([...GLOBALS.matchAll(/--tracking-(\w+):\s*(-?[\d.]+em);/g)].map(([, name, value]) => [value.replace(/^(-?)0\./, '$1.'), name]))
const BRAND_BY_HEX = new Map()
for (const [, name, hex] of GLOBALS.matchAll(/--([a-z][\w-]*):\s*oklch\([^)]*\);\s*\/\*\s*#([0-9a-f]{6})/gi)) if (!BRAND_BY_HEX.has(hex.toLowerCase())) BRAND_BY_HEX.set(hex.toLowerCase(), name)

// 1.1.x classes that 2.0 removed, with what replaced them. text-xs isn't one: it's Tailwind's 12px again.
const REMOVED = new Map(Object.entries(CLASS_RENAMES).filter(([from]) => from !== 'text-xs'))
const REMOVED_RADIUS = /^rounded(-[a-z]{1,2})?-btn$/
const REMOVED_COBALT = /^([a-z-]+)-cobalt(-l1)?(\/.+)?$/

// Tailwind's own text sizes, in px.
const TAILWIND_SIZES = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30, '4xl': 36, '5xl': 48, '6xl': 60, '7xl': 72, '8xl': 96, '9xl': 128 }
const TEXT_SIZE = /^text-(?:(xs|sm|base|lg|[2-9]?xl)|\[([\d.]+)(px|rem)\])(\/.+)?$/
const WEIGHT = /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/
const BOLD = /^(semibold|bold|extrabold|black)$/

/** The type class for a size in px, given the string's weight; null when the size is off the scale. */
function typeClassFor(px, weight) {
  const steps = TYPE_STEPS.filter((s) => s.px === px)
  const heading = steps.find((s) => s.heading)
  const body = steps.find((s) => !s.heading)
  if (heading && (BOLD.test(weight ?? '') || !body)) return { step: heading, extra: weight ? '' : ' font-normal' }
  return body ? { step: body, extra: '' } : null
}
const nearestPx = (px) => STEP_PX.reduce((best, s) => (Math.abs(s - px) < Math.abs(best - px) || (Math.abs(s - px) === Math.abs(best - px) && s > best) ? s : best))
const neighbours = (px) => [STEP_PX.findLast((s) => s < px), STEP_PX.find((s) => s > px)].filter((s) => s !== undefined)

// Spacing utilities that read the spacing scale, and the ones that may go negative.
const SPACING = /^(-?)((?:min-|max-)?[wh]|size|(?:scroll-)?[mp][xytblrse]?|gap(?:-[xy])?|space-[xy]|inset(?:-[xy])?|top|bottom|left|right|start|end|translate-[xy]|basis|indent)-\[(-?)([\d.]+)(px|rem)\]$/
const MAY_BE_NEGATIVE = /^((?:scroll-)?m[xytblrse]?|space-[xy]|inset(?:-[xy])?|top|bottom|left|right|start|end|translate-[xy]|indent)$/
const RADIUS = /^rounded(-(?:[tblrse]|tl|tr|bl|br|ss|se|es|ee))?-\[([\d.]+)(px|rem)\]$/
const HEX_COLOUR = /^(bg|text|border(?:-[xytblrse])?|fill|stroke|ring|outline|divide|from|via|to|decoration|placeholder|caret|accent|shadow)-\[#([0-9a-f]{3}|[0-9a-f]{6})\](\/.+)?$/i
// Arbitrary values with nothing on a scale to swap to: viewport and container units, maths, grid templates.
const NO_TOKEN = /%|\d(?:[dsl]?v[hwib]|vmin|vmax|cq\w*|ch|ex|fr)\b|\b(?:calc|url|min|max|clamp|repeat|minmax)\(|_|^(?:grid-cols|grid-rows|content|col|row|animate|ease|transition)-/
// Physical directions with no logical twin. Centring with -translate-x-1/2 is the exception.
const NO_LOGICAL_TWIN = /^(-?translate-x-.+|origin-(?:top-|bottom-)?(?:left|right)|bg-(?:(?:top|bottom)-)?(?:left|right)(?:-(?:top|bottom))?|object-(?:(?:top|bottom)-)?(?:left|right)(?:-(?:top|bottom))?)$/

// Brand utilities with a semantic token of exactly the same colour, by what the utility paints.
const SEMANTIC = {
  fill: { 'light-l2': 'secondary', 'light-l1': 'muted', 'mint-45': 'primary', 'mint-l3': 'accent', 'error-75': 'destructive', 'warning-45': 'warning', 'mint-15': 'success' },
  text: { 'dark-100': 'foreground', 'dark-75': 'muted-foreground', 'error-75': 'destructive' },
  line: { 'dark-15': 'border', 'dark-45': 'input', 'error-75': 'destructive' },
  ring: { 'mint-45': 'ring', 'error-75': 'destructive' },
}
const PAINTS = { bg: 'fill', fill: 'fill', text: 'text', border: 'line', divide: 'line', ring: 'ring', outline: 'ring' }
const COLOUR_CLASS = /^(bg|fill|text|border|divide|ring|outline)-([a-z]+-(?:l?\d+))(\/\d+)?$/

/** Split a class at top-level colons: "md:data-[x=y]:p-2" → ["md", "data-[x=y]", "p-2"]. */
function segments(cls) {
  const out = []
  let depth = 0
  let cur = ''
  for (const ch of cls) {
    if (ch === '[' || ch === '(') depth++
    if (ch === ']' || ch === ')') depth--
    if (ch === ':' && depth === 0) {
      out.push(cur)
      cur = ''
    } else cur += ch
  }
  out.push(cur)
  return out
}

// A class string is all class-shaped words; anything else (prose, a URL, a path) is skipped whole.
const CLASS_WORD = /^!?-?[a-z0-9@*[(][^\s{};,]*$/
const looksLikeClasses = (tokens) => tokens.length > 0 && tokens.every((t) => CLASS_WORD.test(t) && !/[.?!]$|^https?:|\/\/|\.[a-z]\w*$/i.test(t))

/**
 * Findings for one class string: [{ rule, found, use, fixable }].
 * A class can take several fixes in turn (ml-[8px] → ml-2 → ms-2); each finding's `use` carries
 * the fixes before it, and only the last fixable one is applied (the rest are marked `superseded`).
 * `options.nearest` snaps off-scale text sizes to the nearest type step instead of only reporting them.
 */
export function checkClasses(classes, options = {}) {
  const findings = []
  const tokens = classes.split(/\s+/).filter(Boolean)
  if (!looksLikeClasses(tokens)) return findings
  const parsed = tokens.map((token) => {
    const parts = segments(token)
    const raw = parts.at(-1)
    const bang = raw.startsWith('!') ? '!' : ''
    return { token, variants: parts.slice(0, -1), prefix: parts.length > 1 ? parts.slice(0, -1).join(':') + ':' : '', bang, utility: raw.slice(bang.length) }
  })

  // What the string says about weight and size, by variant prefix: the type fixes depend on both.
  const weights = new Map()
  for (const p of parsed) {
    const weight = p.utility.match(WEIGHT)
    if (weight) weights.set(p.prefix, weight[1])
  }
  const weightAt = (prefix) => weights.get(prefix) ?? weights.get('')
  const typeOf = (p) => {
    const size = p.utility.match(TEXT_SIZE)
    if (!size) return STEP_BY_NAME.has(p.utility.replace(/^text-|\/.+$/g, '')) ? { step: STEP_BY_NAME.get(p.utility.replace(/^text-|\/.+$/g, '')), extra: '' } : null
    const px = size[1] ? TAILWIND_SIZES[size[1]] : pxOf(size[2], size[3])
    return typeClassFor(px, weightAt(p.prefix)) ?? (options.nearest ? typeClassFor(nearestPx(px), weightAt(p.prefix)) : null)
  }
  const leadingAt = new Set(parsed.filter((p) => p.utility.startsWith('leading-')).map((p) => p.prefix))
  const stepAt = new Map()
  for (const p of parsed) {
    const type = typeOf(p)
    if (type) stepAt.set(p.prefix, type.step)
  }

  const sizes = new Map()
  for (const { token, variants, prefix, bang, utility: original } of parsed) {
    if (variants.includes('dark')) {
      findings.push({ rule: 'no-dark-variant', found: token, use: '', fixable: true })
      continue
    }
    let utility = original
    const steps = []
    const fix = (rule, next) => {
      utility = next
      steps.push({ rule, found: token, use: next === '' ? '' : prefix + bang + next, fixable: true })
    }
    const report = (rule, use) => steps.push({ rule, found: token, ...(use ? { use } : {}) })
    let m

    // Removed in 2.0: a warning only, with what replaced it.
    const base = utility.replace(/\/.+$/, '')
    if (REMOVED.has(base)) report('removed-class', REMOVED.get(base).split(' ').map((c) => prefix + bang + c).join(' '))
    else if ((m = utility.match(REMOVED_RADIUS))) report('removed-class', `${prefix}${bang}rounded${m[1] ?? ''}-xl`)
    else if ((m = utility.match(REMOVED_COBALT))) report('removed-class', `${prefix}${bang}${m[1]}-electric-blue${m[2] ?? ''}${m[3] ?? ''}`)

    // Arbitrary values that are already on a scale.
    if ((m = utility.match(/^(-?)([a-z][\w-]*)-\[var\((--[\w-]+)\)\](\/.+)?$/))) fix('arbitrary-value', `${m[1]}${m[2]}-(${m[3]})${m[4] ?? ''}`)
    if ((m = utility.match(SPACING))) {
      const [, neg, box, inner, n, unit] = m
      const px = pxOf(n, unit)
      const negative = (neg === '-') !== (inner === '-') && px !== 0
      if ((!negative || MAY_BE_NEGATIVE.test(box)) && (px === 1 || Number.isInteger(px / 2))) fix('arbitrary-value', `${negative ? '-' : ''}${box}-${px === 1 ? 'px' : px / 4}`)
    }
    if ((m = utility.match(RADIUS))) {
      const px = pxOf(m[2], m[3])
      const step = px >= 9999 ? 'full' : RADIUS_BY_PX.get(px)
      if (step) fix('arbitrary-value', `rounded${m[1] ?? ''}-${step}`)
    }
    if ((m = utility.match(/^opacity-\[(0|1|0?\.\d+|\d+%)\]$/))) {
      const pct = m[1].endsWith('%') ? +m[1].slice(0, -1) : Math.round(+m[1] * 1000) / 10
      if (Number.isInteger(pct)) fix('arbitrary-value', `opacity-${pct}`)
    }
    if ((m = utility.match(/^(-?)z-\[(-?)(\d+)\]$/))) fix('arbitrary-value', `${(m[1] === '-') !== (m[2] === '-') ? '-' : ''}z-${m[3]}`)
    if ((m = utility.match(/^aspect-\[(\d+)\/(\d+)\]$/))) fix('arbitrary-value', `aspect-${{ '16/9': 'video', '1/1': 'square' }[`${m[1]}/${m[2]}`] ?? `${m[1]}/${m[2]}`}`)
    if ((m = utility.match(HEX_COLOUR))) {
      const hex = m[2].length === 3 ? m[2].replace(/./g, '$&$&') : m[2]
      const brand = BRAND_BY_HEX.get(hex.toLowerCase())
      if (brand) fix('arbitrary-value', `${m[1]}-${brand}${m[3] ?? ''}`)
    }
    if ((m = utility.match(/^tracking-\[(-?)0?(\.\d+)em\]$/)) && TRACKING[`${m[1]}${m[2]}em`]) fix('arbitrary-value', `tracking-${TRACKING[`${m[1]}${m[2]}em`]}`)

    // Text sizes to the type scale, and line-heights the type class already sets.
    if ((m = utility.match(TEXT_SIZE))) {
      const px = m[1] ? TAILWIND_SIZES[m[1]] : pxOf(m[2], m[3])
      const exact = typeClassFor(px, weightAt(prefix))
      const type = exact ?? (options.nearest ? typeClassFor(nearestPx(px), weightAt(prefix)) : null)
      if (type) fix('type-scale', `text-${type.step.name}${m[4] ?? ''}${type.extra ? ` ${prefix}${type.extra.trim()}` : ''}`)
      else report('type-scale', neighbours(px).map((s) => `${prefix}text-${typeClassFor(s, weightAt(prefix)).step.name} (${s}px)`).join(' or '))
    }
    if ((m = utility.match(/^leading-\[([\d.]+)(px|%)?\]$/))) {
      const step = stepAt.get(prefix) ?? stepAt.get('')
      const ratio = (value) => (m[2] === '%' ? +m[1] / 100 : m[2] === 'px' ? +m[1] / value.px : +m[1])
      // An unprefixed line-height also applies under every prefix that doesn't set its own: drop it only if they all agree.
      const agree = prefix !== '' || [...stepAt.entries()].every(([at, s]) => leadingAt.has(at) && at !== '' ? true : Math.abs(ratio(s) - s.lineHeight) < 0.005)
      if (step && agree && Math.abs(ratio(step) - step.lineHeight) < 0.005) fix('type-scale', '')
    }

    if (utility !== '') {
      if (/^-?[a-z][\w-]*-\[[^\]"']+\](\/.+)?$|^\[[a-z-]+:[^\]"']+\]$/.test(utility) && !NO_TOKEN.test(utility) && !steps.some((s) => s.rule === 'type-scale')) report('arbitrary-value')
      for (const [re, to] of DIRECTION) {
        if (!re.test(utility)) continue
        // Centring with left-1/2 -translate-x-1/2 is the one place a physical side is right.
        if (/^-?(left|right)-1\/2$/.test(utility) && /translate-x/.test(classes)) report('logical-direction', prefix + bang + utility.replace(re, to))
        else fix('logical-direction', utility.replace(re, to))
      }
      const centring = /^-translate-x-1\/2$/.test(utility) && /(^|\s|:)-?(left|right)-1\/2(\s|$)/.test(classes)
      if (NO_LOGICAL_TWIN.test(utility) && !centring) report('direction-review')
      if (/^-?space-(x|y)-/.test(utility)) report('gap-not-space', `${prefix}flex ${prefix}gap-…`)
      const colour = utility.match(COLOUR_CLASS)
      const semantic = colour && SEMANTIC[PAINTS[colour[1]]][colour[2]]
      if (semantic) fix('semantic-colour', `${colour[1]}-${semantic}${colour[3] ?? ''}`)
      const wh = utility.match(/^(w|h)-(.+)$/)
      if (wh && !/^(screen|auto|fit|min|max|dvh|svh|lvh)/.test(wh[2]) && !bang) {
        const key = `${prefix}${wh[2]}`
        sizes.set(key, (sizes.get(key) ?? new Set()).add(wh[1]))
      }
    }

    const fixes = steps.filter((s) => s.fixable)
    for (const s of fixes.slice(0, -1)) s.superseded = true
    if (fixes.length > 1) fixes.at(-1).also = fixes.slice(0, -1)
    findings.push(...steps)
  }
  for (const [key, seen] of sizes) {
    if (seen.size === 2) {
      const at = key.lastIndexOf(':') + 1
      findings.push({ rule: 'size-shorthand', found: `${key.slice(0, at)}w-${key.slice(at)} ${key.slice(0, at)}h-${key.slice(at)}`, use: `${key.slice(0, at)}size-${key.slice(at)}`, fixable: true })
    }
  }
  return findings
}

/**
 * The string literals in source: [{ index, body }], index at the opening quote. Comments are
 * skipped, and a ' or " that doesn't close on its own line is an apostrophe in JSX text, not a
 * string, so it can't swallow the code after it.
 */
function* stringsIn(source) {
  let i = 0
  while (i < source.length) {
    const ch = source[i]
    if (ch === '/' && source[i + 1] === '/') {
      i = source.indexOf('\n', i)
      if (i < 0) return
    } else if (ch === '/' && source[i + 1] === '*') {
      i = source.indexOf('*/', i + 2)
      if (i < 0) return
      i += 2
    } else if (ch === "'" || ch === '"') {
      let j = i + 1
      while (j < source.length && source[j] !== ch && source[j] !== '\n') j += source[j] === '\\' ? 2 : 1
      if (source[j] === ch) {
        yield { index: i, body: source.slice(i + 1, j) }
        i = j + 1
      } else i++
    } else if (ch === '`') {
      let j = i + 1
      let depth = 0
      while (j < source.length && (depth > 0 || source[j] !== '`')) {
        if (source[j] === '\\') j++
        else if (source[j] === '$' && source[j + 1] === '{') (depth++, j++)
        else if (source[j] === '}' && depth > 0) depth--
        j++
      }
      yield { index: i, body: source.slice(i + 1, j) }
      i = j + 1
    } else i++
  }
}
const lineOf = (text, offset) => text.slice(0, offset).split('\n').length

/** Findings for a file's text: [{ rule, line, found, use }]. */
export function checkSource(text, file = 'x.tsx', options = {}) {
  const findings = []
  // Tests query the DOM with selectors that look like arbitrary values; they aren't UI code.
  if (/\.(test|spec)\.[cm]?[jt]sx?$|(^|\/)(__tests__|playwright-tests|e2e)\//.test(file)) return findings
  const add = (line, f) => findings.push({ line, ...f })

  if (/\.(s?css)$/.test(file)) {
    for (const m of text.matchAll(/@apply\s+([^;]+);/g)) for (const f of checkClasses(m[1], options)) add(lineOf(text, m.index), f)
    return findings
  }

  for (const m of text.matchAll(/import[^'"]*from\s*['"](@tabler\/icons-react|lucide-react)['"]/g)) {
    add(lineOf(text, m.index + m[0].length - 1), { rule: 'icon-import', found: m[1], use: m[1] === 'lucide-react' ? '@beforeyoubid/design-system/icons/lucide' : '@beforeyoubid/design-system/icons', fixable: true })
  }
  for (const m of text.matchAll(/(?<=\s)style=\{\{/g)) add(lineOf(text, m.index), { rule: 'inline-style', found: 'style={{…}}' })
  for (const m of text.matchAll(/<[A-Z][\w.]*\b[^>]*?\basChild\b/g)) add(lineOf(text, m.index + m[0].lastIndexOf('asChild')), { rule: 'render-not-as-child', found: 'asChild', use: 'render={<… />}' })

  // Import specifiers aren't classes; blank them out, keeping offsets and line numbers.
  const code = text.replace(/^\s*import\b[\s\S]*?from\s*(['"])[^'"]+\1;?|^\s*import\s*(['"])[^'"]+\2;?/gm, (s) => s.replace(/[^\n]/g, ' '))
  const scan = (source, base) => {
    for (const { index, body } of stringsIn(source)) {
      const start = base + index + 1
      // A template literal's ${…} parts aren't classes, but the strings inside them can be.
      for (const part of body.matchAll(/\$\{([^}]*)\}/g)) scan(part[1], start + part.index + 2)
      if (!/\s|-/.test(body) || body.length > 2000) continue
      const classes = body.replace(/\$\{[^}]*\}/g, (s) => ' '.repeat(s.length))
      for (const f of checkClasses(classes, options)) {
        const at = classes.indexOf(f.found.split(' ')[0])
        add(lineOf(text, start + Math.max(0, at)), f)
      }
    }
  }
  scan(code, 0)
  return findings.sort((a, b) => a.line - b.line)
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')
const CLASS_EDGE_BEFORE = '(^|[\\s"\'`{(,])'
const CLASS_EDGE_AFTER = '(?=$|[\\s"\'`}),])'

/** Drop one class from a line, with the space on one side of it. */
function removeClass(line, cls) {
  const re = new RegExp(CLASS_EDGE_BEFORE + escape(cls) + '(?:( )|(?=$|["\'`}),]))')
  return line.replace(re, (_, before, after) => (after ? before : before === ' ' ? '' : before))
}

/**
 * Apply the fixable findings. `onLine(line)` limits fixes to some lines (for --changed);
 * `options.nearest` also snaps off-scale text sizes.
 * Returns the new text and the findings it fixed.
 */
export function fixSource(text, file = 'x.tsx', onLine = () => true, options = {}) {
  const lines = text.split('\n')
  const fixed = []
  for (const f of checkSource(text, file, options)) {
    if (!f.fixable || f.superseded || !onLine(f.line)) continue
    const i = f.line - 1
    const before = lines[i]
    if (f.rule === 'icon-import') {
      lines[i] = before.replace(new RegExp(`(['"])${escape(f.found)}\\1`), `$1${f.use}$1`)
    } else if (f.rule === 'size-shorthand') {
      const [w, h] = f.found.split(' ')
      lines[i] = removeClass(before.replace(new RegExp(CLASS_EDGE_BEFORE + escape(w) + CLASS_EDGE_AFTER), `$1${f.use}`), h)

    } else if (f.use === '') {
      lines[i] = removeClass(before, f.found)
    } else {
      lines[i] = before.replace(new RegExp(CLASS_EDGE_BEFORE + escape(f.found) + CLASS_EDGE_AFTER), `$1${f.use}`)
    }
    if (lines[i] !== before) fixed.push(f, ...(f.also ?? []))
  }
  return { text: lines.join('\n'), fixed }
}
