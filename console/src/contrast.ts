import { manifest, type ComponentToken } from './tokens'

/**
 * Live contrast: resolve a token pair the way the browser does, by rendering a
 * hidden probe with the part's data-slot (so its private tokens and any :root
 * overrides apply), then reading the colours through a 1×1 canvas.
 */
let host: HTMLDivElement | null = null
const ctx = (() => {
  const c = document.createElement('canvas')
  c.width = c.height = 1
  return c.getContext('2d', { willReadFrequently: true })!
})()

const lum = ([r, g, b]: readonly number[]) => {
  const l = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * l(r) + 0.7152 * l(g) + 0.0722 * l(b)
}

/** Composite fg over bg over white, then WCAG ratio. */
function ratio(fgCss: string, bgCss: string) {
  ctx.clearRect(0, 0, 1, 1)
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, 1, 1)
  ctx.fillStyle = bgCss
  ctx.fillRect(0, 0, 1, 1)
  const bg = ctx.getImageData(0, 0, 1, 1).data
  ctx.fillStyle = fgCss
  ctx.fillRect(0, 0, 1, 1)
  const fg = ctx.getImageData(0, 0, 1, 1).data
  const a = lum([fg[0] / 255, fg[1] / 255, fg[2] / 255])
  const b = lum([bg[0] / 255, bg[1] / 255, bg[2] / 255])
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

function probe(part: string, fgVar: string, bgVar: string) {
  if (!host) {
    host = document.createElement('div')
    host.setAttribute('aria-hidden', 'true')
    host.style.cssText = 'position:fixed;left:-9999px;top:0;visibility:hidden'
    document.body.append(host)
  }
  const el = document.createElement('div')
  el.setAttribute('data-slot', part)
  el.style.color = `var(${fgVar})`
  el.style.backgroundColor = `var(${bgVar})`
  host.append(el)
  const s = getComputedStyle(el)
  const out = { fg: s.color, bg: s.backgroundColor }
  el.remove()
  return out
}

export interface Pair { fg: ComponentToken; bg: ComponentToken; ratio: number; fgCss: string; bgCss: string }

/** Every foreground component token paired with the fill it sits on, for one component. */
export function pairsFor(component: string): Pair[] {
  const comp = manifest.components.find((c) => c.component === component)
  if (!comp) return []
  const out: Pair[] = []
  for (const fg of comp.tokens) {
    if (fg.property !== 'foreground' || fg.state === 'disabled') continue
    const same = (o: ComponentToken) => o.part === fg.part && ['fill'].includes(o.property) && o.variant === fg.variant
    const bg = comp.tokens.find((o) => same(o) && o.state === fg.state) ?? (fg.state ? undefined : comp.tokens.find((o) => same(o) && !o.state))
    if (!bg) continue
    const { fg: fgCss, bg: bgCss } = probe(fg.part, fg.private, bg.private)
    out.push({ fg, bg, ratio: ratio(fgCss, bgCss), fgCss, bgCss })
  }
  return out
}

/** Contrast of a semantic foreground role on its fill role (e.g. --primary-foreground on --primary). */
export function semanticPairs() {
  const names = new Set(manifest.semantic.map((s) => s.name))
  return manifest.semantic
    .filter((s) => s.name.endsWith('-foreground') && names.has(s.name.replace(/-foreground$/, '')))
    .map((s) => {
      const bgName = s.name.replace(/-foreground$/, '')
      const fgCss = getComputedStyle(document.documentElement).getPropertyValue(s.name).trim()
      const bgCss = getComputedStyle(document.documentElement).getPropertyValue(bgName).trim()
      return { fg: s.name, bg: bgName, ratio: ratio(fgCss || '#000', bgCss || '#fff') }
    })
}

