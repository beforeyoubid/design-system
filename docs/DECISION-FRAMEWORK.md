# Decision Framework: create vs reuse

Rules for deciding **where a UI need belongs** — a token, a variant, a new primitive, a BYB domain component, or code
that never enters the design system at all.

**Audience:** humans and AI agents, in this repo **and in consumer repos** (website, backyard, BYB Assist). If you are
an AI agent about to write any component code, follow the
[audit procedure](#audit-procedure-required-before-writing-component-code) below first.

Related: [`docs/proposal-draft/Monorepo-Proposal.md`](./proposal-draft/Monorepo-Proposal.md) (architecture) ·
`registry.json` (component inventory — if not yet present, scan `src/components/` and `src/stories/` instead).

---

## Component taxonomy — every kind of thing that can exist here

Summary (details per type below):

| #   | Type                     | Lives in                                                         | Decided by                           | Real examples                                         |
| --- | ------------------------ | ---------------------------------------------------------------- | ------------------------------------ | ----------------------------------------------------- |
| T1  | Design token             | `tokens/primitives.json` → generated `globals.css` / `tokens.ts` | Q1                                   | `--mint-45`, `text-heading-lg`, `rounded-btn`         |
| T2  | Theme                    | `tokens/themes/<product>.json`                                   | designer decision                    | `website.json`; future `backyard.json`                |
| T3  | Primitive                | `src/components/ui/`                                             | Q2 (variant) / Q3 (new)              | `Button`, `Card`, `Dialog`, `Slider`                  |
| T4  | Heavy primitive          | `src/components/ui-heavy/` + own subpath                         | Q3 + dependency rule                 | `Chart`, `Calendar`, `Carousel`                       |
| T5  | Composite                | `src/components/byb/` (today)                                    | Q3                                   | `InputField`, `SelectField`                           |
| T6  | BYB domain component     | `src/components/byb/`                                            | Q4                                   | `BYBCounter`, `BYBPillCard`, `BYBTestimonialCarousel` |
| T7  | App-local component      | the consuming app's repo                                         | Q5                                   | inspector service-area map                            |
| T8  | Satellite domain library | its own repo/package                                             | `packages/README.md` 4-question test | `@beforeyoubid/form`, `@byb-private/checkout-funnel`  |
| T9  | Icon                     | `/icons` subpath (re-export of Tabler)                           | never created here                   | `IconHome`, `IconChevronRight`                        |

### T1 — Design token

- **What:** a brand fact — colour, type scale, spacing, radius, tracking. Zero code; generates a Tailwind utility.
- **Boundary:** values only, mirrored 1:1 from Figma. Never invented ad hoc to make a mockup work — adding one is a
  design decision.
- **Example:** `--mint-45` → `bg-mint-45`; `--text-heading-lg` → `text-heading-lg`.

### T2 — Theme

- **What:** one product line's assignment of semantic slots (`--primary`, `--radius`, …) onto primitives.
- **Boundary:** may ONLY reference primitives (`{navy}`) — can never invent a colour value (generator enforces this).
  One theme per product line, named for design intent, not repos.
- **Example:** `website.json` maps `primary → {mint-45}`; a future `backyard.json` might map `primary → {navy}`.

### T3 — Primitive

- **What:** a generic UI role any product could use — Button, Card, Dialog. Variants via `cva` for standard intents and
  sizes.
- **Boundary:** semantic tokens only (`bg-primary`, not `bg-mint-45`) so it re-themes automatically. **No business
  meaning, no domain copy, no heavy external dependency.** Must be exported from the barrel, registered in
  `registry.json`, and have a story.
- **Example:** `Button` with `variant: lime|navy|…` — brand-styled yet fully generic.

### T4 — Heavy primitive

- **What:** a primitive whose implementation needs a heavy third-party library.
- **Boundary:** everything T3 requires, PLUS: never exported from the main barrel; ships via its own subpath export
  (`/chart`) with the library as an **optional peer dependency**. (Barrel exclusion is load-bearing — bundlers resolve
  barrel imports before tree-shaking, so an uninstalled optional peer in the barrel breaks every consumer's build.)
- **Example:** `Chart` (`recharts`), `Calendar` (`react-day-picker`), `Carousel` (`embla-carousel-react`).

### T5 — Composite

- **What:** a convenience assembly of primitives into a recurring generic pattern — still no business meaning.
- **Boundary:** composes primitives, adds structure (label/hint/error slots), never re-implements a primitive's visuals.
  Generic despite living in the `byb/` folder — classified by _meaning_, not location.
- **Example:** `InputField` = `Label` + `Input` + hint/error slots. Replaces nothing about `Input`; wraps it.

### T6 — BYB domain component

- **What:** a component that encodes BYB business meaning — workflow, pricing, checkout, report logic, domain copy.
  Audit-table decision value: `byb-wrapper`.
- **Boundary:** owns the business meaning; delegates ALL "looks" to primitives and tokens. If it re-implements a
  button/card/dialog inside, that piece goes back to Q2/Q3. Content arrives via props, not hard-coded page copy.
- **Example:** `BYBCounter` (animated marketing stat), a future savings-calculator panel.

### T7 — App-local component

- **What:** UI used by one product, on one or two pages, unlikely to repeat.
- **Boundary:** lives in the product's repo — never enters the design system until it meets ALL the
  [promotion criteria](#promotion-criteria-app-local--design-system) below. Its dependencies are the app's problem.
- **Example:** inspector service-area map (single product + heavy map dependency).

### T8 — Satellite domain library

- **What:** a whole library that composes the design system — big enough to be its own package.
- **Boundary:** governed by the 4-question admission test in `packages/README.md` (library? impossible as subpath?
  lockstep evolution? same owners?). Passing all four → `packages/<name>` here; failing any → its own repo consuming the
  published package.
- **Example:** `@beforeyoubid/form` (passes — planned move in), `@byb-private/checkout-funnel` (fails 3–4 — stays out).

### T9 — Icon

- **What:** the canonical Tabler icon set, re-exported via `@beforeyoubid/design-system/icons`.
- **Boundary:** never hand-drawn here, never imported from `@tabler/icons-react` directly in consuming apps — the
  subpath keeps the sanctioned set single-sourced. Icons render `currentColor`, so token utilities style them.
- **Example:** `<IconHome className="size-4 text-navy" />`.

## The mental model

- **Primitive** = _what it is_ (a button, a progress bar).
- **Variant** = _how it looks in standard states_ (primary/secondary, success/warning, sm/md/lg).
- **BYB-specific** = _what business meaning or workflow it represents_.
- **Styling alone never makes a component BYB-specific.** A component can be fully BYB-themed and still be generic if
  the styling comes from tokens. Business meaning, rules, workflow, or domain copy are what make it BYB-specific.

---

## The decision tree before building a new component

When AI or Human needs to decide how to acheive the front end web elements on the consumer side, you will consider the
five following possible outcome.

The five possible answers range from _almost free_ to _expensive to maintain forever_:

- A token (zero new code)
- A variant (a few lines of `cva`)
- A new primitive (real code, real story, permanent maintenance)
- a BYB domain component (code that must track business changes)
- App-local (code, but the product repo carries it). The questions are ordered by that cost — work through them **in
  order** and stop at the first "yes", so the cheap mechanisms are exhausted before the expensive ones. In practice,
  most "we need a new component" requests end at question 1 or 2.

Apply the tree **per element, not per screen**: decompose the design into its distinct UI elements and run each one
through the questions independently — a real screen almost always mixes `reuse`, a `variant`, and maybe one genuinely
new thing (see the audit table below, where four elements land on four different answers). Always cite the question
number in your justification: "byb-wrapper, because question 4" is checkable by a reviewer in seconds; an uncited
decision is not.

_Questions:_

### 1. Is the difference only colour, spacing, radius, typography, or standard size?

→ **Use an existing token utility.** (`bg-mint-45`, `text-heading-lg`, `p-section-md`, …)

- Never hard-code a hex value; never use arbitrary Tailwind values (`text-[#090034]`, `p-[13px]`).
- If the needed token doesn't exist, **add a token** (see "Adding a token" in `CLAUDE.md`) — that's a design decision
  mirrored from Figma, not a code workaround.
- **The trap this question catches** (the most common design-system mistake): a mockup shows a mint-coloured card, and
  without checking, someone builds `MintCard`. The right answer is `Card` + `bg-mint-l1` — zero new code, one card to
  maintain instead of two.

### 2. Does an existing component cover the UI role, but need a standard intent or state?

→ **Add a variant to the primitive** (extend its `cva` definition: e.g. `success`/`warning` intent, a new size).

- "Standard" means any product could plausibly want it. If only one BYB flow wants it, it's probably question 4.
- Check the component's existing variants first — in `registry.json` or its `cva` block.
- Example: the mockup shows a warning-coloured progress bar → extend `Progress` with a `warning` intent variant. Never
  clone the component to restyle it.

### 3. Is it a generic UI role that doesn't exist here yet?

→ **Create a new primitive.**

- This is the first point in the tree where new component code is justified (e.g. a star-rating control nothing else
  covers) — you are creating permanent maintenance surface, hence the conditions below.
- Scaffold with `npx shadcn@latest add <component>` when shadcn has it; customize after.
- Semantic tokens only (`bg-primary`, `text-muted-foreground`) — that's what keeps it re-themeable across
  website/backyard/Assist.
- One file in `src/components/ui/`, export from `src/index.ts`, story covering all variants.
- **Heavy external dependency?** (charting, maps, date engines) → it must ship behind its own subpath export with the
  dependency as an **optional peer** — never a top-level dependency the other 80% of consumers pay for. See the proposal
  §4.

### 4. Does it encode BYB business meaning — workflow, pricing, checkout, report logic, domain copy?

→ **Create a BYB domain component** that composes primitives.

- Litmus test: a mint-styled button is still a generic button (questions 1–2); a "calculate my savings" panel is not —
  business meaning is the only thing that lands an element here.
- It should contain the business meaning and delegate all "looks" to primitives and tokens.
- **The tree recurses into composition**: a BYB component is _built from_ answers to questions 1–3. If you find yourself
  re-implementing a button/card/dialog inside it, go back to questions 2/3 for that piece.
- **Domain component with an exotic heavy dependency** (e.g. a mapping library)? Prefer, in order: app-local
  (question 5) → optional peer + subpath → registry copy-in distribution → satellite package (last resort). See the
  proposal §4.

### 5. Is it used by one product, on one or two pages, and unlikely to repeat?

→ **It stays app-local, in the product's repo.** This is the humility check: even a legitimate, well-built component
should not enter the shared library without real reuse — premature promotion creates maintenance surface with no payoff.
It can be promoted later (see below) once real reuse appears.

> If none of the five questions produced a clear answer, stop and ask the designer / design-system maintainer — do not
> guess.

---

## Promotion criteria: app-local → design system

Promote a component out of a product repo into the design system only when **all** of these hold:

1. **Real or firmly planned use in 2+ surfaces** (a second product, or clearly recurring across the same product).
2. **No page-specific copy or data hard-coded** — content arrives via props.
3. **All styling via tokens** — no hexes, no arbitrary values, semantic tokens for anything reusable.
4. **Generic, documented API** — props make sense without knowing the originating page.
5. **A story exists** (or is written as part of promotion) covering all variants.
6. **Sign-off**: the designer approves the classification (primitive vs BYB domain); the design-system maintainer
   approves the addition.

The reverse move also exists: a design-system component that turns out to have a single consumer and keeps accreting
product-specific props should be **demoted** back to that app.

---

## Audit procedure (required before writing component code)

**For AI agents — in this repo or any consumer repo.** Before implementing any UI from a design (mockup, Figma frame,
Claude Design output, ticket description):

1. **Load the inventory**: read `registry.json` (consumers: `node_modules/@beforeyoubid/design-system/registry.json`).
   If absent, scan `src/components/` + `src/stories/`.
2. **Decompose the design** into its distinct UI elements.
3. **Classify every element** through the decision tree above.
4. **Emit the audit table and stop for approval** before writing component code:

| Element                         | Decision      | Justification                                                     |
| ------------------------------- | ------------- | ----------------------------------------------------------------- |
| Savings slider                  | `reuse`       | `Slider` primitive, registry entry `slider`                       |
| Amount badge with success state | `variant`     | `Badge` exists; needs `success` intent (question 2)               |
| Savings summary card            | `byb-wrapper` | Encodes savings copy + report logic (question 4); composes `Card` |
| Suburb picker map               | `app-local`   | Single product, heavy map dependency (questions 5 + 4-ladder)     |

Decisions: `reuse` | `variant` | `new-primitive` | `byb-wrapper` | `app-local`. Every row cites a registry entry or a
decision-tree question. A human (designer gate) approves the table before implementation proceeds.

---

## Anti-patterns (instant review rejections)

- A new component whose only difference from an existing one is styling → should be a token or variant (questions 1–2).
- Hex values or arbitrary Tailwind values anywhere.
- Brand primitives (`bg-mint-45`) inside a reusable component → use semantic tokens; primitives are for marketing
  surfaces.
- A "BYB" component containing no business meaning → it's a primitive (or nothing).
- A primitive containing business copy or workflow → split it: primitive + BYB wrapper.
- A per-product fork of an existing component → theming is done with tokens/themes, never forks.
- A heavy dependency added to top-level `dependencies` for a single component.

---

## Worked examples

- **A button that matches BYB colours** → generic. Colours come from tokens; variants cover primary/secondary.
  (Questions 1–2.)
- **A button that reads "Get a quote" and starts the quote flow** → the _button_ is still the primitive; the flow entry
  point is app code or a BYB wrapper if reused across surfaces.
- **Progress bar needing success/warning colours** → variants on the `Progress` primitive (question 2). A BYB wrapper
  only if it expresses a BYB workflow (e.g. report-completeness semantics — question 4).
- **Savings calculator** → `Slider`, `Card`, `Input`, `Button` primitives exist; the calculator (formula, report copy,
  CTA flow) is a BYB domain component (question 4).
- **Inspector service-area map** → one product, heavy map dependency → app-local (question 5); revisit via promotion
  criteria if a second surface needs it.
