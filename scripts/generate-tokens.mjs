#!/usr/bin/env node
/**
 * Generates src/generated/default-tokens.ts from globals.css + utilities.css,
 * so the JS token defaults can never drift from the CSS. Also fails if a colour
 * primitive has no `--color-*` line in @theme inline (no bg-/text- utility).
 *
 *   node scripts/generate-tokens.mjs           write the file
 *   node scripts/generate-tokens.mjs --check   fail if the file is out of date
 *
 * Reads:
 *   - colour primitives in :root   (`--mint-45: oklch(…); /* #00AE95 *\/`)
 *   - product badge aliases        (`--badge-product-bpi: var(--category-01);`)
 *   - semantic colour roles        (`--primary: var(--mint-45);`, any alias with a --color-* utility)
 *   - text styles in :root        (`--text-h1`, `--text-h1--line-height`, …)
 *   - letter-spacing / uppercase   (the `.text-*` rules in utilities.css)
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const outFile = path.join(root, 'src', 'generated', 'default-tokens.ts')

const css = fs.readFileSync(path.join(root, 'globals.css'), 'utf8')
const utilities = fs.readFileSync(path.join(root, 'utilities.css'), 'utf8')

const toCamel = (name) => name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())

function sliceBlock(source, opener) {
  const start = source.indexOf(opener)
  if (start === -1) throw new Error(`Could not find "${opener}" in globals.css`)
  let depth = 0
  for (let i = source.indexOf('{', start); i < source.length; i++) {
    if (source[i] === '{') depth++
    if (source[i] === '}' && --depth === 0) return source.slice(start, i + 1)
  }
  throw new Error(`Unclosed block "${opener}" in globals.css`)
}

const rootBlock = sliceBlock(css, ':root {')
const themeBlock = sliceBlock(css, '@theme inline {')

function readRootVar(name) {
  const match = rootBlock.match(new RegExp(`^\\s*--${name}:\\s*([^;]+);`, 'm'))
  if (!match) throw new Error(`--${name} is missing from :root in globals.css`)
  return match[1].trim()
}

// ---------- Colours ----------
const colors = {}
const hexByVar = {}
for (const [, name, hex] of rootBlock.matchAll(/^\s*--([\w-]+):\s*oklch\([^)]*\);\s*\/\*\s*(#[0-9A-Fa-f]{6})/gm)) {
  colors[toCamel(name)] = hex.toUpperCase()
  hexByVar[name] = hex.toUpperCase()
}
const missingHex = [...rootBlock.matchAll(/^\s*--([\w-]+):\s*oklch\([^)]*\);(?!\s*\/\*\s*#)/gm)].map((m) => m[1])
if (missingHex.length) {
  throw new Error(`Colour primitives need a /* #RRGGBB */ comment: ${missingHex.join(', ')}`)
}

// Product badges alias a colour token, like --badge-product-bpi: var(--category-01)
// Every colour primitive needs a --color-* line in @theme inline, or it has no utility class
const exposed = new Set([...themeBlock.matchAll(/--color-([\w-]+)\s*:/g)].map((m) => m[1]))
const unexposed = Object.keys(hexByVar).filter((name) => !exposed.has(name))
if (unexposed.length) {
  throw new Error(
    `Colour primitives with no utility class. Add to @theme inline:\n${unexposed.map((n) => `  --color-${n}: var(--${n});`).join('\n')}`,
  )
}

const badgeProductAliases = {}
for (const [, name, ref] of rootBlock.matchAll(/^\s*--badge-product-([\w-]+):\s*var\(--([\w-]+)\);/gm)) {
  if (!hexByVar[ref]) throw new Error(`--badge-product-${name} points at unknown colour --${ref}`)
  badgeProductAliases[toCamel(name)] = toCamel(ref)
}

// Semantic roles alias a colour token, like --primary: var(--mint-45). A role is an alias with a
// --color-* utility in @theme inline, which leaves out non-colour aliases like --radius.
const semanticAliases = {}
for (const [, name, ref] of rootBlock.matchAll(/^\s*--([\w-]+):\s*var\(--([\w-]+)\);/gm)) {
  if (name.startsWith('badge-product-') || hexByVar[name] || !exposed.has(name)) continue
  if (!hexByVar[ref]) throw new Error(`--${name} points at --${ref}, which isn't a colour primitive`)
  if (colors[toCamel(name)]) throw new Error(`--${name} has the same JS name as a colour primitive`)
  semanticAliases[toCamel(name)] = toCamel(ref)
}

// ---------- Typography ----------
const textRules = {}
for (const [, selectors, body] of utilities.matchAll(/((?:\s*\.text-[\w-]+\s*,?)+)\{([^}]*)\}/g)) {
  const letterSpacing = body.match(/letter-spacing:\s*([^;]+);/)?.[1].trim()
  const uppercase = /text-transform:\s*uppercase/.test(body)
  for (const [, name] of selectors.matchAll(/\.text-([\w-]+)/g)) {
    textRules[name] = { ...textRules[name], ...(letterSpacing && { letterSpacing }), ...(uppercase && { uppercase }) }
  }
}

const typography = {}
for (const [, name, fontSize] of rootBlock.matchAll(/^\s*--text-([\w-]+?):\s*([^;]+);/gm)) {
  if (name.includes('--')) continue
  const prop = (suffix) => rootBlock.match(new RegExp(`^\\s*--text-${name}--${suffix}:\\s*([^;]+);`, 'm'))?.[1].trim()
  const rule = textRules[name] ?? {}
  typography[toCamel(name)] = {
    fontSize: fontSize.trim(),
    lineHeight: prop('line-height') ?? 'normal',
    fontWeight: Number(prop('font-weight') ?? 400),
    ...(rule.letterSpacing && { letterSpacing: rule.letterSpacing }),
    ...(rule.uppercase && { textTransform: 'uppercase' }),
  }
}

// Sanity: the utilities.css letter-spacing values must match the tracking tokens.
for (const [token, expected] of [['tracking-heading', 'h1'], ['tracking-button', 'buttonMd']]) {
  const value = readRootVar(token)
  if (typography[expected]?.letterSpacing !== value) {
    throw new Error(`utilities.css letter-spacing for ${expected} (${typography[expected]?.letterSpacing}) ≠ --${token} (${value})`)
  }
}

// ---------- Output ----------
const literal = (value) => JSON.stringify(value, null, 2).replace(/"([A-Za-z_$][\w$]*)":/g, '$1:').replace(/"/g, "'")

const output = `// Generated from globals.css and utilities.css by scripts/generate-tokens.mjs. Do not edit.
// Run \`pnpm generate-tokens\` after changing a colour or text token.

export const defaultColors = ${literal(colors)} as const

// Each semantic role names the colour token it uses, as in globals.css.
export const defaultSemanticAliases = ${literal(semanticAliases)} as const

// Each product badge names the colour token it uses, as in globals.css.
export const defaultBadgeProductAliases = ${literal(badgeProductAliases)} as const

export const defaultTypography = ${literal(typography)} as const
`

if (process.argv.includes('--check')) {
  const current = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf8') : ''
  if (current !== output) {
    console.error('❌ src/generated/default-tokens.ts is out of date. Run `pnpm generate-tokens`.')
    process.exit(1)
  }
  console.log('✅ Generated tokens are up to date.')
} else {
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, output)
  console.log(
    `✅ Wrote ${path.relative(root, outFile)}: ${Object.keys(colors).length} colours, ${Object.keys(semanticAliases).length} semantic roles, ` +
      `${Object.keys(badgeProductAliases).length} product badges, ${Object.keys(typography).length} text styles.`,
  )
}
