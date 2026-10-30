---
name: author-component
description: Add or change a component in the BYB design system (@beforeyoubid/design-system), from stock shadcn or from scratch, with its story, export, docs and component tokens. Use when asked to build, add, create, restyle or extend a component, add a variant or size, or change a component's props or behaviour in this repo.
argument-hint: <component name and what it should do>
---

# Author a component

Build or change the component described in `$ARGUMENTS`. Terms (part, cva key, wrapper, `@ours`, public and private names) are explained under **Words used here** in `CLAUDE.md`.

## Done when

- The component lives in the right place (stock file, wrapper or BYB composite) and follows every rule under **Authoring rules**.
- Its story covers every variant, size and state, and has a one-line docs description.
- It's exported from `src/index.ts`.
- Its component tokens exist (step 4) and every contrast pair passes WCAG AA, or a failing one is raised with the user.
- DESIGN.md, the CHANGELOG and `docs/registry.md` describe it.
- Every check under **Verify** passes, and you've looked at it rendered.

## Steps

### 1. Look before building

1. Read `CLAUDE.md` in this repo.
2. Search `docs/registry.md` for an existing component that does the job, or one that could take a new variant instead. Extending one beats adding one.
3. Check whether shadcn ships it: `pnpm dlx shadcn@latest search @shadcn -q <name>`. If it does, `pnpm dlx shadcn@latest docs <name>` and read the docs and example it links.

### 2. Put it in the right place

| What you're doing | Where it goes |
|---|---|
| Adding a stock shadcn component | `pnpm dlx shadcn@latest add <name>` writes `src/components/ui/<name>.tsx`. Read it. |
| Changing only how a stock component looks | Its token file, through step 4. Never hand-edit `src/components/ui/`. |
| Changing structure, behaviour, props or variants of a stock component | A wrapper, `src/components/<name>.tsx`, that starts with `export * from "@/components/ui/<name>"` and exports over only the parts it changes. |
| A stock part with no `data-slot` (so no component token can reach it, like the Tooltip arrow) | A wrapper that re-implements the part that renders it and gives the element a `data-slot` named `<component>-<part>`. |
| A BYB component with no stock equivalent | `src/components/<name>.tsx`, one component per file. |

**When you add a wrapper**, point everything at it, or the change only reaches some apps:

1. In `src/index.ts`, export the component from `./components/<name>` instead of `./components/ui/<name>`.
2. Find our files that still import the stock file, and import the wrapper instead (`@/components/<name>`):

   ```bash
   grep -rln "components/ui/<name>['\"]" src --include='*.tsx' | grep -v '^src/components/ui/'
   ```

   The wrapper itself keeps importing the stock file.

**When a wrapper re-implements a stock part** (to add a `data-slot` or change its structure), start from the stock part's class string and say so in a comment: `// From ui/tooltip.tsx TooltipContent; update it when shadcn updates the tooltip.` `tokens:apply` keeps the stock file in step with shadcn, but not your copy.

### 3. Authoring rules

- **Styling:** every rule under **Styling rules** in `CLAUDE.md`: no pixel values, no hard-coded colours, no arbitrary values, type classes, logical sides, `gap-*`, mobile first.
- **Every part has a `data-slot`** named `<component>-<part>` (`stepper-indicator`). Component tokens and the Design Console find parts by it.
- **Variants with `cva`**, exported (`fooVariants`) so apps can extend them. Merge with `cn` from `@/lib/utils`.
- **Icons** from `@tabler/icons-react` inside the package.
- **`render` prop**, never `asChild`, to render as another element.
- **Small and composable.** Prefer parts (`FooHeader`, `FooContent`) over a growing list of content props. Parts are named `<Component><Part>`.
- **Prop names match the rest of the library.** Before naming a prop, find the same idea in `docs/registry.md` and reuse its name and values:
  - `variant` for looks; `size` with `sm` / `md` / `lg`; `appearance` for soft/solid; `orientation` for `horizontal` / `vertical`.
  - `value` / `defaultValue` / `onValueChange`, and `open` / `defaultOpen` / `onOpenChange`, as Base UI names them.
  - Boolean props default to `false` and are named for what they add (`clearable`, not `hideClear`).
- **Accessibility:** keyboard and ARIA come from Base UI primitives (`@base-ui/react`); don't rebuild them. Icon-only controls take a label prop. Visible focus. `aria-invalid` for errors, `aria-busy` for loading.

### 4. Component tokens

Run the `byb-design:add-component-tokens` skill for the component.

### 5. Story

1. Write `src/stories/ui/<Name>.stories.tsx` for a stock or wrapped component, `src/stories/<Name>.stories.tsx` for a BYB composite.
2. Meta `title: 'BYB Components/<Name>'`, `component`, `tags: ['autodocs']`.
3. `parameters: { docs: { description: { component: '<one line: what it is for, and what to use instead when it isn't the right fit>' } } }`. The registry and Storybook both show this line.
4. `argTypes` with `options` for each variant prop (`variant`, `size`, …). The registry lists these. When those props are on a part rather than the root (`TooltipContent`'s `variant`), make that part the meta's `component` and type it `Meta<typeof TooltipContent>`, or `pnpm type-check:stories` fails. The stories still render the whole component.
5. One story per variant, size and state (disabled, invalid, loading, empty).

### 6. Export and document

1. Export from `src/index.ts` in the section that matches (BYB components or shadcn primitives).
2. Add or update its entry under **Components** in `DESIGN.md`: variants, sizes, the look of each state.
3. Add a line to `CHANGELOG.md` (**Added**, or **Fixed** for a change to an existing component), in the section **Which CHANGELOG section** in `CLAUDE.md` names. A rename, a removal or a changed default goes through `byb-design:breaking-change` instead.
4. `pnpm registry:build`.

## Verify

```bash
pnpm type-check
pnpm type-check:stories
pnpm lint
pnpm check-tokens
pnpm check-component-tokens
pnpm check-registry
```

Then look at it in a browser. In the Claude app, start `console` or `storybook` from `.claude/launch.json` in the browser pane; elsewhere run `pnpm console` (http://localhost:6010) or `pnpm storybook` (http://localhost:6006). Check every story, at 375px and at desktop width, and the component's contrast panel in the console. Take a screenshot to show the user.
