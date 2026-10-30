/**
 * Advisory checks for app code against the design system's guardrails
 * (docs/README.md in the package). Each finding names the rule, what was found
 * and what to use instead. `fixSource` applies the findings marked `fixable`:
 * the ones with exactly one right answer that looks the same as before.
 */

const RULES = {
  'logical-direction': 'Use logical sides (start/end) so layouts flip for right-to-left',
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

const TAILWIND_SIZES = /^text-(xs|sm|base|lg|xl|[2-9]xl)(\/.+)?$/
const TYPE_HINT = { xs: 'text-caption-1', sm: 'text-body-5', base: 'text-body-4', lg: 'text-body-3', xl: 'text-body-2 or text-h5', '2xl': 'text-h4', '3xl': 'text-h3', '4xl': 'text-h2', '5xl': 'text-h1', '6xl': 'text-display-4', '7xl': 'text-display-1', '8xl': 'text-display-1', '9xl': 'text-display-1' }

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
const looksLikeClasses = (tokens) => tokens.length > 0 && tokens.every((t) => CLASS_WORD.test(t) && !/[.?!]$|^https?:|\/\/|\.\w+$/.test(t))

/** Findings for one class string: [{ rule, found, use }]. */
export function checkClasses(classes) {
  const findings = []
  const tokens = classes.split(/\s+/).filter(Boolean)
  if (!looksLikeClasses(tokens)) return findings
  const sizes = new Map()
  for (const token of tokens) {
    const parts = segments(token)
    const variants = parts.slice(0, -1)
    const utility = parts.at(-1).replace(/^!/, '')
    const prefix = variants.length ? variants.join(':') + ':' : ''
    if (variants.includes('dark')) findings.push({ rule: 'no-dark-variant', found: token, use: '', fixable: true })
    if (/^-?[a-z][\w-]*-\[[^\]"']+\](\/.+)?$|^\[[a-z-]+:[^\]"']+\]$/.test(utility)) findings.push({ rule: 'arbitrary-value', found: token })
    for (const [re, fix] of DIRECTION) {
      // Centring with left-1/2 -translate-x-1/2 is the one place a physical side is right.
      const centring = /^-?(left|right)-1\/2$/.test(utility) && /translate-x/.test(classes)
      if (re.test(utility)) findings.push({ rule: 'logical-direction', found: token, use: prefix + utility.replace(re, fix), fixable: !centring })
    }
    const size = utility.match(TAILWIND_SIZES)
    if (size) findings.push({ rule: 'type-scale', found: token, use: prefix + TYPE_HINT[size[1]] })
    if (/^-?space-(x|y)-/.test(utility)) findings.push({ rule: 'gap-not-space', found: token, use: `${prefix}flex ${prefix}gap-…` })
    const colour = utility.match(COLOUR_CLASS)
    const semantic = colour && SEMANTIC[PAINTS[colour[1]]][colour[2]]
    if (semantic) findings.push({ rule: 'semantic-colour', found: token, use: `${prefix}${colour[1]}-${semantic}${colour[3] ?? ''}`, fixable: true })
    const wh = utility.match(/^(w|h)-(.+)$/)
    if (wh && !/^(full|screen|auto|fit|min|max|dvh|svh|lvh)/.test(wh[2])) {
      const key = `${prefix}${wh[2]}`
      const seen = sizes.get(key) ?? new Set()
      seen.add(wh[1])
      sizes.set(key, seen)
    }
  }
  for (const [key, seen] of sizes) {
    if (seen.size === 2) {
      const at = key.lastIndexOf(':') + 1
      findings.push({ rule: 'size-shorthand', found: `${key.slice(0, at)}w-${key.slice(at)} ${key.slice(0, at)}h-${key.slice(at)}`, use: `${key.slice(0, at)}size-${key.slice(at)}`, fixable: true })
    }
  }
  return findings
}

const STRING = /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g
const lineOf = (text, offset) => text.slice(0, offset).split('\n').length

/** Findings for a file's text: [{ rule, line, found, use }]. */
export function checkSource(text, file = 'x.tsx') {
  const findings = []
  // Tests query the DOM with selectors that look like arbitrary values; they aren't UI code.
  if (/\.(test|spec)\.[cm]?[jt]sx?$|(^|\/)(__tests__|playwright-tests|e2e)\//.test(file)) return findings
  const add = (line, f) => findings.push({ line, ...f })

  if (/\.(s?css)$/.test(file)) {
    for (const m of text.matchAll(/@apply\s+([^;]+);/g)) for (const f of checkClasses(m[1])) add(lineOf(text, m.index), f)
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
    for (const m of source.matchAll(STRING)) {
      const body = m[2]
      const start = base + m.index + 1
      // A template literal's ${…} parts aren't classes, but the strings inside them can be.
      for (const part of body.matchAll(/\$\{([^}]*)\}/g)) scan(part[1], start + part.index + 2)
      if (!/\s|-/.test(body) || body.length > 2000) continue
      const classes = body.replace(/\$\{[^}]*\}/g, (s) => ' '.repeat(s.length))
      for (const f of checkClasses(classes)) {
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
 * Apply the fixable findings. `onLine(line)` limits fixes to some lines (for --changed).
 * Returns the new text and the findings it fixed.
 */
export function fixSource(text, file = 'x.tsx', onLine = () => true) {
  const lines = text.split('\n')
  const fixed = []
  for (const f of checkSource(text, file)) {
    if (!f.fixable || !onLine(f.line)) continue
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
    if (lines[i] !== before) fixed.push(f)
  }
  return { text: lines.join('\n'), fixed }
}
