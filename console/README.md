# BYB Design Console

Change any brand, semantic or component token and see every component that uses it update, with contrast checked as you go. The components are the real ones, rendered from their Storybook stories.

## Run it

Once per machine:

```bash
corepack enable pnpm   # pnpm comes with Node; this switches it on
```

You need Node 22 or later (`node -v` to check).

Once per clone, and again after pulling changes to `package.json`:

```bash
pnpm install
```

Then, whenever you want the console:

```bash
pnpm console
```

Open http://localhost:6010. Stop it with Ctrl+C.

## While it's running

- **Changes in the page** are kept in your browser until you reset them. Nothing in the repo changes.
- **Edits to a token file** (`src/tokens/components/*.css`) or to `globals.css` show up in the page within a second or two.
- **A new component's story** (`src/stories/*.stories.tsx`) appears in the sidebar when you save it.

## Making your changes the defaults

1. In the console, choose **Export** and **Copy CSS**.
2. Ask Claude to apply it, pasting the block: "Make these the defaults" runs the `byb-design:update-token-values` skill.

The skill writes each value to the right file, updates DESIGN.md and runs the checks. A value that would fail WCAG AA is flagged before it lands.

## Publishing a shareable copy

`pnpm console:build` writes one self-contained page, `console/dist/design-console.html`, that opens without the repo.
