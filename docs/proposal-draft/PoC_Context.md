# PoC Context.md

## Main discussion topics

### Goals

- Review our design system in this repo, If this report can be a single repo (monorepo) for a model report for building
  all components and deployment for future BYB front-end library
- We will be able to identify the workflow so we can use AI automation workflow to support building design components
- Define a clear structure of roles who will designer role and responsibility in terms of making a decision which
  component should be built as a reusable component or the one that can be utilized from the kissing component.
- A good documentation for AI agents to make a decision on using the AI to create a new component or re-use the existing
  one. That's also a meaning the cloud design should be able to utilize some sort of design system to integrate with
  their decision making process as well.
- Create a demo process from a BYB savings calculator showing potential report savings before purchase design =>
  identify the component building => AI automation workflow using multica.ai => component development => then Claude to
  perform website development
- A clear documentation on the separation between design system for premitive tokens, premitive component, design
  tokens, variants, BYB custom UI components. What are a decision making process to promote to be a resuable component.

### Claude Design + Claude Code workflow

- Explored how Claude Design artifacts can be handed off to Claude Code.
- Key idea: use Claude Design for mockups/prototypes, then use Claude Code to generate React components and app code.
- For best results, be explicit about framework, folder structure, component conventions, and what should be generated.
- Good use case: demonstrate AI-to-code automation for business stakeholders.
- We could use multica.ai which is the AI orchestration tools to create a pipeline for custom component development.

### Design-system

- In this repo, there seemed to be BYB components or a new component system that we utilise at CN and also tailwind for
  our website and backyard v3.
- This repo will become a single place of sort of truth for future component developments.

### shadcn/ui philosophy

- Discussed shadcn/ui as a source-code-first component system, not a traditional packaged UI library.
- Core philosophy:
  - You own the code.
  - Components are copied into your repo.
  - The system is AI-friendly and easy to customize.
- This makes it a good fit for Claude Code and design-to-code workflows.

### shadcn/ui usage and structure

- Clarified that shadcn components are typically added via CLI and then imported locally from the repo or workspace
  package.
- In a monorepo, shared UI components can live in a private `packages/ui` package.
- For a private company design system, use a monorepo rather than separate repos for every component.

### Tokens, primitives, and domain components

- Repeatedly clarified the layers:
  - Tokens / theme: global colors, spacing, radius, typography.
  - Primitives: Button, Input, Slider, Card, Progress, etc.
  - Domain / BYB-specific components: checkout flow, savings slider, report cards, report-specific progress.
  - Apps / pages: actual routes and screens composed from shared components.
- Important takeaway:
  - Styling alone does not make a component BYB-specific.
  - Business meaning, rules, workflow, or domain copy make it BYB-specific.

### Button / variant confusion

- Discussed primitive Button vs variant-based Button.
- Clarified that colors, sizes, and standard variants like primary/secondary are part of the primitive component system.
- A button remains generic if it is just a standard reusable UI control with variants.
- It becomes BYB-specific only when it carries business meaning or business logic.

### Progress component question

- Reviewed a Progress component built on Base UI.
- Conclusion:
  - The given component did not yet support built-in variants.
  - It can be extended with variant props if needed.
  - If the component needs only visual states, add variants to the primitive.
  - If it needs BYB-specific meaning or logic, create a BYB wrapper on top.

## Recommended architecture for BYB

- Use a private monorepo.
- Suggested packages:
  - `packages/tokens` for design tokens and theme values.
  - `packages/ui` for generic shadcn-style primitives.
  - `packages/byb-ui` for BYB-specific reusable wrappers and feature components.
  - `apps/web` or `apps/mockups` for actual screens and demos.
- Keep tokens global and shared across the platform.
- Let primitives consume tokens.
- Let BYB-specific components compose primitives.
- Let apps compose BYB components into real pages.

## Important mental model

- Primitive = what it is.
- Variant/semantic styling = how it looks and behaves in standard states.
- BYB-specific = what business meaning or workflow it represents.
- A component can be visually BYB-themed and still be generic if the styling comes from tokens.

## Good rules of thumb

- If the change is only color, radius, spacing, or standard size: use tokens or primitive variants.
- If the same UI role needs different intent states: add variants to the primitive.
- If it encodes BYB workflow, pricing, checkout, report logic, or specific copy: create a BYB-specific
  wrapper/component.
- Prefer reusing primitives before creating more specialized components.

## Useful examples mentioned

- Generic Button with shadcn-style variants.
- BYB wrapper Button if it needs business-specific labeling or logic.
- BYB savings calculator as a good demo POC.
- Progress bar primitive plus potential variants like success/warning.
- BYB-specific progress wrapper only if it expresses a BYB workflow.

## Overall direction

- The most practical setup is a token-driven, monorepo-based design system.
- Claude Design can create the mockup; Claude Code can generate the React implementation.
- shadcn/ui primitives are a strong base for building a private company library with reusable BYB components.

Ref:

- https://www.linkedin.com/pulse/from-styled-components-shadcn-ui-how-we-standardized-our-mattos-05yrf/
- https://shadisbaih.medium.com/building-a-scalable-design-system-with-shadcn-ui-tailwind-css-and-design-tokens-031474b03690
