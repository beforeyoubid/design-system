---
name: breaking-change
description: Ship a breaking change to the BYB design system with a migrator rule, a test and a CHANGELOG entry, so apps upgrade with `npx design-system-migrate`. Use when renaming or removing a component, export, prop, prop value, variant, class or token, or changing a prop's default value or a component's default variant or size, in this repo. A token's value (a brand colour, a semantic role) is `update-token-values` instead.
argument-hint: <what is being renamed, removed or changed>
---

# Ship a breaking change

Make the change the user asked for and give apps a way through it.

## Done when

- The change is made in the package, and nothing in the package still uses the old name.
- `migrate/rules.mjs` rewrites the old usage to the new one, or, where a person has to decide, reports it for review.
- `migrate/rules.test.mjs` has a test for the rule that fails without it.
- `CHANGELOG.md` has an entry under **Breaking**, in the section **Which CHANGELOG section** in `CLAUDE.md` names.
- `pnpm test:migrate` and every check under **Verify** pass.

## Steps

### 1. Check what's been released

A rename or removal only breaks apps if the old name was published. Check the last published version:

```bash
npm view @beforeyoubid/design-system version
npm pack @beforeyoubid/design-system@<that version> --pack-destination <your scratchpad>   # then read package/dist/index.d.ts
```

- **The old name was published:** carry on below.
- **It only exists in the unreleased version** (added or renamed since the last release): it isn't breaking. Change it everywhere in the package, and if a migrator rule already maps an older name to it (`BYBCounter: 'Counter'`), point that rule at the new name instead of adding another. Do steps 3 to 5 for that and skip 2 and 6 (no app uses the unreleased name). In step 7, change the CHANGELOG entry for that published rename to the new name (`BYBCounter` is renamed `Stat`); it stays under **Breaking**. If no rule points at it, the name is brand new: log the rename under **Changed**.

### 2. Find what apps use

Search the consuming apps for the old name before choosing the rule. They're cloned next to this repo under `../../` (for example `../../byb-website`, `../../byb-backyard-v3`). Check the branch each is on with `git -C <app> branch --show-current`. Count uses; note any that a rewrite can't handle (dynamic names, spread props). If the apps aren't cloned there, tell the user the search was skipped.

### 3. Make the change

Change the package. Update its story, DESIGN.md, `src/index.ts` and the component tokens as the other skills describe (`byb-design:author-component`, `byb-design:add-component-tokens`). Search the package for the old name and fix every use. Run `pnpm registry:build` so `docs/registry.md` drops the old name, and update `docs/` wherever the guardrails mention it.

### 4. Pick the rule

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

### 5. Test

Add a test to `migrate/rules.test.mjs` in the style of its neighbours: the old source in, the expected source out (or the expected review message). Cover variant prefixes (`md:hover:`) for classes and aliased imports for exports.

```bash
pnpm test:migrate
```

### 6. Dry-run it on an app

Skip this when no app is cloned next to the repo.

```bash
cd ../../<app> && node <path to this repo>/migrate/index.mjs
```

Without `--write` it only reports. Every use you found in step 2 should appear, as a rewrite or a review line, and nothing else should. Don't write to the app.

### 7. CHANGELOG

Under **Breaking**, in the section **Which CHANGELOG section** in `CLAUDE.md` names, one bullet: **what changed** in bold, the reason in a clause, what to use instead, and that the migrator handles it (or what it reports). Match the existing entries' style.

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
