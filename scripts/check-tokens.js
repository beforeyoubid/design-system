#!/usr/bin/env node
/**
 * Token parity check — every CSS variable in globals.css must have a matching
 * Tailwind color alias in tailwind.config.ts, and vice versa.
 */
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')

const css = fs.readFileSync(path.join(root, 'globals.css'), 'utf8')
const tw = fs.readFileSync(path.join(root, 'tailwind.config.ts'), 'utf8')

// Extract all --color-{name} from globals.css
const cssTokens = new Set()
for (const [, name] of css.matchAll(/--color-([\w-]+)\s*:/g)) {
  cssTokens.add(name)
}

// Extract the colors block from tailwind.config.ts then pull all top-level keys
const colorsBlock = tw.match(/colors:\s*\{([\s\S]*?)\},?\s*maxWidth/)
if (!colorsBlock) {
  console.error('ERROR: could not locate colors block in tailwind.config.ts')
  process.exit(1)
}

const twTokens = new Set()
// Quoted keys: 'mint-90':
for (const [, name] of colorsBlock[1].matchAll(/'([\w-]+)'\s*:/g)) {
  twTokens.add(name)
}
// Unquoted keys: navy:  lime:  green:
for (const [, name] of colorsBlock[1].matchAll(/^\s{8}([\w-]+)\s*:/gm)) {
  if (name !== 'DEFAULT') twTokens.add(name)
}

const inCssNotTw = [...cssTokens].filter(t => !twTokens.has(t))
const inTwNotCss = [...twTokens].filter(t => !cssTokens.has(t))

let failed = false

if (inCssNotTw.length) {
  console.error('\n❌ CSS variables with no Tailwind alias:')
  inCssNotTw.forEach(t => console.error(`   --color-${t}  (add to tailwind.config.ts colors)`))
  failed = true
}

if (inTwNotCss.length) {
  console.error('\n❌ Tailwind color aliases with no CSS variable:')
  inTwNotCss.forEach(t => console.error(`   ${t}  (add --color-${t} to globals.css)`))
  failed = true
}

if (!failed) {
  console.log(`✅ Token parity OK — ${cssTokens.size} CSS vars / ${twTokens.size} Tailwind aliases, all matched.`)
}

process.exit(failed ? 1 : 0)
