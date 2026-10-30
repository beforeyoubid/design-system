import manifestJson from './generated/manifest.json'

export type ValueType = 'color' | 'radius' | 'length' | 'shadow' | 'font-weight' | 'opacity' | 'tracking'

export interface ComponentToken {
  name: string
  private: string
  default: string
  description: string
  type: ValueType
  part: string
  variant: string | null
  state: string | null
  property: string
  reads: string[]
}

export interface Manifest {
  brand: {
    colors: { name: string; hex: string }[]
    radius: { name: string; value: string }[]
    text: { name: string; value: string }[]
    spacing: string
  }
  semantic: { name: string; value: string; hex: string | null; usedBy: string[] }[]
  components: { component: string; description: string; tokens: ComponentToken[] }[]
  states: Record<string, string>
  properties: Record<string, { label: string; type: ValueType }>
  contrastExceptions: { foreground: string; fill: string; status: 'undecided' | 'accepted'; note: string }[]
}

export const manifest = manifestJson as unknown as Manifest

/** Overrides: public token name → CSS value. */
export type Overrides = Record<string, string>

// ---------------------------------------------------------------------------
// Brand colours, grouped the way the palette is named (mint-45 → Mint).
// ---------------------------------------------------------------------------
const FAMILY_ORDER = ['mint', 'navy', 'electric-blue', 'teal', 'lime', 'dark', 'light', 'white', 'success', 'error', 'warning', 'category']
export function familyOf(name: string) {
  const n = name.replace(/^--/, '')
  return FAMILY_ORDER.find((f) => n === f || n.startsWith(f + '-')) ?? 'other'
}
export const colorFamilies = (() => {
  const groups = new Map<string, { name: string; hex: string }[]>()
  for (const c of manifest.brand.colors) {
    const f = familyOf(c.name)
    if (f === 'category') continue
    // Brand accents sit together.
    const key = ['navy', 'electric-blue', 'teal', 'lime'].includes(f) ? 'brand' : f === 'white' ? 'light' : f
    groups.set(key, [...(groups.get(key) ?? []), c])
  }
  const order = ['mint', 'brand', 'dark', 'light', 'success', 'error', 'warning']
  return order.filter((k) => groups.has(k)).map((k) => ({ family: k, colors: groups.get(k)! }))
})()
export const familyLabel: Record<string, string> = {
  mint: 'Mint', brand: 'Brand accents', dark: 'Dark neutrals', light: 'Light neutrals', success: 'Success', error: 'Error', warning: 'Warning',
}
const hexByVar = new Map(manifest.brand.colors.map((c) => [c.name, c.hex]))
const semanticByVar = new Map(manifest.semantic.map((s) => [s.name, s]))

/** "--mint-45" → "Mint 45", "--electric-blue-l1" → "Electric blue L1". */
export function prettyVar(name: string) {
  const n = name.replace(/^--/, '')
  return n
    .split('-')
    .map((w, i) => (/^l\d$/.test(w) ? w.toUpperCase() : i === 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
}

// ---------------------------------------------------------------------------
// Parsing a token value into what a picker shows.
// ---------------------------------------------------------------------------
export interface ColorValue { ref: string; alpha: number }
export function parseColor(v: string): ColorValue | null {
  const s = v.trim()
  let m = s.match(/^var\((--(?:[\w-]|\\:)+)(?:\s*,\s*([\s\S]+))?\)$/)
  if (m) {
    // A component token that falls back to another component token: show what it resolves to.
    if (!hexByVar.has(m[1]) && !semanticByVar.has(m[1]) && m[2]) return parseColor(m[2])
    return { ref: m[1], alpha: 100 }
  }
  m = s.match(/^color-mix\(in \w+,\s*var\((--(?:[\w-]|\\:)+)\)\s+([\d.]+)%,\s*transparent\)$/)
  if (m) return { ref: m[1], alpha: +m[2] }
  if (s === 'transparent') return { ref: 'transparent', alpha: 100 }
  return null
}
export function formatColor({ ref, alpha }: ColorValue) {
  if (ref === 'transparent') return 'transparent'
  return alpha >= 100 ? `var(${ref})` : `color-mix(in oklab, var(${ref}) ${alpha}%, transparent)`
}
export function colorHex(ref: string): string | null {
  if (ref === 'transparent') return null
  return hexByVar.get(ref) ?? semanticByVar.get(ref)?.hex ?? null
}
export function colorLabel(v: string) {
  const c = parseColor(v)
  if (!c) return v
  if (c.ref === 'transparent') return 'None'
  const base = semanticByVar.has(c.ref) ? `${prettyVar(c.ref)} role` : prettyVar(c.ref)
  return c.alpha < 100 ? `${base} at ${c.alpha}%` : base
}

const SPACING_PX = 4
export function parseLength(v: string): number | null {
  const s = v.trim()
  let m = s.match(/^calc\(var\(--spacing\)\s*\*\s*([\d.]+)\)$/)
  if (m) return +m[1] * SPACING_PX
  m = s.match(/^([\d.]+)px$/)
  if (m) return +m[1]
  m = s.match(/^([\d.]+)rem$/)
  if (m) return +m[1] * 16
  m = s.match(/^var\(--(?:[\w-]|\\:)+,\s*([\s\S]+)\)$/)
  if (m) return parseLength(m[1])
  return null
}
export const formatLength = (px: number) => (px % SPACING_PX === 0 || (px * 2) % SPACING_PX === 0 ? `calc(var(--spacing) * ${px / SPACING_PX})` : `${px}px`)

export const radiusSteps = [{ name: 'none', value: '0', px: 0 }, ...manifest.brand.radius.map((r) => ({ name: r.name.replace('--radius-', ''), value: `var(${r.name})`, px: r.value.endsWith('rem') ? parseFloat(r.value) * 16 : parseFloat(r.value) }))]
export function radiusLabel(v: string) {
  const s = v.trim()
  if (s === '0') return 'Square'
  const m = s.match(/var\((--radius-[\w]+)\)\)*$/) ?? s.match(/^var\((--radius-[\w]+)\)$/)
  const step = radiusSteps.find((r) => m && r.value === `var(${m[1]})`)
  if (step) return step.name === 'full' ? 'Fully round' : `${step.px}px`
  const px = parseLength(s)
  return px !== null ? `${px}px` : s
}

export const SHADOWS: { name: string; label: string; value: string }[] = [
  { name: 'none', label: 'None', value: '0 0 #0000' },
  { name: 'xs', label: 'Hairline', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
  { name: 'sm', label: 'Small', value: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' },
  { name: 'md', label: 'Medium', value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
  { name: 'lg', label: 'Large', value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' },
  { name: 'xl', label: 'Extra large', value: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' },
  { name: '2xl', label: 'Floating', value: '0 25px 50px -12px rgb(0 0 0 / 0.25)' },
]
export const WEIGHTS = [
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semibold' },
  { value: '700', label: 'Bold' },
]
export const TRACKING = [
  { value: '0em', label: 'Normal' },
  { value: 'var(--tracking-heading)', label: 'Heading (tight)' },
  { value: 'var(--tracking-button)', label: 'Button (wide)' },
  { value: '0.08em', label: 'Extra wide' },
]

/** Plain-language reading of any value, for "Default:" lines and the change list. */
export function describeValue(type: ValueType, v: string): string {
  switch (type) {
    case 'color': return colorLabel(v)
    case 'radius': return radiusLabel(v)
    case 'length': { const px = parseLength(v); return px === null ? v : `${px}px` }
    case 'shadow': return SHADOWS.find((s) => s.value === v)?.label ?? 'Custom shadow'
    case 'font-weight': return WEIGHTS.find((w) => w.value === v)?.label ?? v
    case 'opacity': return `${Math.round(parseFloat(v) * 100)}%`
    case 'tracking': return TRACKING.find((t) => t.value === v)?.label ?? v
  }
}

// ---------------------------------------------------------------------------
// Names
// ---------------------------------------------------------------------------
export const titleCase = (kebab: string) => kebab.replace(/(^|-)(\w)/g, (_, d, c) => (d ? ' ' : '') + c.toUpperCase())
export const pascal = (kebab: string) => kebab.replace(/(^|-)(\w)/g, (_, _d, c) => c.toUpperCase())

/** The CSS block an app pastes in after importing the design system. */
export function exportCss(overrides: Overrides) {
  const names = Object.keys(overrides).sort()
  if (!names.length) return ':root {\n  /* No changes yet. */\n}\n'
  const groups = new Map<string, string[]>()
  for (const n of names) {
    const comp = manifest.components.find((c) => c.tokens.some((t) => t.name === n))?.component
    const key = comp ? titleCase(comp) : manifest.semantic.some((s) => s.name === n) ? 'Semantic roles' : 'Global look'
    groups.set(key, [...(groups.get(key) ?? []), `  ${n}: ${overrides[n]};`])
  }
  return `:root {\n${[...groups].map(([g, lines]) => `  /* ${g} */\n${lines.join('\n')}`).join('\n\n')}\n}\n`
}

/** Read a block exported earlier back into overrides. */
export function importCss(css: string): Overrides {
  const out: Overrides = {}
  for (const m of css.matchAll(/(--(?:[\w-]|\\:)+)\s*:\s*([^;]+);/g)) out[m[1]] = m[2].trim()
  return out
}
