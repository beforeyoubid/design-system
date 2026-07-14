#!/usr/bin/env node
/**
 * Token pipeline — generates all token artifacts from tokens/*.json.
 *
 *   node scripts/build-tokens.js          regenerate globals.css + src/tokens.ts
 *   node scripts/build-tokens.js --check  staleness check: fail if committed
 *                                         artifacts differ from what the token
 *                                         sources would generate (run in CI)
 *
 * Source of truth:
 *   tokens/primitives.json      brand facts (colours, typography, radius, …)
 *   tokens/themes/website.json  semantic slot mapping (light + dark)
 *
 * Never edit the generated files by hand.
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'))

const primitives = read('tokens/primitives.json')
const theme = read('tokens/themes/website.json')

// ── helpers ──────────────────────────────────────────────────────────────────

/** '{mint-45}' → 'var(--mint-45)' — validates the primitive exists. */
const primitiveNames = new Set(primitives.colors.flatMap((g) => g.tokens.map((t) => t.name)))
function ref(value, context) {
  const m = /^\{([\w-]+)\}$/.exec(value)
  if (!m) throw new Error(`Theme value "${value}" (${context}) must be a {primitive} reference`)
  if (!primitiveNames.has(m[1])) throw new Error(`Theme ${context} references unknown primitive "${m[1]}"`)
  return `var(--${m[1]})`
}

/** Emit aligned CSS declarations: pads property names so values line up. */
function decls(entries, indent = '  ') {
  const width = Math.max(...entries.map(([prop]) => prop.length)) + 1
  return entries
    .map(([prop, value, comment]) => {
      const line = `${indent}${(prop + ':').padEnd(width + 1)}${value};`
      return comment ? `${line} /* ${comment} */` : line
    })
    .join('\n')
}

const banner = (title) => `/* =============================================================================
 * ${title}
 * ============================================================================= */`

// Semantic slots are emitted in visually grouped blocks, some with comments.
const SEMANTIC_LAYOUT = [
  { keys: ['background', 'foreground'] },
  { keys: ['card', 'card-foreground', 'popover', 'popover-foreground'] },
  { keys: ['primary', 'primary-foreground'] },
  { keys: ['secondary', 'secondary-foreground'] },
  { keys: ['muted', 'muted-foreground'] },
  { keys: ['accent', 'accent-foreground'] },
  { keys: ['destructive', 'destructive-foreground'] },
  {
    comment: "shadcn doesn't ship these by default — common project extensions",
    keys: ['success', 'success-foreground', 'warning', 'warning-foreground'],
  },
  { keys: ['border', 'input', 'ring'] },
  { comment: 'shadcn chart slots', keys: ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'] },
  {
    comment: 'Sidebar (shadcn 2025)',
    keys: [
      'sidebar',
      'sidebar-foreground',
      'sidebar-primary',
      'sidebar-primary-foreground',
      'sidebar-accent',
      'sidebar-accent-foreground',
      'sidebar-border',
      'sidebar-ring',
    ],
  },
]

function semanticBlock(map, mode) {
  const blocks = []
  for (const group of SEMANTIC_LAYOUT) {
    const present = group.keys.filter((k) => k in map)
    if (!present.length) continue
    const lines = decls(present.map((k) => [`--${k}`, ref(map[k], `${mode}.${k}`)]))
    blocks.push(group.comment ? `  /* ${group.comment} */\n${lines}` : lines)
  }
  // Guard against typos: every theme key must be consumed by the layout.
  const known = new Set(SEMANTIC_LAYOUT.flatMap((g) => g.keys))
  for (const k of Object.keys(map)) {
    if (!known.has(k)) throw new Error(`Theme ${mode} key "${k}" is not in SEMANTIC_LAYOUT — add it`)
  }
  return blocks.join('\n\n')
}

// ── globals.css ──────────────────────────────────────────────────────────────

function buildGlobalsCss() {
  const parts = []

  parts.push(`/* =============================================================================
 * @beforeyoubid/design-system — globals.css
 * Tailwind CSS v4 + shadcn/ui (BaseUI) — design tokens
 *
 * ⚠ GENERATED FILE — do not edit by hand.
 *   Source: tokens/primitives.json + tokens/themes/website.json
 *   Regenerate with: pnpm build-tokens
 *
 * Figma source of truth:
 *   ${primitives.$meta.figma}
 *
 * Import this file once in the consuming app's root layout.
 *
 *   import "@beforeyoubid/design-system/globals.css"
 *
 * Plus Jakarta Sans must be loaded by the consumer (e.g. via next/font/google).
 * ============================================================================= */

@import "tailwindcss";
@import "./utilities.css";

/* -----------------------------------------------------------------------------
 * Source scanning — when this package is installed under node_modules, Tailwind
 * won't see the classes used by our compiled components unless we tell it to.
 * Paths are resolved relative to this file, so once published this resolves to
 *   node_modules/@beforeyoubid/design-system/dist/**
 * giving the consumer's Tailwind build full visibility with zero config.
 * --------------------------------------------------------------------------- */
@source "./dist/**/*.{js,mjs}";

@custom-variant dark (&:where(.dark, .dark *));

${banner('PRIMITIVES')}

:root {`)

  // Colour primitives
  for (const group of primitives.colors) {
    parts.push(`  /* ---------- ${group.group} ---------- */`)
    parts.push(
      decls(
        group.tokens.map((t) => [
          `--${t.name}`,
          t.oklch,
          t.note ? `${t.hex} — ${t.note}` : t.hex,
        ]),
      ),
    )
    parts.push('')
  }

  parts.push(`  /* ---------- Transparent UI ----------
   * The four Figma "Transparent/*" tokens are composites of opaque primitives
   * + alpha. Use Tailwind's opacity modifier instead of defining them here:
   *   Transparent/Overlay-95%  →  bg-dark-100/95
   *   Transparent/Overlay-50%  →  bg-dark-100/50
   *   Transparent/Button-B     →  bg-dark-30/80
   *   Transparent/Button-A     →  bg-light-l2/80
   */

  /* =============================================================================
   * Typography
   * ============================================================================= */

  /* Font family — Plus Jakarta Sans is loaded by the consuming app (e.g. via
   * next/font/google). We just declare the stack here.
   */
  --font-sans:
    ${primitives.font.sans.replace('ui-sans-serif,', 'ui-sans-serif,\n   ').replace('Roboto,', '\n    Roboto,').replace(/\s+/g, ' ')};

  /* Letter-spacing tokens (tracking-heading, tracking-btn) */
${decls([
  ['--tracking-heading', primitives.tracking.heading],
  ['--tracking-btn', primitives.tracking.btn],
])}

  /* =============================================================================
   * Radius scale
   * ============================================================================= */

${decls(primitives.radius.scale.map((r) => [`--radius-${r.name}`, r.value, r.note]))}

  /* shadcn-compatible alias — components reference \`var(--radius)\` */
  --radius: var(--radius-${primitives.radius.alias});

  /* =============================================================================
   * Layout
   * ============================================================================= */

  --container-site: ${primitives.layout['container-site']};

${decls(['sm', 'md', 'lg'].map((s) => [`--spacing-section-${s}`, primitives.layout[`spacing-section-${s}`]]))}

  /* =============================================================================
   * SEMANTIC TOKENS — light mode (shadcn slots)
   * Components consume these. Re-skin BYB by editing tokens/themes/*.json only.
   * ============================================================================= */

${semanticBlock(theme.semantic, 'semantic')}
}

${banner('SEMANTIC TOKENS — dark mode')}

.dark {
${semanticBlock(theme.dark, 'dark')}
}

${banner('Keyframes')}

@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes fade-in {
  0%   { opacity: 0; transform: translateY(6px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* =============================================================================
 * @theme — exposes every token as a Tailwind utility.
 * \`inline\` is required so utilities resolve through the var-of-var chain.
 * ============================================================================= */

@theme inline {
  /* ---------- Color primitives → bg-mint-45, text-cobalt, border-dark-15, … ---------- */
`)

  for (const group of primitives.colors) {
    parts.push(`  /* ${group.group} */`)
    parts.push(decls(group.tokens.map((t) => [`--color-${t.name}`, `var(--${t.name})`])))
    parts.push('')
  }

  parts.push(`  /* ---------- shadcn semantic slots → bg-primary, text-muted-foreground, … ---------- */
${decls(Object.keys(theme.semantic).map((k) => [`--color-${k}`, `var(--${k})`]))}

  /* ---------- Typography ---------- */
  --font-sans: var(--font-sans);
`)

  for (const group of primitives.typography) {
    const entries = []
    for (const t of group.tokens) {
      entries.push([`--text-${t.name}`, t.size])
      entries.push([`--text-${t.name}--line-height`, t.lineHeight])
      if (t.weight !== 400) entries.push([`--text-${t.name}--font-weight`, String(t.weight)])
    }
    parts.push(`  /* ${group.group} */`)
    parts.push(decls(entries))
    parts.push('')
  }

  parts.push(`  /* Letter spacing */
${decls([
  ['--tracking-heading', 'var(--tracking-heading)'],
  ['--tracking-btn', 'var(--tracking-btn)'],
])}

  /* ---------- Radius ---------- */
${decls(primitives.radius.scale.map((r) => [`--radius-${r.name}`, `var(--radius-${r.name})`]))}

  /* ---------- Layout ---------- */
${decls([
  ['--container-site', 'var(--container-site)'],
  ['--spacing-section-sm', 'var(--spacing-section-sm)'],
  ['--spacing-section-md', 'var(--spacing-section-md)'],
  ['--spacing-section-lg', 'var(--spacing-section-lg)'],
])}

  /* ---------- Animation ---------- */
${decls(Object.entries(primitives.animations).map(([k, v]) => [`--animate-${k}`, v]))}

  @keyframes accordion-down {
    from {
      height: 0;
    }
    to {
      height: var(--radix-accordion-content-height);
    }
  }

  @keyframes accordion-up {
    from {
      height: var(--radix-accordion-content-height);
    }
    to {
      height: 0;
    }
  }
}

${banner('BASE')}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground font-sans antialiased;
  }
}
`)

  return parts.join('\n')
}

// ── src/tokens.ts ────────────────────────────────────────────────────────────

const camel = (name) => name.replace(/-(\w)/g, (_, c) => c.toUpperCase())

function buildTokensTs() {
  const lines = []
  lines.push(`// ⚠ GENERATED FILE — do not edit by hand.
//   Source: tokens/primitives.json · Regenerate with: pnpm build-tokens
//
// Typography tokens — mirrors Figma "font / plus jakarta sans" without the family prefix.
// Semi-bold headings always pair with letterSpacing: '${primitives.tracking.heading}' (tracking-heading class).
// Button styles are uppercase with letterSpacing: '${primitives.tracking.btn}' (tracking-btn class).
export const typography = {`)

  for (const group of primitives.typography) {
    const tsTokens = group.tokens.filter((t) => t.ts)
    if (!tsTokens.length) continue
    lines.push(`  // ${group.group}`)
    for (const t of tsTokens) {
      const props = [`fontSize: '${t.size}'`, `lineHeight: '${t.lineHeight}'`, `fontWeight: ${t.weight}`]
      if (t.ts.letterSpacing) props.push(`letterSpacing: '${t.ts.letterSpacing}'`)
      if (t.ts.textTransform) props.push(`textTransform: '${t.ts.textTransform}' as const`)
      lines.push(`  ${t.ts.key}: { ${props.join(', ')} },`)
    }
  }

  lines.push(`} as const

export type TypographyToken = keyof typeof typography

export const colors = {`)

  for (const group of primitives.colors) {
    lines.push(`  // ${group.group}`)
    for (const t of group.tokens) {
      lines.push(`  ${camel(t.name)}: '${t.hex}',`)
    }
  }

  lines.push(`} as const

export type ColorToken = keyof typeof colors
`)

  return lines.join('\n')
}

// ── main ─────────────────────────────────────────────────────────────────────

const OUTPUTS = [
  { file: 'globals.css', build: buildGlobalsCss },
  { file: 'src/tokens.ts', build: buildTokensTs },
]

const checkMode = process.argv.includes('--check')
let stale = false

for (const { file, build } of OUTPUTS) {
  const target = path.join(ROOT, file)
  const generated = build()
  if (checkMode) {
    const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : ''
    if (current !== generated) {
      console.error(`❌ ${file} is stale — regenerate with \`pnpm build-tokens\` and commit.`)
      stale = true
    } else {
      console.log(`✅ ${file} is in sync with tokens/*.json`)
    }
  } else {
    fs.writeFileSync(target, generated)
    console.log(`✍  wrote ${file}`)
  }
}

if (checkMode && stale) process.exit(1)
