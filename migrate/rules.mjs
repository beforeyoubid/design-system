/**
 * Migration rules from @beforeyoubid/design-system 1.1.x to the role + step
 * release. Pure functions: `migrateSource(text, options)` returns the new text,
 * what changed and what needs a person to look at it.
 *
 * Class renames run in ONE pass with a lookup, so swaps such as
 * rounded-xl ↔ rounded-2xl can't chain into each other.
 */

// ---------------------------------------------------------------------------
// Class renames. A value with a space expands to several classes; any variant
// prefix (md:, hover:, data-[open]:) and `!` are copied onto each of them.
// ---------------------------------------------------------------------------
export const CLASS_RENAMES = {
  // Display + heading (600)
  'text-display-xl': 'text-display-1',
  'text-display': 'text-display-3',
  'text-display-sm': 'text-display-4',
  'text-heading-lg': 'text-h1',
  'text-heading-3xl': 'text-h2',
  'text-heading-md': 'text-h3',
  'text-heading-base': 'text-h4',
  'text-heading-sm': 'text-h5',
  // Body + caption (400). body-sm and btn-sm were 13px; the new step is 14px.
  'text-body-lg': 'text-body-3',
  'text-body-md': 'text-body-4',
  'text-body-sm': 'text-body-5',
  'text-caption': 'text-caption-1',
  'text-xs': 'text-caption-2', // was overridden to 10px; Tailwind's text-xs is 12px again
  'text-2xs': 'text-caption-3',
  // Medium (500) sizes become a size class plus font-medium
  'text-medium-6xl': 'text-display-2 font-medium',
  'text-medium-5xl': 'text-display-4 font-medium',
  'text-medium-4xl': 'text-h1 font-medium',
  'text-medium-3xl': 'text-h2 font-medium',
  'text-medium-2xl': 'text-h3 font-medium',
  'text-medium-xl': 'text-h4 font-medium',
  'text-medium-lg': 'text-body-3 font-medium',
  'text-medium-base': 'text-body-4 font-medium',
  'text-medium-sm': 'text-body-5 font-medium',
  'text-medium-xs': 'text-caption-2 font-medium',
  'text-medium-2xs': 'text-caption-3 font-medium',
  // Buttons
  'text-btn-lg': 'text-button-lg',
  'text-btn-md': 'text-button-md',
  'text-btn-sm': 'text-button-sm',
  'tracking-btn': 'tracking-button',
}

// rounded-xl and rounded-2xl swapped values (xl 20 → 16px, 2xl 16 → 20px),
// so uses swap to keep the same corner. rounded-btn (18px) is removed; buttons use rounded-xl.
const RADIUS_SIDES = '(?:t|r|b|l|s|e|x|y|tl|tr|bl|br|ss|se|es|ee|ts|te|bs|be)'
const RADIUS_SWAP = { xl: '2xl', '2xl': 'xl', btn: 'xl' }

// Colour utilities that can take a colour token
const COLOUR_UTILITIES =
  '(?:bg|text|border|border-[trblxyse]|ring|ring-offset|outline|fill|stroke|from|via|to|decoration|shadow|accent|caret|divide|inset-shadow|inset-ring)'

const TOKEN_START = '(?<![^\\s"\'`{(,])' // start of string or after a class delimiter
const VARIANTS = '((?:[^\\s"\'`{}(),:]+:)*)' // md: hover: data-[state=open]: …
const TOKEN_END = '(?![\\w-])' // allows /50 opacity and /6 line-height modifiers

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function buildClassPattern(renames) {
  const names = Object.keys(renames).sort((a, b) => b.length - a.length).map(escape)
  const core = [
    `(?<rename>${names.join('|')})`,
    `(?<radius>rounded(?:-${RADIUS_SIDES})?-(?:2xl|xl|btn))`,
    `(?<cobalt>${COLOUR_UTILITIES}-cobalt(?:-l1)?)`,
    `(?<grey>(?:text|fill|stroke)-dark-60)`,
  ].join('|')
  return new RegExp(`${TOKEN_START}${VARIANTS}(!?)(?:${core})${TOKEN_END}`, 'g')
}

function renameClass(match, variants, important, groups, renames) {
  const prefix = (cls) => `${variants}${important}${cls}`
  if (groups.rename) {
    return { to: renames[groups.rename].split(' ').map(prefix).join(' '), rule: 'type and button classes' }
  }
  if (groups.radius) {
    const to = groups.radius.replace(/-(2xl|xl|btn)$/, (_, size) => `-${RADIUS_SWAP[size]}`)
    return { to: prefix(to), rule: 'radius swap (rounded-xl ↔ rounded-2xl, rounded-btn → rounded-xl)' }
  }
  if (groups.cobalt) {
    return { to: prefix(groups.cobalt.replace('cobalt', 'electric-blue')), rule: 'cobalt → electric-blue' }
  }
  if (groups.grey) {
    // DESIGN.md: dark-60 is too light for text and icons; placeholders are dark-90
    const shade = /(^|:)placeholder:$/.test(variants) ? 'dark-90' : 'dark-75'
    return { to: prefix(groups.grey.replace('dark-60', shade)), rule: 'dark-60 text and icons → dark-75 (placeholders → dark-90)' }
  }
  return { to: match, rule: null }
}

// CSS custom properties: var(--cobalt), --color-cobalt-l1, …
const CSS_VAR_PATTERN = /(?<![\w-])--(color-)?cobalt(-l1)?(?![\w-])/g

// ---------------------------------------------------------------------------
// Component props. Only applied to components imported from the package.
// ---------------------------------------------------------------------------
export const PROP_RENAMES = {
  Badge: {
    variant: { default: 'gray', secondary: 'gray', outline: 'gray', destructive: 'error' },
  },
  Switch: { size: { default: 'md' } },
  TabsList: { variant: { default: 'pill', pills: 'pill' } },
}
// The cva helpers take the same props: buttonVariants({ variant: 'outline' })
const VARIANT_HELPERS = { buttonVariants: 'Button', badgeVariants: 'Badge' }

/** Values with no like-for-like replacement: a person picks the new one. */
export const PROP_REVIEW = {
  Badge: {
    variant: {
      cobalt: 'tinted cobalt badge removed: use category={n} or another variant',
      teal: 'tinted teal badge removed: use category={n} or another variant',
      ghost: 'ghost badge removed',
      link: 'link badge removed',
    },
    dot: 'the status dot was removed',
  },
}

/** Exported by 1.1.x and gone now. */
export const REMOVED_EXPORTS = {
  colors: 'use generateDesignSystemTokens().colors in a non-CSS context, or a utility class (bg-mint-45)',
  typography: 'use generateDesignSystemTokens().typography in a non-CSS context, or a text-* class',
  BYBTestimonialCard: 'removed from the design system',
  BYBTestimonialCarousel: 'removed from the design system',
  BYBTestimonialCardProps: 'removed from the design system',
  Testimonial: 'removed from the design system',
}

const PACKAGE_IMPORT = /import\s+(?:type\s+)?\{([^}]*)\}\s*from\s*['"]@beforeyoubid\/design-system['"]/g

/** Local names for the package's exports in this file: { Button: 'Button', DSBadge: 'Badge' } */
function readPackageImports(text) {
  const locals = {}
  for (const [, list] of text.matchAll(PACKAGE_IMPORT)) {
    for (const raw of list.split(',')) {
      const spec = raw.replace(/^\s*type\s+/, '').trim()
      if (!spec) continue
      const [imported, local = imported] = spec.split(/\s+as\s+/).map((s) => s.trim())
      locals[local] = imported
    }
  }
  return locals
}

/** End index of a JSX opening tag that starts at `start` (the `<`), skipping {…}, strings and comments. */
function findTagEnd(text, start) {
  let depth = 0
  let quote = null
  for (let i = start + 1; i < text.length; i++) {
    const ch = text[i]
    if (quote) {
      if (ch === '\\') i++
      else if (ch === quote) quote = null
      continue
    }
    if (ch === '/' && text[i + 1] === '/') i = text.indexOf('\n', i) === -1 ? text.length : text.indexOf('\n', i)
    else if (ch === '/' && text[i + 1] === '*') i = text.indexOf('*/', i + 2) === -1 ? text.length : text.indexOf('*/', i + 2) + 1
    else if (ch === '"' || ch === "'" || ch === '`') quote = ch
    else if (ch === '{') depth++
    else if (ch === '}') depth--
    else if (ch === '>' && depth === 0) return i
  }
  return -1
}

const lineOf = (text, index) => text.slice(0, index).split('\n').length

// prop="x" | prop={'x'} | prop={"x"}  (also `prop: 'x'` inside a cva helper call)
const attrPattern = (prop) => new RegExp(`(\\b${prop}=)(?:"([^"]*)"|\\{\\s*['"]([^'"]*)['"]\\s*\\})`, 'g')
// prop={cond ? 'a' : 'b'}: an expression whose string literals are variant values
const expressionPattern = (prop) => new RegExp(`(\\b${prop}=\\{)([^{}]*['"][^{}]*)\\}`, 'g')
const LITERAL = /(['"])([\w-]+)\1/g
const keyPattern = (prop) => new RegExp(`(\\b${prop}\\s*:\\s*)(['"])([^'"]*)\\2`, 'g')

function migrateProps(text, report) {
  const locals = readPackageImports(text)
  const components = Object.entries(locals).filter(([, imported]) => PROP_RENAMES[imported] || PROP_REVIEW[imported])
  const helpers = Object.entries(locals).filter(([, imported]) => PROP_RENAMES[VARIANT_HELPERS[imported]] || PROP_REVIEW[VARIANT_HELPERS[imported]])
  if (!components.length && !helpers.length) return text

  const edits = []

  for (const [local, imported] of components) {
    const tagPattern = new RegExp(`<${escape(local)}(?=[\\s/>])`, 'g')
    for (const tag of text.matchAll(tagPattern)) {
      const end = findTagEnd(text, tag.index)
      if (end === -1) continue
      const source = text.slice(tag.index, end)
      const line = lineOf(text, tag.index)
      const renames = PROP_RENAMES[imported] ?? {}
      const review = PROP_REVIEW[imported] ?? {}
      let updated = source

      for (const [prop, values] of Object.entries(renames)) {
        updated = updated.replace(attrPattern(prop), (whole, head, plain, braced) => {
          const value = plain ?? braced
          if (!(value in values)) return whole
          report.change(`${imported} ${prop}="${value}" → "${values[value]}"`, line)
          return `${head}"${values[value]}"`
        })
        updated = updated.replace(expressionPattern(prop), (whole, head, expression) =>
          `${head}${expression.replace(LITERAL, (literal, quote, value) => {
            if (!(value in values)) return literal
            report.change(`${imported} ${prop}="${value}" → "${values[value]}"`, line)
            return `${quote}${values[value]}${quote}`
          })}}`,
        )
      }
      for (const prop of Object.keys(renames)) {
        for (const [, expression] of source.matchAll(new RegExp(`\\b${prop}=\\{([^}]*)\\}`, 'g'))) {
          if (!/['"]/.test(expression)) {
            report.review(`${imported} ${prop}={${expression.trim()}}: check the values it can return against the renamed ${prop}s`, line)
          }
        }
      }
      for (const [prop, values] of Object.entries(review)) {
        if (typeof values === 'string') {
          if (new RegExp(`\\s${prop}(?=[\\s=/>]|$)`).test(source)) report.review(`${imported} ${prop}: ${values}`, line)
          continue
        }
        for (const [, , plain, braced] of source.matchAll(attrPattern(prop))) {
          const value = plain ?? braced
          if (value in values) report.review(`${imported} ${prop}="${value}": ${values[value]}`, line)
        }
        for (const [, , expression] of source.matchAll(expressionPattern(prop))) {
          for (const [, , value] of expression.matchAll(LITERAL)) {
            if (value in values) report.review(`${imported} ${prop}="${value}": ${values[value]}`, line)
          }
        }
      }
      if (updated !== source) edits.push([tag.index, end, updated])
    }
  }

  for (const [local, imported] of helpers) {
    const component = VARIANT_HELPERS[imported]
    const callPattern = new RegExp(`\\b${escape(local)}\\(\\s*\\{[^}]*\\}`, 'g')
    for (const call of text.matchAll(callPattern)) {
      const line = lineOf(text, call.index)
      let updated = call[0]
      for (const [prop, values] of Object.entries(PROP_RENAMES[component] ?? {})) {
        updated = updated.replace(keyPattern(prop), (whole, head, quote, value) => {
          if (!(value in values)) return whole
          report.change(`${imported} ${prop}: '${value}' → '${values[value]}'`, line)
          return `${head}${quote}${values[value]}${quote}`
        })
      }
      for (const [prop, values] of Object.entries(PROP_REVIEW[component] ?? {})) {
        if (typeof values === 'string') continue
        for (const [, , , value] of call[0].matchAll(keyPattern(prop))) {
          if (value in values) report.review(`${imported} ${prop}: '${value}': ${values[value]}`, line)
        }
      }
      if (updated !== call[0]) edits.push([call.index, call.index + call[0].length, updated])
    }
  }

  // Apply from the end so earlier indexes stay valid
  let result = text
  for (const [start, end, replacement] of edits.sort((a, b) => b[0] - a[0])) {
    result = result.slice(0, start) + replacement + result.slice(end)
  }
  return result
}

function reportRemovedExports(text, report) {
  const locals = readPackageImports(text)
  for (const [, imported] of Object.entries(locals)) {
    if (REMOVED_EXPORTS[imported]) {
      const index = text.search(new RegExp(`\\b${escape(imported)}\\b`))
      report.review(`${imported} is no longer exported: ${REMOVED_EXPORTS[imported]}`, lineOf(text, index))
    }
  }
}

/**
 * @param {string} text file contents
 * @param {{ classRenames?: Record<string, string> }} [options] extra or replacement class mappings
 * @returns {{ text: string, changes: {rule: string, line: number}[], reviews: {message: string, line: number}[] }}
 */
export function migrateSource(text, options = {}) {
  const changes = []
  const reviews = []
  const report = {
    change: (rule, line) => changes.push({ rule, line }),
    review: (message, line) => reviews.push({ message, line }),
  }

  const renames = { ...CLASS_RENAMES, ...options.classRenames }
  const pattern = buildClassPattern(renames)
  let result = text.replace(pattern, (...args) => {
    const groups = args.at(-1)
    const offset = args.at(-3)
    const [match, variants, important] = args
    const { to, rule } = renameClass(match, variants, important, groups, renames)
    if (rule && to !== match) report.change(rule, lineOf(text, offset))
    return to
  })

  result = result.replace(CSS_VAR_PATTERN, (match, color = '', tint = '', offset) => {
    report.change('cobalt → electric-blue', lineOf(text, offset))
    return `--${color}electric-blue${tint}`
  })

  result = migrateProps(result, report)
  reportRemovedExports(result, report)

  return { text: result, changes, reviews }
}
