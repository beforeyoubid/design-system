# `packages/` — publishable workspace packages

This folder holds **one package on purpose**: `design-system/` (`@beforeyoubid/design-system`). All layers — tokens,
shadcn primitives, BYB domain components, icons — ship as one npm package with subpath exports. One package = one
version number, no cross-package compatibility matrix, and tree-shaking already gives consumers
pay-for-what-you-import.

The folder (rather than package-at-repo-root) exists so that adding a package, **if one ever earns its place**, is
`mkdir` + `package.json` instead of a restructure.

## Should something new become a package here? The test

All four must be **yes** — one "no" means it belongs somewhere else:

1. **Is it a library, not a deployed product app?**
   Apps (website, backyard, Assist) live in their own repos and consume the published package. → "no" = own repo.
2. **Is a subpath export of the existing package impossible?**
   Subpaths are the default home for new surfaces (`/icons` today; `/chart`, `/byb`, `/tokens.json` planned). A new
   package is justified only when the code _cannot_ ship inside — a different runtime, consumers that must not install
   the React package, or a heavy self-contained domain suite whose dependencies would pollute the main package.
   → "no" (a subpath works) = add a subpath, not a package.
3. **Does it need to evolve in lockstep with the design system?**
   Lockstep = the same PR regularly touches both (a token/primitive change and the dependent code together). If a
   published version range (`>=1.1`) is enough coupling, a separate repo consuming the package works fine.
   → "no" = own repo as a normal consumer.
4. **Same owners, same release authority?**
   Everything in this repo rides the design-system maintainers' release train. A product team's library with its own
   cadence (alphas, hotfixes) doesn't belong on someone else's train. → "no" = own repo.

## Worked examples (real decisions, not hypotheticals)

- **`checkout-funnel`** (`@byb-private/checkout-funnel` — config-driven React checkout library): passes test 1 (it's a
  library) and test 2 (its Stripe/react-query deps can't ship inside the design system). But today it **fails 3 and
  4** — it couples via a loose peer range (`@beforeyoubid/design-system >=1.1`) and has its own product-driven alpha
  cadence. → **Stays in its own repo.** Revisit if the same team ends up owning both AND design-system round-trips
  (publish → bump → retry) become a measured drag on checkout work.
- **`tokens` as its own package**: fails test 2 today — planned subpath artifacts (`/tokens.json`, per-theme `.css`
  entries) serve non-Tailwind consumers without a second package. It would pass only if a consumer class emerges that
  must not depend on the React package at all (e.g. an email-template pipeline with strict install policies).
- **`form`** (`@beforeyoubid/form` — TanStack Form field abstractions composed from design-system primitives):
  **passes all four** — it's a library (1); it's generic platform infrastructure whose field wrappers evolve with the
  primitives they compose (3); same team, same conventions, same tooling (4). Test 2 is borderline (a `/form` subpath
  with `@tanstack/react-form` as optional peer would technically work), but retrofitting an already-published 1.0.0
  package with consumers needs a stronger payoff than tidiness. → **Planned as `packages/form`**, keeping its own npm
  identity — but sequenced AFTER the monorepo's first successful Changesets → GitHub Packages release proves the rails.
  Migration notes when it happens: `git subtree` to preserve history; switch its publish from npmjs `--access public`
  to the GitHub Packages `publishConfig` (its `@beforeyoubid` scope is compatible). Not moved yet — decision recorded
  2026-07-14.

## What never goes here (fails test 1, or is an anti-pattern)

- **Product apps** — own repos; this monorepo holds the platform, not the products.
- **Per-component packages** (`@beforeyoubid/button`) — version-matrix explosion for zero bundle benefit.
- **A `byb-ui` split** — visible separation of the domain layer is a subpath (`/byb`), same pattern as `/icons`.

Decisions and rationale live in
[`docs/proposal-draft/Monorepo-Proposal.md`](../docs/proposal-draft/Monorepo-Proposal.md) (§1 "One package or many?",
§2 folder structure, §4 dependency strategy). If the test above doesn't produce a clear answer, raise it with the
design-system maintainer — don't guess.
