/**
 * Component tokens: shared parsing for the token files, the class-edit script,
 * the checks and the generated docs.
 *
 * A token file (src/tokens/components/<component>.css) declares, per part, a
 * private token that reads a public component token with the designed value as the fallback:
 *
 *   [data-slot="input"] {
 *     \/* Corner radius. *\/
 *     --_input-radius: var(--input-radius, var(--radius-lg));
 *   }
 *
 * The private name says where the class edit goes:
 *   --_<slot>[-<variant>][-<state>][-<property>]
 * <slot> is the rule's data-slot; <variant> is a cva key on that part (or an
 * alias declared with @alias); <state> and <property> come from the tables
 * below. A value for one breakpoint and up ends in `\:<breakpoint>` on the public
 * component token (`--toast-viewport-offset\:sm`, or `\:md-to-lg` for a range) and in
 * `--<breakpoint>` on the private one (`--_toast-viewport-offset--sm`), because
 * Tailwind won't read a class with a backslash in it. Only an @add class reads a
 * breakpoint component token, under that breakpoint's prefix (`sm:`, `md:max-lg:`).
 * A token's comment can carry directives:
 *   @site <cva group>.<key> | base   which class string to edit (instead of inferring it)
 *   @ours                          read by our own components, not class-edited in ui/
 *   @on <token>                    for text with no fill on its own part: what it sits on
 *                                  (default --background), for the contrast check
 * and a rule can carry standalone directives for classes that aren't component tokens:
 *   \/* @add classes *\/            ensure these classes are present (replacing any
 *                                  class of the same property and state)
 *   \/* @remove classes *\/         remove these classes
 *   \/* @add(size.sm) classes *\/   the same, on a cva key (or an @alias) instead of the part's base
 *   \/* @alias md = size.default *\/ a variant name used in token names
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { cn } from '../../src/lib/utils.ts'

export const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
export const tokenDir = path.join(root, 'src', 'tokens', 'components')
export const uiDir = path.join(root, 'src', 'components', 'ui')

// ---------------------------------------------------------------------------
// Properties: token suffix → Tailwind utility, value type, and a probe class
// that cn puts in the same group (used to find the class a token replaces).
// ---------------------------------------------------------------------------
export const PROPERTIES = {
  '': { utility: 'bg', type: 'color', probe: 'bg-[#010203]', label: 'Fill colour' },
  // Same as '' — for a part named like a semantic token (--input is the semantic
  // border colour, so the input's fill component token is --input-fill).
  fill: { utility: 'bg', type: 'color', probe: 'bg-[#010203]', label: 'Fill colour' },
  foreground: { utility: 'text', type: 'color', probe: 'text-[#010203]', label: 'Text colour' },
  border: { utility: 'border', type: 'color', probe: 'border-[#010203]', label: 'Border colour' },
  ring: { utility: 'ring', type: 'color', probe: 'ring-[#010203]', label: 'Ring colour' },
  // `length:` tells Tailwind a ring-(--x) or border-(--x) is a width, not a colour.
  'border-width': { utility: 'border', cssType: 'length', type: 'length', probe: 'border-[3px]', label: 'Border thickness' },
  'ring-width': { utility: 'ring', cssType: 'length', type: 'length', probe: 'ring-[3px]', label: 'Ring thickness' },
  radius: { utility: 'rounded', type: 'radius', probe: 'rounded-[3px]', label: 'Corner radius' },
  height: { utility: 'h', type: 'length', probe: 'h-[3px]', label: 'Height' },
  'min-height': { utility: 'min-h', type: 'length', probe: 'min-h-[3px]', label: 'Minimum height' },
  width: { utility: 'w', type: 'length', probe: 'w-[3px]', label: 'Width' },
  size: { utility: 'size', type: 'length', probe: 'size-[3px]', label: 'Width and height' },
  padding: { utility: 'p', type: 'length', probe: 'p-[3px]', label: 'Padding' },
  'padding-x': { utility: 'px', type: 'length', probe: 'px-[3px]', label: 'Horizontal padding' },
  'padding-y': { utility: 'py', type: 'length', probe: 'py-[3px]', label: 'Vertical padding' },
  'padding-top': { utility: 'pt', type: 'length', probe: 'pt-[3px]', label: 'Top padding' },
  'padding-bottom': { utility: 'pb', type: 'length', probe: 'pb-[3px]', label: 'Bottom padding' },
  'padding-start': { utility: 'ps', type: 'length', probe: 'ps-[3px]', label: 'Padding at the start (left, or right in right-to-left)' },
  'padding-end': { utility: 'pe', type: 'length', probe: 'pe-[3px]', label: 'Padding at the end (right, or left in right-to-left)' },
  gap: { utility: 'gap', type: 'length', probe: 'gap-[3px]', label: 'Gap between items' },
  // Distance from the edge of the screen or container, for a part positioned against it
  // (a toast stack, a floating panel). Only an @add class reads it, as inset-*, bottom-* or m-*.
  offset: { utility: 'inset', type: 'length', probe: 'inset-[3px]', label: 'Distance from the edge' },
  shadow: { utility: 'shadow', type: 'shadow', probe: 'shadow-[0_0_0_#010203]', label: 'Shadow' },
  'font-weight': { utility: 'font', type: 'font-weight', probe: 'font-[555]', label: 'Font weight' },
  opacity: { utility: 'opacity', type: 'opacity', probe: 'opacity-[.33]', label: 'Opacity' },
  tracking: { utility: 'tracking', type: 'tracking', probe: 'tracking-[3px]', label: 'Letter spacing' },
  // Type on a part whose size or line height an app may set apart from the type scale's
  // pairing (a button size, a tab). `leading`, not `line-height`: `-line-height` already
  // reads as the line variant's height (--tabs-trigger-line-height).
  'font-size': { utility: 'text', cssType: 'length', type: 'font-size', probe: 'text-[3px]', label: 'Text size' },
  leading: { utility: 'leading', type: 'leading', probe: 'leading-[3px]', label: 'Line height' },
}
// Longest suffix first, so `padding-x` wins over `padding` and `min-height` over `height`.
// No property may share a name with a variant or size (outline, icon), or names would be ambiguous.
const PROPERTY_SUFFIXES = Object.keys(PROPERTIES).filter(Boolean).sort((a, b) => b.length - a.length)

// ---------------------------------------------------------------------------
// States: Base UI state names → the Tailwind variant prefixes that express them.
// The first prefix is used when the class has to be added.
// ---------------------------------------------------------------------------
export const STATES = {
  hover: { prefixes: ['hover:'], label: 'when hovered' },
  focus: { prefixes: ['focus-visible:', 'focus:', 'focus-within:', 'has-focus-visible:'], label: 'when focused' },
  active: { prefixes: ['data-active:', 'active:', 'data-[active=true]:', 'aria-[current=page]:'], label: 'when active' },
  pressed: { prefixes: ['data-pressed:', 'aria-pressed:'], label: 'when pressed' },
  open: { prefixes: ['data-open:', 'aria-expanded:', 'data-popup-open:', 'data-[state=open]:', 'data-panel-open:'], label: 'while open' },
  selected: { prefixes: ['data-selected:', 'aria-selected:', 'data-[selected=true]:'], label: 'when selected' },
  highlighted: { prefixes: ['data-highlighted:'], label: 'when highlighted' },
  checked: { prefixes: ['data-checked:', 'aria-checked:', 'data-[state=checked]:'], label: 'when checked' },
  disabled: { prefixes: ['disabled:', 'data-disabled:', 'aria-disabled:', 'has-disabled:'], label: 'when disabled' },
  invalid: { prefixes: ['aria-invalid:', 'data-invalid:', 'has-aria-invalid:'], label: 'when invalid' },
  placeholder: { prefixes: ['placeholder:', 'data-placeholder:'], label: 'placeholder' },
}
const STATE_NAMES = Object.keys(STATES)

// Breakpoints, mobile-first: a component token for `md` applies from md up; `md-to-lg` from md up to lg.
export const BREAKPOINTS = ['sm', 'md', 'lg', 'xl', '2xl']
const BP = BREAKPOINTS.join('|')
const breakpointRe = new RegExp(`^(.+?)--((${BP})(?:-to-(${BP}))?)$`)

/** Split a private name into its base and breakpoint: `--_x--md-to-lg` → { base: '--_x', breakpoint: 'md-to-lg' }. */
export function splitBreakpoint(privateName) {
  const m = privateName.match(breakpointRe)
  if (!m) return { base: privateName, breakpoint: null }
  if (m[4] && BREAKPOINTS.indexOf(m[4]) <= BREAKPOINTS.indexOf(m[3])) throw new Error(`${privateName}: a range must go from a smaller breakpoint to a larger one`)
  return { base: m[1], breakpoint: m[2] }
}

/** The public component token a private name reads: `--_x--md` → `--x\:md`. */
export function publicName(privateName) {
  const { base, breakpoint } = splitBreakpoint(privateName)
  return base.replace(/^--_/, '--') + (breakpoint ? `\\:${breakpoint}` : '')
}

/** The Tailwind prefix for a breakpoint: `md` → `md:`, `md-to-lg` → `md:max-lg:`. */
export function breakpointPrefix(breakpoint) {
  const [from, to] = breakpoint.split('-to-')
  return to ? `${from}:max-${to}:` : `${from}:`
}

// ---------------------------------------------------------------------------
// Token files
// ---------------------------------------------------------------------------

/** All token files except index.css, by component name. */
export function tokenFiles() {
  if (!fs.existsSync(tokenDir)) return []
  return fs
    .readdirSync(tokenDir)
    .filter((f) => f.endsWith('.css') && f !== 'index.css')
    .sort()
    .map((f) => ({ component: f.replace(/\.css$/, ''), file: path.join(tokenDir, f) }))
}

/**
 * Parse one token file into rules. Each rule has its slot, its directives and
 * its tokens: { name, public, fallback, description, site, ours, line }.
 */
export function parseTokenFile(file) {
  const css = fs.readFileSync(file, 'utf8')
  const header = css.match(/^\s*\/\*([\s\S]*?)\*\//)?.[1].replace(/^\s*\* ?/gm, '').trim() ?? ''
  const rules = []
  // Braces inside comments (an example in the header) must not open a rule, so
  // find rules in a copy with comment braces blanked out; positions stay the same.
  const masked = css.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[{}]/g, ' '))
  const ruleRe = /([^{}]*?)\{([^{}]*)\}/g
  let m
  while ((m = ruleRe.exec(masked))) {
    m[2] = css.slice(m.index + m[0].indexOf('{') + 1, m.index + m[0].length - 1)
    const selector = m[1].replace(/\/\*[\s\S]*?\*\//g, '').trim()
    const slot = selector.match(/^\[data-slot="([\w-]+)"\]$/)?.[1]
    if (!slot) throw new Error(`${path.basename(file)}: rule selector must be [data-slot="…"], got ${selector}`)
    const body = m[2]
    const startLine = css.slice(0, m.index).split('\n').length
    const rule = { slot, aliases: {}, add: [], remove: [], tokens: [] }
    // Walk comments and declarations in order, so a comment describes the next declaration.
    const itemRe = /\/\*([\s\S]*?)\*\/|(--_[\w-]+)\s*:\s*([^;]+);/g
    let pending = null
    let it
    while ((it = itemRe.exec(body))) {
      const line = startLine + body.slice(0, it.index).split('\n').length - 1
      if (it[1] !== undefined) {
        const text = it[1].replace(/\s+/g, ' ').trim()
        const directive = text.match(/^@(add|remove|alias)(?:\(([\w.-]+)\))?\s+(.*)$/)
        if (directive) {
          const [, kind, site, rest] = directive
          if (kind === 'alias') {
            const a = rest.match(/^([\w-]+)\s*=\s*(\w+)\.([\w-]+)$/)
            if (!a) throw new Error(`${path.basename(file)}:${line}: bad @alias "${rest}"`)
            rule.aliases[a[1]] = { group: a[2], key: a[3] }
          } else {
            rule[kind].push({ site: site ?? 'base', classes: rest.split(/\s+/).filter(Boolean), line })
          }
          pending = null
        } else pending = text
        continue
      }
      const [, , name, value] = it
      const v = value.trim().match(/^var\((--(?:[\w-]|\\:)+)\s*,\s*([\s\S]+)\)$/)
      if (!v) throw new Error(`${path.basename(file)}:${line}: ${name} must be var(--public, fallback)`)
      const desc = pending ?? ''
      rule.tokens.push({
        name,
        public: v[1],
        fallback: v[2].trim(),
        description: desc.replace(/@(?:site|on)\s+\S+|@ours/g, '').replace(/\s+/g, ' ').trim(),
        site: desc.match(/@site\s+(\S+)/)?.[1] ?? null,
        ours: /@ours\b/.test(desc),
        on: desc.match(/@on\s+(--[\w-]+)/)?.[1] ?? null,
        line,
      })
      pending = null
    }
    rules.push(rule)
  }
  return { header, rules }
}

/**
 * Split a private token name into variant, state and property for its rule.
 * `cvaKeys` lists the cva keys on that part as "group.key".
 */
export function parseTokenName(token, rule, cvaKeys = []) {
  const { base, breakpoint } = splitBreakpoint(token.name)
  const expected = publicName(token.name)
  if (token.public !== expected) throw new Error(`${token.name} must read ${expected}, not ${token.public}`)
  const pub = base.replace(/^--_/, '')
  if (pub !== rule.slot && !pub.startsWith(rule.slot + '-')) {
    throw new Error(`${token.name} is declared on [data-slot="${rule.slot}"] but doesn't start with "${rule.slot}"`)
  }
  let rest = pub === rule.slot ? '' : pub.slice(rule.slot.length + 1)
  let property = ''
  for (const s of PROPERTY_SUFFIXES) {
    if (rest === s || rest.endsWith('-' + s)) {
      property = s
      rest = rest === s ? '' : rest.slice(0, -(s.length + 1))
      break
    }
  }
  let state = null
  for (const s of STATE_NAMES) {
    if (rest === s || rest.endsWith('-' + s)) {
      state = s
      rest = rest === s ? '' : rest.slice(0, -(s.length + 1))
      break
    }
  }
  // The placeholder state has no fill: `--input-placeholder` is the placeholder text colour.
  if (state === 'placeholder' && property === '') property = 'foreground'
  let variant = null
  if (rest) {
    if (rule.aliases[rest]) variant = rule.aliases[rest]
    else {
      // A variant name can exist in more than one cva group (button `default` is both a
      // variant and a size). Sizing properties go to the size group, colours to the variant.
      const matches = cvaKeys.filter((k) => k.split('.').slice(1).join('.') === rest)
      const sizing = ['radius', 'height', 'min-height', 'width', 'size', 'padding', 'padding-x', 'padding-y', 'padding-top', 'padding-bottom', 'padding-start', 'padding-end', 'gap', 'offset', 'border-width', 'ring-width'].includes(property)
      const pick =
        matches.find((k) => (sizing ? /^size\./ : /^variant\./).test(k)) ?? (matches.length === 1 ? matches[0] : null)
      if (pick) {
        const [group, ...key] = pick.split('.')
        variant = { group, key: key.join('.') }
      } else variant = { unresolved: rest }
    }
  }
  if (token.site) {
    variant = token.site === 'base' ? null : { group: token.site.split('.')[0], key: token.site.split('.').slice(1).join('.') }
  }
  return { variant, state, property, breakpoint }
}

// ---------------------------------------------------------------------------
// Classes
// ---------------------------------------------------------------------------

/** Split "hover:data-open:bg-x/50" into ["hover:data-open:", "bg-x/50"], ignoring colons inside brackets. */
export function splitVariant(cls) {
  let depth = 0
  let last = -1
  for (let i = 0; i < cls.length; i++) {
    const c = cls[i]
    if (c === '[' || c === '(') depth++
    else if (c === ']' || c === ')') depth--
    else if (c === ':' && depth === 0) last = i
  }
  return [cls.slice(0, last + 1), cls.slice(last + 1)]
}

const groupCache = new Map()
/** True when `a` and `b` set the same CSS property (each replaces the other in cn). */
export function sameGroup(a, b) {
  const key = a + ' ' + b
  if (!groupCache.has(key)) groupCache.set(key, cn(a, b) === b && cn(b, a) === a)
  return groupCache.get(key)
}

/** The class a token writes, e.g. `hover:bg-(--_button-default-hover)`. */
export function tokenClass(prefix, property, name) {
  const p = PROPERTIES[property]
  return `${prefix}${p.utility}-(${p.cssType ? p.cssType + ':' : ''}${name})`
}

/**
 * Apply one token to a class string: replace the classes that set the same
 * property in the same state with the token class, or append it. Returns the
 * new string.
 */
export function applyToken(classes, { name, part = '', state, property, hints = [] }) {
  const prefixes = state ? STATES[state].prefixes : ['']
  const probe = PROPERTIES[property].probe
  const list = classes.split(/\s+/).filter(Boolean)
  let replaced = false
  const out = []
  for (const c of list) {
    const [prefix, base] = splitVariant(c)
    if (prefixes.includes(prefix) && !base.startsWith('!') && !base.endsWith('!') && sameGroup(base, probe)) {
      const next = tokenClass(baseUiOpenPrefix(state, part) ?? prefix, property, name)
      if (!out.includes(next)) out.push(next)
      replaced = true
    } else out.push(c)
  }
  if (!replaced) out.push(tokenClass(state ? statePrefix(state, part, [...hints, ...list]) : '', property, name))
  return out.join(' ')
}

/**
 * Base UI marks an open trigger with its own attribute, not data-open: a panel
 * trigger (accordion, collapsible) has data-panel-open, any other trigger has
 * data-popup-open. Popups and items keep data-open. A Button keeps the prefix
 * it already uses (aria-expanded:): it's open only as a menu or popover
 * trigger, never as a tooltip trigger, which also sets data-popup-open. Stock sometimes writes data-open: on a trigger, which never
 * matches, so a token on a trigger always gets the right attribute.
 */
function baseUiOpenPrefix(state, part) {
  if (state !== 'open') return null
  if (/(accordion|collapsible)-trigger$/.test(part)) return 'data-panel-open:'
  if (/trigger$/.test(part)) return 'data-popup-open:'
  return null
}

/** The variant prefix for a new class in `state`: Base UI's open attribute, else one the part already uses (its @add classes first), else the first. */
function statePrefix(state, part, list) {
  const { prefixes } = STATES[state]
  return baseUiOpenPrefix(state, part) ?? list.map((c) => splitVariant(c)[0]).find((p) => prefixes.includes(p)) ?? prefixes[0]
}

/** Ensure `cls` is present: drop any class it replaces (same prefix and property). */
export function addClass(classes, cls) {
  const [prefix, base] = splitVariant(cls)
  const list = classes.split(/\s+/).filter(Boolean)
  if (list.includes(cls)) return classes
  const out = []
  let placed = false
  for (const c of list) {
    const [p, b] = splitVariant(c)
    if (p === prefix && sameGroup(b, base)) {
      if (!placed) out.push(cls)
      placed = true
    } else out.push(c)
  }
  if (!placed) out.push(cls)
  return out.join(' ')
}

export function removeClass(classes, cls) {
  return classes.split(/\s+/).filter((c) => c && c !== cls).join(' ')
}

// ---------------------------------------------------------------------------
// Sites in a ui/ file: the class strings for each data-slot, base and cva keys.
// ---------------------------------------------------------------------------

/**
 * Find every editable class string in a TSX source. Returns
 *   { slots: Map<slot, { base: Literal[], cva: string|null }>, cvas: Map<name, { base: Literal, keys: Map<"group.key", Literal> }> }
 * where Literal = { start, end, text } (positions of the string's content).
 */
export function findSites(source, fileName = 'x.tsx') {
  const sf = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const lit = (node) => ({ start: node.getStart(sf) + 1, end: node.getEnd() - 1, text: node.text })
  const isStr = (n) => ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)
  const cvas = new Map()
  const slots = new Map()
  // Top-level string constants, so a cva key written as an identifier (PRIMARY) still
  // has its classes. Such a site can be read but not edited (start/end are -1).
  const consts = new Map()
  for (const st of sf.statements) {
    if (!ts.isVariableStatement(st)) continue
    for (const d of st.declarationList.declarations) {
      if (d.initializer && isStr(d.initializer)) consts.set(d.name.getText(sf), { start: -1, end: -1, text: d.initializer.text })
    }
  }

  /** Record the class expression of one element that carries `slot`. */
  const addSite = (slot, initializer) => {
    const entry = slots.get(slot) ?? { base: [], all: [], allLits: [], cva: null }
    // Several elements can share a data-slot (an input and a textarea); class
    // edits and `all` cover the first one.
    const first = !slots.has(slot)
    const collect = (expr) => {
      if (!expr) return
      if (isStr(expr)) {
        entry.base.push(lit(expr))
        if (first) entry.all.push(expr.text), entry.allLits.push(lit(expr))
      }
      else if (ts.isJsxExpression(expr)) collect(expr.expression)
      else if (ts.isCallExpression(expr)) {
        const callee = expr.expression.getText(sf)
        if (callee === 'cn') {
          // Only the first string literal is the part's own base; later ones are
          // conditional extras (orientation, inset, …) and stay as they are.
          const own = expr.arguments.find(isStr)
          if (own) entry.base.push(lit(own))
          if (first) {
            const strings = expr.arguments.filter(isStr)
            entry.all.push(...strings.map((a) => a.text))
            entry.allLits.push(...strings.map(lit))
          }
          for (const a of expr.arguments) if (ts.isCallExpression(a)) collect(a)
        } else if (/(Variants|Style)$/.test(callee)) entry.cva = callee
      }
    }
    collect(initializer)
    slots.set(slot, entry)
  }

  const visit = (node) => {
    // const xVariants = cva("base", { variants: { group: { key: "classes" } } })
    if (
      ts.isVariableDeclaration(node) &&
      node.initializer &&
      ts.isCallExpression(node.initializer) &&
      node.initializer.expression.getText(sf) === 'cva'
    ) {
      const [baseArg, config] = node.initializer.arguments
      const entry = { base: baseArg && isStr(baseArg) ? lit(baseArg) : null, keys: new Map() }
      const variants = config && ts.isObjectLiteralExpression(config)
        ? config.properties.find((p) => p.name?.getText(sf) === 'variants')
        : null
      if (variants && ts.isPropertyAssignment(variants) && ts.isObjectLiteralExpression(variants.initializer)) {
        for (const group of variants.initializer.properties) {
          if (!ts.isPropertyAssignment(group) || !ts.isObjectLiteralExpression(group.initializer)) continue
          const g = group.name.getText(sf).replace(/^["']|["']$/g, '')
          for (const key of group.initializer.properties) {
            if (!ts.isPropertyAssignment(key)) continue
            const k = key.name.getText(sf).replace(/^["']|["']$/g, '')
            if (isStr(key.initializer)) entry.keys.set(`${g}.${k}`, lit(key.initializer))
            else if (ts.isIdentifier(key.initializer) && consts.has(key.initializer.text)) entry.keys.set(`${g}.${k}`, consts.get(key.initializer.text))
          }
        }
      }
      cvas.set(node.name.getText(sf), entry)
    }
    // <X data-slot="slot" className={cn("…", xVariants(…), className)} />
    if (ts.isJsxAttributes(node)) {
      const attrs = node.properties.filter(ts.isJsxAttribute)
      const slotAttr = attrs.find((a) => a.name.getText(sf) === 'data-slot')
      const slot = slotAttr?.initializer && ts.isStringLiteral(slotAttr.initializer) ? slotAttr.initializer.text : null
      const classAttr = attrs.find((a) => a.name.getText(sf) === 'className')
      if (slot && classAttr?.initializer) addSite(slot, classAttr.initializer)
      // function InputGroupButton() { return <Button className={cn(inputGroupButtonVariants(…))} /> }
      // renders another component and sets no data-slot of its own: the part is
      // named after the function whose cva it uses.
      else if (!slot && classAttr?.initializer) {
        let fn = node.parent
        while (fn && !ts.isFunctionDeclaration(fn)) fn = fn.parent
        const name = fn?.name?.getText(sf)
        const cvaName = name && name[0].toLowerCase() + name.slice(1) + 'Variants'
        if (cvaName && classAttr.initializer.getText(sf).includes(`${cvaName}(`)) {
          addSite(name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(), classAttr.initializer)
        }
      }
    }
    // useRender({ props: mergeProps({ className: cn("…") }, props), state: { slot: "slot" } })
    if (ts.isCallExpression(node) && node.expression.getText(sf) === 'useRender') {
      const options = node.arguments[0]
      const prop = (obj, name) =>
        obj && ts.isObjectLiteralExpression(obj)
          ? obj.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText(sf) === name)?.initializer
          : undefined
      const slotExpr = prop(prop(options, 'state'), 'slot')
      const props = prop(options, 'props')
      const own = props && ts.isCallExpression(props) ? props.arguments[0] : props
      const className = prop(own, 'className')
      if (slotExpr && isStr(slotExpr) && className) addSite(slotExpr.text, className)
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  return { slots, cvas }
}

/** Every `data-slot="…"` value in a source, including ones set without a className. */
export function slotNames(source) {
  return new Set([...source.matchAll(/(?:data-slot=|\bslot:\s*)["']([\w-]+)["']/g)].map((m) => m[1]))
}

// ---------------------------------------------------------------------------
// Values: what a token's fallback means, for the Design Console and the contrast check.
// ---------------------------------------------------------------------------

/** The value type of a token, from its property. */
export function valueType(property) {
  return PROPERTIES[property]?.type ?? 'color'
}

/** A one-line description built from the name, for tokens that don't have one. */
export function describe(slot, component, { variant, state, property }) {
  const prop = PROPERTIES[property]?.label ?? 'Value'
  const part = slot === component ? component : slot.replace(component + '-', '')
  const v = variant?.key ? ` (${variant.group === 'size' ? `${variant.key} size` : `${variant.key} variant`})` : ''
  const s = state && state !== 'placeholder' ? ` ${STATES[state].label}` : ''
  if (state === 'placeholder') return `Placeholder text colour of the ${part}${v}.`
  return `${prop} of the ${part}${v}${s}.`
}
