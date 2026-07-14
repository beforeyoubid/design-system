# CLAUDE.md — BYB design-system monorepo

This repo is the BYB design-system platform: **Tailwind CSS v4 + shadcn/ui (BaseUI)** tokens and components for the BYB marketing website, backyard, BYB Assist, and any other product surfaces that opt in.

Read this before adding or modifying any component or token.

## Monorepo layout (pnpm workspace)

| Path | Purpose |
|---|---|
| `packages/design-system/` | **The published package** — `@beforeyoubid/design-system`. All library code lives here. |
| `apps/demo/` | Private Next.js demo surface — consumes the package via `workspace:*` with zero publish latency. AI-pipeline output and POCs land here. Never published. |
| `docs/` | `DECISION-FRAMEWORK.md` (create-vs-reuse rules) + the monorepo proposal & action tracker. |
| `.changeset/` | Changesets config — every package-changing PR adds a changeset (`pnpm changeset`). |
| `registry.json` | *(inside the package)* Machine-readable component inventory — shipped to consumers; AI agents read it before creating components. |

Root scripts proxy into the package (`pnpm build`, `pnpm lint`, `pnpm storybook`, … work from the repo root). `pnpm demo` runs the demo app.

## What lives in `packages/design-system/`

| Path | Purpose |
|---|---|
| `tokens/` | **Source of truth for all design tokens** — `primitives.json` (brand facts) + `themes/website.json` (semantic mappings). Edit these, never the generated files. |
| `globals.css` | Design tokens + `@theme inline` → Tailwind utilities. **GENERATED** from `tokens/` via `pnpm build-tokens` — do not edit by hand. |
| `utilities.css` | Bespoke product utilities (`.clip-triangle`, `.mask-fade-x`, `.text-btn-*`, `.text-heading-*`). Imported by `globals.css`. |
| `components.json` | shadcn CLI config — wire for `npx shadcn add <component>`. |
| `src/components/ui/` | shadcn primitives — no heavy deps. Where shadcn CLI scaffolds new primitives; customize after scaffolding. |
| `src/components/ui-heavy/` | Primitives with a heavy external library (chart→recharts, calendar→react-day-picker, carousel→embla). Each ships via its **own subpath export** with the library as an **optional peer** — never exported from the main barrel. |
| `src/components/byb/` | BYB-opinionated domain components (`BYBCounter`, `BYBPillCard`, field composites). One file per component. |
| `src/tokens.ts` | Same brand colors and typography exported as JS constants (for non-Tailwind contexts). **GENERATED** from `tokens/` — do not edit by hand. |
| `src/lib/utils.ts` | `cn()` helper — `tailwind-merge` extended with every BYB token. |
| `src/stories/` | Storybook — one file per component, all variants. |
| `src/index.ts` | Public exports — every new component must be re-exported. |
| `src/icons.ts` | Icon surface — re-exports the canonical icon set under the `@beforeyoubid/design-system/icons` subpath. |
| `registry.json` | Component inventory (name, layer, variants, deps, description). Update alongside any component change. |

> `tailwind.config.ts` is **removed** in v2.0. All theme tokens live in `globals.css` via Tailwind v4's `@theme inline` directive.

## Icons

`@tabler/icons-react` is the **canonical** BYB icon set (lucide was dropped). Icons are exposed via a dedicated subpath — **not** the main barrel — so consumers opt in and keep full tree-shaking:

```tsx
import { IconHome, IconChevronRight } from '@beforeyoubid/design-system/icons'

// Tabler renders currentColor strokes — BYB token utilities just work:
<IconHome className="size-4 text-navy" />
```

- `src/icons.ts` is `export * from '@tabler/icons-react'`. The package is marked **external** in `tsup.config.ts`, so the entry compiles to a thin pass-through and the consumer's bundler shakes against the real package.
- The icons entry is built **without** the `'use client'` banner (a second tsup config) — Tabler icons are plain SVG and stay usable inside RSC server components. Cleaning is done once via `pnpm clean` before tsup runs; never set `clean: true` on the multi-config build or the concurrent configs race and wipe each other's `.d.ts`.
- Use icons directly from this subpath. Don't add `@tabler/icons-react` as a direct dependency in consuming apps — import from the design system so the sanctioned set stays single-sourced.

## Heavy components — subpath exports + optional peers

Chart, Calendar, and Carousel are **not in the main barrel**. Each ships from its own subpath with its heavy library as an optional `peerDependency` the consumer installs:

```tsx
import { ChartContainer } from '@beforeyoubid/design-system/chart'      // needs recharts
import { Calendar } from '@beforeyoubid/design-system/calendar'         // needs react-day-picker
import { Carousel } from '@beforeyoubid/design-system/carousel'         // needs embla-carousel-react
```

**Why the barrel exclusion is load-bearing:** a barrel re-export would make every consumer's bundler resolve the heavy library during module-graph construction — before tree-shaking — breaking builds for consumers who never use the component. When adding a new heavy component: put it in `src/components/ui-heavy/`, give it its own `src/<name>.ts` entry + tsup entry + `exports` map entry, declare the library as an optional peer (also add to devDependencies so Storybook works), and record it in `registry.json` with `layer: "ui-heavy"`.

## Token rules

- **Never hard-code a hex value.** Use a token utility (`bg-mint-45`, `text-navy`, `border-dark-15`).
- **Never use arbitrary Tailwind values** (`text-[#090034]`, `p-[13px]`). If a token is missing, add it to `tokens/primitives.json` and run `pnpm build-tokens`.
- **Token naming mirrors Figma 1:1.** When in doubt, check the Figma library or `tokens/primitives.json`.

### Two layers of tokens

1. **Primitives** — brand colours, exact Figma palette
   `--mint-45`, `--mint-l1`, `--cobalt`, `--dark-75`, `--light-sandy`, `--warning-30`, `--category-09`, …
2. **Semantic** — shadcn slots that components consume
   `--primary`, `--background`, `--muted`, `--accent`, `--destructive`, `--border`, `--ring`, `--card`, `--popover`, `--sidebar-*`, `--chart-1…5`, plus `--success` and `--warning` as BYB extensions.

**Use primitives for marketing pages and brand-coloured surfaces. Use semantic tokens inside reusable components** — that's what makes shadcn primitives drop-in compatible.

### Colour reference (primitives)

```
mint-90 → mint-l4              primary brand scale (dark → light)
navy, cobalt, teal, lime       brand accents
cobalt-l1, teal-l1, lime-l1    accent tints (pill / badge backgrounds)
dark-100 → dark-15             neutral text and borders (dark)
light-l1 → light-sandy, white  neutrals (light)
success-90 → success-l1        success states
error-90  → error-l2           error / destructive states
warning-75 → warning-l3        warning / amber states
category-01 → category-16      data-viz palette
```

### Transparent colours — use opacity modifiers

The four Figma `Transparent/*` swatches are composites of an opaque primitive
+ alpha. There is no `--overlay-95` etc. token; use the Tailwind opacity
modifier instead:

| Figma name                   | Tailwind utility    |
| ---------------------------- | ------------------- |
| `Transparent/Overlay-95%`    | `bg-dark-100/95`    |
| `Transparent/Overlay-50%`    | `bg-dark-100/50`    |
| `Transparent/Button-B`       | `bg-dark-30/80`     |
| `Transparent/Button-A`       | `bg-light-l2/80`    |

### Typography tokens

Font: **Plus Jakarta Sans** — loaded by the consuming app (e.g. `next/font/google`). We declare the stack via `--font-sans` only.

Pair semi-bold headings with `tracking-heading` (-0.005em); pair button text with `tracking-btn` (0.04em) + `uppercase`. The `.text-btn-*` and `.text-heading-*` classes in `utilities.css` already bake these in.

```
text-display-xl   72px / 600   hero headline only
text-display      56px / 600   section hero
text-display-sm   52px / 600
text-heading-lg   40px / 600
text-heading-3xl  36px / 600
text-heading-md   28px / 600
text-heading-base 24px / 600
text-heading-sm   20px / 600
text-body-lg      18px / 400
text-body-md      16px / 400
text-body-sm      13px / 400
text-caption      12px / 400
text-xs           10px / 400
text-2xs           8px / 400
text-medium-*     8–52px / 500
text-btn-lg/md/sm 18 / 16 / 13 / 600 (uppercase + tracking-btn baked in)
```

### Spacing tokens

```
p-section-sm    48px
p-section-md    80px
p-section-lg   120px
```

Max-width: `max-w-site` = 1280px — always use this for the content container.

### Radius tokens

```
rounded-sm    4px
rounded-md    8px   ← component default
rounded-lg   12px
rounded-xl   20px
rounded-btn  18px
rounded-full
```

shadcn components reference `var(--radius)` which aliases to `--radius-md`.

## Adding a token

Tokens live in `tokens/*.json`; `globals.css` and `src/tokens.ts` are generated from them.

1. Add the token to `tokens/primitives.json` (colours need both `oklch` and `hex`; both files are Figma-mirrored names).
2. If it's a semantic slot change, edit `tokens/themes/website.json` instead — values may only reference primitives (`{mint-45}` syntax).
3. Run `pnpm build-tokens` — regenerates `globals.css` + `src/tokens.ts` (the `:root` variable, `@theme inline` exposure, and TS constant are all emitted together, so they can never drift). Commit the regenerated files.
4. `pnpm check-tokens` is the CI staleness check — it fails if committed artifacts don't match `tokens/*.json`.
5. If it's a colour utility, add the name to the `text-color` group in `src/lib/utils.ts` so `cn()` handles it correctly.

## Dark mode

The package ships full dark-mode coverage via a `.dark` class. Toggling is the consuming app's responsibility (`<html class="dark">`). Component authors don't need to opt in — semantic tokens flip automatically.

## Tree-shaking guarantees (don't break these)

Consumers get full CSS + JS tree-shaking with zero config. Two pieces hold this together — touch them with care:

### 1. `@source "./dist/**/*.{js,mjs}";` in `globals.css`

Tailwind v4 doesn't scan `node_modules` by default. The `@source` directive at the top of `globals.css` tells the consumer's Tailwind build to scan our compiled output for utility classes. Without it, utilities used inside our components (e.g. `bg-primary` in `BYBButton`) would be tree-shaken out of the consumer's CSS bundle and components would render styleless.

`@source` paths resolve **relative to the CSS file**, so when published, this points at `node_modules/@beforeyoubid/design-system/dist/**`. If `tsup` ever changes the output directory, update the `@source` path to match. If you add a new published path that contains JSX/className strings, add another `@source` line.

### 2. `"sideEffects": ["**/*.css"]` in `package.json`

This tells bundlers that JS exports are side-effect-free (free to tree-shake) but CSS files must be preserved. Without it, conservative bundlers may bundle the entire `dist/index.js` even when only one component is imported.

**Don't add JS files with module-level side effects.** If you ever need one (analytics init, global registration, polyfills) it must be explicitly listed in the `sideEffects` array or it'll be silently dropped.

## Create vs reuse — mandatory audit before any component work

Before creating **any** component (or variant), follow
[`docs/DECISION-FRAMEWORK.md`](./docs/DECISION-FRAMEWORK.md):

1. Load the component inventory (`registry.json` if present, else scan `src/components/` +
   `src/stories/`).
2. Classify each UI element through the decision tree: token → variant → new primitive →
   BYB wrapper → app-local.
3. Emit the audit table (`element → decision → justification`) and get it approved **before**
   writing component code.

Styling alone never makes a component BYB-specific — business meaning does. When in doubt, ask;
don't guess.

## Component rules

- One component per file: primitives in `src/components/ui/`, heavy primitives in `src/components/ui-heavy/`, BYB domain components in `src/components/byb/`
- Every component must be exported from `src/index.ts`
- Every component must have a story in `src/stories/` covering all variants
- **Prefer semantic tokens** (`bg-primary`, `text-muted-foreground`) over brand primitives inside reusable components. Use primitives for marketing pages.
- Use `cva` (class-variance-authority) for all component variants — not ad-hoc `Record<>` maps
- Use `cn` (exported from `src/lib/utils.ts`) for all className merging — not raw `clsx`
- Use `@radix-ui/react-slot` (`Slot`) for the `asChild` pattern on interactive components
- For complex components needing accessibility primitives (Modal, Combobox, Tooltip), use `@radix-ui/*` packages
- **No inline styles.** No `style={{}}` props unless absolutely unavoidable
- **No MUI imports.** This package is MUI-free by design

### Generating new components via shadcn CLI

This package is configured for the shadcn CLI (`components.json` at the root). Scaffold a new primitive with:

```bash
npx shadcn@latest add button
# generates src/components/ui/button.tsx
```

The output uses semantic tokens (`bg-primary`, `text-primary-foreground`, etc.) and works out of the box because the semantic layer is wired up in `globals.css`. After scaffolding, customize the variants and export from `src/index.ts`.

Generated components live under `src/components/ui/` to keep BYB-opinionated wrappers (`BYBButton`) separate from shadcn primitives.

### Component API conventions

```tsx
// Use cva for variants — export the variants object so consumers can extend
const buttonVariants = cva('base-classes', {
  variants: { variant: { lime: '…', navy: '…' }, size: { sm: '…', md: '…' } },
  defaultVariants: { variant: 'lime', size: 'md' },
})

// Interface extends both native element props AND cva VariantProps
export interface BYBButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

// Use cn() — not clsx() — for className merging (cn handles Tailwind conflicts)
className={cn(buttonVariants({ variant, size, className }))}
```

### asChild pattern

Use `asChild` on interactive components to allow rendering as `<Link>` or `<a>` without losing styles:

```tsx
<BYBButton asChild variant="lime">
  <Link href="/get-a-quote">Get a quote</Link>
</BYBButton>
```

## Running locally

This repo uses **pnpm** (`pnpm@11.9.0` via corepack — run `corepack enable pnpm` once). All commands work from the repo root (they proxy into `packages/design-system`).

```bash
pnpm install      # installs the whole workspace (package + demo app)
pnpm dev          # watch mode — rebuild on save
pnpm storybook    # Storybook at http://localhost:6006
pnpm demo         # demo Next.js app — consumes the package live via workspace:*
pnpm build-tokens # regenerate globals.css + src/tokens.ts from tokens/*.json
pnpm check-tokens # staleness check — generated artifacts in sync with tokens/*.json
pnpm type-check   # TypeScript strict check (all workspace packages)
pnpm lint         # ESLint
```

## Publishing — Changesets → GitHub Packages

The package publishes to **GitHub Packages** (`npm.pkg.github.com`, private to the beforeyoubid org) via Changesets. Never publish from a laptop.

1. In any PR that changes the package, run `pnpm changeset` and commit the generated file (pick patch/minor/major + a summary — this becomes the CHANGELOG entry).
2. On merge to `main`, the Release workflow maintains a **"chore: version packages" PR** that accumulates pending changesets.
3. Merging that PR publishes to GitHub Packages automatically (CI uses `GITHUB_TOKEN` — no manual npm auth).

Consumers need a one-time `.npmrc` setup (`@beforeyoubid:registry=https://npm.pkg.github.com` + a `read:packages` token in the developer's `~/.npmrc` and in CI/build environments). After a release, bump the version in consuming apps and run their install.

> **v2.0 is a breaking change.** Consumers must upgrade their host app to Tailwind v4 and drop the v3 `tailwind.config.ts`-based wiring. Direct utility classes (`bg-mint-45`, `text-navy`, `text-heading-lg`) continue to work unchanged.
