/**
 * Resolve token values to sRGB colours and measure WCAG contrast. Reads the
 * brand and semantic tokens from globals.css (:root only; no dark mode).
 */
import fs from 'node:fs'
import path from 'node:path'
import { root } from './lib.mjs'

const css = fs.readFileSync(path.join(root, 'globals.css'), 'utf8')
export const rootVars = new Map()
for (const block of css.matchAll(/(?:^|\n):root\s*\{([\s\S]*?)\n\}/g)) {
  for (const [, name, value] of block[1].matchAll(/(--(?:[\w-]|\\:)+)\s*:\s*([^;]+);/g)) rootVars.set(name, value.trim())
}

const NAMED = { white: '#ffffff', black: '#000000' }

function hex(h) {
  const x = h.replace('#', '')
  const n = x.length === 3 ? x.split('').map((c) => c + c).join('') : x
  return { r: parseInt(n.slice(0, 2), 16) / 255, g: parseInt(n.slice(2, 4), 16) / 255, b: parseInt(n.slice(4, 6), 16) / 255, a: 1 }
}

function oklch(L, C, H) {
  const a = C * Math.cos((H * Math.PI) / 180)
  const b = C * Math.sin((H * Math.PI) / 180)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
  const enc = (v) => {
    const c = Math.min(1, Math.max(0, v))
    return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055
  }
  return { r: enc(lin[0]), g: enc(lin[1]), b: enc(lin[2]), a: 1 }
}

/** Split a CSS argument list at top-level commas. */
function args(s) {
  const out = []
  let depth = 0
  let cur = ''
  for (const ch of s) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === ',' && depth === 0) {
      out.push(cur.trim())
      cur = ''
    } else cur += ch
  }
  out.push(cur.trim())
  return out
}

/** Resolve a CSS colour value (var() chains, color-mix, hex, oklch) to { r, g, b, a } or null. */
export function resolveColor(value, depth = 0) {
  if (depth > 20 || !value) return null
  const v = value.trim()
  if (v === 'transparent') return { r: 1, g: 1, b: 1, a: 0 }
  if (NAMED[v]) return hex(NAMED[v])
  if (v.startsWith('#')) return hex(v)
  let m = v.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+)(%?))?\s*\)$/)
  if (m) {
    const c = oklch(m[2] ? +m[1] / 100 : +m[1], +m[3], +m[4])
    if (m[5]) c.a = m[6] ? +m[5] / 100 : +m[5]
    return c
  }
  m = v.match(/^var\(\s*(--(?:[\w-]|\\:)+)\s*(?:,\s*([\s\S]+))?\)$/)
  if (m) {
    if (rootVars.has(m[1])) return resolveColor(rootVars.get(m[1]), depth + 1)
    return m[2] ? resolveColor(m[2], depth + 1) : null
  }
  m = v.match(/^color-mix\(\s*in\s+\w+\s*,([\s\S]+)\)$/)
  if (m) {
    const [a, b] = args(m[1])
    const pa = a.match(/^([\s\S]+?)\s+([\d.]+)%$/)
    const pb = b.match(/^([\s\S]+?)\s+([\d.]+)%$/)
    const ca = resolveColor(pa ? pa[1] : a, depth + 1)
    const cb = resolveColor(pb ? pb[1] : b, depth + 1)
    if (!ca || !cb) return null
    const wa = pa ? +pa[2] / 100 : pb ? 1 - +pb[2] / 100 : 0.5
    // Mixing with transparent is an alpha change; otherwise a straight blend.
    if (cb.a === 0) return { ...ca, a: ca.a * wa }
    if (ca.a === 0) return { ...cb, a: cb.a * (1 - wa) }
    return { r: ca.r * wa + cb.r * (1 - wa), g: ca.g * wa + cb.g * (1 - wa), b: ca.b * wa + cb.b * (1 - wa), a: 1 }
  }
  return null
}

const over = (top, under) => ({
  r: top.r * top.a + under.r * (1 - top.a),
  g: top.g * top.a + under.g * (1 - top.a),
  b: top.b * top.a + under.b * (1 - top.a),
  a: 1,
})

const luminance = ({ r, g, b }) => {
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

/** WCAG contrast of a foreground on a fill, both composited over a white page. */
export function contrast(fg, bg) {
  const page = { r: 1, g: 1, b: 1, a: 1 }
  const back = over(bg, page)
  const front = over(fg, back)
  const [a, b] = [luminance(front), luminance(back)].sort((x, y) => y - x)
  return (a + 0.05) / (b + 0.05)
}

/** "#RRGGBB" for a resolved colour composited over white. */
export function toHex(c) {
  const o = over(c, { r: 1, g: 1, b: 1, a: 1 })
  return '#' + [o.r, o.g, o.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase()
}
