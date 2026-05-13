# CLAUDE.md — @beforeyoubid/design-system

This package is the BYB design system: Tailwind CSS tokens + shadcn-pattern components for the BYB marketing website.
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
navy / lime / cobalt / teal — brand palette
mint-90 → mint-l4           — primary brand scale (dark → light)
dark-100 → dark-15          — neutral text and borders
light-l1 → light-sandy      — page backgrounds and surfaces
success-90 → success-l1     — success states (confirmed from Figma)
error-90 → error-l2         — error states
warning-75 → warning-l3     — warning states
overlay-95 / overlay-50     — dark overlays
```

### Typography tokens

Font: **Plus Jakarta Sans** — headings are weight 600 (semi-bold), not bold.
Add `tracking-heading` (`-0.005em`) alongside heading classes for correct letter-spacing.

```
text-display-xl   72px / 600   — hero headline only
text-display      56px / 600   — section hero
text-heading-lg   40px / 600   — major section headings  + tracking-heading
text-heading-md   28px / 600   — sub-section headings    + tracking-heading
text-heading-sm   20px / 600   — card/item headings
text-body-lg      18px         — lead body copy
text-body-md      16px         — default body
text-body-sm      13px         — secondary body, labels
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
- Use `cva` (class-variance-authority) for all component variants — not ad-hoc `Record<>` maps
- Use `cn` (exported from `src/lib/utils.ts`) for all className merging — not raw `clsx`
- Use `@radix-ui/react-slot` (`Slot`) for the `asChild` pattern on interactive components
- For complex components needing accessibility primitives (Modal, Combobox, Tooltip), use `@radix-ui/*` packages
- **No inline styles.** No `style={{}}` props unless absolutely unavoidable (e.g. dynamic values with no token equivalent)
- **No MUI imports.** This package is MUI-free by design.

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
