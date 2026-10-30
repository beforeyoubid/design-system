# @beforeyoubid/design-system

BYB design system — **Tailwind CSS v4** + **shadcn/ui (BaseUI)** pattern components for the BYB public website and other product surfaces.

Live Storybook: https://storybook.beforeyoubuy.com.au/design-system/

---

## What you get

- Brand colour palette (OKLCH, full Figma parity) — `bg-mint-45`, `bg-electric-blue`, `text-navy`, …
- shadcn semantic layer — `bg-primary`, `text-foreground`, `bg-destructive`, … out of the box
- Typography scale — `text-display-1`, `text-h1`, `text-body-4`, `text-button-md`, `text-overline`, …
- Radius, shadow, spacing, animation tokens
- Components — shadcn on Base UI styled to the BYB design, plus BYB components (`FileUpload`, `Stepper`, `BYBAreaChart`, …). Every one is listed in [`docs/registry.md`](./docs/registry.md)
- Component tokens — change any component's look from an app's CSS (`--button-radius`, `--card-gap`, …)
- `cn()` helper with `tailwind-merge` extended for every BYB token
- Guardrail docs for apps in [`docs/`](./docs/README.md), shipped with the package, and `npx design-system-check` to report code that breaks them (`--fix` applies the safe fixes)
- The **BYB Design Console** (`pnpm console`): change any token and see every component update, with contrast checked. Setup: [`console/README.md`](./console/README.md)

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

Tailwind v4 only emits utility classes that are referenced somewhere in scanned source files. To make sure classes baked into our compiled components (`bg-primary` inside `Button` etc.) reach your bundle, our `globals.css` ships an `@source` directive that points Tailwind at `node_modules/@beforeyoubid/design-system/dist/**`. **Zero consumer config required.**

If you only render `<Button variant="lime" />` in your app, only the utility classes that variant uses end up in your CSS. The rest are dropped.

### JS (automatic, with `sideEffects: ["**/*.css"]`)

Components are published as ESM. Importing just one named export drops the rest:

```ts
import { Button } from "@beforeyoubid/design-system"
//       ^ only Button + its transitive deps end up in your bundle
```

The package declares `"sideEffects": ["**/*.css"]` in its `package.json`, so bundlers know JS exports are pure (free to tree-shake) but CSS side-effects (`import "./globals.css"`) are preserved.

## Local development

This repo uses **pnpm** (`pnpm@11.9.0` via corepack). Enable it once with `corepack enable pnpm`.

```bash
pnpm install
pnpm dev          # tsup watch mode
pnpm storybook    # Storybook at http://localhost:6006
pnpm console      # the Design Console at http://localhost:6010
```

Working with Claude Code in this repo, the `byb-design` skills (`.claude/skills/byb-design/`) load automatically: authoring components, adding component tokens, applying Design Console exports and shipping breaking changes. `CLAUDE.md` says which to use when.

### Scripts

| Command | What it does |
|---|---|
| `pnpm build` | Production build — ESM + CJS + types via tsup |
| `pnpm dev` | Watch mode build |
| `pnpm storybook` | Run Storybook locally on port 6006 |
| `pnpm build-storybook` | Static Storybook build |
| `pnpm lint` | ESLint across `src/` |
| `pnpm type-check` | TypeScript strict check (no emit) |
| `pnpm check-tokens` | Fail if a colour primitive has no utility class or the generated JS tokens are out of date |
| `pnpm generate-tokens` | Regenerate `src/generated/default-tokens.ts` from `globals.css` |
| `pnpm test:migrate` | Run the `design-system-migrate` codemod and `--check` tests |
| `pnpm console` | The Design Console on port 6010, rebuilt as token files change |
| `pnpm console:build` | One self-contained page, `console/dist/design-console.html` |
| `pnpm tokens:apply` | Token files → class strings in `src/components/ui` |
| `pnpm tokens:build` | Regenerate `index.css`, the Design Console manifest and the DESIGN.md token table |
| `pnpm tokens:import <file>` | Make a Design Console export the defaults (`--dry-run` to preview) |
| `pnpm check-component-tokens` | Fail if a token file and the ui classes disagree, a name is wrong or contrast fails |
| `pnpm registry:build` | Regenerate `docs/registry.md` |
| `pnpm check-registry` | Fail if `docs/registry.md` is stale or a story has no description |

## Using it in an app

Apps install published versions only. Don't link a local build into an app.

Point the app's `CLAUDE.md` (or `AGENTS.md`) at the guardrails, so agents read them before writing UI:

> Before writing UI, read `node_modules/@beforeyoubid/design-system/docs/README.md`.

Before committing, `npx design-system-check --changed` lists guardrail findings on the lines you changed, and `--fix` applies the safe ones. After committing, `--commits <sha or range>` does the same for those commits.

## Changing the package

Styling and component rules for anyone changing this package, by hand or with Claude, are in [CLAUDE.md](./CLAUDE.md) under **Styling rules** and **Component rules**: no pixel values, no hard-coded colours, no arbitrary values, semantic tokens first, Tailwind's spacing and our type scale. In Claude, the `byb-design` skills walk through adding components, component tokens, token values and breaking changes.

## Generating new components

This package is configured for the shadcn CLI:

```bash
pnpm dlx shadcn@latest add button
# generates src/components/ui/button.tsx wired against our semantic tokens
```

Don't hand-edit the generated file. Give it a token file in `src/tokens/components/`, then `pnpm tokens:apply`, `pnpm tokens:build` and `pnpm check-component-tokens`; changes to structure or behaviour go in a wrapper in `src/components/`. Re-export from `src/index.ts` and add a story. `CLAUDE.md` has the details, and the `byb-design:author-component` skill walks through it.

## Publishing

Publishing is manual — no CI publish step.

```bash
pnpm build-and-publish   # builds then runs npm publish --access public
```

Bump the version in `package.json` before publishing. v2.0 onwards follows semver from `2.0.0-alpha.N`.

## Migrating from v1

v1.x targeted Tailwind v3 with a `tailwind.config.ts` extension. v2.0 moves everything to Tailwind v4 + CSS-first config via `@theme inline`. To migrate a consumer:

1. Upgrade Tailwind to v4: `pnpm add -D tailwindcss@^4 @tailwindcss/postcss`
2. Replace `@tailwind base; @tailwind components; @tailwind utilities;` with `@import "tailwindcss";`
3. Remove the `tailwind.config.ts` import / extension from the design system (no longer published)
4. Replace `bg-overlay-95` / `bg-button-a` etc. with the opacity-modifier equivalents — see CLAUDE.md
5. Continue using `bg-mint-45`, `text-body-4`, etc. — these names are unchanged (headings were re-scaled in v2.x — see CLAUDE.md)

## Adding a token

1. Add the CSS variable to `globals.css` under `:root`
2. Add the matching `--color-{name}: var(--{name});` line in `@theme inline`
3. Run `pnpm generate-tokens`, then `pnpm check-tokens`

## CI

Every PR runs: token sanity check → component tokens → component registry → type-check → lint → migrator tests → build → Storybook build.

Merging to `main` triggers an automatic Storybook deploy to S3 + CloudFront invalidation.

## Repo

- GitHub: https://github.com/beforeyoubid/design-system
- npm: `@beforeyoubid/design-system`
- Storybook: https://storybook.beforeyoubuy.com.au/design-system/
