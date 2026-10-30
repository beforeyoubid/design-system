---
name: add-component-tokens
description: Give a BYB design-system component its component tokens, so apps and the Design Console can change its look (colours, radius, sizes, spacing) without touching its code. Use after a component is added or changed, or when asked to add, expose, rename or fix component tokens for a component in this repo.
argument-hint: <component name>
---

# Add component tokens

Give the component in `$ARGUMENTS` a component token for every designed value an app might want to change. Terms (part, cva key, `@ours`, `@on`, public and private names) are explained under **Words used here** in `CLAUDE.md`.

## Done when

- Each designed value on each part reads a token: colours, border, ring, radius, height, width, size, padding, gap, offset, shadow, font weight, opacity, tracking, per variant, state and breakpoint where they differ.
- `pnpm check-component-tokens` passes, with every contrast pair at WCAG AA or raised with the user.
- The tokens show up in the Design Console and change the component's stories.

## Steps

### 1. Read the grammar

Read **Component tokens** in `DESIGN.md` for the naming rules:

```
--<part>[-<variant>][-<state>][-<property>][\:<breakpoint>]
```

- The part is the element's `data-slot` (`select-trigger`). No property means the fill.
- Properties: `foreground`, `border`, `border-width`, `ring`, `ring-width`, `radius`, `height`, `min-height`, `width`, `size`, `padding`, `padding-x`, `padding-y`, `padding-top`, `padding-bottom`, `padding-start`, `padding-end`, `gap`, `offset`, `shadow`, `font-weight`, `opacity`, `tracking`.
- States: `hover`, `focus`, `active`, `pressed`, `open`, `selected`, `highlighted`, `checked`, `disabled`, `invalid`, `placeholder`.
- Variants keep the stock cva key (our `primary` button is `default`).
- A look that lasts while something is true (the latest item in a timeline, a featured card) is a variant, even when a prop or the item's position sets it. Name it on the part whose look changes: if the latest event's title turns mint, that's `--timeline-title-latest-foreground`. States are only the ones listed, which come from interaction or form status.
- A breakpoint value gets its own token, `\:sm` for sm and up, `\:md-to-lg` for a range. In the token file its private name ends `--sm`.

Open a token file for a similar component (`src/tokens/components/button.css`, `select.css`) and copy its shape.

### 2. List the designed values

Read the component's class strings (in `src/components/ui/<name>.tsx` and any wrapper in `src/components/`). For each part, list every class that sets a designed value, per variant, state and breakpoint. Skip pure layout (`flex`, `items-center`) and behaviour (`pointer-events-none`).

If an element you need to change has no `data-slot`, no token can reach it. Give it one in a wrapper first (`byb-design:author-component`, step 2), then come back.

### 3. Write the token file

`src/tokens/components/<component>.css`, one rule per part:

```css
/* Foo — component tokens.
 * Set any token (the name without the underscore) on :root or a section, e.g.
 *   :root { --foo-radius: … }
 * Defaults are the shipped design. Edited by hand; the class edits in ui/foo.tsx follow from these names. */

[data-slot="foo"] {
  /* Corner radius of the foo. */
  --_foo-radius: var(--foo-radius, var(--radius-lg));
  /* Fill colour of the foo when hovered. */
  --_foo-hover: var(--foo-hover, var(--accent));
}
```

- Each token is `--_<name>: var(--<name>, <default>);` with a one-line comment above it. The comment becomes its description in DESIGN.md and the Design Console.
- Defaults reference tokens: semantic first (`var(--primary)`), then brand (`var(--mint-75)`), spacing as `calc(var(--spacing) * N)`, radius as `var(--radius-*)`. No hex.
- A variant's token falls back to the component's own where one exists: `var(--foo-sm-radius, var(--_foo-radius))`.
- Class changes that aren't a value swap go in directives on the rule: `/* @add classes */`, `/* @remove classes */`, `/* @add(size.sm) classes */` for one cva key, `/* @alias md = size.default */`.
- A token read by our wrapper rather than the ui file gets `@ours` in its comment, and the wrapper uses the private name directly (`rounded-(--_foo-radius)`).
- Text on a part with no fill of its own is checked against the page background. When it sits on something else (a parent part's fill, a thumb, a dark section), name that token with `@on` in its comment: `/* Text colour of the active tab. @on --tabs-indicator */`.

### 4. Apply and build

```bash
pnpm tokens:apply              # token files → class strings in src/components/ui
pnpm tokens:build              # index.css, the Design Console manifest, DESIGN.md's token table
pnpm check-component-tokens
```

Read the diff of `src/components/ui/<name>.tsx`. Each designed class should now read a token (`h-9` → `h-(--_foo-height)`) and nothing else should have changed.

### 5. Contrast

`check-component-tokens` measures every text token against the fill it sits on: its own part's fill, the token named with `@on`, or the page background. Text needs 4.5:1; parts named `icon` or `spinner` need 3:1; disabled text is exempt.

1. Change the default so the pair passes AA (4.5:1 for text, 3:1 for icons and borders) when a nearby token passes and keeps the design. Darker text on the same tint is usually the fix (`mint-75` or `mint-90` on mint tints).
2. When it can't pass without changing the design, add it to `scripts/tokens/contrast-exceptions.json` and tell the user:

   ```json
   {
     "foreground": "--_foo-item-highlighted-foreground",
     "fill": "--_foo-item-highlighted",
     "status": "undecided",
     "note": "<what it is>: <colour> on <colour> is <ratio>:1. Options: <each option with its ratio>."
   }
   ```

   `status` stays `undecided` until the user decides. `accepted` needs their reason in `note`.

## Verify

1. `pnpm check-component-tokens` passes.
2. `pnpm console`, open http://localhost:6010, find the component in the sidebar: each new token has a row, and changing it changes the stories.
3. `pnpm type-check` and `pnpm check-registry` pass (`pnpm registry:build` if the registry is stale).
