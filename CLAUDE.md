# CLAUDE.md — @beforeyoubid/design-system

This package is the BYB design system: Tailwind CSS tokens + Base UI components for the BYB marketing website.
Read this before adding or modifying any component or token.

## What lives here

| Path | Purpose |
|---|---|
| `globals.css` | CSS custom properties (design tokens) — source of truth |
| `tailwind.config.ts` | Tailwind aliases that map to CSS variables |
| `src/tokens.ts` | Same tokens exported as JS constants (for non-Tailwind use) |
| `src/components/` | BYB components — one file per component |
| `src/stories/` | Storybook stories — one file per component, all variants |
| `src/index.ts` | Public exports — every new component must be re-exported here |

## Token rules

- **Never hard-code a hex value.** Use a token class (`text-navy`, `bg-lime`, `border-dark-15`).
- **Never use arbitrary Tailwind values** (`text-[#090034]`, `p-[13px]`). If a token is missing, add it to `globals.css` + `tailwind.config.ts` + `tokens.ts`, then run `yarn check-tokens`.
- Token naming follows the Figma palette exactly. When in doubt, check `globals.css`.

### Colour tokens quick reference

```
navy                    — primary dark background, primary text on light
mint-90 → mint-l4       — primary brand gradient (dark → light)
lime                    — CTA accent (buttons, highlights)
dark-100 → dark-15      — neutral text and borders
light-white / l1–l3     — page backgrounds and surfaces
green (success)         — ⚠️ full scale pending designer confirmation
```

### Typography tokens

Use `text-{scale}` classes — never set raw font sizes:

```
text-display-xl   72px / 700   — hero headline only
text-display      56px / 700   — section hero
text-heading-lg   40px / 700   — major section headings
text-heading-md   28px / 700   — sub-section headings
text-heading-sm   20px / 600   — card/item headings
text-body-lg      18px         — lead body copy
text-body-md      16px         — default body
text-body-sm      14px         — secondary body, labels
text-caption      12px         — helper text, captions
```

### Spacing tokens

Section vertical rhythm — use these, not arbitrary padding:

```
py-section-sm   48px   — compact sections
py-section-md   80px   — standard sections
py-section-lg   120px  — hero / feature sections
```

Max-width: `max-w-site` = 1280px — always use this for the content container.

## Adding a token

1. Add the CSS variable to `globals.css` under `:root`
2. Add the matching alias to `tailwind.config.ts` under `colors` (or wherever appropriate)
3. Export the value from `src/tokens.ts`
4. Run `yarn check-tokens` — it fails if either side is missing

## Component rules

- One component per file in `src/components/`
- Every component must be exported from `src/index.ts`
- Every component must have a story in `src/stories/` covering all variants
- Use `clsx` for conditional classes, `tailwind-merge` (via `clsx` + `twMerge`) when consumers need to override
- Use Base UI primitives (`@base-ui-components/react`) for interactive components (buttons, inputs, selects, dialogs)
- **No inline styles.** No `style={{}}` props unless absolutely unavoidable (e.g. dynamic values with no token equivalent)
- **No MUI imports.** This package is MUI-free by design.

### Component API conventions

```tsx
// Variants and sizes are always typed string unions, not enums
variant?: 'lime' | 'navy' | 'ghost-white' | 'outline-navy'
size?: 'sm' | 'md' | 'lg'

// Always extend the native HTML element's props
export interface BYBButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>

// className is always accepted and applied last (consumer wins)
className={clsx(baseClasses, variantClasses[variant], className)}
```

### asChild pattern

Use `asChild` on interactive components to allow rendering as `<Link>` or `<a>` without losing styles:

```tsx
<BYBButton asChild variant="lime">
  <Link href="/get-a-quote">Get a quote</Link>
</BYBButton>
```

## Running locally

```bash
yarn dev          # watch mode — rebuild on save
yarn storybook    # Storybook at http://localhost:6006
yarn check-tokens # verify CSS variables ↔ Tailwind aliases are in sync
yarn type-check   # TypeScript strict check
yarn lint         # ESLint
```

## Publishing

Bump `version` in `package.json` (follow `1.0.0-alpha.N` until stable), then:

```bash
yarn build-and-publish
```

After publishing, update the version in `byb-website/package.json` and run `yarn install`.
