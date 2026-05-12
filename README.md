# @beforeyoubid/design-system

BYB design system — Tailwind CSS + Base UI components for the BYB public website.

Live Storybook: https://storybook.beforeyoubuy.com.au/design-system/

---

## Local development

```bash
yarn install
yarn dev          # build in watch mode
yarn storybook    # Storybook at http://localhost:6006
```

## Scripts

| Command | What it does |
|---|---|
| `yarn build` | Production build — ESM + CJS + types via tsup |
| `yarn dev` | Watch mode build |
| `yarn storybook` | Run Storybook locally on port 6006 |
| `yarn build-storybook` | Static Storybook build |
| `yarn lint` | ESLint across `src/` |
| `yarn type-check` | TypeScript strict check (no emit) |
| `yarn check-tokens` | Verify CSS variables ↔ Tailwind aliases are in sync |

## Publishing

Publishing is manual — no CI publish step.

```bash
yarn build-and-publish   # builds then runs npm publish --access public
```

Bump the version in `package.json` before publishing. We follow `1.0.0-alpha.N` until the first stable release.

## Using in byb-website (local)

Add a workspace link in `byb-website/package.json`:

```json
"@beforeyoubid/design-system": "portal:../design-system"
```

Then in `byb-website`:

```bash
yarn install
```

## Adding a token

1. Add the CSS variable to `globals.css` under `:root`
2. Add the matching alias to `tailwind.config.ts` under `colors`
3. Run `yarn check-tokens` — it will fail if either side is missing

## CI

Every PR runs: token parity check → type-check → lint → build → storybook build.

Merging to `main` triggers an automatic Storybook deploy to S3 + CloudFront invalidation.

## Repo

- GitHub: https://github.com/beforeyoubid/design-system
- npm: `@beforeyoubid/design-system`
- Storybook: https://storybook.beforeyoubuy.com.au/design-system/
