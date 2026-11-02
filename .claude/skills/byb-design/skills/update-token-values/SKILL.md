---
name: update-token-values
description: Make a `:root { … }` block exported from the BYB Design Console (or written by hand) the design system's shipped defaults, across brand, semantic and component tokens. Use when the user pastes a Design Console export, a block of CSS custom properties, or asks to "make these the defaults", "apply these token values", "update the tokens" or change a brand colour or any token's value (for example "the mint should be #00A88F") in this repo.
argument-hint: <pasted :root block, or a path to a .css file>
---

# Update token values

Make the values the user gave the shipped defaults.

## Done when

- Every value is written to the file that owns it, and the generated outputs are rebuilt.
- `pnpm check-component-tokens` and `pnpm check-tokens` pass.
- DESIGN.md prose and the CHANGELOG describe the new values.
- The user has the list of what changed, and any contrast pair that now fails AA.

## Steps

### 1. Save the block

If the user pasted CSS, write it to a file in your scratchpad (not in the repo). If they gave a path, use it. If they described a change in words ("the mint should be #00A88F"), find the token it means and write it as a block: `:root { --mint-45: #00A88F; }`.

### 2. Dry run

```bash
pnpm tokens:import <file> --dry-run
```

It sorts each variable into brand, semantic or component and prints `old → new` with the file and line. `=` means the value is already the default.

- **Unknown names stop the run** and nothing is written. Show the user the list. A typo or a renamed token is the usual cause; ask which token they meant.
- **Brand colours need a hex value** (`--mint-45: #00AE95`). The script writes OKLCH with the hex in a comment.
- Semantic tokens change the light theme only. Dark mode isn't configured or optimised yet, so its values stay as they are.

### 3. Apply

```bash
pnpm tokens:import <file>
pnpm check-component-tokens
pnpm check-tokens
```

`tokens:import` writes the values, then runs `generate-tokens` (when `globals.css` changed) and `tokens:build`.

### 4. Contrast

If `check-component-tokens` reports a pair under AA:

1. Tell the user which pair, its ratio and what each nearby option would give, and ask what to do. Don't change their values yourself.
2. Until they decide, list it in `scripts/tokens/contrast-exceptions.json` with `"status": "undecided"` and a note naming the options.
3. Remove any existing exception whose pair now passes.

### 5. Prose

1. Search the repo for each changed value's old form, a brand colour's old hex included: `git grep -n -i '<old value>' -- . ':!CHANGELOG.md'`. Update DESIGN.md's prose and colour tables, stories and anything else that quotes it; the generated files are already rebuilt. Leave older CHANGELOG entries as they are.
2. If `check-component-tokens` says an exception now passes, remove its entry. Update the ratios in the notes of exceptions that involve a changed colour.
3. Add a CHANGELOG line, in the section **Which CHANGELOG section** in `CLAUDE.md` names. A semantic or brand token change goes under **Breaking** if an app's look changes without the app changing anything (say what changed and that apps reading the token follow it). It needs no migrator rule: apps that use the token follow it, and an app that hard-coded the old value is already outside the guardrails, which `design-system-check` reports. A component token default change goes under **Changed**.

### 6. Report

List for the user: each value that changed (`token: old → new`), any that were already the default, any contrast pair raised, and the commit. Commit locally only.

## Verify

```bash
pnpm check-tokens
pnpm check-component-tokens
pnpm type-check
pnpm check-registry
```

Then `pnpm console`: with no overrides set, the changed components show the new values.
