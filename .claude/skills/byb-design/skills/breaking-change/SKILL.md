---
name: breaking-change
description: Ship a breaking change to the BYB design system with a migrator rule, a test and a CHANGELOG entry, so apps upgrade with `npx design-system-migrate`. Use when renaming or removing a component, export, prop, prop value, variant, class or token, or changing a default that apps rely on, in this repo.
argument-hint: <what is being renamed, removed or changed>
---

# Ship a breaking change

Make the change in `$ARGUMENTS` and give apps a way through it.

## Done when

- The change is made in the package, and nothing in the package still uses the old name.
- `migrate/rules.mjs` rewrites the old usage to the new one, or, where a person has to decide, reports it for review.
- `migrate/rules.test.mjs` has a test for the rule that fails without it.
- `CHANGELOG.md` has an entry under **Breaking** for the next version.
- `pnpm test:migrate` and every check under **Verify** pass.

## Steps

### 1. Find what apps use

Search the consuming apps for the old name before choosing the rule. They're cloned next to this repo under `../../` (for example `../../byb-website`, `../../byb-backyard-v3`). Check the branch each is on with `git -C <app> branch --show-current`. Count uses; note any that a rewrite can't handle (dynamic names, spread props). If the apps aren't cloned there, tell the user the search was skipped.

### 2. Make the change

Change the package. Update its story, DESIGN.md, `src/index.ts` and the component tokens as the other skills describe (`byb-design:author-component`, `byb-design:add-component-tokens`). Search the package for the old name and fix every use. Run `pnpm registry:build` so `docs/registry.md` drops the old name, and update `docs/` wherever the guardrails mention it.

### 3. Pick the rule

`migrate/rules.mjs` has a home for each kind of change. Add to the existing table rather than writing a new pass:

| Change | Where |
|---|---|
| A class renamed | `CLASS_RENAMES` |
| A component or export renamed | `EXPORT_RENAMES` |
| An export moved to another package | `MOVED_EXPORTS` |
| An export removed | `REMOVED_EXPORTS` (reported for review, with what to use instead) |
| A prop or prop value renamed | `PROP_RENAMES` |
| A prop that needs a person to decide | `PROP_REVIEW` or `PACKAGE_PROP_REVIEW` |
| A boolean whose default turned off | `DEFAULTS_TURNED_OFF` |
| A CSS variable renamed | a replace in `migrateSource` beside `CSS_VAR_PATTERN` |

Rewrite when the new code is certain. Report for review when it isn't. A wrong rewrite is worse than a review line.

### 4. Test

Add a test to `migrate/rules.test.mjs` in the style of its neighbours: the old source in, the expected source out (or the expected review message). Cover variant prefixes (`md:hover:`) for classes and aliased imports for exports.

```bash
pnpm test:migrate
```

### 5. Dry-run it on an app

Skip this when no app is cloned next to the repo.

```bash
cd ../../<app> && node <path to this repo>/migrate/index.mjs
```

Without `--write` it only reports. Check the counts match step 1 and the review lines make sense. Don't write to the app.

### 6. CHANGELOG

Under **Breaking** for the next version, one bullet: **what changed** in bold, the reason in a clause, what to use instead, and that the migrator handles it (or what it reports). Match the existing entries' style.

## Verify

```bash
pnpm test:migrate
pnpm type-check
pnpm type-check:stories
pnpm lint
pnpm check-tokens
pnpm check-component-tokens
pnpm check-registry
pnpm build
```
