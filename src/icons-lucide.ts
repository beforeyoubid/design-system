// =============================================================================
// Icons — Lucide, the secondary BYB icon set (alongside Tabler in `./icons`).
//
// Re-exported under the `@beforeyoubid/design-system/icons/lucide` subpath. It
// lives on its own subpath rather than in `./icons` because Tabler and Lucide
// both export overlapping names (`Icon`, `icons`, …).
//
// `lucide-react` is external in tsup, so this compiles to a thin pass-through
// and the consumer's bundler tree-shakes against the real package:
//   import { House, ChevronRight } from '@beforeyoubid/design-system/icons/lucide'
//   <House className="size-4 text-navy" />
//
// No `'use client'` banner (see tsup.config.ts) — Lucide icons are plain SVG
// and stay usable inside RSC server components.
// =============================================================================
export * from 'lucide-react'
