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
9. **No dark mode.** BYB apps are light only, so never write `dark:` classes.

## Check your changes before you commit

```bash
npx design-system-migrate --check --changed
```

It lists guardrail findings on the lines you changed since the last commit, with what to use instead. Fix the ones on lines you touched. It never fails a build, and older code nearby can wait.

`npx design-system-migrate --check src/` runs it over a folder.

## After upgrading the package

```bash
npx design-system-migrate        # dry run: what would change
npx design-system-migrate --write
```

This applies the renames between versions. Read the package's CHANGELOG for anything it lists as needing a person to decide.
