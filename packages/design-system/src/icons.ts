// =============================================================================
// Icons — Tabler is the canonical BYB icon set.
//
// Re-exported under the `@beforeyoubid/design-system/icons` subpath (NOT the
// main barrel) so consumers opt in and keep full tree-shaking: only the icons
// they import end up in their bundle. `@tabler/icons-react` is marked external
// in tsup, so this compiles to a thin pass-through and the consumer's bundler
// shakes against the real package.
//
// Tabler icons render `currentColor` strokes, so BYB token utilities just work:
//   <IconHome className="size-4 text-navy" />
//
// This entry deliberately has NO `'use client'` banner (see tsup.config.ts) —
// the icons are plain SVG and stay usable inside RSC server components.
// =============================================================================
export * from '@tabler/icons-react'
