# @beforeyoubid/design-system

BYB design system — **Tailwind CSS v4** + **shadcn/ui (BaseUI)** pattern components for the BYB public website and other product surfaces.

Live Storybook: https://storybook.beforeyoubuy.com.au/design-system/

---

## What you get

- Brand colour palette (OKLCH, full Figma parity) — `bg-mint-45`, `bg-cobalt`, `text-navy`, …
- shadcn semantic layer — `bg-primary`, `text-foreground`, `bg-destructive`, dark mode, … out of the box
- Typography scale — `text-display-xl`, `text-heading-lg`, `text-body-md`, `text-btn-md`, …
- Radius, shadow, spacing, animation tokens
- Components — opinionated BYB wrappers (`BYBButton`, `BYBCard`, `BYBPillTabs`, …)
- `cn()` helper with `tailwind-merge` extended for every BYB token
- `components.json` so `npx shadcn@latest add <component>` works inside this repo

## Requirements

- **Tailwind CSS v4** in the consuming app (`>=4`)
- React 18+
- Next.js 14+ (peer; works in non-Next consumers too)

## Install

```bash
pnpm add @beforeyoubid/design-system
pnpm add -D tailwindcss@^4 @tailwindcss/postcss
```

> Using a different package manager in your app is fine — swap `pnpm add` for `yarn add` / `npm install` as appropriate.

```js
// postcss.config.js
module.exports = {
  plugins: { '@tailwindcss/postcss': {} },
}
```

```ts
// app/layout.tsx (Next.js App Router)
import "@beforeyoubid/design-system/globals.css"
```

That's the entire setup. Load **Plus Jakarta Sans** in your app (e.g. via `next/font/google`) — the design system declares the font stack but doesn't ship the font itself.

> Vite consumers can swap `@tailwindcss/postcss` for `@tailwindcss/vite` (skip `postcss.config.js`, add the plugin to `vite.config.ts` instead). Same output.

## Tree-shaking

The package is configured for full tree-shaking on both axes — you only ship the components and utilities you actually use.

### CSS (automatic)

Tailwind v4 only emits utility classes that are referenced somewhere in scanned source files. To make sure classes baked into our compiled components (`bg-primary` inside `BYBButton` etc.) reach your bundle, our `globals.css` ships an `@source` directive that points Tailwind at `node_modules/@beforeyoubid/design-system/dist/**`. **Zero consumer config required.**

If you only render `<BYBButton variant="lime" />` in your app, only the utility classes that variant uses end up in your CSS. The rest are dropped.

### JS (automatic, with `sideEffects: ["**/*.css"]`)

Components are published as ESM. Importing just one named export drops the rest:

```ts
import { BYBButton } from "@beforeyoubid/design-system"
//        ^ only BYBButton + its transitive deps end up in your bundle
```

The package declares `"sideEffects": ["**/*.css"]` in its `package.json`, so bundlers know JS exports are pure (free to tree-shake) but CSS side-effects (`import "./globals.css"`) are preserved.

## Local development

This repo uses **pnpm** (`pnpm@11.9.0` via corepack). Enable it once with `corepack enable pnpm`.

```bash
pnpm install
pnpm dev          # tsup watch mode
pnpm storybook    # Storybook at http://localhost:6006
```

### Scripts

| Command | What it does |
|---|---|
| `pnpm build` | Production build — ESM + CJS + types via tsup |
| `pnpm dev` | Watch mode build |
| `pnpm storybook` | Run Storybook locally on port 6006 |
| `pnpm build-storybook` | Static Storybook build |
| `pnpm lint` | ESLint across `src/` |
| `pnpm type-check` | TypeScript strict check (no emit) |
| `pnpm check-tokens` | Verify every colour primitive is exposed via `@theme inline` |

## Generating new components

This package is configured for the shadcn CLI:

```bash
npx shadcn@latest add button
# generates src/components/ui/button.tsx wired against our semantic tokens
```

Customize the generated file, then re-export from `src/index.ts`.

## Publishing

Publishing is manual — no CI publish step.

```bash
pnpm build-and-publish   # builds then runs npm publish --access public
```

Bump the version in `package.json` before publishing. v2.0 onwards follows semver from `2.0.0-alpha.N`.

## Using in byb-website (local)

byb-website uses Yarn 1 classic, so link the built package for local development:

**1. Register the link (once, in design-system):**
```bash
cd services/design-system
pnpm build        # must build first so dist/ exists
pnpm link --global
```

**2. Use the link (in byb-website):**
```bash
cd services/byb-website
yarn link @beforeyoubid/design-system
```

From then on, run `pnpm dev` in design-system while working — changes rebuild automatically and byb-website picks them up on next page refresh.

**To unlink when done:**
```bash
cd services/byb-website
yarn unlink @beforeyoubid/design-system
yarn install --force
```

## Migrating from v1

v1.x targeted Tailwind v3 with a `tailwind.config.ts` extension. v2.0 moves everything to Tailwind v4 + CSS-first config via `@theme inline`. To migrate a consumer:

1. Upgrade Tailwind to v4: `pnpm add -D tailwindcss@^4 @tailwindcss/postcss`
2. Replace `@tailwind base; @tailwind components; @tailwind utilities;` with `@import "tailwindcss";`
3. Remove the `tailwind.config.ts` import / extension from the design system (no longer published)
4. Replace `bg-overlay-95` / `bg-button-a` etc. with the opacity-modifier equivalents — see CLAUDE.md
5. Continue using `bg-mint-45`, `text-heading-lg`, etc. — these names are unchanged

## Adding a token

1. Add the CSS variable to `globals.css` under `:root`
2. Add the matching `--color-{name}: var(--{name});` line in `@theme inline`
3. Run `pnpm check-tokens`

## CI

Every PR runs: token sanity check → type-check → lint → build → Storybook build.

Merging to `main` triggers an automatic Storybook deploy to S3 + CloudFront invalidation.

## Repo

- GitHub: https://github.com/beforeyoubid/design-system
- npm: `@beforeyoubid/design-system`
- Storybook: https://storybook.beforeyoubuy.com.au/design-system/
