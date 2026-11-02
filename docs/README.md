# Building UI with @beforeyoubid/design-system

Read this before writing or changing UI in an app that uses the design system. These docs ship with the package, so they match the version the app has installed.

- [styling.md](./styling.md): tokens, values, layout, type, breakpoints
- [components.md](./components.md): choosing, composing and theming components, forms, accessibility
- [registry.md](./registry.md): every component the package exports, with its variants. Check it before building anything yourself.

## The rules that matter most

1. **Use a design system component before building your own.** Look it up in [registry.md](./registry.md). Fork one into the app only when there's no other way, and tell the design-system team so the gap gets fixed in the package.
2. **Prefer semantic tokens to their brand equivalents.** `bg-primary`, `text-destructive` and `border-border` over `bg-mint-45`, `text-error-75` and `border-dark-15`. An app can retheme a semantic token in one place.
3. **Use the type classes.** `text-h1` to `text-h6`, `text-body-1` to `text-body-5`, `text-caption-*`, `text-overline`, never Tailwind's `text-sm` or `text-2xl`.
4. **No arbitrary values.** No `w-[312px]`, `text-[#090034]` or `leading-[1.4]`. Use a token utility. If a token is missing, ask for one in the package.
5. **Logical sides.** `ms-4`, `pe-2`, `start-0`, `text-start`, `rounded-s-lg`, `border-e`. Not `ml-4`, `pr-2`, `left-0`, `text-left`.
6. **Space siblings with `gap`.** A flex or grid parent with `gap-*`, not margins on the children or `space-y-*`.
7. **Mobile first.** Unprefixed classes are the phone layout. Each breakpoint prefix applies from its width up.
8. **Change a component's look through its props, then its component tokens.** Use `className` on a design system component for layout (width, placement, spacing). A `className` that changes its colours is a last resort and needs a comment saying why.
9. **No dark mode yet.** The package has dark values in code, but dark mode isn't configured or optimised. Don't turn it on or write `dark:` classes until it is.

## Check your changes before you commit

```bash
npx design-system-check --changed
```

It lists guardrail findings on the lines you changed since the last commit, with what to use instead, and changes nothing. Fix the ones on lines you touched; older code nearby can wait. It never fails a build.

```bash
npx design-system-check --changed --fix
```

`--fix` applies the findings with one safe answer and lists the rest for you to fix:

- physical sides to logical ones (`ml-2` → `ms-2`, `left-0` → `start-0`, `rounded-tl-md` → `rounded-ss-md`)
- arbitrary values that are on a scale: spacing on the 2px grid (`p-[8px]` → `p-2`, `max-w-[1920px]` → `max-w-480`), radius (`rounded-[8px]` → `rounded-md`), opacity (`opacity-[0.87]` → `opacity-87`), `z-[100]` → `z-100`, `aspect-[16/9]` → `aspect-video`, brand hex colours (`text-[#00AE95]` → `text-primary`), tracking (`tracking-[0.04em]` → `tracking-button`) and `bg-[var(--x)]` → `bg-(--x)`
- text sizes on the type scale (`text-sm` → `text-body-5`, `text-[16px]` → `text-body-4`; with `font-semibold` or bolder, a size a heading shares becomes the heading, so `text-2xl font-semibold` → `text-h4`), and a `leading-[…]` the type class already sets is dropped
- brand colours with an identical semantic token, `w-N h-N` → `size-N`, icon imports, and dropping `dark:` classes

Text sizes between two steps (`text-[13px]`, `text-3xl`) are listed with the steps either side. Add `--nearest` to snap them to the nearer one (a tie goes to the larger), then check those screens. Values with nothing to swap to (`%`, viewport units, `calc()`, grid templates) aren't flagged. `translate-x`, `origin-left`, `bg-right` and `object-left` have no logical twin, so they're listed for you to check in right-to-left. Classes 2.0 removed (`text-medium-sm`, `text-heading-lg`, `text-btn-md`, `rounded-btn`, `bg-cobalt`, …) generate no CSS, so they're listed with what replaced them; `npx design-system-migrate` renames them.

Already committed? Check the commits instead:

```bash
npx design-system-check --commits abc123             # one commit
npx design-system-check --commits abc123..def456     # what changed after abc123, up to def456
npx design-system-check --commits abc123,def456      # several
```

`--fix` works here too, on files that haven't changed since. `npx design-system-check src/` checks a folder. Pass one of paths, `--changed` or `--commits`.

## After upgrading the package

```bash
npx design-system-migrate        # dry run: what would change
npx design-system-migrate --write
```

This applies the renames between versions. Read the package's CHANGELOG for anything it lists as needing a person to decide.
