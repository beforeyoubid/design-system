# Decision Framework: create vs reuse

Rules for deciding **where a UI need belongs** — a token, a variant, a new primitive, a BYB domain component, or code
that never enters the design system at all.

**Audience:** humans and AI agents, in this repo **and in consumer repos** (website, backyard, BYB Assist). If you are
an AI agent about to write any component code, follow the
[audit procedure](#audit-procedure-required-before-writing-component-code) below first.

Related: [`docs/byb-components/monorepo-proposal.md`](./byb-components/monorepo-proposal.md) (architecture) ·
`registry.json` (component inventory — if not yet present, scan `src/components/` and `src/stories/` instead).

---

## The layers

| Layer                     | What it is                                                                               | Where it lives                                             |
| ------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Tokens / themes**       | Brand facts: colours, typography, spacing, and per-product semantic mappings             | `globals.css` (`:root` + `@theme inline`), `src/tokens.ts` |
| **Primitives**            | Generic UI roles: Button, Card, Dialog, Slider… Variants via `cva`. No business meaning. | `src/components/ui/`                                       |
| **BYB domain components** | Encode BYB workflow, pricing, report logic, or domain copy. Compose primitives.          | `src/components/` (`BYB*`, field wrappers)                 |
| **App-local components**  | Single-product UI unlikely to repeat                                                     | The consuming app's repo — **not here**                    |

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
