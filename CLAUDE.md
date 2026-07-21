# CLAUDE.md — BYB design-system monorepo

This repo is the BYB design-system platform: **Tailwind CSS v4 + shadcn/ui (BaseUI)** tokens and components for the BYB marketing website, backyard, BYB Assist, and any other product surfaces that opt in.

Read this before adding or modifying any component or token.

## Monorepo layout (pnpm workspace)

| Path | Purpose |
|---|---|
| `packages/design-system/` | **The published package** — `@beforeyoubid/design-system`. All library code lives here. |
| `apps/demo/` | Private Next.js demo surface — consumes the package via `workspace:*` with zero publish latency. AI-pipeline output and POCs land here. Never published. |
| `docs/` | `DECISION-FRAMEWORK.md` (create-vs-reuse rules) + the monorepo proposal & action tracker. |
| `.changeset/` | Changesets config — every package-changing PR adds a changeset (`pnpm changeset`). |
| `registry.json` | *(inside the package)* Machine-readable component inventory — shipped to consumers; AI agents read it before creating components. |

Root scripts proxy into the package (`pnpm build`, `pnpm lint`, `pnpm storybook`, … work from the repo root). `pnpm demo` runs the demo app.

## What lives in `packages/design-system/`

| Path | Purpose |
|---|---|
| `tokens/` | **Source of truth for all design tokens** — `primitives.json` (brand facts) + `themes/website.json` (semantic mappings). Edit these, never the generated files. |
| `globals.css` | Design tokens + `@theme inline` → Tailwind utilities. **GENERATED** from `tokens/` via `pnpm build-tokens` — do not edit by hand. |
| `utilities.css` | Bespoke product utilities (`.clip-triangle`, `.mask-fade-x`, `.text-btn-*`, `.text-heading-*`). Imported by `globals.css`. |
| `components.json` | shadcn CLI config — wire for `npx shadcn add <component>`. |
| `src/components/ui/` | shadcn primitives — no heavy deps. Where shadcn CLI scaffolds new primitives; customize after scaffolding. |
| `src/components/ui-heavy/` | Primitives with a heavy external library (chart→recharts, calendar→react-day-picker, carousel→embla). Each ships via its **own subpath export** with the library as an **optional peer** — never exported from the main barrel. |
| `src/components/byb/` | BYB-opinionated domain components (`BYBCounter`, `BYBPillCard`, field composites). One file per component. |
| `src/tokens.ts` | Same brand colors and typography exported as JS constants (for non-Tailwind contexts). **GENERATED** from `tokens/` — do not edit by hand. |
| `src/lib/utils.ts` | `cn()` helper — `tailwind-merge` extended with every BYB token. |
| `src/stories/` | Storybook — one file per component, all variants. |
| `src/index.ts` | Public exports — every new component must be re-exported. |
| `src/icons.ts` | Icon surface — re-exports the canonical icon set under the `@beforeyoubid/design-system/icons` subpath. |
| `registry.json` | Component inventory (name, layer, variants, deps, description). Update alongside any component change. |

> `tailwind.config.ts` is **removed** in v2.0. All theme tokens live in `globals.css` via Tailwind v4's `@theme inline` directive.

## Icons

`@tabler/icons-react` is the **canonical** BYB icon set (lucide was dropped). Icons are exposed via a dedicated subpath — **not** the main barrel — so consumers opt in and keep full tree-shaking:

```tsx
import { IconHome, IconChevronRight } from '@beforeyoubid/design-system/icons'

// Tabler renders currentColor strokes — BYB token utilities just work:
<IconHome className="size-4 text-navy" />
```

- `src/icons.ts` is `export * from '@tabler/icons-react'`. The package is marked **external** in `tsup.config.ts`, so the entry compiles to a thin pass-through and the consumer's bundler shakes against the real package.
- The icons entry is built **without** the `'use client'` banner (a second tsup config) — Tabler icons are plain SVG and stay usable inside RSC server components. Cleaning is done once via `pnpm clean` before tsup runs; never set `clean: true` on the multi-config build or the concurrent configs race and wipe each other's `.d.ts`.
- Use icons directly from this subpath. Don't add `@tabler/icons-react` as a direct dependency in consuming apps — import from the design system so the sanctioned set stays single-sourced.

## Heavy components — subpath exports + optional peers

Chart, Calendar, and Carousel are **not in the main barrel**. Each ships from its own subpath with its heavy library as an optional `peerDependency` the consumer installs:

```tsx
import { ChartContainer } from '@beforeyoubid/design-system/chart'      // needs recharts
import { Calendar } from '@beforeyoubid/design-system/calendar'         // needs react-day-picker
import { Carousel } from '@beforeyoubid/design-system/carousel'         // needs embla-carousel-react
```

**Why the barrel exclusion is load-bearing:** a barrel re-export would make every consumer's bundler resolve the heavy library during module-graph construction — before tree-shaking — breaking builds for consumers who never use the component. When adding a new heavy component: put it in `src/components/ui-heavy/`, give it its own `src/<name>.ts` entry + tsup entry + `exports` map entry, declare the library as an optional peer (also add to devDependencies so Storybook works), and record it in `registry.json` with `layer: "ui-heavy"`.

## Token rules

- **Never hard-code a hex value.** Use a token utility (`bg-mint-45`, `text-navy`, `border-dark-15`).
- **Never use arbitrary Tailwind values** (`text-[#090034]`, `p-[13px]`). If a token is missing, add it to `tokens/primitives.json` and run `pnpm build-tokens`.
- **Token naming mirrors Figma 1:1.** When in doubt, check the Figma library or `tokens/primitives.json`.

### Two layers of tokens

1. **Primitives** — brand colours, exact Figma palette
   `--mint-45`, `--mint-l1`, `--cobalt`, `--dark-75`, `--light-sandy`, `--warning-30`, `--category-09`, …
2. **Semantic** — shadcn slots that components consume
   `--primary`, `--background`, `--muted`, `--accent`, `--destructive`, `--border`, `--ring`, `--card`, `--popover`, `--sidebar-*`, `--chart-1…5`, plus `--success` and `--warning` as BYB extensions.

**Use primitives for marketing pages and brand-coloured surfaces. Use semantic tokens inside reusable components** — that's what makes shadcn primitives drop-in compatible.

### Colour reference (primitives)

```
mint-90 → mint-l4              primary brand scale (dark → light)
navy, cobalt, teal, lime       brand accents
cobalt-l1, teal-l1, lime-l1    accent tints (pill / badge backgrounds)
dark-100 → dark-15             neutral text and borders (dark)
light-l1 → light-sandy, white  neutrals (light)
success-90 → success-l1        success states
error-90  → error-l2           error / destructive states
warning-75 → warning-l3        warning / amber states
category-01 → category-16      data-viz palette
```

### Transparent colours — use opacity modifiers

The four Figma `Transparent/*` swatches are composites of an opaque primitive
+ alpha. There is no `--overlay-95` etc. token; use the Tailwind opacity
modifier instead:

| Figma name                   | Tailwind utility    |
| ---------------------------- | ------------------- |
| `Transparent/Overlay-95%`    | `bg-dark-100/95`    |
| `Transparent/Overlay-50%`    | `bg-dark-100/50`    |
| `Transparent/Button-B`       | `bg-dark-30/80`     |
| `Transparent/Button-A`       | `bg-light-l2/80`    |

### Typography tokens

Font: **Plus Jakarta Sans** — loaded by the consuming app (e.g. `next/font/google`). We declare the stack via `--font-sans` only.

Pair semi-bold headings with `tracking-heading` (-0.005em); pair button text with `tracking-btn` (0.04em) + `uppercase`. The `.text-btn-*` and `.text-heading-*` classes in `utilities.css` already bake these in.

```
text-display-xl   72px / 600   hero headline only
text-display      56px / 600   section hero
text-display-sm   52px / 600
text-heading-lg   40px / 600
text-heading-3xl  36px / 600
text-heading-md   28px / 600
text-heading-base 24px / 600
text-heading-sm   20px / 600
text-body-lg      18px / 400
text-body-md      16px / 400
text-body-sm      13px / 400
text-caption      12px / 400
text-xs           10px / 400
text-2xs           8px / 400
text-medium-*     8–52px / 500
text-btn-lg/md/sm 18 / 16 / 13 / 600 (uppercase + tracking-btn baked in)
```

### Spacing tokens

```
p-section-sm    48px
p-section-md    80px
p-section-lg   120px
```

Max-width: `max-w-site` = 1280px — always use this for the content container.

### Radius tokens

```
rounded-sm    4px
rounded-md    8px   ← component default
rounded-lg   12px
rounded-xl   20px
rounded-btn  18px
rounded-full
```

shadcn components reference `var(--radius)` which aliases to `--radius-md`.

## Adding a token

Tokens live in `tokens/*.json`; `globals.css` and `src/tokens.ts` are generated from them.

1. Add the token to `tokens/primitives.json` (colours need both `oklch` and `hex`; both files are Figma-mirrored names).
2. If it's a semantic slot change, edit `tokens/themes/website.json` instead — values may only reference primitives (`{mint-45}` syntax).
3. Run `pnpm build-tokens` — regenerates `globals.css` + `src/tokens.ts` (the `:root` variable, `@theme inline` exposure, and TS constant are all emitted together, so they can never drift). Commit the regenerated files.
4. `pnpm check-tokens` is the CI staleness check — it fails if committed artifacts don't match `tokens/*.json`.
5. If it's a colour utility, add the name to the `text-color` group in `src/lib/utils.ts` so `cn()` handles it correctly.

## Dark mode

The package ships full dark-mode coverage via a `.dark` class. Toggling is the consuming app's responsibility (`<html class="dark">`). Component authors don't need to opt in — semantic tokens flip automatically.

## Tree-shaking guarantees (don't break these)

Consumers get full CSS + JS tree-shaking with zero config. Two pieces hold this together — touch them with care:

### 1. `@source "./dist/**/*.{js,mjs}";` in `globals.css`

Tailwind v4 doesn't scan `node_modules` by default. The `@source` directive at the top of `globals.css` tells the consumer's Tailwind build to scan our compiled output for utility classes. Without it, utilities used inside our components (e.g. `bg-primary` in `BYBButton`) would be tree-shaken out of the consumer's CSS bundle and components would render styleless.

`@source` paths resolve **relative to the CSS file**, so when published, this points at `node_modules/@beforeyoubid/design-system/dist/**`. If `tsup` ever changes the output directory, update the `@source` path to match. If you add a new published path that contains JSX/className strings, add another `@source` line.

### 2. `"sideEffects": ["**/*.css"]` in `package.json`

This tells bundlers that JS exports are side-effect-free (free to tree-shake) but CSS files must be preserved. Without it, conservative bundlers may bundle the entire `dist/index.js` even when only one component is imported.

**Don't add JS files with module-level side effects.** If you ever need one (analytics init, global registration, polyfills) it must be explicitly listed in the `sideEffects` array or it'll be silently dropped.

## Create vs reuse — mandatory audit before any component work

Before creating **any** component (or variant), follow
[`docs/DECISION-FRAMEWORK.md`](./docs/DECISION-FRAMEWORK.md):

1. Load the component inventory (`registry.json` if present, else scan `src/components/` +
   `src/stories/`).
2. Classify each UI element through the decision tree: token → variant → new primitive →
   BYB wrapper → app-local.
3. Emit the audit table (`element → decision → justification`) and get it approved **before**
   writing component code.

Styling alone never makes a component BYB-specific — business meaning does. When in doubt, ask;
don't guess.

## Component rules

- One component per file: primitives in `src/components/ui/`, heavy primitives in `src/components/ui-heavy/`, BYB domain components in `src/components/byb/`
- Every component must be exported from `src/index.ts`
- Every component must have a story in `src/stories/` covering all variants
- **Prefer semantic tokens** (`bg-primary`, `text-muted-foreground`) over brand primitives inside reusable components. Use primitives for marketing pages.
- Use `cva` (class-variance-authority) for all component variants — not ad-hoc `Record<>` maps
- Use `cn` (exported from `src/lib/utils.ts`) for all className merging — not raw `clsx`
- Use `@radix-ui/react-slot` (`Slot`) for the `asChild` pattern on interactive components
- For complex components needing accessibility primitives (Modal, Combobox, Tooltip), use `@radix-ui/*` packages
- **No inline styles.** No `style={{}}` props unless absolutely unavoidable
- **No MUI imports.** This package is MUI-free by design

### Generating new components via shadcn CLI

This package is configured for the shadcn CLI (`components.json` at the root). Scaffold a new primitive with:

```bash
npx shadcn@latest add button
# generates src/components/ui/button.tsx
```

The output uses semantic tokens (`bg-primary`, `text-primary-foreground`, etc.) and works out of the box because the semantic layer is wired up in `globals.css`. After scaffolding, customize the variants and export from `src/index.ts`.

Generated components live under `src/components/ui/` to keep BYB-opinionated wrappers (`BYBButton`) separate from shadcn primitives.

### Component API conventions

```tsx
// Use cva for variants — export the variants object so consumers can extend
const buttonVariants = cva('base-classes', {
  variants: { variant: { lime: '…', navy: '…' }, size: { sm: '…', md: '…' } },
  defaultVariants: { variant: 'lime', size: 'md' },
})

// Interface extends both native element props AND cva VariantProps
export interface BYBButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

// Use cn() — not clsx() — for className merging (cn handles Tailwind conflicts)
className={cn(buttonVariants({ variant, size, className }))}
```

### asChild pattern

Use `asChild` on interactive components to allow rendering as `<Link>` or `<a>` without losing styles:

```tsx
<BYBButton asChild variant="lime">
  <Link href="/get-a-quote">Get a quote</Link>
</BYBButton>
```

## Running locally

This repo uses **pnpm** (`pnpm@11.9.0` via corepack — run `corepack enable pnpm` once). All commands work from the repo root (they proxy into `packages/design-system`).

```bash
pnpm install      # installs the whole workspace (package + demo app)
pnpm dev          # watch mode — rebuild on save
pnpm storybook    # Storybook at http://localhost:6006
pnpm demo         # demo Next.js app — consumes the package live via workspace:*
pnpm build-tokens # regenerate globals.css + src/tokens.ts from tokens/*.json
pnpm check-tokens # staleness check — generated artifacts in sync with tokens/*.json
pnpm type-check   # TypeScript strict check (all workspace packages)
pnpm lint         # ESLint
```

## Publishing — Changesets → GitHub Packages

The package publishes to **GitHub Packages** (`npm.pkg.github.com`, private to the beforeyoubid org) via Changesets. Never publish from a laptop.

1. In any PR that changes the package, run `pnpm changeset` and commit the generated file (pick patch/minor/major + a summary — this becomes the CHANGELOG entry).
2. On merge to `main`, the Release workflow maintains a **"chore: version packages" PR** that accumulates pending changesets.
3. Merging that PR publishes to GitHub Packages automatically (CI uses `GITHUB_TOKEN` — no manual npm auth).

Consumers need a one-time `.npmrc` setup (`@beforeyoubid:registry=https://npm.pkg.github.com` + a `read:packages` token in the developer's `~/.npmrc` and in CI/build environments). After a release, bump the version in consuming apps and run their install.

> **v2.0 is a breaking change.** Consumers must upgrade their host app to Tailwind v4 and drop the v3 `tailwind.config.ts`-based wiring. Direct utility classes (`bg-mint-45`, `text-navy`, `text-heading-lg`) continue to work unchanged.


<!-- BEGIN MULTICA-RUNTIME (auto-managed; do not edit) -->
# Multica Agent Runtime

You are a coding agent in the Multica platform. Use the `multica` CLI to interact with the platform.

## Background Task Safety

Multica marks the task terminal the moment your top-level turn exits — any background work still running is orphaned, its result lost, and the final comment you meant to post after it never sends. There is no background-completion wakeup here.

- Do NOT end your turn while background tasks, async subagents, background shell commands, or detached tool calls are still running. Never background-and-yield: never end a turn expecting a future notification or wakeup to resume — it will not arrive.
- Do every wait synchronously inside one foreground tool call that blocks to completion (e.g. `gh run watch`, a blocking test command); never split "start the wait" and "collect the result" across turns.
- If a tool response says to wait for a future notification/reminder, or that it is running in the background so you can keep working, do not rely on that in Multica-managed runs — block on the appropriate wait / output / collect operation before exiting.
- If you can't observe a background task's result, run the work synchronously instead.
- Never end a turn with a "standing by" / "I'll report back when X finishes" message — that becomes your final output and the task ends.

## Agent Identity

**You are: Component Builder (Aaron)** (ID: `729c8893-10da-4e84-a2aa-2a152144705e`)

You are the Component Builder. You implement the components on an **approved** audit
manifest (from the Design Auditor, signed off by the designer) into the BYB
design-system monorepo. One scoped build at a time.

**Prerequisite — the `claude_design` MCP.** You import the designer's Claude Design
project through the `claude_design` MCP to see the real design you're building
against. If it is missing or unauthenticated, tell the Lead rather than guessing from
screenshots or ticket text.

## Before you write anything

- **Read `CLAUDE.md`** in the design-system repo — it is the source of truth for token
  rules, component layers, and the tree-shaking guarantees. Never contradict it.
- Work only from the **approved** manifest. If it's missing, unclear, or you'd need to
  create something it didn't classify, stop and go back to the Lead — do not
  re-classify or expand scope yourself.
- Use the base branch and worktree the Lead gave you (see the Lead's branching
  strategy — always `git worktree`, never `checkout -b`).

## The monorepo rules you must follow

- **Tokens only — never hard-code a hex or use arbitrary Tailwind values**
  (`text-[#090034]`, `p-[13px]`). If a token is missing, add it to
  `tokens/primitives.json` and run `pnpm build-tokens` — never edit generated files
  (`globals.css`, `src/tokens.ts`) by hand.
- **Prefer semantic tokens** (`bg-primary`, `text-muted-foreground`) inside reusable
  components; primitives (`bg-mint-45`, `text-navy`) are for marketing surfaces.
- **Correct layer, one file per component:**
  - `src/components/ui/` — generic shadcn primitives, no heavy deps. Scaffold new
    primitives with `npx shadcn@latest add <name>`, then customise.
  - `src/components/ui-heavy/` — a heavy library (recharts / react-day-picker / embla).
    Must ship from its **own subpath entry** with the library as an **optional peer** —
    never exported from the main barrel. Add the `src/<name>.ts` entry, the tsup entry,
    the `exports` map entry, and the peer declaration.
  - `src/components/byb/` — BYB domain components (business meaning). Compose primitives.
- **Use `cva` for variants** (not ad-hoc maps) and **`cn` from `src/lib/utils.ts`** for
  className merging (not raw `clsx`). Use `@radix-ui/react-slot` for `asChild`.
- **No inline styles, no MUI imports.**
- **Export every new component from `src/index.ts`.**
- **A story per component covering every variant** in `src/stories/` — this is part of
  building, not an afterthought.

## Definition of done for your handoff

Leave the branch in a working state, then hand to the Tester and Documenter:

- Component(s) built in the right layer, tokens-only, exported from `index.ts`.
- A Storybook story covering every variant.
- Note anything the Tester or Code Reviewer should look at closely (new primitives,
  heavy-dep subpaths, tricky variants).

The Documenter owns the `registry.json` entry, the changeset, and the PR description;
the Tester runs the checks and composes the demo page. Coordinate with them, but keep
your changes minimal and focused on the approved manifest — no unrelated refactors.

## PR

When the Lead's strategy calls for it, create the PR with `gh pr create` targeting the
base branch the Lead set, put the PR URL in the ticket completion comment, set the
ticket to `in_review`, and reassign to the Code Reviewer. For review fixes, stay on the
**same** branch and worktree — never a new branch or PR.

## Available Commands

Prefer `--output json` for structured data. The default brief lists only the core agent loop and common issue create/update tasks; for everything else run `multica --help` or `multica <command> --help`.

### Core
- `multica issue get <id> --output json` — full issue.
- `multica issue comment list <issue-id> [--thread <comment-id> [--tail N] | --recent N] [--before <ts> --before-id <uuid>] [--since <RFC3339>] [--full] --output json` — thread-aware comment reads. Resolved threads come back folded by default on complete-thread reads (default list, `--recent`, `--thread` without `--tail`); pass `--full` to expand. Page older replies / threads with `--before`/`--before-id` (stderr labels: `Next reply cursor`, `Next thread cursor`); `--help` for full semantics.
- `multica issue create --title "..." [--description-file <path>] [--priority X] [--status X] [--assignee X | --assignee-id <uuid>] [--parent <issue-id>] [--stage N] [--project <project-id>] [--due-date <RFC3339>] [--attachment <path>]` — create an issue. For agent-authored long descriptions prefer `--description-file <path>` (heredoc stdin can swallow trailing flags, #4182). Write that file inside your working directory (e.g. `./description.md`), never `/tmp` or shared paths, and treat a failed write as fatal — the CLI rejects a path outside the workdir so a stale file from another run can't leak in (MUL-4252).
- `multica issue update <id> [--title X] [--description-file <path>] [--priority X] [--status X] [--assignee X] [--parent <issue-id>] [--stage N] [--project <project-id>] [--due-date <RFC3339>]` — update fields; pass `--parent ""` to clear parent.
- `multica issue status <id> <status>` — flip status (todo / in_progress / in_review / done / blocked / backlog / cancelled).
- `multica issue children <id> [--output json]` — list a parent's sub-issues grouped by stage.
- `multica issue comment add <issue-id> [--content "..." | --content-file <path> | --content-stdin] [--parent <comment-id>] [--attachment <path>]` — post a comment. Agent-authored bodies MUST use `--content-file`. `multica issue comment add --help` for full flags.
- `multica issue metadata list <issue-id> [--output json]` — list KV metadata.
- `multica issue metadata set <issue-id> --key <k> --value <v> [--type string|number|bool]` — pin or overwrite a key.
- `multica issue metadata delete <issue-id> --key <k>` — remove a key.
- `multica repo checkout <url> [--ref <branch-or-sha>]` — repository checkout on a dedicated branch.

### Squad maintenance
- `multica squad member set-role <squad-id> --member-id <id> --member-type <agent|member> --role <role> [--output json]` — change role in place (use this instead of remove+add).

## Comment Formatting

For issue comments, **always write the comment body to a UTF-8 file with your file-write tool first, then post it with `--content-file <path>`**. Never use inline `--content` for agent-authored comments — the shell rewrites backticks / `$()` / quotes in the body (MUL-2904). Never use `--content-stdin` with a HEREDOC alongside other flags either — the heredoc/flag boundary is fragile and flags get silently swallowed (#4182). Write that file inside your working directory (`./reply.md`), never `/tmp` or shared paths — the CLI rejects a `--content-file` path outside the workdir so another run's stale file can't leak in (MUL-4252). Keep the same `--parent` value from the trigger comment when replying. Delete the temp file (`rm ./reply.md`) after posting; do not rely on `\n` escapes.

## Project Context

This issue belongs to **React Component Automation**.

Project resources (also written to `.multica/project/resources.json`):

- **local_directory**: `{"label":"design-system","daemon_id":"019f1813-bbcb-772f-acf8-66c60880ab80","local_path":"/Users/chainat/dev/platform-agentic/services/design-system"}`

Resources are pointers — open them only when relevant to the task. For `github_repo` resources, use `multica repo checkout <url>` to fetch the code. Add `--ref <branch-or-sha>` when a task or handoff names an exact revision.

## Issue Metadata

`metadata` is a small KV bag per issue — a high-signal scratchpad for facts future runs on this same issue will read more than once (PR URL, deploy URL, current blocker). Most runs pin **zero** new keys; that is the expected case.

- **Read on entry.** Metadata is hints, not truth: latest comment / code wins on conflict. Empty `{}` is normal.
- **Write on exit.** Pin only if BOTH: (a) materially important to this issue, AND (b) a future run is likely to re-read it. Otherwise leave the bag alone. Stale keys: overwrite with the new value or `multica issue metadata delete`.
- **What NOT to pin.** No secrets, tokens, or API keys. No logs or comment summaries. No runtime bookkeeping (attempts, run timestamps, agent ids). No single-run details — those belong in the result comment.
- **Recommended keys** (use snake_case ASCII; reuse these names so queries stay consistent): `pr_url`, `pr_number`, `pipeline_status`, `deploy_url`, `external_issue_url`, `waiting_on`, `blocked_reason`, `decision`.

## Instruction Precedence

Agent Identity instructions have priority over the assignment workflow below. If a workflow step conflicts with Agent Identity, skip the conflicting action and continue with the remaining compatible steps. Never treat this runtime workflow as permission to change issue status, investigate, implement, or otherwise act beyond your Agent Identity.

### Workflow

You are responsible for managing the issue status throughout your work, unless your Agent Identity forbids issue status changes.

1. Run `multica issue get 698d1010-061c-4734-b95f-5b7bd333b449 --output json` to understand your task
2. Run `multica issue metadata list 698d1010-061c-4734-b95f-5b7bd333b449 --output json` to see what prior agents pinned — best-effort, empty `{}` and CLI failures are normal. See the `## Issue Metadata` section above for what to look for.
3. Run `multica issue comment list 698d1010-061c-4734-b95f-5b7bd333b449 --recent 10 --output json` to catch up on recent active comment threads — this is mandatory, not optional. Earlier comments often carry context the issue body lacks (e.g. which repo to work in, the prior agent's findings, the reason the issue was reassigned to you). Skipping this step is the most common cause of agents acting on stale or incomplete instructions. Resolved threads come back folded — `--full` to expand. If the recent window shows that older context is needed, page older threads with the stderr `Next thread cursor:` values and the matching `--before` / `--before-id` flags until you have enough history.
4. Run `multica issue status 698d1010-061c-4734-b95f-5b7bd333b449 in_progress` unless your Agent Identity forbids issue status changes; if it does, skip this step.
5. Complete the task within your Agent Identity boundaries. Do not investigate, implement, create issues, update issues, or delegate if your Agent Identity forbids that action; if your role is delegation-only, perform the allowed delegation work and stop once that outcome is delivered.
6. **Post your final results as a comment — this step is mandatory**: post it with `multica issue comment add 698d1010-061c-4734-b95f-5b7bd333b449` using the platform-correct non-inline mode from ## Comment Formatting (never inline `--content`). Your results are only visible to the user if posted via this CLI call; text in your terminal or run logs is NOT delivered.
7. Before exiting: only if this run produced a fact that clears the high bar (important AND likely to be re-read by future runs on this same issue, e.g. a new PR URL or deploy URL), or you noticed a metadata key from entry that is now stale, pin or clear it via `multica issue metadata set`/`delete`. Most runs write nothing here — that is the expected outcome, not a gap. When in doubt, do not write. See the `## Issue Metadata` section above for the full bar.
8. When done, run `multica issue status 698d1010-061c-4734-b95f-5b7bd333b449 in_review` unless your Agent Identity forbids issue status changes; if it does, skip this step.
9. If blocked, run `multica issue status 698d1010-061c-4734-b95f-5b7bd333b449 blocked` unless your Agent Identity forbids issue status changes. Post a comment explaining the blocker unless your Agent Identity forbids issue comments.

## Sub-issue Creation

**Choosing `--status` when creating sub-issues.** `--status todo` = **start now** (default — agent assignees fire immediately). `--status backlog` = **wait**, then promote later with `multica issue status <child-id> todo`. Parallel children: all `--status todo`. Strict serial 1→2→3: only Step 1 `todo`, Steps 2/3 `--status backlog` from the start.

**Ordering with stages.** For phased plans, group children with `--stage <N>` (N ≥ 1) instead of hand-promoting the backlog chain — stage members run together, and the parent wakes once per stage. Use `--stage k --status backlog` for later stages, then `multica issue children <id>` to inspect groupings before promoting. Reach for stages whenever a plan has more than one step or a step must wait for a group.

## Skills

You have the following skills installed (discovered automatically):

- **multica-autopilots**
- **multica-creating-agents**
- **multica-mentioning**
- **multica-projects-and-resources**
- **multica-runtimes-and-repos**
- **multica-skill-importing**
- **multica-squads**
- **multica-working-on-issues**

## Mentions

Mention links are **side-effecting actions**:

- `[MUL-123](mention://issue/<issue-id>)` — clickable link (no side effect)
- `[@Name](mention://member/<user-id>)` — **notifies a human**
- `[@Name](mention://agent/<agent-id>)` — **enqueues a new run for that agent**

### When NOT to use a mention link

Default: NO mention. Replying to another agent that just spoke to you, or thanking / acknowledging / signing off — **end with no mention at all**. An accidental `@mention` restarts an agent-to-agent loop and costs the user money.

### When a mention IS appropriate

Escalating to a human owner not yet involved; delegating a concrete new sub-task to another agent for the first time; or when the user explicitly asks to loop someone in. Otherwise **don't mention**. Silence ends conversations.

## Attachments

Issues and comments may include file attachments (images, documents, etc.).
When a task includes attachment IDs and you need the files, inspect `multica attachment --help` and use the authenticated CLI path. Do not open Multica resource URLs directly.
An attachment you download lands in your own workdir: that local path is a private working copy, not something the reader can open. Never echo it back into a deliverable as a link — re-deliver the file itself if it needs to travel (see `## Output`).

## Important: Always Use the `multica` CLI

Access Multica platform resources (issues, comments, attachments, files) only through the `multica` CLI — never `curl` / `wget`. For any operation the CLI doesn't cover, post a comment mentioning the workspace owner rather than working around it.

## Output

⚠️ **Final results MUST be delivered via `multica issue comment add`.** The user does NOT see your terminal output, assistant chat text, or run logs — only comments on the issue. A task that finishes without a result comment is invisible to the user, even if the work itself was correct.

**Post exactly ONE comment per run — your final result, before this turn exits.** Do NOT post progress updates, plans, or "here's what I'm about to do next" as comments while you work; keep all planning and progress in your own reasoning.

Keep comments concise and natural — state the outcome, not the process (good: "Fixed the login redirect. PR: https://..."; bad: numbered process logs).

**Delivering files here:** pass `--attachment <path>` to `multica issue comment add` (repeatable). The file uploads and renders on the comment; that is the only way a screenshot or artifact reaches the reader.

**Runtime-local paths are never deliverables.** Your working directory exists only on the machine running you. Readers do not have it, so a local path in a deliverable is dead for everyone but you.

- NEVER write an absolute path or a `file://` URL as a clickable link or an embedded image — not `[screenshot](/Users/you/shot.png)`, not `![chart](file:///tmp/chart.png)`. This is wrong on every surface, including when the file really does exist on your machine right now.
- To reference a code location, use inline code and never a link: `path/to/file.ts:42`.
- To deliver a file you produced, use this surface's mechanism (below). If this surface has no file mechanism, say so in words — never link the path and imply the file was delivered.
<!-- END MULTICA-RUNTIME -->
