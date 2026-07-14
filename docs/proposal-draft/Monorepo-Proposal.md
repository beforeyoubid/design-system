# Proposal: BYB Design System Platform — Monorepo, Themes, and Component Structure

> Status: **Draft for review** · Author: compiled from design discussions (see [`PoC_Context.md`](./PoC_Context.md)) ·
> Date: 2026-07-14

## 1. Summary of decisions

| Question                                       | Decision                                                                                                                                                                                 |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New repo or extend this one?                   | **Extend this repo in place** (Option A). Keep git history, npm identity, CI. Optionally rename the GitHub repo later (redirects are automatic).                                         |
| One package or many?                           | **One published package**: `@beforeyoubid/design-system`. Layers are expressed via folders and subpath exports, not extra packages.                                                      |
| Multiple design systems for multiple products? | **No — one design system, multiple themes.** Products (website, backyard v2/v3, BYB Assist) differ by _theme_, never by forked components.                                               |
| Where do tokens live?                          | **Tokens become data** (platform-neutral JSON). The per-theme CSS entries (`website.css`, `backyard.css`, …), `tokens.ts`, and `tokens.json` are _generated build outputs_, not sources. |
| How does each consumer get its theme?          | **One self-contained CSS entry per theme** — a consumer imports exactly one file (`@beforeyoubid/design-system/backyard.css`); no `data-theme` attribute, no override-file ordering.     |
| Component-specific heavy dependencies?         | **Optional peer dependencies + dedicated subpath entries** for the heavy ~20%; the core barrel stays dependency-light for the ~80%.                                                      |
| Real product apps in the monorepo?             | **No.** Website, backyard, Assist stay in their own repos and consume published packages. The monorepo contains only the library, docs, and demo/prototype apps.                         |

## 2. Target folder structure

```
design-system/                          ← this git repo (same URL, same history)
├── pnpm-workspace.yaml                 packages: [packages/*, apps/*]
├── package.json                        root — "private": true, workspace scripts only
├── docs/
│   ├── DECISION-FRAMEWORK.md           create-vs-reuse rules (humans + AI agents)
│   └── proposal-draft/                 discussion notes + this proposal
├── claude-design/                      Claude Design import folders — one per theme (§7)
│   ├── website/                        half hand-authored (spec, guidelines, assets),
│   ├── backyard/                       half generated (resolved tokens, manifest);
│   └── assist/                         boundary enforced by a CI staleness check
├── packages/
│   └── design-system/                  ← current code moves here; npm name unchanged
│       ├── package.json                @beforeyoubid/design-system (only published pkg)
│       ├── tsup.config.ts              one entry per subpath export
│       ├── tokens/                     ★ SOURCE OF TRUTH (JSON, platform-neutral)
│       │   ├── primitives.json         mint/dark scales, typography, spacing, radii
│       │   └── themes/
│       │       ├── website.json        default mapping (today's globals.css semantics
│       │       │                       incl. dark-mode block)
│       │       ├── backyard.json       (future) backyard product line — v2 AND v3
│       │       └── assist.json         (future) BYB Assist
│       ├── scripts/
│       │   └── build-tokens.(js|ts)    generates every token artifact from JSON
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/                 shadcn primitives (~80%, no heavy deps)
│       │   │   ├── ui-heavy/           chart, calendar, carousel (own entry points)
│       │   │   └── byb/                BYB domain components (BYBCounter, InputField…)
│       │   ├── stories/                Storybook stays with the code it documents
│       │   ├── lib/  hooks/  icons.ts  index.ts
│       │   └── (tokens.ts — GENERATED, gitignored or checked in from build)
│       └── dist/                       build output incl. generated CSS artifacts
└── apps/
    └── demo/                           private Next.js app — never published
                                        AI-pipeline output, savings-calculator POC,
                                        real-consumer testbed via workspace:*
```

Key properties:

- **The root `package.json` is `"private": true`** — it can never be published by accident; it exists for `pnpm -r`
  scripts and shared dev tooling.
- **`apps/demo` depends on the package via `"@beforeyoubid/design-system": "workspace:*"`** — it consumes the library
  exactly like a real product does, but with zero publish latency. This is the surface the AI automation pipeline builds
  into.
- Storybook remains inside the package (stories document the package). Split to `apps/storybook` only if its dependency
  footprint ever becomes a problem.
- The conversion is a `git mv` in one PR. npm consumers notice nothing.

## 3. Token & theme architecture

### The problem being solved

Today `globals.css` fuses three concerns: token **values**, Tailwind v4 **wiring** (`@theme inline`, `@source`), and
product **theming** (semantic slot assignments + `.dark`). `src/tokens.ts` duplicates values by hand and `check-tokens`
polices the drift. This ceiling breaks with multiple consumers on multiple stacks (backyard v2, emails, future
surfaces).

### The architecture

**Tokens are data; every consumable format is generated.**

```
tokens/*.json  (source of truth, W3C design-tokens-style JSON)
      │
      ▼  scripts/build-tokens (Style Dictionary or small custom script), runs in CI
      ├── website.css          self-contained Tailwind v4 entry (aliased as globals.css)
      ├── backyard.css         self-contained entry — backyard product line
      ├── assist.css           self-contained entry — BYB Assist
      ├── backyard.vars.css    variables-only flavour (no Tailwind) → backyard v2 today
      ├── tokens.ts / .json    JS + raw data → non-CSS contexts, tooling, AI agents
      └── (future formats: tailwind-v3 preset, MUI theme, email-safe hex, native)
```

Consequences:

- `check-tokens` becomes obsolete — parity is guaranteed by construction.
- Adding a token = one JSON edit; every artifact regenerates on the next build.
- A new consumer type is a new _output format_, never a rethink.
- The JSON doubles as the machine-readable token inventory for AI agents.

### Theming model (one design system, N themes)

- **Primitives are global and immutable across products.** No product overrides `--mint-45`.
- **Each product line gets a semantic theme** — a JSON mapping of `--primary`, `--background`, `--radius`, … onto
  primitives. A theme **extends the default and states only its differences**, and may **only reference primitives** —
  it can never invent a new colour value. If a product needs a colour that doesn't exist, that's a new primitive (a
  design decision, one JSON edit), not a theme-level hack. The generator enforces this mechanically.

```jsonc
// tokens/themes/backyard.json
{
  "extends": "website",
  "semantic": {
    "primary": "{navy}", // must reference a primitive
    "radius": "{radius-sm}",
    "background": "{light-l1}",
  },
  "dark": {
    "background": "{dark-100}", // theme-specific dark overrides (optional)
  },
}
```

- Components never change per product: they consume semantic utilities (`bg-primary`), and the theme decides what those
  mean. This is why the existing rule — _semantic tokens inside reusable components, primitives only on marketing
  surfaces_ — is load-bearing: components written that way are automatically re-themeable.
- If BYB ever runs genuinely separate brands (white-label), the same repo absorbs it with a `tokens/brands/<brand>/`
  dimension above themes — still one design system, one component library.

### Theme delivery: one self-contained CSS entry per consumer

The generator emits a **complete, standalone stylesheet per theme** — primitives + that theme's semantic mapping + its
`.dark` block + the Tailwind v4 wiring (`@theme inline`, `@source`) in one file. A consumer's entire theming decision is
**one import line**:

```tsx
// marketing site, app/layout.tsx
import '@beforeyoubid/design-system/website.css';

// backyard v3
import '@beforeyoubid/design-system/backyard.css';

// backyard v2 (older stack, no Tailwind v4) — variables only
import '@beforeyoubid/design-system/backyard.vars.css';
```

Why this shape:

- **Unambiguous** — no base-file + override-file ordering, no `data-theme` attribute, no way to half-apply a theme.
  Which theme a product uses is answerable with a one-line grep, by humans and AI agents alike.
- **Duplication across generated files is irrelevant** — they're build outputs; each consumer ships only its own.
- **Dark mode stays orthogonal** — every generated entry includes its own `.dark` block, so `<html class="dark">` works
  identically in every product under any theme.
- **`globals.css` is kept as an alias for `website.css`** so existing consumers keep working unchanged.

Naming rule: **name themes after design intent / product line, not repos.** `backyard.json` serves backyard v2 _and_ v3;
if website and Assist ever converge visually they share one theme file rather than duplicating it.

> Rejected alternative — runtime switching via a `data-theme` attribute (base CSS + per-theme override files). Only
> justified when a single app must render multiple themes at runtime (e.g. white-label per request). Each BYB product
> permanently owns one theme, so the self-contained entry is simpler and safer. The generator could add attribute-scoped
> outputs later without changing the token source.

## 4. Component structure & the dependency strategy

### Layers (source organization, not packaging)

| Layer            | Location                   | Rule                                                                                 |
| ---------------- | -------------------------- | ------------------------------------------------------------------------------------ |
| Tokens / themes  | `tokens/`                  | The brand facts. Never hard-coded in components.                                     |
| Primitives       | `src/components/ui/`       | Generic UI roles (Button, Card, Dialog). Variants via `cva`. No business meaning.    |
| Heavy primitives | `src/components/ui-heavy/` | Same as above but with an external heavy dependency → own subpath entry (see below). |
| BYB domain       | `src/components/byb/`      | Encodes BYB workflow, pricing, report logic, or domain copy. Composes primitives.    |
| App-local        | _consuming app's repo_     | Single-product, unlikely to repeat → never enters the design system.                 |

A component is BYB-specific because of **business meaning**, not styling — token-driven styling keeps a component
generic.

### Dependency tiers

Roughly 80% of the library is primitives with no external dependency. The dependency strategy makes that structural:

| Tier                             | Packages                                                                                          | Treatment                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Core (tiny, pervasive)           | `clsx`, `tailwind-merge`, `class-variance-authority`, `@radix-ui/react-slot`, `@base-ui/react`    | Regular `dependencies`.                                                      |
| Heavy, one component each        | `recharts` (chart), `react-day-picker` + `date-fns` (calendar), `embla-carousel-react` (carousel) | **Optional peer dependency + dedicated subpath entry.**                      |
| Small-to-mid, one component each | `sonner`, `vaul`, `cmdk`, `input-otp`, `react-resizable-panels`, `next-themes`                    | Leave as-is for now; migrate opportunistically at the next major if desired. |

### Subpath entries — the mechanics

Heavy components **must leave the main barrel**: a barrel re-export forces every consumer's bundler to _resolve_ the
heavy library during module-graph construction, before tree-shaking — so an uninstalled optional peer would break builds
for consumers who only wanted `Button`. Dedicated entries make the peer genuinely optional. The `/icons` entry already
proves this pattern in-repo.

```jsonc
// package.json (target shape)
"exports": {
  ".":            "…",   // the 80% — Button, Card, Input, Dialog…
  "./chart":      "…",   // peer: recharts
  "./calendar":   "…",   // peer: react-day-picker
  "./carousel":   "…",   // peer: embla-carousel-react
  "./icons":      "…",   // peer-like external: @tabler/icons-react (existing)
  "./website.css":  "./dist/website.css",   // generated theme entries — one per consumer
  "./backyard.css": "./dist/backyard.css",
  "./assist.css":   "./dist/assist.css",
  "./backyard.vars.css": "./dist/backyard.vars.css", // variables-only (backyard v2)
  "./globals.css":  "./dist/website.css",   // alias — existing consumers keep working
  "./tokens.json":  "./dist/tokens.json"    // generated — raw data
},
"peerDependencies": {
  "recharts": "^3.8.0",
  "react-day-picker": "^9.0.0",
  "embla-carousel-react": "^8.6.0"
},
"peerDependenciesMeta": {
  "recharts": { "optional": true },
  "react-day-picker": { "optional": true },
  "embla-carousel-react": { "optional": true }
}
```

Consumer experience:

```tsx
import { Button, Card } from '@beforeyoubid/design-system'; // nothing extra
import { ChartContainer } from '@beforeyoubid/design-system/chart'; // requires: pnpm add recharts
```

Each subpath is a separate tsup entry with its library marked `external`. Keep the existing multi-config rules: `clean`
once via the build script (never per-config), `'use client'` banner on client entries only.

> ⚠️ Moving Chart/Calendar/Carousel out of the barrel is a **breaking change** — ship it in a major version, batched
> with any other breaks. Migration for consumers is two lines: change the import path, install the peer.

### Domain components with exotic dependencies (e.g. inspector service-area map)

Decision ladder:

1. **App-local first** — if one product uses it, it stays in that product's repo; the map library is that app's
   dependency. The design system contributes only the primitives it composes.
2. **Shared + heavy** → optional peer + subpath, exactly like chart.
3. **Domain-specific + shared** → shadcn-style **registry copy-in** (Phase 4): the component lives in this repo as a
   registry item carrying its own dependency manifest; a product pulls it with `npx shadcn add …`, which copies the
   source into the app and installs its deps there. The app owns the code; the design system owns the blueprint.
4. **Satellite package** (`@beforeyoubid/design-system-maps`) — last resort for a large self-contained suite;
   reintroduces a version pairing, so avoid unless the above genuinely don't fit.

## 5. Publishing workflow

Replace manual laptop publishing with **Changesets + GitHub Actions**:

1. **Feature PR** — author (human or AI agent) runs `pnpm changeset`, committing a small file declaring bump type +
   summary.
2. **CI on every PR** — `lint`, `type-check`, `test`, `build`, Storybook build; wire **Chromatic** (addon already in
   devDeps) for hosted per-PR Storybook + visual regression diffs — the safety net that lets a human approve AI-authored
   visual changes at a glance.
3. **On merge to main** — the Changesets action maintains a rolling "Version Packages" PR (version bump + CHANGELOG).
4. **Merge the version PR** — CI publishes to npm with `NPM_TOKEN`, tags, and creates a GitHub release.

`apps/demo` is private and ignored by Changesets. Release cadence: feature PRs merge freely; a human merges the version
PR to ship.

## 6. Governance & AI workflow (pointers)

- **`docs/DECISION-FRAMEWORK.md`** — the explicit decision tree (token → variant → new primitive → BYB wrapper →
  app-local) plus promotion criteria. Referenced from CLAUDE.md so every AI session inherits the rules.
  _Highest-leverage deliverable; do first._
- **Component registry** (`registry.json`) — machine-readable inventory: name, layer, path, variants, required peers,
  story link. Serves the AI audit step ("does X already exist?"), the Claude Design manifest (§7), and, later,
  shadcn-CLI copy-in distribution. Start hand-written; automate generation later (see below).
- **Roles** — AI proposes, designer disposes: the designer owns tokens and the create-vs-reuse classification call; a
  design-system maintainer approves promotions and owns releases; agents do audits and implementation behind that gate.
- **Pipeline** — Design (Claude Design/Figma) → Audit (agent vs registry) → Gate (designer approves classification) →
  Build (Claude Code: component + story + checks + PR) → Compose (page in `apps/demo` or the product). Each step must be
  runnable manually; the orchestration layer (e.g. multica.ai — capabilities to be validated) only sequences them.

### Component development by AI agents — making the inventory legible

An agent deciding _reuse vs create_ (in this repo **or in a consumer repo** looking at a website/backyard design) must
answer three questions fast — **what exists, what it looks like, and what the rules say** — without reading ~50
component files. Five artifacts serve that, in priority order:

**1. `registry.json` — "what exists" (highest value).** One file, one entry per component:

```jsonc
{
  "name": "Badge",
  "layer": "primitive", // primitive | ui-heavy | byb
  "description": "Small status/category label. Use for statuses and counts — NOT for interactive filters (use Toggle).",
  "variants": { "variant": ["default", "secondary", "destructive", "outline"] },
  "importPath": "@beforeyoubid/design-system",
  "requiredPeers": [],
  "story": "src/stories/badge.stories.tsx",
}
```

- The **`description` is the one hand-authored field and is where the reuse decision actually happens** — write it as
  _role + when-to-use + when-NOT-to-use_. Author it as JSDoc on each component export so the generator can extract it
  and IDEs show it to humans.
- **v1 is hand-written** (an hour or two for the current inventory — 90% of the value). Automate generation from source
  in CI later (extract variants from `cva`, descriptions from JSDoc) when hand-maintenance starts to drift — the same
  generated-from-source principle as tokens, deferred until it earns its keep. A stale registry is worse than none:
  agents "discover" gaps that don't exist and create duplicates.

**2. Ship the registry inside the published package.** The create-vs-reuse decision usually happens in the **consumer
repo**, where design-system source doesn't exist. Adding `registry.json` to the package `files` puts the inventory at
`node_modules/@beforeyoubid/design-system/registry.json` in every consumer — version-matched to the components actually
installed. Each consumer repo's CLAUDE.md gets a three-line snippet: _"Before creating any UI component, read that file
and apply the decision framework; propose classification before writing code."_

**3. `DECISION-FRAMEWORK.md` — "what to do about a gap."** The registry says what exists; the framework says how to act
when something doesn't: only-styling-differs → token/variant; new generic role → new primitive; business meaning → BYB
wrapper; single-product one-off → app-local. Both together are the complete decision input.

**4. The mandated audit procedure — data alone doesn't change agent behaviour.** CLAUDE.md (here and in consumers)
requires, before any component code:

> For each UI element in the design, emit a table:
> `element → decision (reuse | variant | new-primitive | byb-wrapper | app-local) → justification citing a registry entry or a framework rule.`
> A human (the designer gate from the roles model) approves the table before implementation.

**5. Visual ground truth (defer).** For mockup-image inputs, a vision-capable agent benefits from comparing the design
against rendered components. Hosted Storybook (free once Chromatic is wired into CI for the publishing workflow) + the
`story` link in each registry entry covers this. Skip until Chromatic lands — agents get far on good descriptions alone.

**Minimum viable version:** framework doc + CLAUDE.md audit procedure + hand-written `registry.json` shipped in the
package — roughly two days of writing, no infrastructure, and an agent in the website repo can make defensible
reuse-vs-create decisions. Skip for now: an MCP server / query API over the registry — a JSON file in `node_modules` is
already ideal agent food; revisit only if the inventory outgrows a context window (hundreds of components).

## 7. Claude Design integration

> Basis: Anthropic's June 2026 Claude Design update (beta; Pro/Max/Team/Enterprise) added **design system imports** —
> from a GitHub repo via a `design-system-spec.json` manifest (documented as one spec at the repo root), from design
> files, or direct upload. Claude Design generates mockups using the imported components/tokens/typography and
> self-checks output against the approved system. An organization can hold **multiple design systems**; an admin can
> publish them org-wide and set one as the **org default** (inherited by new projects). Claude Code integrates via
> `/design-sync`. Exact manifest schema and whether an import URL may target a repo _subdirectory_ must be verified at
> implementation time.

Claude Design is treated as **one more consumer of the same source of truth**: everything derivable from `tokens/` or
the registry is generated, never hand-maintained; only genuinely design-tool-specific content (guidelines prose, canvas
assets) is authored by hand.

### The `claude-design/` folder — one importable design system per theme

A committed folder at the repo root holds one complete, self-describing design system per product line:

```
claude-design/
├── website/
│   ├── design-system-spec.json      hand-authored — systemName "BYB — Website",
│   │                                paths, framework (react + tailwind v4)
│   ├── guidelines.md                hand-authored — voice, layout rules, dos/don'ts
│   ├── assets/                      hand-curated — logos, reference imagery
│   ├── tokens.json                  GENERATED — resolved website values. Do not edit.
│   └── components/manifest.json     GENERATED — from registry.json (shared inventory)
├── backyard/                        same shape — tokens resolve primary → navy, etc.
└── assist/
```

Rules that keep it healthy:

- **Hand-authored vs generated is a per-file boundary.** The spec, guidelines, and assets have no other source of truth
  — this folder is their home; edit freely via PR. `tokens.json` and `components/manifest.json` are resolved from
  `tokens/themes/*.json` and the registry — hand-editing them would let Claude Design and the shipped CSS disagree about
  what a colour means.
- **Two guards enforce the boundary:** a header comment in every generated file
  (`"GENERATED from tokens/themes/<theme>.json — edit that file instead"`), and a **CI staleness check** that
  regenerates the files and fails the build if the committed copies differ.
- **Resolved values, not references.** Each theme's `tokens.json` carries concrete values (backyard `primary` = navy's
  hex), so a mockup generated against it is unambiguous.
- The shared `components/manifest.json` (derived from `registry.json`) tells Claude Design what already exists —
  variants, layer, description — steering it toward _reusing_ components instead of inventing near-duplicates on the
  canvas.

### How each theme is imported and differentiated

Each subfolder is a complete bundle, so it feeds **any** of the delivery mechanisms — the layout decision is independent
of which one wins:

1. **Subdirectory import (preferred, needs a ~30-min experiment):** if Claude Design's import URL accepts a repo
   subfolder, each `claude-design/<theme>/` is imported directly — one repo, N design systems.
2. **Satellite mirror repos (fallback):** CI copies each subfolder to a tiny read-only repo (`design-website`,
   `design-backyard`) whose root satisfies the documented one-spec-per-repo constraint. Humans never touch satellites;
   they're deploy targets, like a `gh-pages` branch.
3. **Direct upload (stopgap/demo):** zip a subfolder and upload — works today, but re-uploading on every token change
   makes it unsuitable as the standing mechanism.

In the Claude Design org, each import appears as a distinct design system named by its spec's `systemName` ("BYB —
Website", "BYB — Backyard", "BYB — Assist"). The admin sets **website as the org default**; a designer starting backyard
work switches that project's design system, and every generation then resolves and self-checks against backyard's values
— tool-enforced, not prompt-discipline.

**Sequencing:** while only one theme exists, a single import ("BYB Design System" = the website folder) is enough. Run
the subdirectory-URL experiment when the second theme lands, then adopt mechanism 1 or 2.

### Governance fit

Claude Design's enterprise controls (an admin approves one standard design system and can lock edits) map directly onto
the roles model in §6: the design-system maintainer owns the approved import; designers consume it. This closes the loop
on the original goal — _"Claude Design should utilise the design system in its decision-making"_ — mechanically rather
than by prompt discipline.

### Effect on the AI pipeline (§6)

The Design → Audit → Gate → Build flow gets materially cheaper: mockups arrive already speaking token/component
vocabulary (real utilities, real component names), so the Audit step shifts from "translate a freehand mockup into our
vocabulary" to "diff the mockup's component usage against the registry" — and `/design-sync` gives Claude Code shared
context with the canvas instead of a static screenshot hand-off.

## 8. Phased roadmap & action tracker

> Status legend: ✅ done · 🔲 pending · Last updated: **2026-07-14** (phases 1–2 executed)

### Summary

| Phase                         | Goal                                                    | Consumer impact                                             | Status            |
| ----------------------------- | ------------------------------------------------------- | ----------------------------------------------------------- | ----------------- |
| **1. Governance docs**        | Rules + inventory that humans and AI agents decide with | None                                                        | ✅ (2 follow-ups) |
| **2. Tokens → JSON**          | Tokens become data; CSS/TS become generated artifacts   | None                                                        | ✅ (1 deferred)   |
| **3. Workspace conversion**   | Monorepo structure + demo app + automated publishing    | None                                                        | 🔲                |
| **4. Dependency restructure** | Heavy deps become pay-for-what-you-use                  | **Major version** — 2-line migration for affected consumers | 🔲                |
| **5. Registry + AI pipeline** | Automated inventory + Claude Design import + demo run   | None                                                        | 🔲                |
| **6. Themes on demand**       | Second product theme, per-theme CSS entries, Figma sync | Additive                                                    | 🔲                |

Phases 1–2 were independent of the monorepo conversion and are done; phase 4 is the only consumer-facing break and
should be batched into one well-communicated major release.

### Phase 1 — Governance docs ✅

| #   | Action                                                                                          | Status |
| --- | ----------------------------------------------------------------------------------------------- | ------ |
| 1.1 | Write `docs/DECISION-FRAMEWORK.md` (layers, decision tree, promotion criteria, audit procedure) | ✅     |
| 1.2 | Wire mandatory create-vs-reuse audit into `CLAUDE.md`                                           | ✅     |
| 1.3 | Hand-write `registry.json` v1 — 52 components, variants from `cva`, use/NOT-use descriptions    | ✅     |
| 1.4 | Ship `registry.json` in the package (`files` array)                                             | ✅     |
| 1.5 | Designer review of registry descriptions (they steer agent decisions)                           | 🔲     |
| 1.6 | Add missing `BYBImage` story (gap found during registry build)                                  | 🔲     |

### Phase 2 — Tokens → JSON ✅

| #   | Action                                                                                                    | Status |
| --- | ---------------------------------------------------------------------------------------------------------- | ------ |
| 2.1 | Extract all primitives to `tokens/primitives.json` (OKLCH + hex, typography, radius, layout, animations)  | ✅     |
| 2.2 | Extract semantic mappings to `tokens/themes/website.json` ({primitive} references only, light + dark)     | ✅     |
| 2.3 | Build `scripts/build-tokens.js` — generates `globals.css` + `src/tokens.ts`; validates theme references   | ✅     |
| 2.4 | Verify semantic equality old vs generated (every custom property, scope, keyframe, TS entry — 0 diffs)    | ✅     |
| 2.5 | Repurpose `pnpm check-tokens` as the staleness check (`--check`); delete old parity script                | ✅     |
| 2.6 | Wire `build-tokens` into `pnpm build`; update CLAUDE.md token workflow                                    | ✅     |
| 2.7 | Variables-only `.vars.css` flavour for non-Tailwind consumers (backyard v2) — build when a consumer asks  | 🔲     |

### Phase 3 — Workspace conversion 🔲

| #   | Action                                                                                            |
| --- | -------------------------------------------------------------------------------------------------- |
| 3.1 | Root `package.json` (`"private": true`) + declare `packages/*`, `apps/*` in `pnpm-workspace.yaml` |
| 3.2 | `git mv` package code into `packages/design-system/`; fix relative paths (one PR)                 |
| 3.3 | Verify: `pnpm build`, Storybook, `npm publish --dry-run` produce an identical artifact            |
| 3.4 | Scaffold `apps/demo` (private Next.js app, `workspace:*` dependency)                              |
| 3.5 | Changesets: per-PR changeset files, auto "Version Packages" PR, CI publish with `NPM_TOKEN`       |
| 3.6 | Wire Chromatic into CI (hosted Storybook per PR + visual regression)                              |
| 3.7 | Update `CLAUDE.md` to describe the new layout (it must always reflect reality)                    |

### Phase 4 — Dependency restructure 🔲 (ships as a major)

| #   | Action                                                                                                      |
| --- | ------------------------------------------------------------------------------------------------------------ |
| 4.1 | Move Chart / Calendar / Carousel out of the barrel to `./chart`, `./calendar`, `./carousel` subpath entries |
| 4.2 | `recharts`, `react-day-picker` (+ `date-fns`), `embla-carousel-react` → optional `peerDependencies`         |
| 4.3 | Split `src/components/` into `ui/` + `ui-heavy/` + `byb/`; update registry layers                           |
| 4.4 | Migration notes (2 lines per consumer: import path + peer install); batch into one major release            |

### Phase 5 — Registry + AI pipeline 🔲

| #   | Action                                                                                                            |
| --- | ------------------------------------------------------------------------------------------------------------------ |
| 5.1 | Automate `registry.json` generation (variants from `cva`, descriptions from JSDoc) + CI staleness check           |
| 5.2 | Scaffold `claude-design/<theme>/` folders (spec, guidelines, generated tokens/manifest) + CI staleness check (§7) |
| 5.3 | Add the 3-line audit snippet to consumer repos' CLAUDE.md (website, backyard, Assist)                             |
| 5.4 | Manual end-to-end savings-calculator run: Design → Audit → Gate → Build → Compose in `apps/demo`                  |
| 5.5 | Automate the pipeline using the manual run as the spec (validate multica.ai capabilities first)                   |

### Phase 6 — Themes on demand 🔲 (trigger: a designer defines a second product's look)

| #   | Action                                                                                                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 6.1 | Extend generator: `extends` resolution + self-contained per-theme entries (`website.css`, `backyard.css`; `globals.css` stays as website alias) |
| 6.2 | Create `tokens/themes/backyard.json` from designer decisions (differences only)                                                                 |
| 6.3 | Run the Claude Design subdirectory-import experiment; adopt import mechanism 1 or 2 (§7)                                                        |
| 6.4 | Figma variable sync (verify plan supports the Variables API / Tokens Studio first)                                                              |
