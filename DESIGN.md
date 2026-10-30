# BYB Design System

> Design spec for `@beforeyoubid/design-system`.
> Source of truth is the code: `globals.css`, `utilities.css` and `src/components` (`src/tokens.ts` is generated from the CSS). When this file and the code disagree, the code wins. Update this file in the same PR.
> Stack: Tailwind CSS v4 + shadcn/ui on Base UI. Font: Plus Jakarta Sans. Icons: Tabler (primary), Lucide (secondary).
> Related Confluence (ER space): Typography · Product Badges · Responsive Breakpoints.

---

## Contents

1. [Principles](#principles)
2. [Colour](#colour)
3. [Typography](#typography)
4. [Spacing and layout](#spacing-and-layout)
5. [Breakpoints and grid](#breakpoints-and-grid)
6. [Radius](#radius)
7. [Elevation](#elevation)
8. [Motion](#motion)
9. [Iconography](#iconography)
10. [Components](#components)
11. [Component tokens (levers)](#component-tokens-levers)
12. [Accessibility](#accessibility)
13. [Rules for designers and engineers](#rules-for-designers-and-engineers)
14. [Tokens in JS](#tokens-in-js)
15. [Upgrading from 1.1.x](#upgrading-from-11x)

---

## Principles

Before You Buy helps people make property decisions: reports, inspections, contracts, prices. The UI is document-heavy and decision-critical, so it should feel **calm, direct and trustworthy**.

- **Clarity over decoration.** Flat surfaces, light borders, soft shadows only where something floats.
- **One loud thing per screen.** Lime is the primary call to action. Use it once per view.
- **Mint is the brand.** Mint carries selection, focus, progress and success.
- **Navy anchors.** Headings and key text use navy; body text uses the dark neutrals.
- **Tokens only.** Every colour, size and radius comes from a token. No hex values, no arbitrary values.

**Voice:** clear, direct, sentence case. Buttons are short imperatives ("Get a quote", "Upload", "Save").
**Casing:** sentence case for headings and body. Buttons, overlines and tab labels are UPPERCASE (baked into the type tokens).

---

## Colour

Colours are defined in OKLCH in `globals.css` with the hex alongside. Two layers:

1. **Primitives**: the exact Figma palette. Use only where no semantic role fits (a marketing illustration, a product badge).
2. **Semantic**: shadcn roles (`primary`, `muted`, `border`, …). Prefer them everywhere, in components and in apps, so an app can retheme a role in one place.

Utility pattern: `bg-{token}`, `text-{token}`, `border-{token}`, `ring-{token}`, `fill-{token}`, `stroke-{token}`.

### Brand

| Token | Hex | RGB | Use |
|---|---|---|---|
| `mint-45` | `#00AE95` | 0, 174, 149 | **Brand colour.** Focus rings, active states, indicators |
| `navy` | `#090034` | 9, 0, 52 | Headings, key text, text on lime |
| `lime` | `#D4F269` | 212, 242, 105 | Key accents, `lime` button |
| `electric-blue` | `#015AFF` | 1, 90, 255 | Accent, charts |
| `teal` | `#35BDB2` | 53, 189, 178 | Accent, charts |
| `electric-blue-l1` | `#E6EEFF` | | Pill / badge tint |
| `teal-l1` | `#BFE8E6` | | Pill / badge tint |
| `lime-l1` | `#EAF8B0` | | Pill / badge tint |

### Mint scale (dark → light)

| Token | Hex | Typical use |
|---|---|---|
| `mint-90` | `#005246` | Text on mint tints |
| `mint-75` | `#007A69` | Secondary button, links |
| `mint-60` | `#009E87` | Tab indicator, active step |
| `mint-45` | `#00AE95` | Brand, focus, segmented active tab |
| `mint-30` | `#4FC3AE` | Hover on mint-75 |
| `mint-15` | `#6BCCBB` | |
| `mint-l1` | `#ABE2D8` | Badge border |
| `mint-l2` | `#D2EFEA` | Badge fill, completed step |
| `mint-l3` | `#E1F5F1` | Selected row, accent surface, icon circle |
| `mint-l4` | `#F4FBFA` | Row hover, info alert |

### Neutrals

| Dark | Hex | Use | | Light | Hex | Use |
|---|---|---|---|---|---|---|
| `dark-100` | `#16181D` | Default text, overlays | | `light-l1` | `#F9FAFB` | Muted surface, table header |
| `dark-90` | `#444A5A` | Body text, sub-headings, placeholders | | `light-l2` | `#F2F4F7` | Disabled fill, segmented track |
| `dark-75` | `#656E85` | Secondary text via `muted-foreground`, hints, icons (not sub-headings) | | `light-l3` | `#EAECF0` | Dividers on white |
| `dark-60` | `#858EA3` | Not used for text or icons (too light: 3.3:1 on white); use `dark-75` | | `light-sandy` | `#F8F3EE` | Warm marketing surface |
| `dark-45` | `#A5ABBB` | Form control borders (inputs, select, date picker, checkbox, radio, choice cards), disabled text, tertiary hover | | `white` | `#FFFFFF` | Page and card background |
| `dark-30` | `#C2C6D1` | | | | | |
| `dark-15` | `#DFE1E7` | Borders on cards and non-form surfaces | | | | |

### Status

| Scale | Tokens |
|---|---|
| Success | `success-90` `#0D492E` · `-75` `#15754A` · `-60` `#1C9B62` · `-45` `#22B976` · `-30` `#34DA90` · `-15` `#9CEDC9` · `-l1` `#E9FBF3` |
| Error | `error-90` `#7C1A12` · `-75` `#BF271C` · `-60` `#E5584D` · `-45` `#ED8A83` · `-30` `#F3AFAB` · `-15` `#F8D5D3` · `-l1` `#FDF2F2` · `-l2` `#FEFBFB` |
| Warning | `warning-75` `#906809` · `-60` `#B68205` · `-45` `#D49702` · `-30` `#FDB402` · `-15` `#FED776` · `-l1` `#FEEDC1` · `-l2` `#FEF5DC` · `-l3` `#FFF9EB` |

Status pattern: **tint fill (`-l1`/`-l2`/`-l3`) + light border (`-15`) + strong text (`-75`)**.

### Category palette (data-viz + product badges)

35 colours, `category-01` … `category-35`. Every one carries **white text at WCAG AA (≥ 4.5:1)**; keep it that way when adding more.

| # | Hex | # | Hex | # | Hex | # | Hex | # | Hex |
|---|---|---|---|---|---|---|---|---|---|
| 01 | `#068091` | 08 | `#880E4F` | 15 | `#555555` | 22 | `#827717` | 29 | `#065F46` |
| 02 | `#026772` | 09 | `#E4145F` | 16 | `#262323` | 23 | `#8A6100` | 30 | `#4A148C` |
| 03 | `#037DAE` | 10 | `#7B1FA2` | 17 | `#2E7D32` | 24 | `#B91C1C` | 31 | `#9F1239` |
| 04 | `#016299` | 11 | `#8C4FF5` | 18 | `#C2410C` | 25 | `#1565C0` | 32 | `#A21CAF` |
| 05 | `#4E342E` | 12 | `#673AB7` | 19 | `#303F9F` | 26 | `#AD1457` | 33 | `#004D40` |
| 06 | `#6D4C41` | 13 | `#757575` | 20 | `#00796B` | 27 | `#37474F` | 34 | `#546E7A` |
| 07 | `#3D0C11` | 14 | `#616161` | 21 | `#33691E` | 28 | `#9A3412` | 35 | `#5C6BC0` |

01–19 are assigned to products; 20–35 are unassigned placeholders.

### Product badges

Each product has a badge token that aliases a category colour. Mapping is owned by the Confluence **Product Badges** page.

| Token | Category | Product |
|---|---|---|
| `badge-product-bpi` | 01 | Building & Pest Inspection |
| `badge-product-building-inspection` | 02 | Building Inspection |
| `badge-product-pest-inspection` | 03 | Pest Inspection |
| `badge-product-strata-report` | 04 | Strata Inspection |
| `badge-product-owners-corp-cert` | 05 | Owners Corporation Certificate (VIC) |
| `badge-product-pool-inspection` | 06 | Pool Inspection |
| `badge-product-electrical-report` | 07 | Electrical Inspection |
| `badge-product-electrical-safety-cert` | 08 | Electrical Safety Certificate |
| `badge-product-plumbing-report` | 09 | Plumbing Inspection |
| `badge-product-handover-inspection` | 10 | Handover Inspection |
| `badge-product-valuations` | 11 | Valuations |
| `badge-product-asbestos-testing` | 12 | Asbestos Testing |
| `badge-product-dilapidation-report` | 13 | Dilapidation Report |
| `badge-product-depreciation-schedule` | 14 | Depreciation Schedule |
| `badge-product-owner-builder-report` | 15 | Owner Builder Report |
| `badge-product-minimum-standards` | 16 | Minimum Standards |
| `badge-product-new-building-inspection` | 17 | New Build Inspection |
| `badge-product-home-energy-rating` | 18 | Home Energy Rating |
| `badge-product-bmc` | 19 | BMC (Building Management Committee) |

```tsx
<Badge product="electrical-report">Electrical Inspection</Badge>   // component
<span className="badge-product-electrical-report">…</span>         // plain class: fill + white text, always shipped
<div className="border-badge-product-bpi text-badge-product-bpi">  // colour only: bg- / text- / border-
```

Charts use `chart-1…5` first (mint-45, teal, electric-blue, warning-30, error-60), then the category palette.

### Transparency

No separate tokens; use opacity modifiers.

| Figma | Utility |
|---|---|
| Transparent/Overlay-95% | `bg-dark-100/95` |
| Transparent/Overlay-50% (modal backdrop) | `bg-dark-100/50` |
| Transparent/Button-B | `bg-dark-30/80` |
| Transparent/Button-A | `bg-light-l2/80` |

### Semantic tokens

| Slot | Light | Dark |
|---|---|---|
| `background` / `foreground` | white / dark-100 | dark-100 / light-l1 |
| `card`, `popover` | white | dark-90 |
| `primary` / `-foreground` | mint-45 / navy | mint-30 / dark-100 |
| `secondary` | light-l2 | dark-90 |
| `muted` / `-foreground` | light-l1 / dark-75 | dark-90 / dark-45 |
| `accent` / `-foreground` | mint-l3 / mint-90 | mint-90 / mint-l2 |
| `destructive` | error-75 | error-45 |
| `success` / `-foreground` | mint-15 / mint-90 | success-30 / dark-100 |
| `warning` | warning-45 | warning-30 |
| `border` | dark-15 | dark-90 |
| `input` | dark-45 | dark-90 |
| `ring` | mint-45 | mint-30 |
| `sidebar-*` | light-l1 surface, mint-45 primary, mint-l3 accent | dark-90 surface, mint-30 primary |

Every error and destructive colour reads `destructive`: error text, invalid borders and rings, destructive buttons, menu items, badges, alerts and toasts. Use `text-destructive`, `border-destructive` and so on rather than `error-75`, so the error red changes in one place.

`globals.css` keeps shadcn's `.dark` values, but BYB apps have no dark mode: don't write `dark:` classes, and component tokens have no dark values.

---

## Typography

**Font:** Plus Jakarta Sans, loaded by the app (e.g. `next/font/google`). Stack: `"Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.

### Naming

Every style is **`{role}-{step}`**, and **1 is always the largest**. Headings use H1–H6 because that's how the team already talks about them. Use these for all product type. Tailwind's own `text-xs`…`text-9xl` still exist underneath, but don't use them for designed text. For a different weight, add `font-medium` / `font-semibold`; there is no weight scale.

**Style names are not tags.** Pick the HTML tag for document structure (one `<h1>` per page, no skipped levels) and the class for looks: `<h2 className="text-h1">` is correct.

| Class | Size | Line height | Weight | Extras | Use |
|---|---|---|---|---|---|
| `text-display-1` | 72px | 1.05 | 600 | -0.005em | Primary KPI on a dashboard/summary, one per screen |
| `text-display-2` | 64px | 1.06 | 600 | -0.005em | Welcome, onboarding and confirmation screen titles |
| `text-display-3` | 56px | 1.08 | 600 | -0.005em | Stat card numbers in a summary row |
| `text-display-4` | 52px | 1.2 | 600 | -0.005em | Secondary KPI / numeric values in detail panels |
| `text-h1` | 40px | 1.2 | 600 | -0.005em | Page / screen title, one per screen |
| `text-h2` | 36px | 1.2 | 600 | -0.005em | Major section |
| `text-h3` | 28px | 1.2 | 600 | -0.005em | Sub-section, card group title |
| `text-h4` | 24px | 1.2 | 600 | -0.005em | Card, modal, drawer title |
| `text-h5` | 20px | 1.3 | 600 | -0.005em | Small card / panel header |
| `text-h6` | 18px | 1.3 | 600 | -0.005em | Form section, list group, dense UI |
| `text-body-1` | 24px | 1.4 | 400 | | Intro text on welcome / onboarding screens |
| `text-body-2` | 20px | 1.4 | 400 | | Short intro under a page title, summaries |
| `text-body-3` | 18px | 1.4 | 400 | | Long-form reading: report content, help docs |
| `text-body-4` | 16px | 1.4 | 400 | | **Default body**, app UI copy |
| `text-body-5` | 14px | 1.4 | 400 | | Tables, forms, menus, helper text |
| `text-caption-1` | 12px | 1.4 | 400 | | Captions, meta, timestamps |
| `text-caption-2` | 10px | 1.4 | 400 | | Badges, chart axes, fine print |
| `text-caption-3` | 8px | 1.4 | 400 | | Under review, avoid (not readable) |
| `text-overline` | 12px | 1.4 | 600 | 0.04em, UPPERCASE | Eyebrows, table headers, stat labels |
| `text-button-lg` | 18px | 1.3 | 600 | 0.04em, UPPERCASE | Large CTAs outside the Button component |
| `text-button-md` | 16px | 1.3 | 600 | 0.04em, UPPERCASE | Button `size="lg"` label |
| `text-button-sm` | 14px | 1.3 | 600 | 0.04em, UPPERCASE | Button `size="sm"` and `size="md"` labels (default) |

JS (non-CSS contexts only, e.g. canvas or Stripe): `generateDesignSystemTokens().typography.h1`. See [Tokens in JS](#tokens-in-js).

**Responsive:** step headings down on mobile, e.g. `text-h3 md:text-h1`.

**Colour:** headings `text-navy`; **sub-headings `text-dark-90`**: overlines, group and section labels, column labels (e.g. "INSPECTION TYPE", "Switch inspection type", Select group labels, the time picker's "HR / MIN"), never `dark-60` or `dark-75`; body `text-dark-90`; descriptions and secondary text `text-muted-foreground` (`dark-75`, unchanged); hints, helper text and icons `text-dark-75`. Don't use `dark-60` for text or icons.

**Upgrading from 1.1.x:** the old names (`text-heading-lg`, `text-medium-4xl`, `text-body-md`, the 10px `text-xs`, …) are gone. Run the migrator (see [Upgrading](#upgrading-from-11x)); it maps each one to its role + step class.

---

## Spacing and layout

Spacing follows Tailwind's 4px scale (`p-1` = 4px, `p-4` = 16px, `gap-6` = 24px). Section and container tokens:

| Token | Value | Use |
|---|---|---|
| `p-section-sm` / `py-section-sm` | 48px | Compact section padding |
| `p-section-md` | 80px | Default section padding |
| `p-section-lg` | 120px | Large page sections / feature areas |
| `max-w-site` | 1280px | **Always** the content container width |

Common component rhythm: card padding 24px (16px for `size="sm"`), form field height 40px, table cell padding 12px horizontal.

---

## Breakpoints and grid

Use Tailwind's standard prefixes `sm:`, `md:`, `lg:`, `xl:` and `2xl:`. Values follow the Confluence **Responsive Breakpoints** page.

Mobile-first: unprefixed classes are the mobile styles, and each prefix applies **from that width up**, so a value carries to bigger screens until a larger prefix overrides it.

| Tier | Width | Prefix | Device | Layout |
|---|---|---|---|---|
| Mobile | < 768px | *(none)*: base styles | Phones | Single column, adjusted spacing |
| Tablet | 768–1023px | `md:` (≥ 768px) | Tablets | Multi-column, card-based |
| Desktop | 1024–1279px | `lg:` (≥ 1024px) | Small laptops, desktops | Full layouts, side navigation |
| Laptop | 1280–1439px | `xl:` (≥ 1280px) | Most laptops | Full layouts (the website's main desktop layout) |
| Large | ≥ 1440px | `2xl:` (≥ 1440px) | Large screens; the 1440px Figma desktop frame | Max content width, extra assets |

- `xl:` stays at Tailwind's default 1280px; the website relies on it in 300+ places.
- `2xl:` is moved from Tailwind's 1536px to **1440px** to match the Figma desktop frame, so the 1440px layout has its own prefix.
- `sm:` (≥ 640px) is available for large phones, between the mobile base and `md:`. Our "SM" mobile tier is the **unprefixed** base, not `sm:`.
- One range only: `max-md:` (mobile), `md:max-lg:` (tablet), `lg:max-xl:` (desktop), `xl:max-2xl:` (1280–1439px laptops).

```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">…</div>
<nav className="hidden lg:flex">…</nav>              // desktop and up
<div className="lg:hidden">…</div>                   // mobile + tablet
<aside className="max-md:hidden">…</aside>           // tablet and up
<div className="hidden md:max-lg:block">…</div>       // tablet only
<aside className="hidden 2xl:block">…</aside>         // 1440px and up only
```

**Design grid (Figma frames)**

| Frame | Device | Columns | Margin | Gutter |
|---|---|---|---|---|
| 390px | Mobile | 4 | 16px (`px-4`) | 16px (`gap-4`) |
| 968px | Tablet | 8 | 24px (`px-6`) | 16px (`gap-4`) |
| 1440px | Desktop | 12 | 64px (`px-16`) | 20px (`gap-5`) |

Page container: `mx-auto w-full max-w-site px-4 md:px-6 lg:px-16`. Grid: `grid-cols-4 gap-4 md:grid-cols-8 lg:grid-cols-12 lg:gap-5`. Touch targets ≥ 48px on mobile.

---

## Radius

| Token | Value | Use |
|---|---|---|
| `rounded-sm` | 4px | Menubar trigger, small chips |
| `rounded-md` | 8px | **Component default** (`--radius`), menu items, segmented tab |
| `rounded-lg` | 12px | Cards, inputs, small buttons, menus/popovers, tables (card/bordered) |
| `rounded-xl` | 16px | Default and large buttons, tooltip, tab panel |
| `rounded-2xl` | 20px | Alerts, toasts, popovers, alert dialogs, drawers, skeletons, sidebar inset |
| `rounded-3xl` | 24px | Dialogs |
| `rounded-4xl` | 32px | |
| `rounded-full` | 9999px | Pills, badges, avatars, icon buttons, pill tabs |

The scale runs in order: 4, 8, 12, 16, 20, 24, 32px. **Upgrading:** `rounded-xl` and `rounded-2xl` used to be swapped (xl was 20px, 2xl 16px). Every library component was updated so nothing changed on screen; the migrator swaps app code the same way (including side variants like `rounded-t-xl`) and maps the removed `rounded-btn` to `rounded-xl`.

---

## Elevation

Shadows currently use Tailwind defaults. Keep them subtle.

| Utility | Use |
|---|---|
| `shadow-xs` | Cards, buttons, tab panel, segmented indicator |
| `shadow-md` | Dropdowns, menus, select, command, hover card |
| `shadow-lg` | Popovers, sheets, dialogs, context menus |
| `shadow-xl` / `shadow-2xl` | Large overlays (use sparingly) |

Proposed (not yet tokens): `shadow-raised`, `shadow-overlay`, `shadow-modal`.

---

## Motion

| Token | Value | Use |
|---|---|---|
| `ease-snappy` | `cubic-bezier(0.32, 0.72, 0, 1)` | Sliding indicators, panels, navigation menu |
| `animate-tab-in-left/right` | 0.3s ease-snappy, slide 0.5rem | Tab panel change |
| `animate-fade-in` | 0.25s ease-out, rise 6px | Content reveal |
| `animate-accordion-down/up` | 0.2s ease-out | Accordion |
| `animate-marquee` | 35s linear infinite | Logo strips (`animate-marquee-paused` on hover) |

Durations: 100–150ms for colour/hover, 200–300ms for movement, 350ms max for large surfaces. Animate `transform` and `opacity`, not layout. Respect `motion-reduce`.

---

## Iconography

- **Tabler** (`@beforeyoubid/design-system/icons`) is the primary set, used inside components.
- **Lucide** (`@beforeyoubid/design-system/icons/lucide`) is available as a secondary set.
- Icons ship on subpaths (not the main barrel) for tree-shaking, and are server-component safe.
- Icons are stroke-based and use `currentColor`; colour them with text tokens (`text-navy`, `text-mint-75`).
- Default sizes: 16px (`size-4`) in buttons and inputs, 12px in badges and xs buttons, 20px in empty states and modal close.
- Don't install Tabler or Lucide directly in apps; import from the design system.

---

## Components

All components live in `@beforeyoubid/design-system`. Variants use `cva`; class merging uses `cn()`.

### Button

Base: semibold, UPPERCASE, 0.04em tracking, focus ring `ring-2 ring-navy ring-offset-2`, 1px press nudge.

| Variant | Default | Hover | Use |
|---|---|---|---|
| `primary` | `bg-primary` (mint-45) `text-primary-foreground` (navy) `shadow-xs` | `bg-primary/80` | **Main CTA**, one per view |
| `secondary` | `bg-white border-navy text-navy` | `bg-navy text-white` | Secondary action |
| `tertiary` | `bg-white border-dark-15 text-dark-90` | `bg-dark-45 text-dark-100` | Neutral / cancel |
| `ghost` | `text-mint-75` | `text-mint-45` | Low emphasis |
| `destructive` | `bg-destructive text-white` | `bg-error-45` | Delete, irreversible |
| `link` | `text-mint-75` | underline | Inline action |

Use `primary`, `secondary` and `tertiary` where they fit. These 1.x variants stay so existing screens don't change, and are there when a design needs them:

| Variant | Same as / look | Use |
|---|---|---|
| `default` | alias of `primary` | shadcn's name for the main button |
| `outline-navy` | alias of `secondary` | |
| `outline` | `bg-input/30 border-border` | shadcn outline |
| `lime` | `bg-lime text-navy` | Lime brand CTA |
| `navy` | `bg-navy text-white` | Order and pricing CTAs on navy-led marketing layouts |

Disabled (filled variants): `bg-light-l2 text-dark-45`.

| Size | Height | Radius | Text |
|---|---|---|---|
| `xs` | 28px | 8px | `text-caption-2` |
| `sm` | 36px | 12px | `text-button-sm` |
| `md` (default; `default` is an alias) | 40px | 16px | `text-button-sm` |
| `lg` | 44px | 16px | `text-button-md` |
| `icon-xs/sm/icon/lg` | 28 / 36 / 40 / 44px | full | |

Props: `loading` (spinner + `aria-busy`), `icon`, `iconPosition` (`left` / `right`), `render` for links.

### Badge

Pill, semibold. Sizes `sm` / `md` (default, 20px, `text-caption-2`) / `lg` (28px, **14px** `text-body-5`, 16px icon). `appearance`: `tint` (default, light fill + border) or `solid` (full tone colour, e.g. status pills). `icon` + `iconPosition` (`left` default / `right`) add a Lucide icon; `spinner` shows a loading spinner. No status dot.

| Variant | Fill / border / text |
|---|---|
| `gray` (default) | light-l2 / dark-15 / dark-75 |
| `mint` | mint-l2 / mint-l1 / mint-90 |
| `lime` | lime / lime / navy |
| `success` | mint-l3 / mint-l1 / mint-75 |
| `error` | error-l1 / error-15 / error-75 |
| `warning` | warning-l3 / warning-l1 / warning-75 |
| `electric-blue` | electric-blue-l1 / electric-blue-l1 / electric-blue |

Solid (`appearance="solid"`): gray dark-75 + white · mint mint-75 + white · lime lime + navy · success mint-75 + white · error error-75 + white · warning warning-30 + navy · electric-blue electric-blue + white. Example: `<Badge size="lg" appearance="solid" variant="warning" icon={<Clock />}>Awaiting authority</Badge>`.

`category={1…35}`: solid badge in the category palette, white text (md: 24px, `text-body-5` medium). Follows `size`.
`product="electrical-report"` (any product badge name): same solid style in the product's colour. Overrides `category`.

### Form controls (Input, Textarea, InputGroup, Select)

- 40px tall, `rounded-lg`, `border-dark-45`, white fill, `text-body-5 text-dark-100`, placeholder `dark-90`.
- Every input fills its container: Input, Textarea, InputGroup, Select, NativeSelect, Combobox, TimePicker and FileUpload are `w-full`. The layout around them (a grid column, a `max-w-*` wrapper) sets the width. InputOTP is the exception: its digit boxes are a fixed size.
- Yes/no props are off by default and named for the behaviour they add (`clearable`, `multiple`, `overlapping`), so turning one on is passing it.
- Focus: `border-mint-45` + `ring-3 ring-mint-45/30`.
- Invalid (`aria-invalid`): `border-destructive`, red ring on focus.
- Disabled: `bg-light-l2 text-dark-45`. Its label dims to 50% with it (`--field-label-disabled-opacity`), and so does a file upload's hint.
- Label, hint and error come from `Field`, `FieldLabel`, `FieldDescription` and `FieldError`; `FieldLabel required` adds a mint asterisk. Groups of fields use `FieldSet` with `FieldLegend` and a `FieldGroup`, with a `FieldSeparator` between sections. Apps build forms with `@beforeyoubid/form`, whose `InputField`, `SelectField` and `DateField` compose these parts.
- `Select` rows take `meta` (right side of the row, e.g. a count or `<ColorDot />`); on single-select rows a `meta` replaces the trailing check and the mint row fill marks the selection. `SelectTrigger onClear={…}` shows an × beside the chevron (`IconX`, `dark-75`, hover `dark-100`, no background; pass it only while something is selected), and `SelectChip` / `SelectChipOverflow` ("+N") render selected values in the field. Multi-select lists end with an "N selected · CLEAR" footer (`SelectFooter`); CLEAR is `text-overline` (uppercase) in `mint-75`, hover `mint-90`.
- `TimePicker` has a 40px trigger and scrollable hour / minute columns: 24-hour (no AM/PM), selected value in lime like the calendar's selected day; columns scroll without a visible scrollbar (`no-scrollbar`). `formatDateDMY` shows a date as DD/MM/YYYY.
- Resting border `dark-45` on every form control and menu: Input, Textarea, InputGroup, InputOTP, Select trigger (its options panel keeps `light-l3`), DatePicker / TimePicker trigger and panel, Checkbox and Radio boxes, and checkbox / radio choice cards. DropdownMenu keeps the lighter `dark-15` on its panel, card trigger, card items and checkbox-item boxes, with `mint-45` on a highlighted card item. Checkbox ticks are navy. Select trigger hover `dark-75`. Focus, open, checked and invalid states keep mint-45 / error-75.
- Checkbox, Radio, Switch: mint-checked; `RadioGroup` sizes `sm` / `md` / `lg`; labels `text-body-5 font-semibold text-navy`, descriptions `text-dark-75`.

### Card

`rounded-lg border-border bg-card shadow-xs`, padding 24px (`size="sm"`: 16px). Title `text-body-4 font-medium`, description `text-body-5 text-muted-foreground`. Parts: `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`, `CardIcon`. `<CardHeader icon={<FileText />} iconVariant="navy">` adds an `IconTile` above the title.

### IconTile

Lucide icon on a tinted tile; used by Card, Dialog and the product dropdown. `EmptyMedia variant="icon"` draws the same mint circle.

| Prop | Options |
|---|---|
| `variant` | `mint` (mint-l3 / mint-75), `navy` (navy / white), `lime` (lime / navy), `warning` (warning-l2 / warning-75), `error` (error-l1 / error-75), `neutral` (light-l2 / navy) |
| `size` | `sm` 32px (16px icon), `md` 40px (20px), `lg` 48px (24px) |
| `shape` | `circle` (default), `square` (`rounded-lg`) |

Product icons, names and badge colours come from `productBadges` (`src/lib/product-badges.ts`).

### Tabs

| Variant | Look |
|---|---|
| `pill` (default) | White track with `dark-15` border, sliding `mint-60` pill, active text white |
| `line` | Underline row, 3px `mint-60` indicator, inactive `dark-100` → hover `dark-75`, active `navy` (same in vertical) |
| `segmented` | `light-l2` track, sliding `mint-45` segment, active text white |

All triggers: `text-body-5 font-semibold tracking-button uppercase`. Indicator slides with `ease-snappy` 300ms; panels slide 0.5rem. `TabsContent panel` gives a `rounded-xl` bordered panel. Supports vertical orientation.

### Table

Headers use `text-overline text-dark-100`; sortable headers (`sortable`, `sortDirection`, `onSort`) show Lucide arrows in `dark-75` and set `aria-sort`; cells `text-body-5 text-dark-90`; rows hover `mint-l4`, selected `mint-l3`.

| Prop | Options |
|---|---|
| `variant` | `default` (row dividers), `card` (rounded-lg frame + shadow-xs, light-l1 header), `striped` (zebra rows), `bordered` (frame + column lines) |
| `size` | `sm` (head 36px, cell py 8), `md` (44 / 12), `lg` (48 / 16) |

`TableEmpty` renders an `Empty` across all columns; compose it with `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription` and `EmptyContent`. `TableCaption` displays below the frame. Selectable rows: whole row is clickable. `TableExpandableRow` reveals a detail row and the whole row is clickable (clicks on buttons, links and menu items inside it don't toggle it). The chevron sits in a trailing **Controls** column (`<TableControlsHead />`) together with `controls`, e.g. a ⋮ `DropdownMenuIconTrigger` menu. `TableViewMore` reveals rows beyond an initial count.

### Overlays

| Component | Notes |
|---|---|
| `Dialog` / `AlertDialog` | Backdrop `bg-dark-100/50`, white panel, actions right-aligned. One layout: 24px radius, × close, header / content / actions separated by spacing (no divider lines), and a scrolling `DialogBody` for long content whose top and bottom edges fade only while there is more to scroll to (shadcn's `scroll-fade-y` utility, sized to 24px with `scroll-fade-6`). All dialog content is left-aligned. `DialogHeader icon iconVariant` adds a 40px `IconTile` on the left, in one row with the title (12px gap, vertically centred); the description wraps below at full width, starting under the icon (also when it is passed inside `DialogHeader`), and actions stay right-aligned. `DialogContent` `size` `sm` / `md` / `lg` / `xl`. `DialogCollapsible` (`view-more` or `dropdown`). `ConfirmDialog` replaces the old `Modal` (cancel / action, `destructive`). Title `text-navy`; the description / sub-heading under it (`DialogDescription`) is `text-body-5 text-dark-90`. |
| `Sheet` / `Drawer` | Edge panels for secondary flows |
| `Popover`, `HoverCard` | `rounded-lg`, floating shadow (`shadow-md` / `shadow-lg`) |
| `Tooltip` | Navy bubble, white `text-body-4`, `rounded-xl`, navy arrow, above the trigger on hover |
| `DropdownMenu`, `ContextMenu`, `Menubar`, `Command` | Panel `rounded-lg`, items `rounded-md`, hover `accent`. Dropdown checkbox items match Select; radio items show the selection with a mint fill (no check mark). `DropdownMenuProductItem` gives a 54px product row with the colour dot on the right. `DropdownMenuIconTrigger` is an icon-only trigger (no button styling): `icon` = `kebab` ⋮ (default), `meatball` ⋯, `chevron`, `settings` or any element; `variant` mint / dark / navy; `size` sm / md / lg; always pass `label`. `DropdownMenuCardTrigger` / `DropdownMenuCardGrid` / `DropdownMenuCardItem` and `ProductSwitcher` give the card-grid picker. |

### Feedback

| Component | Variants |
|---|---|
| `Alert` | `default`, `info` (mint-l4), `success`, `warning`, `destructive`; `rounded-2xl`, tint fill + `-15` border + `-75` text |
| `Toaster` + `toast` (Base UI) | See **Toasts** below |
| `Empty` (shadcn) | `default`, `outline` (dashed border), `muted`; `EmptyMedia variant="icon"` mint circle, navy `EmptyTitle`, `EmptyContent` for actions |
| `Progress`, `Spinner` | Loading states |
| `Skeleton` | `light-l2` fill with a white shimmer sweep (`animate-shimmer`); static when reduced motion is on |

### Toasts

Short, non-blocking feedback after an action. shadcn's `toast` on Base UI's Toast (no Sonner). Mount `<Toaster />` once in the app root, then call `toast.add({ type, title, description, actionProps })`. `toast.promise`, `toast.update` and `toast.close` are also available (see **In-progress toasts** below).

```tsx
toast.add({
  type: 'success',
  title: 'File deleted',
  description: 'Contract of sale.pdf was removed.',
  actionProps: { children: 'Undo', onClick: restoreFile },
})
```

| `type` | Fill | Title, icon, ×, action link | Use for |
|---|---|---|---|
| `success` | `mint-l3` | `mint-75`, check | A completed action: "Inspection booked" |
| `info` | `mint-l4` | `mint-75`, "i" | Neutral updates: "Report is being prepared" |
| `warning` | `warning-l3` | `warning-75`, exclamation mark | Needs attention but nothing failed: "Please check your conditions" |
| `error` | `error-l1` | `destructive`, × | Something failed or is blocked: "You are not verified" |
| none (default) | `light-l2` | `navy`, bell | General notices that aren't success, warning or error: "Settings saved" |

Anatomy (the original BYB Toast): flat, 20px radius (`rounded-2xl`), 8px / 12px padding; 32px white circle with a type-coloured border holding the Tabler icon; title `text-body-5` semibold in the type colour; description `text-body-5 text-dark-90`; optional action as an underlined text link in the type colour, right after the description ("Undo"). Clicking the action closes the toast unless its `onClick` calls `event.preventDefault()`. × top-right in the type colour.

**In-progress toasts (`toast.promise`, `type: 'loading'`)**

One toast follows the action from start to finish. It is never navy.

| Stage | Look |
|---|---|
| Pending | Spinner in the icon circle, coloured by `data.pendingType`: `error` red for deleting / removing, `warning` amber for risky changes, `info` light mint (default) for everything else. Stays until the promise settles. |
| Success | Same toast turns **green** (`success`), auto-dismisses after 5s |
| Error | Same toast turns **red** (`error`), stays until closed |

A string stage is the toast title; pass an object for a description.

```tsx
toast.promise(deleteReport(id), {
  loading: { title: 'Deleting report…', data: { pendingType: 'error' } },
  success: 'Report deleted',
  error: "Couldn't delete the report",
})
```

**Placement**

| Screen | Position |
|---|---|
| Desktop (≥ 768px) | Bottom-right, 440px wide, 24px from the edges |
| Mobile (< 768px) | Bottom, full width (16px side margins below 640px, 24px from 640–767px) |

New toasts stack on top; hovering the stack expands it.

**When it disappears**

| `type` | Auto-dismiss |
|---|---|
| `success` | 5 seconds |
| `warning` | 8 seconds |
| `error` | Never: stays until the user closes it |
| `info`, default | 5 seconds |

Every toast has a × so it can be closed early. Override per toast with `timeout` (ms, `0` = stays) only when the user needs longer to read or act, e.g. a toast with an Undo action. Don't put the only path to an action inside a toast; it may disappear before the user acts.

### Navigation and structure

`Stepper` (sizes `sm/md/lg/dot`; statuses active mint-60 with ring and navy number, complete mint-l2 with mint-90 tick, upcoming white with 2px navy border and navy number, error error-75; title `text-body-4 font-semibold text-navy` (`text-body-5` at sm), description `text-body-5 text-dark-90`) · `Breadcrumb` · `Pagination` · `NavigationMenu` · `Sidebar` · `Accordion` (`size` `sm` / `md` / `lg`) · `Collapsible` · `Separator` · `ScrollArea` · `Resizable` · `AspectRatio` · `Carousel`.

### Data and media

`BYBAreaChart`, `BYBBarChart`, `ChartFrame` (with `ChartLegendList`, `CHART_PALETTE`), `Chart` · `Avatar` · `FileUpload` (see File upload) · `Counter` · `Toggle` / `ToggleGroup` · `Slider` · `InputOTP` · `Calendar` · `Label`.

### File upload

`FileUpload` is the file field: a `FileDropZone`, a hidden file input, and a `FileUploadCard` per file, built on `Attachment`.

- **Without `uploadOptions`** it behaves like `<input type="file">`. The value is `File[]`, `name` puts the files in a plain form submit or `FormData`, and `required` uses the browser's check. The ref is the file input's, so react-hook-form's `register` works.
- **With `uploadOptions`** each file uploads as soon as it's picked. `presign(file)` returns a presigned S3 PUT URL (the app's own "prepare upload" mutation). FileUpload PUTs the file there with `Content-Type: file.type`, showing progress, cancel and Retry (Retry asks for a new URL). The value is what `onUploadFinished(file, url)` returns, or the URL minus its query string without it: `TValue | null` for one file, `TValue[]` with `multiple`. The value only changes once an upload finishes.
- One file: its card takes the drop zone's place. `accept` and `maxSize` refuse a file with a message under the zone. `confirmDelete` and `deleteToast` (both off by default) ask before deleting and offer Undo.
- Labels and errors come from `Field`, `FieldLabel htmlFor` and `FieldError`, as for every input. Set `aria-invalid` for the error look. `hint` shows under the drop zone, above the files, and a refused file's message takes its place.
- The card: 36px mint-l3 circle with the file icon, name `text-body-4 font-semibold text-dark-90`, "4 MB · Uploaded 12 Oct 2026" in `text-caption-1 text-dark-75`, then icon-only download (`mint-75`, hover `mint-90`) and delete (trash, `error-75`, hover `error-90`) with tooltips. While a file uploads, and once it completes or fails, the card is compact (`text-body-5` name, `text-caption-2` status, 16px icons, buttons top right) with a progress bar or the error and Retry. `FileUploadCard` is exported for lists of files outside a FileUpload.

Our `Attachment` adds `status` (`uploading` · `completed` · `error` · `uploaded`) and three parts: `AttachmentStatus` (the coloured label in the description), `AttachmentProgress` (a full-width bar) and `AttachmentError` (the message, with Retry when `onRetry` is set).

## Component tokens (levers)

Tokens come in three layers. Each layer reads the one above it, so a change at the top flows down.

| Layer | What it is | Examples | Where it lives |
|---|---|---|---|
| Brand | The raw palette, type scale and radius scale | `--mint-45`, `--navy`, `--text-body-4`, `--radius-lg` | `globals.css` `:root` |
| Semantic | Roles that shadcn components read | `--primary`, `--muted-foreground`, `--border`, `--ring` | `globals.css` `:root` and `.dark` |
| Component | One look of one part of one component: a **lever** | `--button-default`, `--input-radius`, `--tabs-trigger-active-foreground` | `src/tokens/components/<component>.css` |

A **part** is one element of a component, named by its `data-slot` (`select-trigger`, `dialog-content`). A lever's name says which part, which variant, which state and which property it sets:

```
--<part>[-<variant>][-<state>][-<property>][\:<breakpoint>]

--button-default                    fill of the primary button
--button-default-hover              its fill when hovered
--button-outline-border             border colour of the tertiary (stock outline) button
--input-radius                      corner radius of every input
--dropdown-menu-item-highlighted-foreground   text colour of the highlighted menu item
--toast-viewport-offset\:sm         distance of the toasts from the screen edges, from sm up
```

No property means the fill. Properties: `foreground` (text and icon colour), `border`, `ring`, `radius`, `height`, `min-height`, `width`, `size`, `padding`, `padding-x`, `padding-y`, `gap`, `offset` (distance from the screen or container edge), `shadow`, `font-weight`, `opacity`, `tracking`. States: `hover`, `focus`, `active`, `pressed`, `open`, `selected`, `highlighted`, `checked`, `disabled`, `invalid`, `placeholder`. A variant's lever falls back to the component's own lever where there is one (`--button-sm-radius` → `--button-radius`). Variants keep the stock key in lever names: our `primary` button is `default`, `tertiary` is `outline`.

**Breakpoints.** We're mobile-first: a lever without a breakpoint is the value on every screen, and a value that changes at a breakpoint gets its own lever with `\:<breakpoint>` at the end, for that breakpoint and up. `--toast-viewport-offset` is 16px; `--toast-viewport-offset\:sm` makes it 24px from `sm` up. A range adds `-to-<breakpoint>`, up to but not including the second: `\:md-to-lg` is `md` up to `lg`. Breakpoints are `sm`, `md`, `lg`, `xl` and `2xl` ([Breakpoints and grid](#breakpoints-and-grid)). The backslash is part of the name in CSS; in JavaScript leave it out: `el.style.setProperty('--toast-viewport-offset:sm', '32px')`.

```css
:root {
  --toast-viewport-offset: 12px;
  --toast-viewport-offset\:sm: 32px;
  --sidebar-inset-offset\:md: 0px;
}
```

Inside the token files the private name ends in `--<breakpoint>` instead (`--_toast-viewport-offset--sm`), because Tailwind won't read a class with a backslash in it. Only an `@add` class reads a breakpoint lever, under that breakpoint's prefix (`sm:`, or `md:max-lg:` for a range); `pnpm check-component-tokens` fails if the prefix doesn't match.

**Pull a lever** by setting it on `:root`, or on any element to change one section only:

```css
:root {
  --button-default: var(--navy);
  --input-radius: var(--radius-md);
}
.checkout { --card-padding-y: calc(var(--spacing) * 8); }
```

Every default is the BYB design, so an app that sets nothing gets the designed look. Don't edit the component files to change a look; pull its lever. If no lever exists for what you need, add one (below).

**The Design Console** (`pnpm console`, or the published "BYB Design Console" page) lists every brand, semantic and component token with a picker that only offers values of the right type (palette colours for colours, the radius scale for radii, and so on), shows every affected component live from the Storybook stories, checks contrast as you go, and exports the changes as a `:root` block to paste into an app.

**How the levers reach the components.** The shadcn components in `src/components/ui/` are the CLI's own files. `pnpm tokens:apply` edits their class strings so each designed value reads its lever (`h-9` → `h-(--_input-height)`). The private name (`--_input-height`) is declared on the part and falls back to the public lever, then to the default. Components that change how stock behaves or is built, not just how it looks, are our own files in `src/components/` and export over the stock ones (Button, Calendar, Pagination, Tabs, Toast, …).

To update the shadcn components:

```bash
npx shadcn@latest add <components> --overwrite   # the CLI's latest files
pnpm tokens:apply                                # re-applies every lever
pnpm tokens:build                                # index.css, Design Console manifest, the table below
pnpm check-component-tokens                      # names, missing levers, contrast
```

Contrast pairs that fall under WCAG AA are listed in `scripts/tokens/contrast-exceptions.json` as `undecided` (a design call still to make) or `accepted` (with the reason). `check-component-tokens --strict` fails while any are undecided.

### Every lever

<!-- component-tokens:start -->
<!-- Generated by scripts/tokens/build.mjs from src/tokens/components/*.css; don't edit. -->

<details>
<summary><strong>accordion</strong> (12)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--accordion-item-border` | Border colour of the item. | `var(--dark-15)` |
| `--accordion-trigger-font-weight` | Font weight of the trigger. | `600` |
| `--accordion-trigger-foreground` | Text colour of the trigger. | `var(--dark-100)` |
| `--accordion-trigger-hover-foreground` | Text colour of the trigger when hovered. | `var(--mint-45)` |
| `--accordion-trigger-open-foreground` | Text colour of the trigger while open. | `var(--mint-45)` |
| `--accordion-trigger-disabled-opacity` | Opacity of the trigger when disabled. | `0.5` |
| `--accordion-trigger-gap` | Gap between items of the trigger. | `calc(var(--spacing) * 6)` |
| `--accordion-trigger-padding-y` | Vertical padding of the trigger. | `calc(var(--spacing) * 5)` |
| `--accordion-trigger-sm-gap` | Gap between the title and chevron (sm size). | `calc(var(--spacing) * 4)` |
| `--accordion-trigger-sm-padding-y` | Vertical padding of the trigger (sm size). | `calc(var(--spacing) * 3)` |
| `--accordion-trigger-lg-padding-y` | Vertical padding of the trigger (lg size). | `calc(var(--spacing) * 6)` |
| `--accordion-content-foreground` | Text colour of the content. | `var(--dark-75)` |

</details>

<details>
<summary><strong>alert-dialog</strong> (16)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--alert-dialog-overlay` | Fill colour of the overlay. | `color-mix(in oklab, var(--dark-100) 50%, transparent)` |
| `--alert-dialog-content-gap` | Gap between items of the content. | `calc(var(--spacing) * 6)` |
| `--alert-dialog-content-radius` | Corner radius of the content. | `var(--radius-2xl)` |
| `--alert-dialog-content-border` | Border colour of the content. | `var(--border)` |
| `--alert-dialog-content` | Fill colour of the content. | `var(--popover)` |
| `--alert-dialog-content-padding` | Padding of the content. | `calc(var(--spacing) * 6)` |
| `--alert-dialog-content-foreground` | Text colour of the content. | `var(--popover-foreground)` |
| `--alert-dialog-content-shadow` | Shadow of the content. | `0 25px 50px -12px rgb(0 0 0 / 0.25)` |
| `--alert-dialog-header-gap` | Gap between items of the header. | `calc(var(--spacing) * 1.5)` |
| `--alert-dialog-header-with-media-gap` | Gap between the media and the text of a header with media. | `calc(var(--spacing) * 6)` |
| `--alert-dialog-footer-gap` | Gap between items of the footer. | `calc(var(--spacing) * 2)` |
| `--alert-dialog-media-size` | Width and height of the media. | `calc(var(--spacing) * 16)` |
| `--alert-dialog-media-radius` | Corner radius of the media. | `var(--radius-full)` |
| `--alert-dialog-media` | Fill colour of the media. | `var(--muted)` |
| `--alert-dialog-title-font-weight` | Font weight of the title. | `500` |
| `--alert-dialog-description-foreground` | Text colour of the description. | `var(--muted-foreground)` |

</details>

<details>
<summary><strong>alert</strong> (14)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--alert-gap` | Gap between items of the alert. | `calc(var(--spacing) * 0.5)` |
| `--alert-radius` | Corner radius of the alert. | `var(--radius-2xl)` |
| `--alert-padding-x` | Horizontal padding of the alert. | `calc(var(--spacing) * 4)` |
| `--alert-padding-y` | Vertical padding of the alert. | `calc(var(--spacing) * 3)` |
| `--alert-default` | Fill colour of the alert (default variant). | `var(--card)` |
| `--alert-default-border` | Border colour of the alert (default variant). | `var(--border)` |
| `--alert-default-foreground` | Text colour of the alert (default variant). | `var(--card-foreground)` |
| `--alert-destructive` | Fill colour of the alert (destructive variant). | `var(--error-l1)` |
| `--alert-destructive-border` | Border colour of the alert (destructive variant). | `var(--error-15)` |
| `--alert-destructive-foreground` | Text colour of the alert (destructive variant). | `var(--destructive)` |
| `--alert-with-icon-gap` | Gap between the icon and the text of an alert with an icon. | `calc(var(--spacing) * 2.5)` |
| `--alert-with-action-padding-x` | Right padding of an alert with an action button (room for the button). | `calc(var(--spacing) * 18)` |
| `--alert-title-font-weight` | Font weight of the title. | `500` |
| `--alert-description-foreground` | Text colour of the description. | `var(--muted-foreground)` |

</details>

<details>
<summary><strong>aspect-ratio</strong> (0)</summary>

| Lever | What it changes | Default |
|---|---|---|


</details>

<details>
<summary><strong>attachment</strong> (43)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--attachment-radius` | Corner radius of the attachment. | `var(--radius-lg)` |
| `--attachment` | Fill colour of the attachment. | `var(--card)` |
| `--attachment-foreground` | Text colour of the attachment. | `var(--card-foreground)` |
| `--attachment-shadow` | Shadow of the attachment. | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
| `--attachment-error-border` | Border colour of a failed upload. | `var(--destructive)` |
| `--attachment-focus-ring` | Ring colour of the attachment when focused. | `color-mix(in oklab, var(--ring) 50%, transparent)` |
| `--attachment-default-gap` | Gap between items of the attachment (default size). | `calc(var(--spacing) * 4)` |
| `--attachment-default-padding` | Padding of the attachment (default size). | `calc(var(--spacing) * 4)` |
| `--attachment-sm-gap` | Gap between items of the attachment (sm size, the card of an upload in progress). | `calc(var(--spacing) * 3)` |
| `--attachment-sm-padding` | Padding of the attachment (sm size). | `calc(var(--spacing) * 4)` |
| `--attachment-xs-gap` | Gap between items of the attachment (xs size). | `calc(var(--spacing) * 1.5)` |
| `--attachment-xs-radius` | Corner radius of the attachment (xs size). | `var(--attachment-radius, var(--radius-xl))` |
| `--attachment-vertical-width` | Width of the attachment (vertical variant). | `calc(var(--spacing) * 24)` |
| `--attachment-vertical-with-content-width` | Width of a vertical attachment that shows its title and description. | `calc(var(--spacing) * 30)` |
| `--attachment-media-width` | Width of the media. | `calc(var(--spacing) * 9)` |
| `--attachment-media-radius` | Corner radius of the media. | `var(--radius-full)` |
| `--attachment-media` | Fill colour of the media. | `var(--mint-l3)` |
| `--attachment-media-foreground` | Text colour of the media. | `var(--mint-75)` |
| `--attachment-media-error` | Fill colour of the media on a failed upload. | `var(--mint-l3)` |
| `--attachment-media-error-foreground` | Icon colour of the media on a failed upload. | `var(--mint-75)` |
| `--attachment-media-icon-size` | Size of the media's icon. | `calc(var(--spacing) * 5)` |
| `--attachment-media-sm-icon-size` | Size of the media's icon in a small (sm) attachment. | `calc(var(--spacing) * 4.5)` |
| `--attachment-media-image-opacity` | Opacity of the media (image variant). | `0.6` |
| `--attachment-media-sm-width` | Width of the media in a small (sm) attachment. | `calc(var(--spacing) * 8)` |
| `--attachment-media-xs-width` | Width of the media in an extra-small (xs) attachment. | `calc(var(--spacing) * 7)` |
| `--attachment-media-xs-radius` | Corner radius of the media in an extra-small (xs) attachment. | `var(--radius-lg)` |
| `--attachment-title-font-weight` | Font weight of the title. | `600` |
| `--attachment-title-foreground` | Text colour of the title. | `var(--dark-90)` |
| `--attachment-description-foreground` | Text colour of the description. | `var(--dark-75)` |
| `--attachment-description-error-foreground` | Text colour of the description on a failed upload (the status label stays red). | `var(--dark-75)` |
| `--attachment-group-gap` | Gap between items of the group. | `calc(var(--spacing) * 3)` |
| `--attachment-group-padding-y` | Vertical padding of the group. | `calc(var(--spacing) * 1)` |
| `--attachment-status-gap` | Gap between the status icon and its label. | `calc(var(--spacing) * 1)` |
| `--attachment-status-foreground` | Colour of the status label while uploading. | `var(--dark-75)` |
| `--attachment-status-completed-foreground` | Colour of the status label once an upload completes. | `var(--mint-60)` |
| `--attachment-status-error-foreground` | Colour of the status label when an upload fails. | `var(--destructive)` |
| `--attachment-progress-height` | Height of the upload progress bar. | `calc(var(--spacing) * 1.5)` |
| `--attachment-progress-radius` | Corner radius of the upload progress bar. | `var(--radius-full)` |
| `--attachment-progress` | Colour of the progress bar's track. | `var(--mint-l2)` |
| `--attachment-progress-indicator` | Colour of the uploaded part of the progress bar. | `var(--mint-60)` |
| `--attachment-error-foreground` | Colour of the error message under a failed upload. | `var(--destructive)` |
| `--attachment-retry-foreground` | Colour of the Retry link. | `var(--destructive)` |
| `--attachment-retry-font-weight` | Font weight of the Retry link. | `600` |

</details>

<details>
<summary><strong>avatar</strong> (19)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--avatar-size` | Width and height of the avatar. | `calc(var(--spacing) * 8)` |
| `--avatar-radius` | Corner radius of the avatar. | `var(--radius-full)` |
| `--avatar-sm-size` | Size of a small (sm) avatar. | `calc(var(--spacing) * 6)` |
| `--avatar-lg-size` | Size of a large (lg) avatar. | `calc(var(--spacing) * 10)` |
| `--avatar-image-radius` | Corner radius of the image. | `var(--radius-full)` |
| `--avatar-fallback-radius` | Corner radius of the fallback. | `var(--radius-full)` |
| `--avatar-fallback` | Fill colour of the fallback. | `var(--muted)` |
| `--avatar-fallback-foreground` | Text colour of the fallback. | `var(--muted-foreground)` |
| `--avatar-badge-radius` | Corner radius of the badge. | `var(--radius-full)` |
| `--avatar-badge` | Fill colour of the badge. | `var(--primary)` |
| `--avatar-badge-foreground` | Text colour of the badge. | `var(--primary-foreground)` |
| `--avatar-badge-ring` | Ring colour of the badge. | `var(--background)` |
| `--avatar-badge-size` | Width and height of the status dot on a default avatar. | `calc(var(--spacing) * 2.5)` |
| `--avatar-badge-sm-size` | Width and height of the status dot on a small avatar. | `calc(var(--spacing) * 2)` |
| `--avatar-badge-lg-size` | Width and height of the status dot on a large avatar. | `calc(var(--spacing) * 3)` |
| `--avatar-group-count-radius` | Corner radius of the group-count. | `var(--radius-full)` |
| `--avatar-group-count` | Fill colour of the group-count. | `var(--muted)` |
| `--avatar-group-count-foreground` | Text colour of the group-count. | `var(--muted-foreground)` |
| `--avatar-group-count-ring` | Ring colour of the group-count. | `var(--background)` |

</details>

<details>
<summary><strong>badge</strong> (65)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--badge-height` | Height of the badge. | `calc(var(--spacing) * 5)` |
| `--badge-gap` | Gap between items of the badge. | `calc(var(--spacing) * 1)` |
| `--badge-radius` | Corner radius of the badge. | `var(--radius-full)` |
| `--badge-padding-x` | Horizontal padding of the badge. | `calc(var(--spacing) * 2)` |
| `--badge-padding-y` | Vertical padding of the badge. | `calc(var(--spacing) * 0.5)` |
| `--badge-font-weight` | Font weight of the badge. | `500` |
| `--badge-focus-border` | Border colour of the badge when focused. | `var(--ring)` |
| `--badge-focus-ring` | Ring colour of the badge when focused. | `color-mix(in oklab, var(--ring) 50%, transparent)` |
| `--badge-invalid-border` | Border colour of the badge when invalid. | `var(--destructive)` |
| `--badge-invalid-ring` | Ring colour of the badge when invalid. | `color-mix(in oklab, var(--destructive) 20%, transparent)` |
| `--badge-default-border` | Border colour of the badge (default variant). | `var(--mint-l1)` |
| `--badge-default` | Fill colour of the badge (default variant). | `var(--mint-l2)` |
| `--badge-default-font-weight` | Font weight of the badge (default variant). | `var(--badge-font-weight, 600)` |
| `--badge-default-foreground` | Text colour of the badge (default variant). | `var(--mint-90)` |
| `--badge-secondary-border` | Border colour of the badge (secondary variant). | `var(--dark-15)` |
| `--badge-secondary` | Fill colour of the badge (secondary variant). | `var(--light-l2)` |
| `--badge-secondary-font-weight` | Font weight of the badge (secondary variant). | `var(--badge-font-weight, 600)` |
| `--badge-secondary-foreground` | Text colour of the badge (secondary variant). | `var(--dark-75)` |
| `--badge-destructive-border` | Border colour of the badge (destructive variant). | `var(--error-15)` |
| `--badge-destructive` | Fill colour of the badge (destructive variant). | `var(--error-l1)` |
| `--badge-destructive-font-weight` | Font weight of the badge (destructive variant). | `var(--badge-font-weight, 600)` |
| `--badge-destructive-foreground` | Text colour of the badge (destructive variant). | `var(--destructive)` |
| `--badge-outline-border` | Border colour of the badge (outline variant). | `var(--border)` |
| `--badge-outline` | Fill colour of the badge (outline variant). | `color-mix(in oklab, var(--input) 30%, transparent)` |
| `--badge-outline-foreground` | Text colour of the badge (outline variant). | `var(--foreground)` |
| `--badge-ghost-hover` | Fill colour of the badge (ghost variant) when hovered. | `var(--muted)` |
| `--badge-ghost-hover-foreground` | Text colour of the badge (ghost variant) when hovered. | `var(--muted-foreground)` |
| `--badge-link-foreground` | Text colour of the badge (link variant). | `var(--primary)` |
| `--badge-lime-border` | Border colour of the badge (lime variant). | `var(--lime)` |
| `--badge-lime` | Fill colour of the badge (lime variant). | `var(--lime)` |
| `--badge-lime-foreground` | Text colour of the badge (lime variant). | `var(--navy)` |
| `--badge-lime-font-weight` | Font weight of the badge (lime variant). | `var(--badge-font-weight, 600)` |
| `--badge-success-border` | Border colour of the badge (success variant). | `var(--mint-l1)` |
| `--badge-success` | Fill colour of the badge (success variant). | `var(--mint-l3)` |
| `--badge-success-foreground` | Text colour of the badge (success variant). | `var(--mint-75)` |
| `--badge-success-font-weight` | Font weight of the badge (success variant). | `var(--badge-font-weight, 600)` |
| `--badge-warning-border` | Border colour of the badge (warning variant). | `var(--warning-l1)` |
| `--badge-warning` | Fill colour of the badge (warning variant). | `var(--warning-l3)` |
| `--badge-warning-foreground` | Text colour of the badge (warning variant). | `var(--warning-75)` |
| `--badge-warning-font-weight` | Font weight of the badge (warning variant). | `var(--badge-font-weight, 600)` |
| `--badge-electric-blue-border` | Border colour of the badge (electric-blue variant). | `var(--electric-blue-l1)` |
| `--badge-electric-blue` | Fill colour of the badge (electric-blue variant). | `var(--electric-blue-l1)` |
| `--badge-electric-blue-foreground` | Text colour of the badge (electric-blue variant). | `var(--electric-blue)` |
| `--badge-electric-blue-font-weight` | Font weight of the badge (electric-blue variant). | `var(--badge-font-weight, 600)` |
| `--badge-gray-solid` | Fill and border colour of the solid badge (gray variant). | `var(--dark-75)` |
| `--badge-gray-solid-foreground` | Text colour of the solid badge (gray variant). | `var(--white)` |
| `--badge-mint-solid` | Fill and border colour of the solid badge (mint variant). | `var(--mint-75)` |
| `--badge-mint-solid-foreground` | Text colour of the solid badge (mint variant). | `var(--white)` |
| `--badge-lime-solid` | Fill and border colour of the solid badge (lime variant). | `var(--lime)` |
| `--badge-lime-solid-foreground` | Text colour of the solid badge (lime variant). | `var(--navy)` |
| `--badge-success-solid` | Fill and border colour of the solid badge (success variant). | `var(--mint-75)` |
| `--badge-success-solid-foreground` | Text colour of the solid badge (success variant). | `var(--white)` |
| `--badge-error-solid` | Fill and border colour of the solid badge (error variant). | `var(--destructive)` |
| `--badge-error-solid-foreground` | Text colour of the solid badge (error variant). | `var(--white)` |
| `--badge-warning-solid` | Fill and border colour of the solid badge (warning variant). | `var(--warning-30)` |
| `--badge-warning-solid-foreground` | Text colour of the solid badge (warning variant). | `var(--navy)` |
| `--badge-electric-blue-solid` | Fill and border colour of the solid badge (electric-blue variant). | `var(--electric-blue)` |
| `--badge-electric-blue-solid-foreground` | Text colour of the solid badge (electric-blue variant). | `var(--white)` |
| `--badge-sm-height` | Height of the small badge. | `calc(var(--spacing) * 4)` |
| `--badge-sm-padding-x` | Horizontal padding of the small badge. | `calc(var(--spacing) * 1.5)` |
| `--badge-lg-height` | Height of the large badge. | `calc(var(--spacing) * 7)` |
| `--badge-lg-gap` | Gap between items of the large badge. | `calc(var(--spacing) * 1.5)` |
| `--badge-lg-padding-x` | Horizontal padding of the large badge. | `calc(var(--spacing) * 3)` |
| `--badge-filled-font-weight` | Font weight of a category or product badge (solid colour fill). | `var(--badge-font-weight, 500)` |
| `--badge-with-icon-padding-x` | Padding on the icon side of the badge when it has an icon. | `calc(var(--spacing) * 1.5)` |

</details>

<details>
<summary><strong>breadcrumb</strong> (8)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--breadcrumb-list-gap` | Gap between items of the list. | `calc(var(--spacing) * 1.5)` |
| `--breadcrumb-list-foreground` | Text colour of the list. | `var(--muted-foreground)` |
| `--breadcrumb-list-gap\:sm` | Gap between crumbs from the sm breakpoint up. | `calc(var(--spacing) * 2.5)` |
| `--breadcrumb-item-gap` | Gap between items of the item. | `calc(var(--spacing) * 1.5)` |
| `--breadcrumb-link-hover-foreground` | Text colour of the link when hovered. | `var(--foreground)` |
| `--breadcrumb-page-font-weight` | Font weight of the page. | `500` |
| `--breadcrumb-page-foreground` | Text colour of the page. | `var(--mint-75)` |
| `--breadcrumb-ellipsis-size` | Width and height of the ellipsis. | `calc(var(--spacing) * 5)` |

</details>

<details>
<summary><strong>button-group</strong> (6)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--button-group-text-gap` | Gap between items of the text. | `calc(var(--spacing) * 2)` |
| `--button-group-text-radius` | Corner radius of the text. | `var(--radius-4xl)` |
| `--button-group-text` | Fill colour of the text. | `var(--muted)` |
| `--button-group-text-padding-x` | Horizontal padding of the text. | `calc(var(--spacing) * 2.5)` |
| `--button-group-text-font-weight` | Font weight of the text. | `500` |
| `--button-group-separator` | Fill colour of the separator. | `var(--input)` |

</details>

<details>
<summary><strong>button</strong> (81)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--button-radius` | Corner radius of the button. | `var(--radius-xl)` |
| `--button-font-weight` | Font weight of the button. | `600` |
| `--button-focus-ring` | Ring colour of the button when focused. | `var(--navy)` |
| `--button-invalid-ring` | Ring colour of the button when invalid. | `color-mix(in oklab, var(--destructive) 20%, transparent)` |
| `--button-default` | Fill colour of the button (default variant). | `var(--primary)` |
| `--button-default-foreground` | Text colour of the button (default variant). | `var(--primary-foreground)` |
| `--button-default-shadow` | Shadow of the button (default variant). | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
| `--button-default-hover` | Fill colour of the button (default variant) when hovered. | `color-mix(in oklab, var(--primary) 80%, transparent)` |
| `--button-default-open` | Fill colour of the button (default variant) while open. | `color-mix(in oklab, var(--primary) 80%, transparent)` |
| `--button-default-disabled` | Fill colour of the button (default variant) when disabled. | `var(--light-l2)` |
| `--button-default-disabled-foreground` | Text colour of the button (default variant) when disabled. | `var(--dark-45)` |
| `--button-default-disabled-shadow` | Shadow of the button (default variant) when disabled. | `0 0 #0000` |
| `--button-outline-border` | Border colour of the button (outline variant). | `var(--dark-15)` |
| `--button-outline` | Fill colour of the button (outline variant). | `var(--white)` |
| `--button-outline-foreground` | Text colour of the button (outline variant). | `var(--dark-90)` |
| `--button-outline-hover-border` | Border colour of the button (outline variant) when hovered. | `var(--dark-45)` |
| `--button-outline-hover` | Fill colour of the button (outline variant) when hovered. | `var(--dark-45)` |
| `--button-outline-hover-foreground` | Text colour of the button (outline variant) when hovered. | `var(--dark-100)` |
| `--button-outline-open-border` | Border colour of the button (outline variant) while open. | `var(--mint-45)` |
| `--button-outline-open` | Fill colour of the button (outline variant) while open. | `var(--mint-l4)` |
| `--button-outline-open-foreground` | Text colour of the button (outline variant) while open. | `var(--mint-75)` |
| `--button-outline-open-ring` | Ring colour of the button (outline variant) while open. | `color-mix(in oklab, var(--mint-45) 30%, transparent)` |
| `--button-outline-disabled-border` | Border colour of the button (outline variant) when disabled. | `var(--light-l2)` |
| `--button-outline-disabled` | Fill colour of the button (outline variant) when disabled. | `var(--light-l2)` |
| `--button-outline-disabled-foreground` | Text colour of the button (outline variant) when disabled. | `var(--dark-45)` |
| `--button-secondary-border` | Border colour of the button (secondary variant). | `var(--navy)` |
| `--button-secondary` | Fill colour of the button (secondary variant). | `var(--white)` |
| `--button-secondary-foreground` | Text colour of the button (secondary variant). | `var(--navy)` |
| `--button-secondary-hover` | Fill colour of the button (secondary variant) when hovered. | `var(--navy)` |
| `--button-secondary-hover-foreground` | Text colour of the button (secondary variant) when hovered. | `var(--white)` |
| `--button-secondary-open` | Fill colour of the button (secondary variant) while open. | `var(--navy)` |
| `--button-secondary-open-foreground` | Text colour of the button (secondary variant) while open. | `var(--white)` |
| `--button-secondary-disabled-border` | Border colour of the button (secondary variant) when disabled. | `var(--dark-15)` |
| `--button-secondary-disabled` | Fill colour of the button (secondary variant) when disabled. | `var(--light-l2)` |
| `--button-secondary-disabled-foreground` | Text colour of the button (secondary variant) when disabled. | `var(--dark-45)` |
| `--button-ghost-foreground` | Text colour of the button (ghost variant). | `var(--mint-75)` |
| `--button-ghost-hover-foreground` | Text colour of the button (ghost variant) when hovered. | `var(--mint-45)` |
| `--button-ghost-open-foreground` | Text colour of the button (ghost variant) while open. | `var(--mint-45)` |
| `--button-ghost-disabled-foreground` | Text colour of the button (ghost variant) when disabled. | `var(--dark-45)` |
| `--button-destructive` | Fill colour of the button (destructive variant). | `var(--destructive)` |
| `--button-destructive-foreground` | Text colour of the button (destructive variant). | `var(--white)` |
| `--button-destructive-shadow` | Shadow of the button (destructive variant). | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
| `--button-destructive-hover` | Fill colour of the button (destructive variant) when hovered. | `var(--error-45)` |
| `--button-destructive-focus-ring` | Ring colour of the button (destructive variant) when focused. | `var(--button-focus-ring, var(--destructive))` |
| `--button-destructive-disabled` | Fill colour of the button (destructive variant) when disabled. | `var(--light-l2)` |
| `--button-destructive-disabled-foreground` | Text colour of the button (destructive variant) when disabled. | `var(--dark-45)` |
| `--button-destructive-disabled-shadow` | Shadow of the button (destructive variant) when disabled. | `0 0 #0000` |
| `--button-link-foreground` | Text colour of the button (link variant). | `var(--mint-75)` |
| `--button-link-hover-foreground` | Text colour of the button (link variant) when hovered. | `var(--mint-45)` |
| `--button-link-disabled-foreground` | Text colour of the button (link variant) when disabled. | `var(--dark-45)` |
| `--button-md-height` | Height of the button (md size). | `calc(var(--spacing) * 10)` |
| `--button-md-gap` | Gap between items of the button (md size). | `calc(var(--spacing) * 3)` |
| `--button-md-padding-x` | Horizontal padding of the button (md size). | `calc(var(--spacing) * 4)` |
| `--button-xs-height` | Height of the button (xs size). | `calc(var(--spacing) * 7)` |
| `--button-xs-gap` | Gap between items of the button (xs size). | `calc(var(--spacing) * 1)` |
| `--button-xs-radius` | Corner radius of the button (xs size). | `var(--button-radius, var(--radius-md))` |
| `--button-xs-padding-x` | Horizontal padding of the button (xs size). | `calc(var(--spacing) * 3)` |
| `--button-xs-padding-y` | Vertical padding of the button (xs size). | `calc(var(--spacing) * 1)` |
| `--button-sm-height` | Height of the button (sm size). | `calc(var(--spacing) * 9)` |
| `--button-sm-gap` | Gap between items of the button (sm size). | `calc(var(--spacing) * 2)` |
| `--button-sm-radius` | Corner radius of the button (sm size). | `var(--button-radius, var(--radius-lg))` |
| `--button-sm-padding-x` | Horizontal padding of the button (sm size). | `calc(var(--spacing) * 3.5)` |
| `--button-lg-height` | Height of the button (lg size). | `calc(var(--spacing) * 11)` |
| `--button-lg-gap` | Gap between items of the button (lg size). | `calc(var(--spacing) * 3)` |
| `--button-lg-padding-x` | Horizontal padding of the button (lg size). | `calc(var(--spacing) * 4.5)` |
| `--button-icon-size` | Width and height of the button (icon size). | `calc(var(--spacing) * 10)` |
| `--button-icon-radius` | Corner radius of the button (icon size). | `var(--button-radius, var(--radius-full))` |
| `--button-icon-xs-size` | Width and height of the button (icon-xs size). | `calc(var(--spacing) * 7)` |
| `--button-icon-xs-radius` | Corner radius of the button (icon-xs size). | `var(--button-radius, var(--radius-full))` |
| `--button-icon-sm-size` | Width and height of the button (icon-sm size). | `calc(var(--spacing) * 9)` |
| `--button-icon-sm-radius` | Corner radius of the button (icon-sm size). | `var(--button-radius, var(--radius-full))` |
| `--button-icon-lg-size` | Width and height of the button (icon-lg size). | `calc(var(--spacing) * 11)` |
| `--button-icon-lg-radius` | Corner radius of the button (icon-lg size). | `var(--button-radius, var(--radius-full))` |
| `--button-lime` | Fill colour of the button (lime variant). | `var(--lime)` |
| `--button-lime-foreground` | Text colour of the button (lime variant). | `var(--navy)` |
| `--button-navy` | Fill colour of the button (navy variant). | `var(--navy)` |
| `--button-navy-foreground` | Text colour of the button (navy variant). | `var(--white)` |
| `--button-md-with-icon-padding-x` | Padding on the icon side of the button (md) when it has an icon. | `calc(var(--spacing) * 3.5)` |
| `--button-xs-with-icon-padding-x` | Padding on the icon side of the button (xs) when it has an icon. | `calc(var(--spacing) * 2)` |
| `--button-sm-with-icon-padding-x` | Padding on the icon side of the button (sm) when it has an icon. | `calc(var(--spacing) * 3)` |
| `--button-lg-with-icon-padding-x` | Padding on the icon side of the button (lg) when it has an icon. | `calc(var(--spacing) * 4)` |

</details>

<details>
<summary><strong>calendar</strong> (14)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--calendar-day-selected` | Fill of the selected day, and of a range's first and last day. | `var(--lime)` |
| `--calendar-day-selected-foreground` | Text colour of the selected day. | `var(--navy)` |
| `--calendar-day-foreground` | Text colour of a day. | `var(--dark-90)` |
| `--calendar-day-hover` | Fill of a day when hovered. | `var(--light-l2)` |
| `--calendar-day-radius` | Corner radius of a day, today and the ends of a range. | `var(--radius-full)` |
| `--calendar-range` | Fill behind the days inside a range. | `var(--light-l2)` |
| `--calendar-today` | Fill of today. | `var(--light-l2)` |
| `--calendar-today-foreground` | Text colour of today. | `var(--dark-90)` |
| `--calendar-outside-foreground` | Text colour of days from the previous and next month. | `var(--dark-45)` |
| `--calendar-disabled-foreground` | Text colour of days that can't be picked. | `var(--dark-45)` |
| `--calendar-caption-foreground` | Text colour of the month and year. | `var(--navy)` |
| `--calendar-weekday-foreground` | Text colour of the weekday names. | `var(--dark-75)` |
| `--calendar-nav-foreground` | Colour of the previous and next month arrows. | `var(--dark-75)` |
| `--calendar-nav-hover-foreground` | Colour of the month arrows when hovered. | `var(--navy)` |

</details>

<details>
<summary><strong>card</strong> (17)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--card-gap` | Gap between items of the card. | `calc(var(--spacing) * 6)` |
| `--card-radius` | Corner radius of the card. | `var(--radius-lg)` |
| `--card-border` | Border colour of the card. | `var(--border)` |
| `--card-fill` | Fill colour of the card. | `var(--card)` |
| `--card-shadow` | Shadow of the card. | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
| `--card-padding-y` | Vertical padding of the card. | `calc(var(--spacing) * 6)` |
| `--card-sm-gap` | Gap between sections of a small (sm) card. | `calc(var(--spacing) * 4)` |
| `--card-sm-padding-y` | Vertical padding of a small (sm) card. | `calc(var(--spacing) * 4)` |
| `--card-header-gap` | Gap between items of the header. | `calc(var(--spacing) * 2)` |
| `--card-header-padding-x` | Horizontal padding of the header. | `calc(var(--spacing) * 6)` |
| `--card-header-sm-padding-x` | Horizontal padding of the header in a small (sm) card. | `calc(var(--spacing) * 4)` |
| `--card-title-font-weight` | Font weight of the title. | `500` |
| `--card-description-foreground` | Text colour of the description. | `var(--muted-foreground)` |
| `--card-content-padding-x` | Horizontal padding of the content. | `calc(var(--spacing) * 6)` |
| `--card-content-sm-padding-x` | Horizontal padding of the content in a small (sm) card. | `calc(var(--spacing) * 4)` |
| `--card-footer-padding-x` | Horizontal padding of the footer. | `calc(var(--spacing) * 6)` |
| `--card-footer-sm-padding-x` | Horizontal padding of the footer in a small (sm) card. | `calc(var(--spacing) * 4)` |

</details>

<details>
<summary><strong>carousel</strong> (2)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--carousel-previous-radius` | Corner radius of the previous. | `var(--radius-full)` |
| `--carousel-next-radius` | Corner radius of the next. | `var(--radius-full)` |

</details>

<details>
<summary><strong>chart-frame</strong> (9)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--chart-frame` | Fill colour of the chart card. | `var(--white)` |
| `--chart-frame-border` | Border colour of the chart card. | `var(--light-l3)` |
| `--chart-frame-radius` | Corner radius of the chart card. | `var(--radius-lg)` |
| `--chart-frame-title-foreground` | Text colour of the title and the trend line. | `var(--navy)` |
| `--chart-frame-description-foreground` | Text colour of the description and the caption. | `var(--dark-75)` |
| `--chart-frame-legend-foreground` | Text and icon colour of the legend. | `var(--dark-75)` |
| `--chart-frame-tooltip` | Fill colour of the chart tooltip. | `var(--white)` |
| `--chart-frame-tooltip-border` | Border colour of the chart tooltip. | `var(--light-l3)` |
| `--chart-frame-tooltip-foreground` | Text colour of the chart tooltip. | `var(--dark-90)` |

</details>

<details>
<summary><strong>chart</strong> (0)</summary>

| Lever | What it changes | Default |
|---|---|---|


</details>

<details>
<summary><strong>checkbox</strong> (19)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--checkbox-size` | Width and height of the checkbox. | `calc(var(--spacing) * 4)` |
| `--checkbox-radius` | Corner radius of the checkbox. | `var(--radius-sm)` |
| `--checkbox-border` | Border colour of the checkbox. | `var(--dark-45)` |
| `--checkbox` | Fill colour of the checkbox. | `var(--white)` |
| `--checkbox-foreground` | Text colour of the checkbox. | `var(--navy)` |
| `--checkbox-focus-border` | Border colour of the checkbox when focused. | `var(--mint-45)` |
| `--checkbox-focus-ring` | Ring colour of the checkbox when focused. | `color-mix(in oklab, var(--mint-45) 30%, transparent)` |
| `--checkbox-checked-border` | Border colour of the checkbox when checked. | `var(--mint-45)` |
| `--checkbox-checked` | Fill colour of the checkbox when checked. | `var(--mint-45)` |
| `--checkbox-invalid-border` | Border colour of the checkbox when invalid. | `var(--destructive)` |
| `--checkbox-invalid-ring` | Ring colour of the checkbox when invalid. | `color-mix(in oklab, var(--destructive) 20%, transparent)` |
| `--checkbox-disabled-opacity` | Opacity of the checkbox when disabled. | `0.5` |
| `--checkbox-label-foreground` | Text colour of the label beside the control. | `var(--navy)` |
| `--checkbox-description-foreground` | Text colour of the description under the label. | `var(--dark-75)` |
| `--checkbox-field-card` | Fill colour of an option card (card variant). | `var(--white)` |
| `--checkbox-field-card-border` | Border colour of an option card (card variant). | `var(--dark-45)` |
| `--checkbox-field-card-radius` | Corner radius of an option card (card variant). | `var(--radius-lg)` |
| `--checkbox-field-card-checked` | Fill colour of a ticked option card (card variant). | `var(--mint-l4)` |
| `--checkbox-field-card-checked-border` | Border colour of a ticked option card (card variant). | `var(--mint-45)` |

</details>

<details>
<summary><strong>collapsible</strong> (0)</summary>

| Lever | What it changes | Default |
|---|---|---|


</details>

<details>
<summary><strong>combobox</strong> (41)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--combobox-content-radius` | Corner radius of the content. | `var(--radius-2xl)` |
| `--combobox-content` | Fill colour of the content. | `var(--popover)` |
| `--combobox-content-foreground` | Text colour of the content. | `var(--popover-foreground)` |
| `--combobox-content-shadow` | Shadow of the content. | `0 25px 50px -12px rgb(0 0 0 / 0.25)` |
| `--combobox-content-ring` | Ring colour of the content. | `color-mix(in oklab, var(--foreground) 5%, transparent)` |
| `--combobox-list-padding` | Padding of the list. | `calc(var(--spacing) * 1)` |
| `--combobox-item-gap` | Gap between items of the item. | `calc(var(--spacing) * 2.5)` |
| `--combobox-item-radius` | Corner radius of the item. | `var(--radius-xl)` |
| `--combobox-item-padding-y` | Vertical padding of the item. | `calc(var(--spacing) * 2)` |
| `--combobox-item-highlighted` | Fill colour of the item when highlighted. | `var(--accent)` |
| `--combobox-item-highlighted-foreground` | Text colour of the item when highlighted. | `var(--accent-foreground)` |
| `--combobox-item-disabled-opacity` | Opacity of the item when disabled. | `0.5` |
| `--combobox-label-padding-x` | Horizontal padding of the label. | `calc(var(--spacing) * 3.5)` |
| `--combobox-label-padding-y` | Vertical padding of the label. | `calc(var(--spacing) * 2.5)` |
| `--combobox-label-foreground` | Text colour of the label. | `var(--muted-foreground)` |
| `--combobox-empty-padding-y` | Vertical padding of the empty. | `calc(var(--spacing) * 2)` |
| `--combobox-empty-foreground` | Text colour of the empty. | `var(--muted-foreground)` |
| `--combobox-separator-height` | Height of the separator. | `1px` |
| `--combobox-separator` | Fill colour of the separator. | `color-mix(in oklab, var(--border) 50%, transparent)` |
| `--combobox-chips-min-height` | Minimum height of the chips. | `calc(var(--spacing) * 10)` |
| `--combobox-chips-gap` | Gap between items of the chips. | `calc(var(--spacing) * 1.5)` |
| `--combobox-chips-radius` | Corner radius of the chips. | `var(--radius-lg)` |
| `--combobox-chips-border` | Border colour of the chips. | `var(--dark-45)` |
| `--combobox-chips` | Fill colour of the chips. | `var(--white)` |
| `--combobox-chips-padding-x` | Horizontal padding of the chips. | `calc(var(--spacing) * 3)` |
| `--combobox-chips-padding-y` | Vertical padding of the chips. | `calc(var(--spacing) * 1.5)` |
| `--combobox-chips-focus-border` | Border colour of the chips when focused. | `var(--mint-45)` |
| `--combobox-chips-focus-ring` | Ring colour of the chips when focused. | `color-mix(in oklab, var(--mint-45) 30%, transparent)` |
| `--combobox-chips-invalid-border` | Border colour of the chips when invalid. | `var(--destructive)` |
| `--combobox-chips-invalid-ring` | Ring colour of the chips when invalid. | `color-mix(in oklab, var(--destructive) 20%, transparent)` |
| `--combobox-chips-with-chips-padding-x` | Horizontal padding of the chips field once it holds a chip. | `calc(var(--spacing) * 1.5)` |
| `--combobox-chip-gap` | Gap between items of the chip. | `calc(var(--spacing) * 1)` |
| `--combobox-chip-radius` | Corner radius of the chip. | `var(--radius-4xl)` |
| `--combobox-chip` | Fill colour of the chip. | `color-mix(in oklab, var(--muted-foreground) 10%, transparent)` |
| `--combobox-chip-padding-x` | Horizontal padding of the chip. | `calc(var(--spacing) * 2)` |
| `--combobox-chip-font-weight` | Font weight of the chip. | `500` |
| `--combobox-chip-foreground` | Text colour of the chip. | `var(--foreground)` |
| `--combobox-chip-disabled-opacity` | Opacity of the chip when disabled. | `0.5` |
| `--combobox-chip-with-remove-padding-x` | Right padding of a chip that has a remove (×) button. | `0px` |
| `--combobox-chip-remove-opacity` | Opacity of the chip-remove. | `0.5` |
| `--combobox-chip-remove-hover-opacity` | Opacity of the chip-remove when hovered. | `1` |

</details>

<details>
<summary><strong>command</strong> (27)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--command-radius` | Corner radius of the command. | `var(--radius-lg)` |
| `--command-border` | Border colour of the command. | `var(--light-l3)` |
| `--command` | Fill colour of the command. | `var(--white)` |
| `--command-foreground` | Text colour of the command. | `var(--dark-90)` |
| `--command-shadow` | Shadow of the command. | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` |
| `--command-input-wrapper-height` | Height of the input-wrapper. | `calc(var(--spacing) * 11)` |
| `--command-input-wrapper-gap` | Gap between items of the input-wrapper. | `calc(var(--spacing) * 2)` |
| `--command-input-wrapper-border` | Border colour of the input-wrapper. | `var(--light-l3)` |
| `--command-input-wrapper-padding-x` | Horizontal padding of the input-wrapper. | `calc(var(--spacing) * 3)` |
| `--command-input-foreground` | Text colour of the input. | `var(--dark-100)` |
| `--command-input-placeholder` | Placeholder text colour of the input. | `var(--dark-90)` |
| `--command-input-disabled-foreground` | Text colour of the input when disabled. | `var(--dark-45)` |
| `--command-list-padding` | Padding of the list. | `calc(var(--spacing) * 1)` |
| `--command-empty-padding-y` | Vertical padding of the empty. | `calc(var(--spacing) * 6)` |
| `--command-empty-foreground` | Text colour of the empty. | `var(--dark-75)` |
| `--command-group-foreground` | Text colour of the group. | `var(--dark-90)` |
| `--command-separator-height` | Height of the separator. | `1px` |
| `--command-separator` | Fill colour of the separator. | `var(--light-l3)` |
| `--command-item-height` | Height of the item. | `calc(var(--spacing) * 8)` |
| `--command-item-gap` | Gap between items of the item. | `calc(var(--spacing) * 2.5)` |
| `--command-item-radius` | Corner radius of the item. | `var(--radius-md)` |
| `--command-item-padding-x` | Horizontal padding of the item. | `calc(var(--spacing) * 2)` |
| `--command-item-foreground` | Text colour of the item. | `var(--dark-90)` |
| `--command-item-selected` | Fill colour of the item when selected. | `var(--mint-l2)` |
| `--command-item-selected-foreground` | Text colour of the item when selected. | `var(--mint-90)` |
| `--command-shortcut-foreground` | Text colour of the shortcut. | `var(--dark-75)` |
| `--command-dialog-radius` | Corner radius of the command palette dialog. | `var(--radius-lg)` |

</details>

<details>
<summary><strong>context-menu</strong> (40)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--context-menu-content-radius` | Corner radius of the content. | `var(--radius-lg)` |
| `--context-menu-content-border` | Border colour of the content. | `var(--border)` |
| `--context-menu-content` | Fill colour of the content. | `var(--popover)` |
| `--context-menu-content-padding` | Padding of the content. | `calc(var(--spacing) * 1)` |
| `--context-menu-content-foreground` | Text colour of the content. | `var(--popover-foreground)` |
| `--context-menu-content-shadow` | Shadow of the content. | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` |
| `--context-menu-label-padding-x` | Horizontal padding of the label. | `calc(var(--spacing) * 3)` |
| `--context-menu-label-padding-y` | Vertical padding of the label. | `calc(var(--spacing) * 2.5)` |
| `--context-menu-label-foreground` | Text colour of the label. | `var(--muted-foreground)` |
| `--context-menu-item-gap` | Gap between items of the item. | `calc(var(--spacing) * 2.5)` |
| `--context-menu-item-radius` | Corner radius of the item. | `var(--radius-md)` |
| `--context-menu-item-padding-x` | Horizontal padding of the item. | `calc(var(--spacing) * 3)` |
| `--context-menu-item-padding-y` | Vertical padding of the item. | `calc(var(--spacing) * 2)` |
| `--context-menu-item-focus` | Fill colour of the item when focused. | `var(--accent)` |
| `--context-menu-item-focus-foreground` | Text colour of the item when focused. | `var(--accent-foreground)` |
| `--context-menu-item-disabled-opacity` | Opacity of the item when disabled. | `0.5` |
| `--context-menu-item-inset-padding-x` | Left padding of an indented row (inset items, labels and sub-menu triggers). | `calc(var(--spacing) * 9.5)` |
| `--context-menu-sub-trigger-radius` | Corner radius of the sub-trigger. | `var(--radius-md)` |
| `--context-menu-sub-trigger-padding-x` | Horizontal padding of the sub-trigger. | `calc(var(--spacing) * 3)` |
| `--context-menu-sub-trigger-padding-y` | Vertical padding of the sub-trigger. | `calc(var(--spacing) * 2)` |
| `--context-menu-sub-trigger-focus` | Fill colour of the sub-trigger when focused. | `var(--accent)` |
| `--context-menu-sub-trigger-focus-foreground` | Text colour of the sub-trigger when focused. | `var(--accent-foreground)` |
| `--context-menu-sub-trigger-open` | Fill colour of the sub-trigger while open. | `var(--accent)` |
| `--context-menu-sub-trigger-open-foreground` | Text colour of the sub-trigger while open. | `var(--accent-foreground)` |
| `--context-menu-sub-content-shadow` | Shadow of the sub-content. | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` |
| `--context-menu-checkbox-item-gap` | Gap between items of the checkbox-item. | `calc(var(--spacing) * 2)` |
| `--context-menu-checkbox-item-radius` | Corner radius of the checkbox-item. | `var(--radius-md)` |
| `--context-menu-checkbox-item-padding-y` | Vertical padding of the checkbox-item. | `calc(var(--spacing) * 2)` |
| `--context-menu-checkbox-item-focus` | Fill colour of the checkbox-item when focused. | `var(--accent)` |
| `--context-menu-checkbox-item-focus-foreground` | Text colour of the checkbox-item when focused. | `var(--accent-foreground)` |
| `--context-menu-checkbox-item-disabled-opacity` | Opacity of the checkbox-item when disabled. | `0.5` |
| `--context-menu-radio-item-gap` | Gap between items of the radio-item. | `calc(var(--spacing) * 2)` |
| `--context-menu-radio-item-radius` | Corner radius of the radio-item. | `var(--radius-md)` |
| `--context-menu-radio-item-padding-y` | Vertical padding of the radio-item. | `calc(var(--spacing) * 2)` |
| `--context-menu-radio-item-focus` | Fill colour of the radio-item when focused. | `var(--accent)` |
| `--context-menu-radio-item-focus-foreground` | Text colour of the radio-item when focused. | `var(--accent-foreground)` |
| `--context-menu-radio-item-disabled-opacity` | Opacity of the radio-item when disabled. | `0.5` |
| `--context-menu-separator-height` | Height of the separator. | `1px` |
| `--context-menu-separator` | Fill colour of the separator. | `color-mix(in oklab, var(--border) 50%, transparent)` |
| `--context-menu-shortcut-foreground` | Text colour of the shortcut. | `var(--muted-foreground)` |

</details>

<details>
<summary><strong>counter</strong> (6)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--counter-value-navy-foreground` | Colour of the number and icon (navy variant). | `var(--navy)` |
| `--counter-value-lime-foreground` | Colour of the number and icon (lime variant, for dark sections). | `var(--lime)` |
| `--counter-value-white-foreground` | Colour of the number and icon (white variant, for dark sections). | `var(--white)` |
| `--counter-label-navy-foreground` | Text colour of the label (navy variant). | `var(--dark-75)` |
| `--counter-label-lime-foreground` | Text colour of the label (lime variant). | `var(--dark-75)` |
| `--counter-label-white-foreground` | Text colour of the label (white variant). | `var(--white)` |

</details>

<details>
<summary><strong>dialog</strong> (22)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--dialog-overlay` | Fill colour of the overlay. | `color-mix(in oklab, var(--dark-100) 50%, transparent)` |
| `--dialog-content-radius` | Corner radius of the content. | `var(--radius-3xl)` |
| `--dialog-content-gap` | Gap between items of the content. | `calc(var(--spacing) * 4)` |
| `--dialog-content` | Fill colour of the content. | `var(--white)` |
| `--dialog-content-padding` | Padding of the content. | `calc(var(--spacing) * 6)` |
| `--dialog-content-foreground` | Text colour of the content. | `var(--dark-90)` |
| `--dialog-content-shadow` | Shadow of the content. | `0 25px 50px -12px rgb(0 0 0 / 0.25)` |
| `--dialog-header-gap` | Gap between items of the header. | `calc(var(--spacing) * 1.5)` |
| `--dialog-footer-gap` | Gap between items of the footer. | `calc(var(--spacing) * 2)` |
| `--dialog-title-font-weight` | Font weight of the title. | `600` |
| `--dialog-title-foreground` | Text colour of the title. | `var(--navy)` |
| `--dialog-description-foreground` | Text colour of the description. | `var(--dark-90)` |
| `--dialog-close-foreground` | Colour of the close (×) button. | `var(--dark-75)` |
| `--dialog-close-hover-foreground` | Colour of the close button when hovered. | `var(--dark-100)` |
| `--dialog-collapsible-border` | Border colour of the dropdown collapsible. | `var(--light-l3)` |
| `--dialog-collapsible-foreground` | Text colour of the collapsible content. | `var(--dark-90)` |
| `--dialog-collapsible-trigger-foreground` | Text colour of the dropdown row. | `var(--navy)` |
| `--dialog-collapsible-trigger-hover-foreground` | Text colour of the dropdown row when hovered. | `var(--mint-75)` |
| `--dialog-collapsible-icon-foreground` | Chevron colour of the dropdown row. | `var(--dark-75)` |
| `--dialog-collapsible-toggle-foreground` | Text colour of the "View more" toggle. | `var(--mint-75)` |
| `--dialog-collapsible-toggle-hover-foreground` | Text colour of the "View more" toggle when hovered. | `var(--mint-45)` |
| `--dialog-collapsible-focus-ring` | Focus ring of the collapsible toggles. | `var(--mint-45)` |

</details>

<details>
<summary><strong>direction</strong> (0)</summary>

| Lever | What it changes | Default |
|---|---|---|


</details>

<details>
<summary><strong>drawer</strong> (15)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--drawer-overlay` | Fill colour of the overlay. | `color-mix(in oklab, var(--dark-100) 50%, transparent)` |
| `--drawer-popup-min-height` | Minimum height of the popup. | `calc(var(--spacing) * 0)` |
| `--drawer-popup-radius` | Corner radius of the popup. | `var(--radius-2xl)` |
| `--drawer-popup-border` | Border colour of the popup. | `var(--border)` |
| `--drawer-popup` | Fill colour of the popup. | `var(--popover)` |
| `--drawer-popup-foreground` | Text colour of the popup. | `var(--popover-foreground)` |
| `--drawer-content-min-height` | Minimum height of the content. | `calc(var(--spacing) * 0)` |
| `--drawer-header-gap` | Gap between items of the header. | `calc(var(--spacing) * 0.5)` |
| `--drawer-header-padding` | Padding of the header. | `calc(var(--spacing) * 4)` |
| `--drawer-header-gap\:md` | Gap between the title and description from the md breakpoint up. | `calc(var(--spacing) * 1.5)` |
| `--drawer-footer-gap` | Gap between items of the footer. | `calc(var(--spacing) * 2)` |
| `--drawer-footer-padding` | Padding of the footer. | `calc(var(--spacing) * 4)` |
| `--drawer-title-font-weight` | Font weight of the title. | `500` |
| `--drawer-title-foreground` | Text colour of the title. | `var(--foreground)` |
| `--drawer-description-foreground` | Text colour of the description. | `var(--muted-foreground)` |

</details>

<details>
<summary><strong>dropdown-menu</strong> (86)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--dropdown-menu-content-radius` | Corner radius of the content. | `var(--radius-lg)` |
| `--dropdown-menu-content-border` | Border colour of the content. | `var(--dark-15)` |
| `--dropdown-menu-content` | Fill colour of the content. | `var(--white)` |
| `--dropdown-menu-content-padding` | Padding of the content. | `calc(var(--spacing) * 1)` |
| `--dropdown-menu-content-foreground` | Text colour of the content. | `var(--dark-90)` |
| `--dropdown-menu-content-shadow` | Shadow of the content. | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` |
| `--dropdown-menu-label-padding-x` | Horizontal padding of the label. | `calc(var(--spacing) * 2.5)` |
| `--dropdown-menu-label-font-weight` | Font weight of the label. | `600` |
| `--dropdown-menu-label-foreground` | Text colour of the label. | `var(--navy)` |
| `--dropdown-menu-item-height` | Height of the item. | `calc(var(--spacing) * 8)` |
| `--dropdown-menu-item-gap` | Gap between items of the item. | `calc(var(--spacing) * 2.5)` |
| `--dropdown-menu-item-radius` | Corner radius of the item. | `var(--radius-md)` |
| `--dropdown-menu-item-padding-x` | Horizontal padding of the item. | `calc(var(--spacing) * 2.5)` |
| `--dropdown-menu-item-foreground` | Text colour of the item. | `var(--dark-90)` |
| `--dropdown-menu-item-highlighted` | Fill colour of the item when highlighted. | `var(--mint-l2)` |
| `--dropdown-menu-item-highlighted-foreground` | Text colour of the item when highlighted. | `var(--mint-90)` |
| `--dropdown-menu-item-disabled-foreground` | Text colour of the item when disabled. | `var(--dark-45)` |
| `--dropdown-menu-item-inset-padding-x` | Left padding of an indented row (inset items, labels and sub-menu triggers). | `calc(var(--spacing) * 9)` |
| `--dropdown-menu-item-destructive-foreground` | Text colour of a destructive item (e.g. Delete). | `var(--destructive)` |
| `--dropdown-menu-item-destructive-highlighted` | Fill colour of a destructive item when highlighted. | `var(--error-l1)` |
| `--dropdown-menu-item-destructive-highlighted-foreground` | Text colour of a destructive item when highlighted. | `var(--destructive)` |
| `--dropdown-menu-sub-trigger-height` | Height of the sub-trigger. | `calc(var(--spacing) * 8)` |
| `--dropdown-menu-sub-trigger-gap` | Gap between items of the sub-trigger. | `calc(var(--spacing) * 2.5)` |
| `--dropdown-menu-sub-trigger-radius` | Corner radius of the sub-trigger. | `var(--radius-md)` |
| `--dropdown-menu-sub-trigger-padding-x` | Horizontal padding of the sub-trigger. | `calc(var(--spacing) * 2.5)` |
| `--dropdown-menu-sub-trigger-foreground` | Text colour of the sub-trigger. | `var(--dark-90)` |
| `--dropdown-menu-sub-trigger-highlighted` | Fill colour of the sub-trigger when highlighted. | `var(--mint-l2)` |
| `--dropdown-menu-sub-trigger-highlighted-foreground` | Text colour of the sub-trigger when highlighted. | `var(--mint-90)` |
| `--dropdown-menu-sub-trigger-disabled-foreground` | Text colour of the sub-trigger when disabled. | `var(--dark-45)` |
| `--dropdown-menu-sub-trigger-open` | Fill colour of the sub-trigger while open. | `var(--mint-l2)` |
| `--dropdown-menu-sub-trigger-open-foreground` | Text colour of the sub-trigger while open. | `var(--mint-90)` |
| `--dropdown-menu-checkbox-item-min-height` | Minimum height of the checkbox item. | `calc(var(--spacing) * 8)` |
| `--dropdown-menu-checkbox-item-radius` | Corner radius of the checkbox item. | `var(--radius-md)` |
| `--dropdown-menu-checkbox-item-padding-y` | Vertical padding of the checkbox item. | `calc(var(--spacing) * 1.5)` |
| `--dropdown-menu-checkbox-item-foreground` | Text colour of the checkbox item. | `var(--dark-100)` |
| `--dropdown-menu-checkbox-item-highlighted` | Fill colour of the checkbox item when highlighted. | `var(--light-l1)` |
| `--dropdown-menu-checkbox-item-disabled-foreground` | Text colour of the checkbox item when disabled. | `var(--dark-45)` |
| `--dropdown-menu-checkbox-item-gap` | Gap between items of the checkbox-item. | `calc(var(--spacing) * 2.5)` |
| `--dropdown-menu-checkbox-item-padding-x` | Horizontal padding of the checkbox-item. | `calc(var(--spacing) * 2.5)` |
| `--dropdown-menu-checkbox-item-indicator-size` | Width and height of the checkbox-item-indicator. | `calc(var(--spacing) * 4)` |
| `--dropdown-menu-checkbox-item-indicator-radius` | Corner radius of the checkbox-item-indicator. | `var(--radius-sm)` |
| `--dropdown-menu-checkbox-item-indicator-border` | Border colour of the checkbox-item-indicator. | `var(--dark-15)` |
| `--dropdown-menu-checkbox-item-indicator` | Fill colour of the checkbox-item-indicator. | `var(--white)` |
| `--dropdown-menu-checkbox-item-indicator-foreground` | Text colour of the checkbox-item-indicator. | `var(--navy)` |
| `--dropdown-menu-radio-item-min-height` | Minimum height of the radio item. | `calc(var(--spacing) * 8)` |
| `--dropdown-menu-radio-item-radius` | Corner radius of the radio item. | `var(--radius-md)` |
| `--dropdown-menu-radio-item-padding-y` | Vertical padding of the radio item. | `calc(var(--spacing) * 1.5)` |
| `--dropdown-menu-radio-item-foreground` | Text colour of the radio item. | `var(--dark-100)` |
| `--dropdown-menu-radio-item-highlighted` | Fill colour of the radio item when highlighted. | `var(--light-l1)` |
| `--dropdown-menu-radio-item-disabled-foreground` | Text colour of the radio item when disabled. | `var(--dark-45)` |
| `--dropdown-menu-radio-item-gap` | Gap between items of the radio-item. | `calc(var(--spacing) * 2.5)` |
| `--dropdown-menu-radio-item-padding-x` | Horizontal padding of the radio-item. | `calc(var(--spacing) * 2.5)` |
| `--dropdown-menu-radio-item-checked` | Fill colour of the radio-item when checked. | `var(--mint-l2)` |
| `--dropdown-menu-radio-item-checked-foreground` | Text colour of the radio-item when checked. | `var(--mint-90)` |
| `--dropdown-menu-separator-height` | Height of the separator. | `1px` |
| `--dropdown-menu-separator` | Fill colour of the separator. | `var(--light-l3)` |
| `--dropdown-menu-shortcut-foreground` | Text colour of the shortcut. | `var(--dark-75)` |
| `--dropdown-menu-icon-trigger-mint-foreground` | Icon colour (mint tone). | `var(--mint-75)` |
| `--dropdown-menu-icon-trigger-mint-hover-foreground` | Icon colour when hovered or open (mint tone). | `var(--mint-45)` |
| `--dropdown-menu-icon-trigger-dark-foreground` | Icon colour (dark tone). | `var(--dark-75)` |
| `--dropdown-menu-icon-trigger-dark-hover-foreground` | Icon colour when hovered or open (dark tone). | `var(--dark-100)` |
| `--dropdown-menu-icon-trigger-navy-foreground` | Icon colour (navy tone). | `var(--navy)` |
| `--dropdown-menu-icon-trigger-navy-hover-foreground` | Icon colour when hovered or open (navy tone). | `var(--dark-75)` |
| `--dropdown-menu-icon-trigger-focus-ring` | Focus ring of the icon trigger. | `var(--mint-45)` |
| `--dropdown-menu-icon-trigger-disabled-foreground` | Icon colour when disabled. | `var(--dark-45)` |
| `--dropdown-menu-card-trigger` | Fill colour of the card trigger. | `var(--white)` |
| `--dropdown-menu-card-trigger-border` | Border colour of the card trigger. | `var(--dark-15)` |
| `--dropdown-menu-card-trigger-radius` | Corner radius of the card trigger. | `var(--radius-lg)` |
| `--dropdown-menu-card-trigger-hover-border` | Border colour of the card trigger when hovered. | `var(--mint-30)` |
| `--dropdown-menu-card-trigger-open` | Fill colour of the card trigger while open. | `var(--mint-l4)` |
| `--dropdown-menu-card-trigger-open-border` | Border colour of the card trigger while open or focused. | `var(--mint-45)` |
| `--dropdown-menu-card-trigger-open-ring` | Ring colour of the card trigger while open or focused. | `color-mix(in oklab, var(--mint-45) 30%, transparent)` |
| `--dropdown-menu-card-trigger-open-icon-foreground` | Chevron colour while open. | `var(--mint-75)` |
| `--dropdown-menu-card-trigger-disabled` | Fill colour of the card trigger when disabled. | `var(--light-l2)` |
| `--dropdown-menu-card-trigger-label-foreground` | Text colour of the small label above the title. | `var(--dark-90)` |
| `--dropdown-menu-card-trigger-foreground` | Text colour of the title. | `var(--dark-100)` |
| `--dropdown-menu-card-trigger-meta-foreground` | Colour of the right-hand meta text and the chevron. | `var(--dark-75)` |
| `--dropdown-menu-card-item` | Fill colour of an option card. | `var(--white)` |
| `--dropdown-menu-card-item-border` | Border colour of an option card. | `var(--dark-15)` |
| `--dropdown-menu-card-item-radius` | Corner radius of an option card. | `var(--radius-lg)` |
| `--dropdown-menu-card-item-highlighted` | Fill colour of an option card when highlighted. | `var(--light-l1)` |
| `--dropdown-menu-card-item-highlighted-border` | Border colour of an option card when highlighted. | `var(--mint-45)` |
| `--dropdown-menu-card-item-checked` | Fill colour of the chosen option card. | `var(--mint-l3)` |
| `--dropdown-menu-card-item-checked-border` | Border colour of the chosen option card. | `var(--mint-45)` |
| `--dropdown-menu-card-item-foreground` | Text colour of an option card title. | `var(--dark-100)` |
| `--dropdown-menu-card-item-meta-foreground` | Text colour of an option card meta line. | `var(--dark-75)` |

</details>

<details>
<summary><strong>empty</strong> (15)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--empty-gap` | Gap between items of the empty. | `calc(var(--spacing) * 4)` |
| `--empty-radius` | Corner radius of the empty. | `var(--radius-lg)` |
| `--empty-padding-x` | Horizontal padding of the empty. | `calc(var(--spacing) * 6)` |
| `--empty-padding-y` | Vertical padding of the empty. | `calc(var(--spacing) * 10)` |
| `--empty-outline-border` | Border colour of the empty state (outline variant). | `var(--border)` |
| `--empty-muted` | Fill colour of the empty state (muted variant). | `var(--muted)` |
| `--empty-header-gap` | Gap between items of the header. | `calc(var(--spacing) * 1.5)` |
| `--empty-icon-icon-size` | Width and height of the icon (icon variant). | `calc(var(--spacing) * 10)` |
| `--empty-icon-icon-radius` | Corner radius of the icon (icon variant). | `var(--radius-full)` |
| `--empty-icon-icon` | Fill colour of the icon (icon variant). | `var(--accent)` |
| `--empty-icon-icon-foreground` | Text colour of the icon (icon variant). | `var(--mint-75)` |
| `--empty-title-font-weight` | Font weight of the title. | `600` |
| `--empty-title-foreground` | Text colour of the title. | `var(--navy)` |
| `--empty-description-foreground` | Text colour of the description. | `var(--muted-foreground)` |
| `--empty-content-gap` | Gap between items of the content. | `calc(var(--spacing) * 4)` |

</details>

<details>
<summary><strong>field</strong> (21)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--field-set-gap` | Gap between items of the set. | `calc(var(--spacing) * 5)` |
| `--field-set-with-choices-gap` | Gap between items of a field set that holds a checkbox or radio group. | `calc(var(--spacing) * 3)` |
| `--field-legend-font-weight` | Font weight of the legend. | `600` |
| `--field-legend-foreground` | Text colour of the legend. | `var(--navy)` |
| `--field-group-gap` | Gap between items of the group. | `calc(var(--spacing) * 5)` |
| `--field-group-checkbox-group-gap` | Gap between the checkboxes of a field group used as a checkbox group. | `calc(var(--spacing) * 3)` |
| `--field-gap` | Gap between items of the field. | `calc(var(--spacing) * 1.5)` |
| `--field-content-gap` | Gap between items of the content. | `calc(var(--spacing) * 1)` |
| `--field-label-gap` | Gap between items of the label. | `calc(var(--spacing) * 2)` |
| `--field-label-font-weight` | Font weight of the label. | `600` |
| `--field-label-foreground` | Text colour of the label. | `var(--navy)` |
| `--field-label-disabled-opacity` | Opacity of the label when its field is disabled. Dimmed: at full strength the greyed form read as live. | `0.5` |
| `--field-description-font-weight` | Font weight of the description. | `400` |
| `--field-description-foreground` | Text colour of the description. | `var(--muted-foreground)` |
| `--field-separator-height` | Height of the separator. | `calc(var(--spacing) * 5)` |
| `--field-separator-content` | Fill colour of the separator-content. | `var(--background)` |
| `--field-separator-content-padding-x` | Horizontal padding of the separator-content. | `calc(var(--spacing) * 2)` |
| `--field-separator-content-foreground` | Text colour of the separator-content. | `var(--muted-foreground)` |
| `--field-error-font-weight` | Font weight of the error. | `400` |
| `--field-error-foreground` | Text colour of the error. | `var(--destructive)` |
| `--field-label-required-foreground` | Colour of the asterisk on a required field's label. | `var(--mint-45)` |

</details>

<details>
<summary><strong>file-drop-zone</strong> (20)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--file-drop-zone-min-height` | Minimum height of the drop zone. | `calc(var(--spacing) * 26)` |
| `--file-drop-zone-gap` | Gap between the icon and the text. | `calc(var(--spacing) * 2.5)` |
| `--file-drop-zone-padding` | Padding inside the drop zone. | `calc(var(--spacing) * 4)` |
| `--file-drop-zone-radius` | Corner radius of the drop zone. | `var(--radius-lg)` |
| `--file-drop-zone` | Fill colour of the drop zone. | `var(--white)` |
| `--file-drop-zone-foreground` | Text colour of the drop zone. | `var(--dark-90)` |
| `--file-drop-zone-border` | Dashed border colour of the drop zone. | `var(--dark-15)` |
| `--file-drop-zone-hover` | Fill colour on hover, focus and while a file is dragged over. | `var(--mint-l3)` |
| `--file-drop-zone-hover-foreground` | Text colour on hover, focus and while a file is dragged over. | `var(--mint-75)` |
| `--file-drop-zone-hover-border` | Border colour on hover, focus and while a file is dragged over. | `var(--mint-45)` |
| `--file-drop-zone-focus-ring` | Focus ring colour. | `color-mix(in oklab, var(--mint-45) 30%, transparent)` |
| `--file-drop-zone-invalid` | Fill colour in the error state. | `var(--error-l1)` |
| `--file-drop-zone-invalid-border` | Border colour in the error state. | `var(--destructive)` |
| `--file-drop-zone-invalid-focus-ring` | Focus ring colour in the error state. | `color-mix(in oklab, var(--destructive) 20%, transparent)` |
| `--file-drop-zone-disabled` | Fill colour when disabled. | `var(--light-l1)` |
| `--file-drop-zone-disabled-foreground` | Text and icon colour when disabled. | `var(--dark-45)` |
| `--file-drop-zone-icon-foreground` | Colour of the upload icon. | `var(--mint-60)` |
| `--file-drop-zone-icon-hover-foreground` | Colour of the upload icon on hover and while a file is dragged over. | `var(--mint-75)` |
| `--file-drop-zone-browse-foreground` | Colour of the word "browse". | `var(--mint-75)` |
| `--file-drop-zone-browse-font-weight` | Font weight of the word "browse". | `600` |

</details>

<details>
<summary><strong>file-upload</strong> (13)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--file-upload-gap` | Gap between the drop zone, its message and the list of files. | `calc(var(--spacing) * 2)` |
| `--file-upload-list-gap` | Gap between the file cards. | `calc(var(--spacing) * 2)` |
| `--file-upload-message-foreground` | Colour of the message when a picked file isn't accepted (wrong type or too large). | `var(--destructive)` |
| `--file-upload-action-size` | Width and height of a file card's download, delete and cancel buttons. | `calc(var(--spacing) * 8)` |
| `--file-upload-action-icon-size` | Icon size of a file card's buttons. | `calc(var(--spacing) * 5)` |
| `--file-upload-action-sm-icon-size` | Icon size of the buttons on a compact (sm) card: an upload in progress, completed or failed. | `calc(var(--spacing) * 4)` |
| `--file-upload-action-focus-ring` | Focus ring colour of a file card's buttons. | `var(--mint-45)` |
| `--file-upload-action-download-foreground` | Colour of the download button. | `var(--mint-75)` |
| `--file-upload-action-download-hover-foreground` | Colour of the download button on hover. | `var(--mint-90)` |
| `--file-upload-action-delete-foreground` | Colour of the delete button. | `var(--destructive)` |
| `--file-upload-action-delete-hover-foreground` | Colour of the delete button on hover. | `var(--error-90)` |
| `--file-upload-action-cancel-foreground` | Colour of the cancel (×) button. | `var(--dark-75)` |
| `--file-upload-action-cancel-hover-foreground` | Colour of the cancel (×) button on hover. | `var(--dark-100)` |

</details>

<details>
<summary><strong>hover-card</strong> (8)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--hover-card-content-width` | Width of the content. | `calc(var(--spacing) * 75)` |
| `--hover-card-content-gap` | Gap between items of the content. | `calc(var(--spacing) * 3)` |
| `--hover-card-content-radius` | Corner radius of the content. | `var(--radius-lg)` |
| `--hover-card-content-border` | Border colour of the content. | `var(--light-l3)` |
| `--hover-card-content` | Fill colour of the content. | `var(--white)` |
| `--hover-card-content-padding` | Padding of the content. | `calc(var(--spacing) * 4)` |
| `--hover-card-content-foreground` | Text colour of the content. | `var(--dark-90)` |
| `--hover-card-content-shadow` | Shadow of the content. | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` |

</details>

<details>
<summary><strong>icon-tile</strong> (16)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--icon-tile-mint` | Fill colour of the tile (mint variant). | `var(--mint-l3)` |
| `--icon-tile-mint-foreground` | Icon colour of the tile (mint variant). | `var(--mint-75)` |
| `--icon-tile-navy` | Fill colour of the tile (navy variant). | `var(--navy)` |
| `--icon-tile-navy-foreground` | Icon colour of the tile (navy variant). | `var(--white)` |
| `--icon-tile-warning` | Fill colour of the tile (warning variant). | `var(--warning-l2)` |
| `--icon-tile-warning-foreground` | Icon colour of the tile (warning variant). | `var(--warning-75)` |
| `--icon-tile-error` | Fill colour of the tile (error variant). | `var(--error-l1)` |
| `--icon-tile-error-foreground` | Icon colour of the tile (error variant). | `var(--destructive)` |
| `--icon-tile-lime` | Fill colour of the tile (lime variant). | `var(--lime)` |
| `--icon-tile-lime-foreground` | Icon colour of the tile (lime variant). | `var(--navy)` |
| `--icon-tile-neutral` | Fill colour of the tile (neutral variant). | `var(--light-l2)` |
| `--icon-tile-neutral-foreground` | Icon colour of the tile (neutral variant). | `var(--navy)` |
| `--icon-tile-sm-size` | Width and height of the tile (sm size). | `calc(var(--spacing) * 8)` |
| `--icon-tile-md-size` | Width and height of the tile (md size). | `calc(var(--spacing) * 10)` |
| `--icon-tile-lg-size` | Width and height of the tile (lg size). | `calc(var(--spacing) * 12)` |
| `--icon-tile-square-radius` | Corner radius of the tile (square shape). | `var(--radius-lg)` |

</details>

<details>
<summary><strong>input-group</strong> (22)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--input-group-min-height` | Minimum height of the input-group. | `calc(var(--spacing) * 10)` |
| `--input-group-gap` | Gap between items of the input-group. | `calc(var(--spacing) * 2)` |
| `--input-group-radius` | Corner radius of the input-group. | `var(--radius-lg)` |
| `--input-group-border` | Border colour of the input-group. | `var(--dark-45)` |
| `--input-group` | Fill colour of the input-group. | `var(--white)` |
| `--input-group-padding-x` | Horizontal padding of the input-group. | `calc(var(--spacing) * 3)` |
| `--input-group-focus-border` | Border colour of the input-group when focused. | `var(--mint-45)` |
| `--input-group-focus-ring` | Ring colour of the input-group when focused. | `color-mix(in oklab, var(--mint-45) 30%, transparent)` |
| `--input-group-addon-gap` | Gap between items of the addon. | `calc(var(--spacing) * 2)` |
| `--input-group-addon-foreground` | Text colour of the addon. | `var(--dark-75)` |
| `--input-group-button-gap` | Gap between items of the button. | `calc(var(--spacing) * 1)` |
| `--input-group-button-radius` | Corner radius of the button. | `var(--radius-md)` |
| `--input-group-button-xs-height` | Height of the button (xs size). | `calc(var(--spacing) * 7)` |
| `--input-group-button-xs-padding-x` | Horizontal padding of the button (xs size). | `calc(var(--spacing) * 2.5)` |
| `--input-group-button-sm-height` | Height of the button (sm size). | `calc(var(--spacing) * 8)` |
| `--input-group-button-sm-padding-x` | Horizontal padding of the button (sm size). | `calc(var(--spacing) * 3)` |
| `--input-group-button-icon-xs-size` | Width and height of the button (icon-xs size). | `calc(var(--spacing) * 7)` |
| `--input-group-button-icon-sm-size` | Width and height of the button (icon-sm size). | `calc(var(--spacing) * 8)` |
| `--input-group-control-min-height` | Minimum height of the control. | `calc(var(--spacing) * 9)` |
| `--input-group-control-radius` | Corner radius of the control. | `0` |
| `--input-group-control-padding-x` | Horizontal padding of the control. | `calc(var(--spacing) * 0)` |
| `--input-group-control-shadow` | Shadow of the control. | `0 0 #0000` |

</details>

<details>
<summary><strong>input-otp</strong> (13)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--input-otp-group-gap` | Gap between items of the group. | `calc(var(--spacing) * 0.5)` |
| `--input-otp-slot-size` | Width and height of the slot. | `calc(var(--spacing) * 8)` |
| `--input-otp-slot-radius` | Corner radius of the slot. | `var(--radius-md)` |
| `--input-otp-slot-border` | Border colour of the slot. | `var(--dark-45)` |
| `--input-otp-slot` | Fill colour of the slot. | `var(--white)` |
| `--input-otp-slot-font-weight` | Font weight of the slot. | `500` |
| `--input-otp-slot-foreground` | Text colour of the slot. | `var(--dark-100)` |
| `--input-otp-slot-active-border` | Border colour of the slot when active. | `var(--mint-45)` |
| `--input-otp-slot-active-foreground` | Text colour of the slot when active. | `var(--navy)` |
| `--input-otp-slot-active-ring` | Ring colour of the slot when active. | `color-mix(in oklab, var(--mint-45) 30%, transparent)` |
| `--input-otp-slot-invalid-border` | Border colour of the slot when invalid. | `var(--destructive)` |
| `--input-otp-separator-padding-x` | Horizontal padding of the separator. | `calc(var(--spacing) * 1)` |
| `--input-otp-separator-foreground` | Text colour of the separator. | `var(--dark-75)` |

</details>

<details>
<summary><strong>input</strong> (13)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--input-radius` | Corner radius of the input. | `var(--radius-lg)` |
| `--input-border` | Border colour of the input. | `var(--dark-45)` |
| `--input-fill` | Fill colour of the input. | `var(--white)` |
| `--input-padding-x` | Horizontal padding of the input. | `calc(var(--spacing) * 3)` |
| `--input-foreground` | Text colour of the input. | `var(--dark-100)` |
| `--input-placeholder` | Placeholder text colour of the input. | `var(--dark-90)` |
| `--input-focus-border` | Border colour of the input when focused. | `var(--mint-45)` |
| `--input-focus-ring` | Ring colour of the input when focused. | `color-mix(in oklab, var(--mint-45) 30%, transparent)` |
| `--input-invalid-border` | Border colour of the input when invalid. | `var(--destructive)` |
| `--input-disabled` | Fill colour of the input when disabled. | `var(--light-l2)` |
| `--input-disabled-foreground` | Text colour of the input when disabled. | `var(--dark-45)` |
| `--input-height` | Height of the input. | `calc(var(--spacing) * 10)` |
| `--input-padding-y` | Vertical padding of the input. | `calc(var(--spacing) * 1)` |

</details>

<details>
<summary><strong>item</strong> (32)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--item-group-gap` | Gap between items of the group. | `calc(var(--spacing) * 4)` |
| `--item-group-sm-gap` | Gap between small (sm) items. | `calc(var(--spacing) * 2.5)` |
| `--item-group-xs-gap` | Gap between extra-small (xs) items. | `calc(var(--spacing) * 2)` |
| `--item-radius` | Corner radius of the item. | `var(--radius-2xl)` |
| `--item-focus-border` | Border colour of the item when focused. | `var(--ring)` |
| `--item-focus-ring` | Ring colour of the item when focused. | `color-mix(in oklab, var(--ring) 50%, transparent)` |
| `--item-outline-border` | Border colour of the item (outline variant). | `var(--border)` |
| `--item-muted` | Fill colour of the item (muted variant). | `color-mix(in oklab, var(--muted) 50%, transparent)` |
| `--item-md-gap` | Gap between items of the item (md size). | `calc(var(--spacing) * 3.5)` |
| `--item-md-padding-x` | Horizontal padding of the item (md size). | `calc(var(--spacing) * 4)` |
| `--item-md-padding-y` | Vertical padding of the item (md size). | `calc(var(--spacing) * 3.5)` |
| `--item-sm-gap` | Gap between items of the item (sm size). | `calc(var(--spacing) * 3.5)` |
| `--item-sm-padding-x` | Horizontal padding of the item (sm size). | `calc(var(--spacing) * 3.5)` |
| `--item-sm-padding-y` | Vertical padding of the item (sm size). | `calc(var(--spacing) * 3)` |
| `--item-xs-gap` | Gap between items of the item (xs size). | `calc(var(--spacing) * 2.5)` |
| `--item-xs-padding-x` | Horizontal padding of the item (xs size). | `calc(var(--spacing) * 3)` |
| `--item-xs-padding-y` | Vertical padding of the item (xs size). | `calc(var(--spacing) * 2.5)` |
| `--item-media-gap` | Gap between items of the media. | `calc(var(--spacing) * 2)` |
| `--item-media-image-size` | Width and height of the media (image variant). | `calc(var(--spacing) * 10)` |
| `--item-media-image-radius` | Corner radius of the media (image variant). | `var(--radius-lg)` |
| `--item-media-image-sm-size` | Size of the image in a small (sm) item. | `calc(var(--spacing) * 8)` |
| `--item-media-image-xs-size` | Size of the image in an extra-small (xs) item. | `calc(var(--spacing) * 6)` |
| `--item-media-image-xs-radius` | Corner radius of the image in an extra-small (xs) item. | `var(--radius-md)` |
| `--item-content-gap` | Gap between items of the content. | `calc(var(--spacing) * 1)` |
| `--item-content-xs-gap` | Gap between the title and description in an extra-small (xs) item. | `calc(var(--spacing) * 0.5)` |
| `--item-title-gap` | Gap between items of the title. | `calc(var(--spacing) * 2)` |
| `--item-title-font-weight` | Font weight of the title. | `500` |
| `--item-description-font-weight` | Font weight of the description. | `400` |
| `--item-description-foreground` | Text colour of the description. | `var(--muted-foreground)` |
| `--item-actions-gap` | Gap between items of the actions. | `calc(var(--spacing) * 2)` |
| `--item-header-gap` | Gap between items of the header. | `calc(var(--spacing) * 2)` |
| `--item-footer-gap` | Gap between items of the footer. | `calc(var(--spacing) * 2)` |

</details>

<details>
<summary><strong>kbd</strong> (8)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--kbd-height` | Height of the kbd. | `calc(var(--spacing) * 5)` |
| `--kbd-gap` | Gap between items of the kbd. | `calc(var(--spacing) * 1)` |
| `--kbd-radius` | Corner radius of the kbd. | `var(--radius-sm)` |
| `--kbd` | Fill colour of the kbd. | `var(--muted)` |
| `--kbd-padding-x` | Horizontal padding of the kbd. | `calc(var(--spacing) * 1)` |
| `--kbd-font-weight` | Font weight of the kbd. | `500` |
| `--kbd-foreground` | Text colour of the kbd. | `var(--muted-foreground)` |
| `--kbd-group-gap` | Gap between items of the group. | `calc(var(--spacing) * 1)` |

</details>

<details>
<summary><strong>label</strong> (3)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--label-gap` | Gap between items of the label. | `calc(var(--spacing) * 2)` |
| `--label-font-weight` | Font weight of the label. | `500` |
| `--label-foreground` | Text colour of the label. | `var(--dark-90)` |

</details>

<details>
<summary><strong>menubar</strong> (56)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--menubar-height` | Height of the menubar. | `calc(var(--spacing) * 9)` |
| `--menubar-radius` | Corner radius of the menubar. | `var(--radius-md)` |
| `--menubar-border` | Border colour of the menubar. | `var(--border)` |
| `--menubar-padding` | Padding of the menubar. | `calc(var(--spacing) * 1)` |
| `--menubar-trigger-radius` | Corner radius of the trigger. | `var(--radius-sm)` |
| `--menubar-trigger-padding-x` | Horizontal padding of the trigger. | `calc(var(--spacing) * 2)` |
| `--menubar-trigger-padding-y` | Vertical padding of the trigger. | `calc(var(--spacing) * 0.75)` |
| `--menubar-trigger-font-weight` | Font weight of the trigger. | `500` |
| `--menubar-trigger-hover-foreground` | Text colour of the trigger when hovered. | `var(--mint-75)` |
| `--menubar-trigger-open` | Fill colour of the trigger while open. | `var(--muted)` |
| `--menubar-content-radius` | Corner radius of the content. | `var(--radius-lg)` |
| `--menubar-content-border` | Border colour of the content. | `var(--border)` |
| `--menubar-content` | Fill colour of the content. | `var(--popover)` |
| `--menubar-content-padding` | Padding of the content. | `calc(var(--spacing) * 1)` |
| `--menubar-content-foreground` | Text colour of the content. | `var(--popover-foreground)` |
| `--menubar-content-shadow` | Shadow of the content. | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` |
| `--menubar-item-gap` | Gap between items of the item. | `calc(var(--spacing) * 2.5)` |
| `--menubar-item-radius` | Corner radius of the item. | `var(--radius-md)` |
| `--menubar-item-padding-x` | Horizontal padding of the item. | `calc(var(--spacing) * 3)` |
| `--menubar-item-padding-y` | Vertical padding of the item. | `calc(var(--spacing) * 2)` |
| `--menubar-item-focus` | Fill colour of the item when focused. | `var(--accent)` |
| `--menubar-item-focus-foreground` | Text colour of the item when focused. | `var(--accent-foreground)` |
| `--menubar-item-disabled-opacity` | Opacity of the item when disabled. | `0.5` |
| `--menubar-item-inset-padding-x` | Left padding of an indented row (inset items, labels and sub-menu triggers). | `calc(var(--spacing) * 9.5)` |
| `--menubar-checkbox-item-gap` | Gap between items of the checkbox-item. | `calc(var(--spacing) * 2.5)` |
| `--menubar-checkbox-item-radius` | Corner radius of the checkbox-item. | `var(--radius-md)` |
| `--menubar-checkbox-item-padding-y` | Vertical padding of the checkbox-item. | `calc(var(--spacing) * 2)` |
| `--menubar-checkbox-item-focus` | Fill colour of the checkbox-item when focused. | `var(--accent)` |
| `--menubar-checkbox-item-focus-foreground` | Text colour of the checkbox-item when focused. | `var(--accent-foreground)` |
| `--menubar-checkbox-item-disabled-opacity` | Opacity of the checkbox-item when disabled. | `0.5` |
| `--menubar-radio-item-gap` | Gap between items of the radio-item. | `calc(var(--spacing) * 2.5)` |
| `--menubar-radio-item-radius` | Corner radius of the radio-item. | `var(--radius-md)` |
| `--menubar-radio-item-padding-y` | Vertical padding of the radio-item. | `calc(var(--spacing) * 2)` |
| `--menubar-radio-item-focus` | Fill colour of the radio-item when focused. | `var(--accent)` |
| `--menubar-radio-item-focus-foreground` | Text colour of the radio-item when focused. | `var(--accent-foreground)` |
| `--menubar-radio-item-disabled-opacity` | Opacity of the radio-item when disabled. | `0.5` |
| `--menubar-label-padding-x` | Horizontal padding of the label. | `calc(var(--spacing) * 3.5)` |
| `--menubar-label-padding-y` | Vertical padding of the label. | `calc(var(--spacing) * 2.5)` |
| `--menubar-label-foreground` | Text colour of the label. | `var(--muted-foreground)` |
| `--menubar-separator-height` | Height of the separator. | `1px` |
| `--menubar-separator` | Fill colour of the separator. | `color-mix(in oklab, var(--border) 50%, transparent)` |
| `--menubar-shortcut-foreground` | Text colour of the shortcut. | `var(--muted-foreground)` |
| `--menubar-sub-trigger-gap` | Gap between items of the sub-trigger. | `calc(var(--spacing) * 2)` |
| `--menubar-sub-trigger-radius` | Corner radius of the sub-trigger. | `var(--radius-md)` |
| `--menubar-sub-trigger-padding-x` | Horizontal padding of the sub-trigger. | `calc(var(--spacing) * 3)` |
| `--menubar-sub-trigger-padding-y` | Vertical padding of the sub-trigger. | `calc(var(--spacing) * 2)` |
| `--menubar-sub-trigger-focus` | Fill colour of the sub-trigger when focused. | `var(--accent)` |
| `--menubar-sub-trigger-focus-foreground` | Text colour of the sub-trigger when focused. | `var(--accent-foreground)` |
| `--menubar-sub-trigger-open` | Fill colour of the sub-trigger while open. | `var(--accent)` |
| `--menubar-sub-trigger-open-foreground` | Text colour of the sub-trigger while open. | `var(--accent-foreground)` |
| `--menubar-sub-content-radius` | Corner radius of the sub-content. | `var(--radius-lg)` |
| `--menubar-sub-content-border` | Border colour of the sub-content. | `var(--border)` |
| `--menubar-sub-content` | Fill colour of the sub-content. | `var(--popover)` |
| `--menubar-sub-content-padding` | Padding of the sub-content. | `calc(var(--spacing) * 1)` |
| `--menubar-sub-content-foreground` | Text colour of the sub-content. | `var(--popover-foreground)` |
| `--menubar-sub-content-shadow` | Shadow of the sub-content. | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` |

</details>

<details>
<summary><strong>native-select</strong> (21)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--native-select-height` | Height of the native-select. | `calc(var(--spacing) * 10)` |
| `--native-select-radius` | Corner radius of the native-select. | `var(--radius-lg)` |
| `--native-select-border` | Border colour of the native-select. | `var(--dark-45)` |
| `--native-select` | Fill colour of the native-select. | `var(--white)` |
| `--native-select-padding-y` | Vertical padding of the native-select. | `calc(var(--spacing) * 1)` |
| `--native-select-foreground` | Text colour of the native-select. | `var(--dark-100)` |
| `--native-select-placeholder` | Placeholder text colour of the native-select. | `var(--dark-90)` |
| `--native-select-focus-border` | Border colour of the native-select when focused. | `var(--mint-45)` |
| `--native-select-focus-ring` | Ring colour of the native-select when focused. | `color-mix(in oklab, var(--mint-45) 30%, transparent)` |
| `--native-select-invalid-border` | Border colour of the native-select when invalid. | `var(--destructive)` |
| `--native-select-invalid-ring` | Ring colour of the native-select when invalid. | `color-mix(in oklab, var(--destructive) 20%, transparent)` |
| `--native-select-disabled` | Fill colour of the native-select when disabled. | `var(--light-l2)` |
| `--native-select-disabled-foreground` | Text colour of the native-select when disabled. | `var(--dark-45)` |
| `--native-select-sm-height` | Height of a small (sm) native select. | `calc(var(--spacing) * 9)` |
| `--native-select-icon-size` | Width and height of the icon. | `calc(var(--spacing) * 3.5)` |
| `--native-select-icon-foreground` | Text colour of the icon. | `var(--dark-75)` |
| `--native-select-icon-disabled-foreground` | Text colour of the icon when disabled. | `var(--dark-45)` |
| `--native-select-option` | Fill colour of the option. | `Canvas` |
| `--native-select-option-foreground` | Text colour of the option. | `CanvasText` |
| `--native-select-optgroup` | Fill colour of the optgroup. | `Canvas` |
| `--native-select-optgroup-foreground` | Text colour of the optgroup. | `CanvasText` |

</details>

<details>
<summary><strong>navigation-menu</strong> (25)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--navigation-menu-list-gap` | Gap between items of the list. | `calc(var(--spacing) * 0)` |
| `--navigation-menu-trigger-height` | Height of the trigger. | `calc(var(--spacing) * 10)` |
| `--navigation-menu-trigger-gap` | Gap between items of the trigger. | `calc(var(--spacing) * 1)` |
| `--navigation-menu-trigger-radius` | Corner radius of the trigger. | `var(--radius-lg)` |
| `--navigation-menu-trigger-padding-x` | Horizontal padding of the trigger. | `calc(var(--spacing) * 3)` |
| `--navigation-menu-trigger-font-weight` | Font weight of the trigger. | `500` |
| `--navigation-menu-trigger-foreground` | Text colour of the trigger. | `var(--dark-100)` |
| `--navigation-menu-trigger-hover-foreground` | Text colour of the trigger when hovered. | `var(--mint-75)` |
| `--navigation-menu-trigger-focus-ring` | Ring colour of the trigger when focused. | `color-mix(in oklab, var(--mint-45) 30%, transparent)` |
| `--navigation-menu-trigger-disabled-foreground` | Text colour of the trigger when disabled. | `var(--dark-45)` |
| `--navigation-menu-trigger-open` | Fill colour of the trigger while open. | `var(--mint-l4)` |
| `--navigation-menu-trigger-open-foreground` | Text colour of the trigger while open. | `var(--mint-75)` |
| `--navigation-menu-content-padding` | Padding of the content. | `calc(var(--spacing) * 1)` |
| `--navigation-menu-link-min-height` | Minimum height of the link. | `calc(var(--spacing) * 8)` |
| `--navigation-menu-link-gap` | Gap between items of the link. | `calc(var(--spacing) * 2)` |
| `--navigation-menu-link-radius` | Corner radius of the link. | `var(--radius-md)` |
| `--navigation-menu-link-padding-x` | Horizontal padding of the link. | `calc(var(--spacing) * 2)` |
| `--navigation-menu-link-padding-y` | Vertical padding of the link. | `calc(var(--spacing) * 1.5)` |
| `--navigation-menu-link-foreground` | Text colour of the link. | `var(--dark-100)` |
| `--navigation-menu-link-hover` | Fill colour of the link when hovered. | `var(--light-l1)` |
| `--navigation-menu-link-focus` | Fill colour of the link when focused. | `var(--light-l1)` |
| `--navigation-menu-link-focus-ring` | Ring colour of the link when focused. | `color-mix(in oklab, var(--mint-45) 30%, transparent)` |
| `--navigation-menu-link-active` | Fill colour of the link when active. | `var(--mint-l2)` |
| `--navigation-menu-link-active-foreground` | Text colour of the link when active. | `var(--mint-90)` |
| `--navigation-menu-indicator-height` | Height of the indicator. | `calc(var(--spacing) * 1.5)` |

</details>

<details>
<summary><strong>pagination</strong> (7)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--pagination-content-gap` | Gap between items of the content. | `calc(var(--spacing) * 1)` |
| `--pagination-ellipsis-size` | Width and height of the ellipsis. | `calc(var(--spacing) * 9)` |
| `--pagination-ellipsis-foreground` | Text colour of the ellipsis. | `var(--dark-90)` |
| `--pagination-link-foreground` | Text colour of a page number. | `var(--dark-90)` |
| `--pagination-link-hover-foreground` | Text colour of a page number when hovered. | `var(--navy)` |
| `--pagination-link-active` | Fill of the current page. | `var(--lime)` |
| `--pagination-link-active-foreground` | Text colour of the current page. | `var(--navy)` |

</details>

<details>
<summary><strong>popover</strong> (11)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--popover-content-width` | Width of the content. | `calc(var(--spacing) * 72)` |
| `--popover-content-gap` | Gap between items of the content. | `calc(var(--spacing) * 4)` |
| `--popover-content-radius` | Corner radius of the content. | `var(--radius-2xl)` |
| `--popover-content-border` | Border colour of the content. | `var(--border)` |
| `--popover-content` | Fill colour of the content. | `var(--popover)` |
| `--popover-content-padding` | Padding of the content. | `calc(var(--spacing) * 4)` |
| `--popover-content-foreground` | Text colour of the content. | `var(--popover-foreground)` |
| `--popover-content-shadow` | Shadow of the content. | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` |
| `--popover-header-gap` | Gap between items of the header. | `calc(var(--spacing) * 1)` |
| `--popover-title-font-weight` | Font weight of the title. | `500` |
| `--popover-description-foreground` | Text colour of the description. | `var(--muted-foreground)` |

</details>

<details>
<summary><strong>progress</strong> (7)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--progress-gap` | Gap between items of the progress. | `calc(var(--spacing) * 3)` |
| `--progress-track-height` | Height of the track. | `calc(var(--spacing) * 2)` |
| `--progress-track-radius` | Corner radius of the track. | `var(--radius-full)` |
| `--progress-track` | Fill colour of the track. | `var(--dark-15)` |
| `--progress-indicator` | Fill colour of the indicator. | `var(--primary)` |
| `--progress-label-font-weight` | Font weight of the label. | `500` |
| `--progress-value-foreground` | Text colour of the value. | `var(--muted-foreground)` |

</details>

<details>
<summary><strong>radio-group</strong> (24)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--radio-group-gap` | Gap between items of the radio-group. | `calc(var(--spacing) * 2.5)` |
| `--radio-group-sm-gap` | Gap between options (sm size). | `calc(var(--spacing) * 2)` |
| `--radio-group-lg-gap` | Gap between options (lg size). | `calc(var(--spacing) * 3)` |
| `--radio-group-card-gap` | Gap between options (card variant). | `calc(var(--spacing) * 2)` |
| `--radio-group-item-radius` | Corner radius of the item. | `var(--radius-full)` |
| `--radio-group-item-border` | Border colour of the item. | `var(--dark-45)` |
| `--radio-group-item` | Fill colour of the item. | `var(--white)` |
| `--radio-group-item-size` | Width and height of the item. | `calc(var(--spacing) * 4)` |
| `--radio-group-item-sm-size` | Width and height of the radio (sm size). | `calc(var(--spacing) * 3.5)` |
| `--radio-group-item-lg-size` | Width and height of the radio (lg size). | `calc(var(--spacing) * 5)` |
| `--radio-group-item-focus-border` | Border colour of the item when focused. | `var(--mint-45)` |
| `--radio-group-item-focus-ring` | Ring colour of the item when focused. | `color-mix(in oklab, var(--mint-45) 30%, transparent)` |
| `--radio-group-item-checked-border` | Border colour of the item when checked. | `var(--mint-45)` |
| `--radio-group-item-invalid-border` | Border colour of the item when invalid. | `var(--destructive)` |
| `--radio-group-item-invalid-ring` | Ring colour of the item when invalid. | `color-mix(in oklab, var(--destructive) 20%, transparent)` |
| `--radio-group-item-disabled-opacity` | Opacity of the item when disabled. | `0.5` |
| `--radio-group-indicator` | Fill of the dot in a checked radio. | `var(--mint-45)` |
| `--radio-group-field-card` | Fill colour of an option card (card variant). | `var(--white)` |
| `--radio-group-field-card-border` | Border colour of an option card (card variant). | `var(--dark-45)` |
| `--radio-group-field-card-radius` | Corner radius of an option card (card variant). | `var(--radius-lg)` |
| `--radio-group-field-card-checked` | Fill colour of the chosen option card (card variant). | `var(--mint-l4)` |
| `--radio-group-field-card-checked-border` | Border colour of the chosen option card (card variant). | `var(--mint-45)` |
| `--radio-group-label-foreground` | Text colour of an option's label. | `var(--navy)` |
| `--radio-group-description-foreground` | Text colour of an option's description. | `var(--dark-75)` |

</details>

<details>
<summary><strong>resizable</strong> (3)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--resizable-handle-width` | Width of the handle. | `1px` |
| `--resizable-handle` | Fill colour of the handle. | `var(--border)` |
| `--resizable-handle-focus-ring` | Ring colour of the handle when focused. | `var(--ring)` |

</details>

<details>
<summary><strong>scroll-area</strong> (4)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--scroll-area-viewport-focus-ring` | Ring colour of the viewport when focused. | `color-mix(in oklab, var(--ring) 50%, transparent)` |
| `--scroll-area-scrollbar-padding` | Padding of the scrollbar. | `1px` |
| `--scroll-area-thumb-radius` | Corner radius of the thumb. | `var(--radius-full)` |
| `--scroll-area-thumb` | Fill colour of the thumb. | `var(--border)` |

</details>

<details>
<summary><strong>select</strong> (63)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--select-trigger-height` | Height of the trigger. | `calc(var(--spacing) * 10)` |
| `--select-trigger-gap` | Gap between items of the trigger. | `calc(var(--spacing) * 2)` |
| `--select-trigger-radius` | Corner radius of the trigger. | `var(--radius-lg)` |
| `--select-trigger-border` | Border colour of the trigger. | `var(--dark-45)` |
| `--select-trigger` | Fill colour of the trigger. | `var(--white)` |
| `--select-trigger-padding-x` | Horizontal padding of the trigger. | `calc(var(--spacing) * 3)` |
| `--select-trigger-foreground` | Text colour of the trigger. | `var(--dark-100)` |
| `--select-trigger-hover-border` | Border colour of the trigger when hovered. | `var(--dark-75)` |
| `--select-trigger-focus-border` | Border colour of the trigger when focused. | `var(--mint-45)` |
| `--select-trigger-focus-ring` | Ring colour of the trigger when focused. | `color-mix(in oklab, var(--mint-45) 30%, transparent)` |
| `--select-trigger-placeholder` | Placeholder text colour of the trigger. | `var(--dark-90)` |
| `--select-trigger-open-border` | Border colour of the trigger while open. | `var(--mint-45)` |
| `--select-trigger-open` | Fill colour of the trigger while open. | `var(--mint-l4)` |
| `--select-trigger-open-foreground` | Text colour of the trigger while open. | `var(--mint-75)` |
| `--select-trigger-open-ring` | Ring colour of the trigger while open. | `color-mix(in oklab, var(--mint-45) 30%, transparent)` |
| `--select-trigger-invalid-border` | Border colour of the trigger when invalid. | `var(--destructive)` |
| `--select-trigger-disabled` | Fill colour of the trigger when disabled. | `var(--light-l2)` |
| `--select-trigger-disabled-foreground` | Text colour of the trigger when disabled. | `var(--dark-45)` |
| `--select-trigger-sm-height` | Height of a small (sm) trigger. | `calc(var(--spacing) * 9)` |
| `--select-icon-size` | Width and height of the chevron. | `calc(var(--spacing) * 3.5)` |
| `--select-icon-foreground` | Colour of the chevron. | `var(--dark-75)` |
| `--select-icon-open-foreground` | Colour of the chevron while open. | `var(--mint-75)` |
| `--select-icon-disabled-foreground` | Colour of the chevron when disabled. | `var(--dark-45)` |
| `--select-clear-foreground` | Colour of the clear (×) button. | `var(--dark-75)` |
| `--select-clear-hover-foreground` | Colour of the clear button when hovered. | `var(--dark-100)` |
| `--select-clear-focus-ring` | Ring colour of the clear button when focused. | `color-mix(in oklab, var(--mint-45) 30%, transparent)` |
| `--select-chip` | Fill of a selected value's chip. | `var(--mint-l2)` |
| `--select-chip-foreground` | Text colour of a chip. | `var(--mint-90)` |
| `--select-chip-height` | Height of a chip. | `calc(var(--spacing) * 6)` |
| `--select-chip-radius` | Corner radius of a chip. | `var(--radius-full)` |
| `--select-chip-overflow` | Fill of the "+N" chip. | `var(--light-l2)` |
| `--select-chip-overflow-foreground` | Text colour of the "+N" chip. | `var(--dark-75)` |
| `--select-content-radius` | Corner radius of the content. | `var(--radius-lg)` |
| `--select-content-border` | Border colour of the content. | `var(--light-l3)` |
| `--select-content` | Fill colour of the content. | `var(--white)` |
| `--select-content-padding` | Padding of the content. | `calc(var(--spacing) * 1)` |
| `--select-content-foreground` | Text colour of the content. | `var(--dark-100)` |
| `--select-content-shadow` | Shadow of the content. | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` |
| `--select-label-padding-x` | Horizontal padding of the label. | `calc(var(--spacing) * 2)` |
| `--select-label-foreground` | Text colour of the label. | `var(--dark-90)` |
| `--select-item-min-height` | Minimum height of the item. | `calc(var(--spacing) * 8)` |
| `--select-item-radius` | Corner radius of the item. | `var(--radius-md)` |
| `--select-item-padding-y` | Vertical padding of the item. | `calc(var(--spacing) * 1.5)` |
| `--select-item-foreground` | Text colour of the item. | `var(--dark-100)` |
| `--select-item-highlighted` | Fill colour of the item when highlighted. | `var(--light-l1)` |
| `--select-item-focus` | Fill colour of the item when focused. | `var(--light-l1)` |
| `--select-item-selected` | Fill colour of the item when selected. | `var(--mint-l2)` |
| `--select-item-selected-foreground` | Text colour of the item when selected. | `var(--mint-90)` |
| `--select-item-disabled-foreground` | Text colour of the item when disabled. | `var(--dark-45)` |
| `--select-item-checkbox` | Fill colour of the checkbox in a multiple-select row. | `var(--white)` |
| `--select-item-checkbox-border` | Border colour of the checkbox in a multiple-select row. | `var(--dark-45)` |
| `--select-item-checkbox-checked` | Fill and border colour of the checkbox when its row is selected. | `var(--mint-45)` |
| `--select-item-checkbox-checked-foreground` | Colour of the tick in a selected checkbox. | `var(--navy)` |
| `--select-item-check-foreground` | Colour of the trailing tick on the selected row (single select). | `var(--mint-75)` |
| `--select-item-meta-foreground` | Text colour of the right-hand label (meta) in a row. | `var(--dark-75)` |
| `--select-separator-height` | Height of the separator. | `1px` |
| `--select-separator` | Fill colour of the separator. | `var(--light-l3)` |
| `--select-scroll-up-button` | Fill colour of the scroll-up-button. | `var(--white)` |
| `--select-scroll-up-button-padding-y` | Vertical padding of the scroll-up-button. | `calc(var(--spacing) * 1)` |
| `--select-scroll-up-button-foreground` | Text colour of the scroll-up-button. | `var(--dark-75)` |
| `--select-scroll-down-button` | Fill colour of the scroll-down-button. | `var(--white)` |
| `--select-scroll-down-button-padding-y` | Vertical padding of the scroll-down-button. | `calc(var(--spacing) * 1)` |
| `--select-scroll-down-button-foreground` | Text colour of the scroll-down-button. | `var(--dark-75)` |

</details>

<details>
<summary><strong>separator</strong> (1)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--separator` | Fill colour of the separator. | `var(--border)` |

</details>

<details>
<summary><strong>sheet</strong> (11)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--sheet-overlay` | Fill colour of the overlay. | `color-mix(in oklab, var(--dark-100) 50%, transparent)` |
| `--sheet-content` | Fill colour of the content. | `var(--popover)` |
| `--sheet-content-foreground` | Text colour of the content. | `var(--popover-foreground)` |
| `--sheet-content-shadow` | Shadow of the content. | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` |
| `--sheet-header-gap` | Gap between items of the header. | `calc(var(--spacing) * 1.5)` |
| `--sheet-header-padding` | Padding of the header. | `calc(var(--spacing) * 6)` |
| `--sheet-footer-gap` | Gap between items of the footer. | `calc(var(--spacing) * 2)` |
| `--sheet-footer-padding` | Padding of the footer. | `calc(var(--spacing) * 6)` |
| `--sheet-title-font-weight` | Font weight of the title. | `500` |
| `--sheet-title-foreground` | Text colour of the title. | `var(--foreground)` |
| `--sheet-description-foreground` | Text colour of the description. | `var(--muted-foreground)` |

</details>

<details>
<summary><strong>sidebar</strong> (81)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--sidebar-fill` | Fill colour of the sidebar. | `var(--sidebar)` |
| `--sidebar-inner` | Fill colour of the inner. | `var(--sidebar)` |
| `--sidebar-rail-width` | Width of the rail. | `calc(var(--spacing) * 4)` |
| `--sidebar-inset` | Fill colour of the inset. | `var(--background)` |
| `--sidebar-inset-offset\:md` | With the inset sidebar, from md up: space between the content panel and the screen edges (none on the sidebar's side while it's open). | `calc(var(--spacing) * 2)` |
| `--sidebar-inset-radius\:md` | With the inset sidebar, from md up: corner radius of the content panel. | `var(--radius-2xl)` |
| `--sidebar-inset-shadow\:md` | With the inset sidebar, from md up: shadow of the content panel. | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` |
| `--sidebar-input-height` | Height of the input. | `calc(var(--spacing) * 8)` |
| `--sidebar-input` | Fill colour of the input. | `var(--background)` |
| `--sidebar-input-shadow` | Shadow of the input. | `0 0 #0000` |
| `--sidebar-header-gap` | Gap between items of the header. | `calc(var(--spacing) * 2)` |
| `--sidebar-header-padding` | Padding of the header. | `calc(var(--spacing) * 2)` |
| `--sidebar-footer-gap` | Gap between items of the footer. | `calc(var(--spacing) * 2)` |
| `--sidebar-footer-padding` | Padding of the footer. | `calc(var(--spacing) * 2)` |
| `--sidebar-separator` | Fill colour of the separator. | `var(--sidebar-border)` |
| `--sidebar-content-min-height` | Minimum height of the content. | `calc(var(--spacing) * 0)` |
| `--sidebar-content-gap` | Gap between items of the content. | `calc(var(--spacing) * 2)` |
| `--sidebar-group-padding` | Padding of the group. | `calc(var(--spacing) * 2)` |
| `--sidebar-group-label-height` | Height of the group-label. | `calc(var(--spacing) * 8)` |
| `--sidebar-group-label-radius` | Corner radius of the group-label. | `var(--radius-md)` |
| `--sidebar-group-label-padding-x` | Horizontal padding of the group-label. | `calc(var(--spacing) * 3)` |
| `--sidebar-group-label-font-weight` | Font weight of the group-label. | `500` |
| `--sidebar-group-label-foreground` | Text colour of the group-label. | `color-mix(in oklab, var(--sidebar-foreground) 70%, transparent)` |
| `--sidebar-group-label-ring` | Ring colour of the group-label. | `var(--sidebar-ring)` |
| `--sidebar-group-action-width` | Width of the group-action. | `calc(var(--spacing) * 5)` |
| `--sidebar-group-action-radius` | Corner radius of the group-action. | `var(--radius-md)` |
| `--sidebar-group-action-padding` | Padding of the group-action. | `calc(var(--spacing) * 0)` |
| `--sidebar-group-action-foreground` | Text colour of the group-action. | `var(--sidebar-foreground)` |
| `--sidebar-group-action-ring` | Ring colour of the group-action. | `var(--sidebar-ring)` |
| `--sidebar-group-action-hover-foreground` | Text colour of the group-action when hovered. | `var(--sidebar-accent-foreground)` |
| `--sidebar-menu-gap` | Gap between items of the menu. | `calc(var(--spacing) * 1)` |
| `--sidebar-menu-button-gap` | Gap between items of the menu-button. | `calc(var(--spacing) * 2)` |
| `--sidebar-menu-button-radius` | Corner radius of the menu-button. | `var(--radius-lg)` |
| `--sidebar-menu-button-padding-x` | Horizontal padding of the menu-button. | `calc(var(--spacing) * 3)` |
| `--sidebar-menu-button-padding-y` | Vertical padding of the menu-button. | `calc(var(--spacing) * 2)` |
| `--sidebar-menu-button-ring` | Ring colour of the menu-button. | `var(--sidebar-ring)` |
| `--sidebar-menu-button-hover` | Fill colour of the menu-button when hovered. | `var(--sidebar-accent)` |
| `--sidebar-menu-button-hover-foreground` | Text colour of the menu-button when hovered. | `var(--sidebar-accent-foreground)` |
| `--sidebar-menu-button-active` | Fill colour of the menu-button when active. | `var(--sidebar-accent)` |
| `--sidebar-menu-button-active-foreground` | Text colour of the menu-button when active. | `var(--sidebar-accent-foreground)` |
| `--sidebar-menu-button-disabled-opacity` | Opacity of the menu-button when disabled. | `0.5` |
| `--sidebar-menu-button-active-font-weight` | Font weight of the menu-button when active. | `500` |
| `--sidebar-menu-button-default-hover` | Fill colour of the menu-button (default variant) when hovered. | `var(--sidebar-menu-button-hover, var(--sidebar-accent))` |
| `--sidebar-menu-button-default-hover-foreground` | Text colour of the menu-button (default variant) when hovered. | `var(--sidebar-menu-button-hover-foreground, var(--sidebar-accent-foreground))` |
| `--sidebar-menu-button-outline` | Fill colour of the menu-button (outline variant). | `var(--background)` |
| `--sidebar-menu-button-outline-hover` | Fill colour of the menu-button (outline variant) when hovered. | `var(--sidebar-menu-button-hover, var(--sidebar-accent))` |
| `--sidebar-menu-button-outline-hover-foreground` | Text colour of the menu-button (outline variant) when hovered. | `var(--sidebar-menu-button-hover-foreground, var(--sidebar-accent-foreground))` |
| `--sidebar-menu-button-md-height` | Height of the menu-button (md size). | `calc(var(--spacing) * 9)` |
| `--sidebar-menu-button-sm-height` | Height of the menu-button (sm size). | `calc(var(--spacing) * 8)` |
| `--sidebar-menu-button-lg-height` | Height of the menu-button (lg size). | `calc(var(--spacing) * 14)` |
| `--sidebar-menu-button-lg-padding-x` | Horizontal padding of the menu-button (lg size). | `var(--sidebar-menu-button-padding-x, calc(var(--spacing) * 3))` |
| `--sidebar-menu-action-width` | Width of the menu-action. | `calc(var(--spacing) * 5)` |
| `--sidebar-menu-action-radius` | Corner radius of the menu-action. | `var(--radius-md)` |
| `--sidebar-menu-action-padding` | Padding of the menu-action. | `calc(var(--spacing) * 0)` |
| `--sidebar-menu-action-foreground` | Text colour of the menu-action. | `var(--sidebar-foreground)` |
| `--sidebar-menu-action-ring` | Ring colour of the menu-action. | `var(--sidebar-ring)` |
| `--sidebar-menu-action-hover-foreground` | Text colour of the menu-action when hovered. | `var(--sidebar-accent-foreground)` |
| `--sidebar-menu-badge-height` | Height of the menu-badge. | `calc(var(--spacing) * 5)` |
| `--sidebar-menu-badge-radius` | Corner radius of the menu-badge. | `var(--radius-md)` |
| `--sidebar-menu-badge-padding-x` | Horizontal padding of the menu-badge. | `calc(var(--spacing) * 1)` |
| `--sidebar-menu-badge-font-weight` | Font weight of the menu-badge. | `500` |
| `--sidebar-menu-badge-foreground` | Text colour of the menu-badge. | `var(--sidebar-foreground)` |
| `--sidebar-menu-skeleton-height` | Height of the menu-skeleton. | `calc(var(--spacing) * 8)` |
| `--sidebar-menu-skeleton-gap` | Gap between items of the menu-skeleton. | `calc(var(--spacing) * 2)` |
| `--sidebar-menu-skeleton-radius` | Corner radius of the menu-skeleton. | `var(--radius-md)` |
| `--sidebar-menu-skeleton-padding-x` | Horizontal padding of the menu-skeleton. | `calc(var(--spacing) * 2)` |
| `--sidebar-menu-sub-gap` | Gap between items of the menu-sub. | `calc(var(--spacing) * 1)` |
| `--sidebar-menu-sub-border` | Border colour of the menu-sub. | `var(--sidebar-border)` |
| `--sidebar-menu-sub-padding-x` | Horizontal padding of the menu-sub. | `calc(var(--spacing) * 2.5)` |
| `--sidebar-menu-sub-padding-y` | Vertical padding of the menu-sub. | `calc(var(--spacing) * 0.5)` |
| `--sidebar-menu-sub-button-height` | Height of the menu-sub-button. | `calc(var(--spacing) * 7)` |
| `--sidebar-menu-sub-button-gap` | Gap between items of the menu-sub-button. | `calc(var(--spacing) * 2)` |
| `--sidebar-menu-sub-button-radius` | Corner radius of the menu-sub-button. | `var(--radius-md)` |
| `--sidebar-menu-sub-button-padding-x` | Horizontal padding of the menu-sub-button. | `calc(var(--spacing) * 2)` |
| `--sidebar-menu-sub-button-foreground` | Text colour of the menu-sub-button. | `var(--sidebar-foreground)` |
| `--sidebar-menu-sub-button-ring` | Ring colour of the menu-sub-button. | `var(--sidebar-ring)` |
| `--sidebar-menu-sub-button-hover` | Fill colour of the menu-sub-button when hovered. | `var(--sidebar-accent)` |
| `--sidebar-menu-sub-button-hover-foreground` | Text colour of the menu-sub-button when hovered. | `var(--sidebar-accent-foreground)` |
| `--sidebar-menu-sub-button-active` | Fill colour of the menu-sub-button when active. | `var(--sidebar-accent)` |
| `--sidebar-menu-sub-button-active-foreground` | Text colour of the menu-sub-button when active. | `var(--sidebar-accent-foreground)` |
| `--sidebar-menu-sub-button-disabled-opacity` | Opacity of the menu-sub-button when disabled. | `0.5` |

</details>

<details>
<summary><strong>skeleton</strong> (2)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--skeleton-radius` | Corner radius of the skeleton. | `var(--radius-2xl)` |
| `--skeleton` | Fill colour of the skeleton. | `var(--light-l2)` |

</details>

<details>
<summary><strong>slider</strong> (10)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--slider-track-height` | Height of the track. | `calc(var(--spacing) * 2)` |
| `--slider-track-radius` | Corner radius of the track. | `var(--radius-full)` |
| `--slider-track` | Fill colour of the track. | `var(--dark-15)` |
| `--slider-range` | Fill colour of the range. | `var(--primary)` |
| `--slider-thumb-size` | Width and height of the thumb. | `calc(var(--spacing) * 5)` |
| `--slider-thumb-radius` | Corner radius of the thumb. | `var(--radius-full)` |
| `--slider-thumb-border` | Border colour of the thumb. | `var(--primary)` |
| `--slider-thumb` | Fill colour of the thumb. | `var(--white)` |
| `--slider-thumb-shadow` | Shadow of the thumb. | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` |
| `--slider-thumb-ring` | Ring colour of the thumb. | `color-mix(in oklab, var(--ring) 50%, transparent)` |

</details>

<details>
<summary><strong>spinner</strong> (2)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--spinner-size` | Width and height of the spinner. | `calc(var(--spacing) * 4)` |
| `--spinner-foreground` | Text colour of the spinner. | `var(--primary)` |

</details>

<details>
<summary><strong>stepper</strong> (16)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--stepper-indicator-active` | Fill colour of the current step (and of a done step in the dot size). | `var(--mint-60)` |
| `--stepper-indicator-active-foreground` | Number colour of the current step. | `var(--navy)` |
| `--stepper-indicator-active-ring` | Ring colour around the current step. | `var(--mint-45)` |
| `--stepper-indicator-complete` | Fill colour of a done step. | `var(--mint-l2)` |
| `--stepper-indicator-complete-foreground` | Tick colour of a done step. | `var(--mint-90)` |
| `--stepper-indicator-upcoming` | Fill colour of a step still to come. | `var(--white)` |
| `--stepper-indicator-upcoming-border` | Border colour of a step still to come. | `var(--navy)` |
| `--stepper-indicator-upcoming-foreground` | Number colour of a step still to come. | `var(--navy)` |
| `--stepper-indicator-error` | Fill colour of a step with an error. | `var(--destructive)` |
| `--stepper-indicator-error-foreground` | Icon colour of a step with an error. | `var(--white)` |
| `--stepper-indicator-dot-upcoming` | Fill colour of a step still to come (dot size). | `var(--dark-15)` |
| `--stepper-connector` | Colour of the line between steps. | `var(--light-l3)` |
| `--stepper-connector-complete` | Colour of the line once the step before it is done. | `var(--mint-60)` |
| `--stepper-title-foreground` | Text colour of a step title. | `var(--navy)` |
| `--stepper-title-error-foreground` | Text colour of a step title with an error. | `var(--destructive)` |
| `--stepper-description-foreground` | Text colour of a step description. | `var(--dark-90)` |

</details>

<details>
<summary><strong>switch</strong> (11)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--switch-radius` | Corner radius of the switch. | `var(--radius-full)` |
| `--switch-padding` | Padding of the switch. | `calc(var(--spacing) * 0.5)` |
| `--switch-checked` | Fill colour of the switch when checked. | `var(--mint-45)` |
| `--switch-focus-ring` | Ring colour of the switch when focused. | `color-mix(in oklab, var(--mint-45) 30%, transparent)` |
| `--switch-invalid-ring` | Ring colour of the switch when invalid. | `color-mix(in oklab, var(--destructive) 20%, transparent)` |
| `--switch-disabled-opacity` | Opacity of the switch when disabled. | `0.5` |
| `--switch-thumb-radius` | Corner radius of the thumb. | `var(--radius-full)` |
| `--switch-thumb` | Fill colour of the thumb. | `var(--white)` |
| `--switch-thumb-shadow` | Shadow of the thumb. | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
| `--switch-label-foreground` | Text colour of the label beside the control. | `var(--navy)` |
| `--switch-description-foreground` | Text colour of the description under the label. | `var(--dark-75)` |

</details>

<details>
<summary><strong>table</strong> (25)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--table-header-tinted` | Fill colour of the header row (card and bordered variants). | `var(--light-l1)` |
| `--table-footer-border` | Border colour of the footer. | `var(--border)` |
| `--table-footer` | Fill colour of the footer. | `var(--light-l1)` |
| `--table-footer-font-weight` | Font weight of the footer. | `500` |
| `--table-footer-foreground` | Text colour of the footer. | `var(--navy)` |
| `--table-row-border` | Border colour of the row. | `var(--border)` |
| `--table-row-hover` | Fill colour of the row when hovered. | `var(--mint-l4)` |
| `--table-row-striped` | Fill colour of every other row (striped variant). | `var(--light-l1)` |
| `--table-row-striped-hover` | Fill colour of a hovered row (striped variant). | `var(--mint-l4)` |
| `--table-row-open` | Fill colour of an expanded row. | `var(--mint-l4)` |
| `--table-head-padding-x` | Horizontal padding of the head. | `calc(var(--spacing) * 3)` |
| `--table-head-border` | Border colour of the head. | `var(--border)` |
| `--table-head-height` | Height of the head. | `calc(var(--spacing) * 11)` |
| `--table-head-foreground` | Text colour of the head. | `var(--dark-100)` |
| `--table-cell-padding-x` | Horizontal padding of the cell. | `calc(var(--spacing) * 3)` |
| `--table-cell-border` | Border colour of the cell. | `var(--border)` |
| `--table-cell-padding-y` | Vertical padding of the cell. | `calc(var(--spacing) * 3)` |
| `--table-cell-foreground` | Text colour of the cell. | `var(--dark-90)` |
| `--table-caption-foreground` | Text colour of the caption. | `var(--muted-foreground)` |
| `--table-sort-button-foreground` | Text colour of a sortable column heading. | `var(--dark-100)` |
| `--table-sort-button-hover-foreground` | Text colour of a sortable column heading when hovered. | `var(--navy)` |
| `--table-sort-button-focus-ring` | Focus ring of a sortable column heading. | `var(--mint-45)` |
| `--table-sort-button-icon-foreground` | Colour of the sort arrow. | `var(--dark-75)` |
| `--table-detail-row` | Fill colour of the detail row under an expanded row. | `var(--mint-l4)` |
| `--table-detail-row-foreground` | Text colour of the detail row. | `var(--dark-90)` |

</details>

<details>
<summary><strong>tabs</strong> (45)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--tabs-gap` | Gap between items of the tabs. | `calc(var(--spacing) * 2)` |
| `--tabs-list-default-gap` | Gap between items of the list (default variant). | `calc(var(--spacing) * 0.5)` |
| `--tabs-list-default-radius` | Corner radius of the list (default variant). | `var(--radius-full)` |
| `--tabs-list-default-border` | Border colour of the list (default variant). | `var(--dark-15)` |
| `--tabs-list-default` | Fill colour of the list (default variant). | `var(--white)` |
| `--tabs-list-default-padding` | Padding of the list (default variant). | `calc(var(--spacing) * 0.75)` |
| `--tabs-list-line-gap` | Gap between items of the list (line variant). | `calc(var(--spacing) * 6)` |
| `--tabs-list-line-border` | Border colour of the list (line variant). | `var(--border)` |
| `--tabs-list-segmented` | Fill colour of the list (segmented variant). | `var(--light-l2)` |
| `--tabs-list-segmented-gap` | Gap between items of the list (segmented variant). | `calc(var(--spacing) * 1)` |
| `--tabs-list-segmented-radius` | Corner radius of the list (segmented variant). | `var(--radius-lg)` |
| `--tabs-list-segmented-padding` | Padding of the list (segmented variant). | `calc(var(--spacing) * 1)` |
| `--tabs-list-line-vertical-gap` | Gap between the triggers of a vertical line tab list. | `calc(var(--spacing) * 0.5)` |
| `--tabs-trigger-gap` | Gap between items of the trigger. | `calc(var(--spacing) * 1.5)` |
| `--tabs-trigger-focus-ring` | Ring colour of the trigger when focused. | `var(--navy)` |
| `--tabs-trigger-disabled-foreground` | Text colour of the trigger when disabled. | `var(--dark-45)` |
| `--tabs-trigger-height` | Height of the trigger. | `calc(var(--spacing) * 7)` |
| `--tabs-trigger-radius` | Corner radius of the trigger. | `var(--radius-full)` |
| `--tabs-trigger-padding-x` | Horizontal padding of the trigger. | `calc(var(--spacing) * 2.5)` |
| `--tabs-trigger-font-weight` | Font weight of the trigger. | `600` |
| `--tabs-trigger-foreground` | Text colour of the trigger. | `var(--navy)` |
| `--tabs-trigger-active-foreground` | Text colour of the trigger when active. | `var(--white)` |
| `--tabs-trigger-line-height` | Height of the trigger (line variant). | `calc(var(--spacing) * 10)` |
| `--tabs-trigger-line-radius` | Corner radius of the trigger (line variant). | `var(--radius-sm)` |
| `--tabs-trigger-line-padding-x` | Horizontal padding of the trigger (line variant). | `calc(var(--spacing) * 1)` |
| `--tabs-trigger-line-foreground` | Text colour of the trigger (line variant). | `var(--dark-100)` |
| `--tabs-trigger-line-hover-foreground` | Text colour of the trigger (line variant) when hovered. | `var(--dark-75)` |
| `--tabs-trigger-line-active-foreground` | Text colour of the trigger (line variant) when active. | `var(--navy)` |
| `--tabs-trigger-line-hover-indicator` | Colour of the bar under a hovered trigger (line variant). | `var(--dark-15)` |
| `--tabs-trigger-segmented-height` | Height of the trigger (segmented variant). | `calc(var(--spacing) * 8)` |
| `--tabs-trigger-segmented-radius` | Corner radius of the trigger (segmented variant). | `var(--radius-md)` |
| `--tabs-trigger-segmented-padding-x` | Horizontal padding of the trigger (segmented variant). | `calc(var(--spacing) * 3)` |
| `--tabs-trigger-segmented-foreground` | Text colour of the trigger (segmented variant). | `var(--navy)` |
| `--tabs-trigger-segmented-active-foreground` | Text colour of the trigger (segmented variant) when active. | `var(--white)` |
| `--tabs-indicator` | Colour of the sliding thumb behind the active tab. | `var(--mint-60)` |
| `--tabs-indicator-radius` | Corner radius of the sliding thumb. | `var(--radius-full)` |
| `--tabs-indicator-line` | Colour of the bar under the active tab (line variant). | `var(--mint-60)` |
| `--tabs-indicator-line-height` | Thickness of the bar under the active tab (line variant). | `calc(var(--spacing) * 0.75)` |
| `--tabs-indicator-segmented` | Colour of the thumb behind the active segment (segmented variant). | `var(--mint-45)` |
| `--tabs-indicator-segmented-radius` | Corner radius of the thumb (segmented variant). | `var(--radius-md)` |
| `--tabs-content-panel` | Fill colour of the content card (panel variant). | `var(--white)` |
| `--tabs-content-panel-border` | Border colour of the content card (panel variant). | `var(--light-l3)` |
| `--tabs-content-panel-radius` | Corner radius of the content card (panel variant). | `var(--radius-xl)` |
| `--tabs-content-panel-padding` | Padding of the content card (panel variant). | `calc(var(--spacing) * 6)` |
| `--tabs-content-panel-gap` | Gap between items of the content card (panel variant). | `calc(var(--spacing) * 5)` |

</details>

<details>
<summary><strong>textarea</strong> (12)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--textarea-radius` | Corner radius of the textarea. | `var(--radius-lg)` |
| `--textarea-border` | Border colour of the textarea. | `var(--dark-45)` |
| `--textarea` | Fill colour of the textarea. | `var(--white)` |
| `--textarea-padding-x` | Horizontal padding of the textarea. | `calc(var(--spacing) * 3)` |
| `--textarea-foreground` | Text colour of the textarea. | `var(--dark-100)` |
| `--textarea-placeholder` | Placeholder text colour of the textarea. | `var(--dark-90)` |
| `--textarea-focus-border` | Border colour of the textarea when focused. | `var(--mint-45)` |
| `--textarea-focus-ring` | Ring colour of the textarea when focused. | `color-mix(in oklab, var(--mint-45) 30%, transparent)` |
| `--textarea-invalid-border` | Border colour of the textarea when invalid. | `var(--destructive)` |
| `--textarea-disabled` | Fill colour of the textarea when disabled. | `var(--light-l2)` |
| `--textarea-disabled-foreground` | Text colour of the textarea when disabled. | `var(--dark-45)` |
| `--textarea-padding-y` | Vertical padding of the textarea. | `calc(var(--spacing) * 2.5)` |

</details>

<details>
<summary><strong>toast</strong> (26)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--toast-viewport-offset` | Distance of the toasts from the bottom and side edges of the screen. | `calc(var(--spacing) * 4)` |
| `--toast-viewport-offset\:sm` | Distance of the toasts from the screen edges from the sm breakpoint up. | `calc(var(--spacing) * 6)` |
| `--toast-viewport-width\:md` | Width of the toasts from the md breakpoint up, held to the end edge. Below md they span the screen. | `calc(var(--spacing) * 110)` |
| `--toast-radius` | Corner radius of the toast. | `var(--radius-2xl)` |
| `--toast-focus-ring` | Ring colour of the toast when focused. | `color-mix(in oklab, var(--ring) 50%, transparent)` |
| `--toast` | Fill colour of the toast. | `var(--light-l2)` |
| `--toast-foreground` | Text colour of the toast. | `var(--navy)` |
| `--toast-success` | Fill colour of the toast (success type). | `var(--mint-l3)` |
| `--toast-success-foreground` | Colour of the title, icon and × (success type). | `var(--mint-75)` |
| `--toast-warning` | Fill colour of the toast (warning type). | `var(--warning-l3)` |
| `--toast-warning-foreground` | Colour of the title, icon and × (warning type). | `var(--warning-75)` |
| `--toast-error` | Fill colour of the toast (error type). | `var(--error-l1)` |
| `--toast-error-foreground` | Colour of the title, icon and × (error type). | `var(--destructive)` |
| `--toast-info` | Fill colour of the toast (info type). | `var(--mint-l4)` |
| `--toast-info-foreground` | Colour of the title, icon and × (info type). | `var(--mint-75)` |
| `--toast-content-gap` | Gap between items of the content. | `calc(var(--spacing) * 2)` |
| `--toast-content-padding-x` | Horizontal padding of the content. | `calc(var(--spacing) * 2)` |
| `--toast-content-padding-y` | Vertical padding of the content. | `calc(var(--spacing) * 3)` |
| `--toast-title-font-weight` | Font weight of the title. | `600` |
| `--toast-description-foreground` | Text colour of the description. | `var(--dark-90)` |
| `--toast-action-font-weight` | Font weight of the action. | `600` |
| `--toast-close-padding` | Padding of the close. | `calc(var(--spacing) * 1)` |
| `--toast-close-hover-foreground` | Text colour of the close when hovered. | `var(--navy)` |
| `--toast-icon-size` | Width and height of the icon. | `calc(var(--spacing) * 8)` |
| `--toast-icon-radius` | Corner radius of the icon. | `var(--radius-full)` |
| `--toast-icon` | Fill colour of the icon. | `var(--white)` |

</details>

<details>
<summary><strong>toggle-group</strong> (0)</summary>

| Lever | What it changes | Default |
|---|---|---|


</details>

<details>
<summary><strong>toggle</strong> (23)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--toggle-gap` | Gap between items of the toggle. | `calc(var(--spacing) * 1)` |
| `--toggle-radius` | Corner radius of the toggle. | `var(--radius-md)` |
| `--toggle-font-weight` | Font weight of the toggle. | `500` |
| `--toggle-hover` | Fill colour of the toggle when hovered. | `var(--muted)` |
| `--toggle-hover-foreground` | Text colour of the toggle when hovered. | `var(--foreground)` |
| `--toggle-focus-border` | Border colour of the toggle when focused. | `var(--ring)` |
| `--toggle-focus-ring` | Ring colour of the toggle when focused. | `color-mix(in oklab, var(--ring) 50%, transparent)` |
| `--toggle-disabled-opacity` | Opacity of the toggle when disabled. | `0.5` |
| `--toggle-invalid-border` | Border colour of the toggle when invalid. | `var(--destructive)` |
| `--toggle-invalid-ring` | Ring colour of the toggle when invalid. | `color-mix(in oklab, var(--destructive) 20%, transparent)` |
| `--toggle-pressed` | Fill colour of the toggle when pressed. The mint accent, so on reads apart from off (muted matched the page). | `var(--accent)` |
| `--toggle-pressed-foreground` | Text colour of the toggle when pressed. | `var(--accent-foreground)` |
| `--toggle-outline-border` | Border colour of the toggle (outline variant). | `var(--input)` |
| `--toggle-outline-hover` | Fill colour of the toggle (outline variant) when hovered. | `var(--toggle-hover, var(--muted))` |
| `--toggle-md-height` | Height of the toggle (md size). | `calc(var(--spacing) * 9)` |
| `--toggle-md-padding-x` | Horizontal padding of the toggle (md size). | `calc(var(--spacing) * 3)` |
| `--toggle-sm-height` | Height of the toggle (sm size). | `calc(var(--spacing) * 8)` |
| `--toggle-sm-padding-x` | Horizontal padding of the toggle (sm size). | `calc(var(--spacing) * 3)` |
| `--toggle-lg-height` | Height of the toggle (lg size). | `calc(var(--spacing) * 10)` |
| `--toggle-lg-padding-x` | Horizontal padding of the toggle (lg size). | `calc(var(--spacing) * 4)` |
| `--toggle-md-with-icon-padding-x` | Padding on the icon side of the toggle (md) when it has an icon. | `calc(var(--spacing) * 2.5)` |
| `--toggle-sm-with-icon-padding-x` | Padding on the icon side of the toggle (sm) when it has an icon. | `calc(var(--spacing) * 2)` |
| `--toggle-lg-with-icon-padding-x` | Padding on the icon side of the toggle (lg) when it has an icon. | `calc(var(--spacing) * 3)` |

</details>

<details>
<summary><strong>tooltip</strong> (7)</summary>

| Lever | What it changes | Default |
|---|---|---|
| `--tooltip-content-gap` | Gap between items of the content. | `calc(var(--spacing) * 1.5)` |
| `--tooltip-content-radius` | Corner radius of the content. | `var(--radius-xl)` |
| `--tooltip-content` | Fill colour of the content. | `var(--navy)` |
| `--tooltip-content-padding-x` | Horizontal padding of the content. | `calc(var(--spacing) * 4)` |
| `--tooltip-content-padding-y` | Vertical padding of the content. | `calc(var(--spacing) * 2)` |
| `--tooltip-content-foreground` | Text colour of the content. | `var(--white)` |
| `--tooltip-content-with-kbd-padding-x` | Right padding of a tooltip that ends in a keyboard shortcut. | `calc(var(--spacing) * 1.5)` |

</details>

<!-- component-tokens:end -->

---

## Accessibility

- Contrast: navy, dark-100 and dark-90 on white pass AA for body text. `dark-75` (5.1:1) is the lightest colour for text and icons; hints, helper text and icons use it. `dark-60` (3.3:1) is not used for text or icons. Placeholders and sub-headings are `dark-90`. Lime buttons always use navy text.
- Focus is always visible: mint-45 ring on inputs, navy ring on buttons.
- Interactive targets are 36px or larger (buttons `sm` and up, form controls 40px).
- Base UI primitives provide keyboard support and ARIA; don't remove it.
- Use `aria-invalid` for error states, `aria-busy` for loading.
- Table captions stay available to screen readers even when shown below the frame.
- Respect `prefers-reduced-motion` (`motion-reduce:animate-none`).

---

## Rules for designers and engineers

1. **Never hard-code hex** or arbitrary values (`text-[#090034]`, `p-[13px]`). Add a token instead.
2. **Semantic tokens wherever a role fits;** brand primitives only where none does.
3. **One primary CTA per view.**
4. **Content width is `max-w-site`.**
5. **No inline styles, no MUI.** Use `cva` for variants, `cn()` for merging, Base UI `render` for links.
6. **New tokens:** add to `globals.css` `:root` (OKLCH + hex comment) → `@theme inline` → run `pnpm generate-tokens` (updates the JS defaults) → `cn()` group in `src/lib/utils.ts`.
7. **Typography by role + step** (`text-h3`, `text-body-4`), never pixel sizes. Tag for structure, class for looks.
8. **Breakpoints:** standard Tailwind prefixes, mobile-first: no prefix for mobile, `md:` 768, `lg:` 1024, `xl:` 1280, `2xl:` 1440 (`sm:` 640 for large phones). One range only: `max-md:`, `md:max-lg:`, `xl:max-2xl:`.
9. **Badge colours keep white text at AA.** New category colours must pass 4.5:1 against white.
10. **Hover never adds a background to a bare text or icon control.** Links, page numbers, text tabs, nav triggers, × and other icon buttons change colour only. Controls that already have a fill (buttons, chips) change their fill; rows in lists, menus, selects, tables and the calendar keep their row highlight.
11. **Sub-headings are `dark-90`.** Overlines, group labels, section labels and column labels use `text-dark-90`; `dark-60` and `dark-75` are too grey for them. Descriptions keep `text-muted-foreground`, except dialog descriptions (`DialogDescription`), which are `dark-90`.
12. **No `dark-60` for text or icons.** Hints, helper text, meta labels and icons use `text-dark-75`; `dark-60` is too light (3.3:1 on white).
13. **Deleting anything asks first.** Every delete or remove action (files, rows, reports, list items, saved records) opens a delete dialog before anything is removed: `ConfirmDialog destructive` with a trash `IconTile`, a title that names the thing ("Delete this file?"), a description naming the item and what happens, and Cancel (focused by default) / Delete. Only after Delete is confirmed is the item removed, followed by a `success` toast ("File deleted") with an Undo action where the delete can be reversed. Cancelling an upload in progress or clearing a field is not a delete and needs no dialog. Other destructive row actions such as "Cancel order" follow the same pattern ("Cancel this order?", Keep order / Cancel order). Built in: `FileUpload` (`confirmDelete`); examples in the DropdownMenu, ContextMenu and Table stories.
14. **Apps follow `docs/README.md`.** The guardrail docs ship in the package; keep them in step with these rules. Apps check their changes with `npx design-system-migrate --check --changed`.

---

## Tokens in JS

In the DOM, always use utility classes. For places CSS can't reach (Stripe Elements, canvas, charts drawn in JS, emails), each app keeps **one** theme module that calls `generateDesignSystemTokens`, and reads every token from it:

```ts
// app/theme.ts
import { generateDesignSystemTokens } from '@beforeyoubid/design-system'

export const tokens = generateDesignSystemTokens({
  // Only what this app overrides in its CSS, with the same values
  overrides: { colors: { mint45: '#00A08A' } },
})

tokens.colors.mint45                  // '#00A08A'
tokens.badgeProductColors.bpi         // follows colors.category01
tokens.typography.h1                  // { fontSize: '40px', lineHeight: '1.2', fontWeight: 600, letterSpacing: '-0.005em' }
```

The defaults are generated from `globals.css`, so they always match the CSS. Don't hard-code hex values or import raw token objects.

## Upgrading from 1.1.x

Run the migrator once per app, in the PR that upgrades the package, on a clean working tree:

```bash
npx design-system-migrate            # dry run: what would change, and what needs a decision
npx design-system-migrate --write    # apply
```

It renames the old type, button, radius and colour classes, swaps `rounded-xl` ↔ `rounded-2xl`, moves `dark-60` text and icons to `dark-75`, turns `primary-foreground` classes and `var(--primary-foreground)` reads into `white` (the token is navy now), renames Badge, Switch and TabsList variants and `BYBCounter` / `BYBTimePicker` / `BYBSpinner` / `BYBFileUploadCard` (now `Counter` / `TimePicker` / `Spinner` / `FileUploadCard`), and moves `InputField` / `SelectField` imports to `@beforeyoubid/form`. For `@beforeyoubid/form` 1.x apps it adds `clearable` to `SearchField` / `RatingField` and `revealable` to `PasswordField` where they relied on the old default (on), and drops `clearable={false}` / `revealable={false}`. It lists each standalone `TimeField` whose `onChange` or `step` / `min` / `max` needs moving: TimeField is now the `TimePicker`, and `onValueChange` gets the time string. Button variants are left alone: every 1.x variant still exists and looks the same. It lists anything with no like-for-like replacement with its file and line. `--map old=new` changes a mapping for one app, e.g. `--map text-xs=text-sm`. Run it only once: a second run would swap the radius classes back.

### Changes the migrator can't make

Everything the migrator can change, it changes. What's left is listed here, and kept up to date with every 2.0 change that can't be automated. Where the dry run can find an occurrence, it lists it with its file and line.

| Change | What to do | Found by the dry run |
|---|---|---|
| `colors` and `typography` exports removed | In CSS, use the utility class (`bg-mint-45`, `text-body-4`). Outside CSS (Stripe, canvas, `themeColor`), use `generateDesignSystemTokens()` | Yes, each import |
| `BYBTestimonialCard` and `BYBTestimonialCarousel` removed | Move the component into the app | Yes, each import |
| `BYBImage` moved out | Copy `src/components/BYBImage.tsx` from design-system 1.x into the app (it's `next/image` with a default `sizes`; only byb-website uses it) | Yes, each import |
| `InputField` and `SelectField` moved to `@beforeyoubid/form` | The migrator moves the imports; add `"@beforeyoubid/form": "^2.0.0"` to the app's dependencies, and `@import "@beforeyoubid/form/styles.css";` after the design system's `globals.css` so Tailwind scans the form package | Yes, printed after the summary |
| `BYBSpinner` props | The migrator renames it to `Spinner`; replace `size` with a class (sm `size-3`, md `size-4`, lg `size-5`, xl `size-6`), `color` with `text-lime` / `text-navy` / `text-current` (mint is the default), `label` with `aria-label` | Yes, each prop |
| `BYBFileUploadCard` props | The migrator renames it to `FileUploadCard`; rename `onRemove` to `onDelete` and `downloadHref` to `url` | Yes, each prop |
| `BYBEmptyState` removed | `Empty` with `EmptyHeader` (`EmptyMedia variant="icon"`, `EmptyTitle`, `EmptyDescription`) and `EmptyContent` for actions and footer. Variants: plain → `default`, dashed → `outline`, muted → `muted` | Yes, each import |
| `BYBFieldset` removed | `FieldSet` with `FieldLegend`, `FieldDescription` and a `FieldGroup`; for `divided`, a `FieldSeparator` between the sets | Yes, each import |
| `BYBAttachment` removed | `FileUpload` (see File upload). It uploads each file to a presigned S3 URL itself; `onUpload` becomes `uploadOptions={{ presign }}` and the value is the file URL | Yes, each import |
| `BYBDatePicker` removed | `DateField` from `@beforeyoubid/form` (`description` → `hint`), or `Popover` + `Calendar` + `TimePicker`. `formatDateDMY` is still exported | Yes, each import |
| Parts that render a stock Button take the stock variant keys: `AlertDialogAction`, `AlertDialogCancel`, `CarouselPrevious` / `CarouselNext`, `InputGroupButton`, `SidebarTrigger` | Use the stock key (`default`, `outline`, `secondary`, `ghost`), or render ours: `render={<Button variant="tertiary" />}` | No |

