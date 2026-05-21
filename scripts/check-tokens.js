#!/usr/bin/env node
/**
 * Token sanity check (Tailwind v4)
 *
 * Verifies that every brand colour primitive declared in `:root` is exposed
 * as a Tailwind utility via `@theme inline` in globals.css.
 *
 * Catches the most common drift: adding a new colour primitive and forgetting
 * to wire it into `@theme` so `bg-{name}` / `text-{name}` work in JSX.
 *
 * Semantic shadcn tokens (--background, --primary, --muted, …) are exposed
 * separately and not checked here.
 */
const fs = require('fs')
const path = require('path')

const css = fs.readFileSync(path.join(__dirname, '..', 'globals.css'), 'utf8')

// Slice :root primitives — from `:root {` to the start of the semantic block
// (marked by the first `--background:` declaration).
const rootStart = css.indexOf(':root {')
const semanticStart = css.indexOf('--background:', rootStart)
if (rootStart === -1 || semanticStart === -1) {
  console.error('❌ Could not locate :root block boundaries in globals.css')
  process.exit(1)
}
const primitivesBlock = css.slice(rootStart, semanticStart)

// Pull the @theme inline block
const themeMatch = css.match(/@theme inline\s*\{([\s\S]*?)\n\}/)
if (!themeMatch) {
  console.error('❌ Could not locate @theme inline block in globals.css')
  process.exit(1)
}

// Every primitive declared as oklch(…)
const primitives = new Set()
for (const [, name] of primitivesBlock.matchAll(/^\s*--([\w-]+):\s*oklch/gm)) {
  primitives.add(name)
}

// Every --color-X exposed in @theme inline
const exposed = new Set()
for (const [, name] of themeMatch[1].matchAll(/--color-([\w-]+)\s*:/g)) {
  exposed.add(name)
}

const missing = [...primitives].filter((p) => !exposed.has(p))

if (missing.length) {
  console.error('\n❌ Colour primitives missing a --color-* exposure in @theme inline:')
  missing.forEach((t) =>
    console.error(`   --${t}  →  add  --color-${t}: var(--${t});  to @theme inline`),
  )
  process.exit(1)
}

console.log(
  `✅ Token sanity OK — ${primitives.size} colour primitives, all exposed via @theme inline.`,
)
