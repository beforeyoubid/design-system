# BYB Design System

> Design spec for `@beforeyoubid/design-system`.
> Source of truth is the code: `globals.css`, `utilities.css`, `src/tokens.ts` and `src/components`. When this file and the code disagree, the code wins. Update this file in the same PR.
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
11. [Accessibility](#accessibility)
12. [Rules for designers and engineers](#rules-for-designers-and-engineers)

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

1. **Primitives**: the exact Figma palette. Use for marketing pages and brand surfaces.
2. **Semantic**: shadcn slots (`primary`, `muted`, `border`, …). Use inside reusable components so they flip in dark mode.

Utility pattern: `bg-{token}`, `text-{token}`, `border-{token}`, `ring-{token}`, `fill-{token}`, `stroke-{token}`.

### Brand

| Token | Hex | RGB | Use |
|---|---|---|---|
| `mint-45` | `#00AE95` | 0, 174, 149 | **Brand colour.** Focus rings, active states, indicators |
| `navy` | `#090034` | 9, 0, 52 | Headings, key text, text on lime |
| `lime` | `#D4F269` | 212, 242, 105 | **Primary button**, key accents |
| `cobalt` | `#015AFF` | 1, 90, 255 | Accent, charts |
| `teal` | `#35BDB2` | 53, 189, 178 | Accent, charts |
| `cobalt-l1` | `#C8D0FB` | | Pill / badge tint |
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
| `dark-90` | `#444A5A` | Body text | | `light-l2` | `#F2F4F7` | Disabled fill, segmented track |
| `dark-75` | `#656E85` | Secondary text | | `light-l3` | `#EAECF0` | Dividers on white |
| `dark-60` | `#858EA3` | Placeholder, hint | | `light-sandy` | `#F8F3EE` | Warm marketing surface |
| `dark-45` | `#A5ABBB` | Disabled text, tertiary hover | | `white` | `#FFFFFF` | Page and card background |
| `dark-30` | `#C2C6D1` | | | | | |
| `dark-15` | `#DFE1E7` | Borders, inputs | | | | |

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

Charts use `chart-1…5` first (mint-45, teal, cobalt, warning-30, error-60), then the category palette.

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
| `primary` / `-foreground` | mint-45 / white | mint-30 / dark-100 |
| `secondary` | light-l2 | dark-90 |
| `muted` / `-foreground` | light-l1 / dark-75 | dark-90 / dark-45 |
| `accent` / `-foreground` | mint-l3 / mint-90 | mint-90 / mint-l2 |
| `destructive` | error-60 | error-45 |
| `success` | success-45 | success-30 |
| `warning` | warning-45 | warning-30 |
| `border`, `input` | dark-15 | dark-90 |
| `ring` | mint-45 | mint-30 |
| `sidebar-*` | light-l1 surface, mint-45 primary, mint-l3 accent | dark-90 surface, mint-30 primary |

Dark mode is turned on by the app with `<html class="dark">`; semantic tokens flip automatically.

---

## Typography

**Font:** Plus Jakarta Sans, loaded by the app (e.g. `next/font/google`). Stack: `"Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.

### Naming

Every style is **`{role}-{step}`**, and **1 is always the largest**. Headings use H1–H6 because that's how the team already talks about them. Tailwind's default `text-xs`…`text-9xl` are disabled, so only these sizes exist. For a different weight, add `font-medium` / `font-semibold`; there is no weight scale.

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

JS: `import { typography } from '@beforeyoubid/design-system'` → `typography.h1`, `typography.body4`.

**Responsive:** step headings down on mobile, e.g. `text-h3 md:text-h1` (or `text-h3 desktop:text-h1`).

**Colour:** headings `text-navy`; body `text-dark-90`; secondary `text-dark-75`; hints `text-dark-60` (not for essential content).

**Deprecated names** (same values, removed next major): `text-display-xl/lg/md/sm`, `text-heading-xl/lg/md/sm/xs`, `text-body-2xl/xl/lg/md/sm`, `text-caption`, `-sm`, `-xs`. Display and body map largest-first (`display-xl` → `display-1`, `body-md` → `body-4`), `heading-xl…xs` → `h1…h5`, `caption`/`-sm`/`-xs` → `caption-1/2/3`. Full table on the Confluence **Typography** page.

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

Mobile-first: unprefixed classes are mobile; prefixes apply **from that width up**. Values follow the Confluence **Responsive Breakpoints** page.

| Tier | Width | Prefix | Device | Layout |
|---|---|---|---|---|
| Mobile | < 768px | *(none)* | Phones | Single column, adjusted spacing |
| Tablet | 768–1023px | `md:` | Tablets | Multi-column, card-based |
| Desktop | 1024–1439px | `lg:` | Laptops / desktops | Full layouts, side navigation |
| Large | ≥ 1440px | `xl:` | Large screens | Max content width, extra assets |

```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">…</div>
<nav className="hidden lg:flex">…</nav>          // desktop-only
<div className="md:hidden">…</div>               // mobile-only
```

- `sm:` (640px) and `2xl:` (1536px) exist for shadcn internals. Don't use them for page layout.
- Range-only styles: `max-md:` (mobile only), `md:max-lg:` (tablet only).

**Named device variants** (same widths, read like the design spec):

| Variant | Range | Equivalent |
|---|---|---|
| `mobile:` | < 768px | `max-md:` |
| `tablet:` | 768–1023px | `md:max-lg:` |
| `desktop:` | ≥ 1024px | `lg:` |
| `wide:` | ≥ 1440px | `xl:` |

```tsx
<div className="px-4 tablet:px-6 desktop:px-16">…</div>
<aside className="mobile:hidden">…</aside>
```

Pick one style per file. Don't mix `lg:` and `desktop:` on the same element.

**Design grid (Figma frames)**

| Frame | Device | Columns | Margin | Gutter |
|---|---|---|---|---|
| 390px | Mobile | 4 | 16px (`px-4`) | 16px (`gap-4`) |
| 968px | Tablet | 8 | 24px (`px-6`) | 16px (`gap-4`) |
| 1440px | Desktop | 12 | 64px (`px-16`) | 20px (`gap-5`) |

Page container: `mx-auto w-full max-w-site px-4 md:px-6 lg:px-16`. Touch targets ≥ 48px on mobile.

---

## Radius

| Token | Value | Use |
|---|---|---|
| `rounded-sm` | 4px | Menubar trigger, small chips |
| `rounded-md` | 8px | **Component default** (`--radius`), menu items, segmented tab |
| `rounded-lg` | 12px | Cards, inputs, small buttons, menus/popovers, tables (card/bordered) |
| `rounded-2xl` | 16px | Default and large buttons, tab panel |
| `rounded-xl` | 20px | Alerts, toasts |
| `rounded-3xl` | 24px | |
| `rounded-4xl` | 32px | |
| `rounded-full` | 9999px | Pills, badges, avatars, icon buttons, pill tabs |

Note: `rounded-xl` (20px) is larger than `rounded-2xl` (16px) in this system. This mirrors Figma.

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
| `primary` | `bg-lime text-navy shadow-xs` | brightness 95% | **Main CTA**, one per view |
| `secondary` | `bg-mint-75 text-white` | `bg-mint-30` | Secondary action |
| `tertiary` | `bg-white border-dark-15 text-dark-90` | `bg-dark-45 text-white` | Neutral / cancel |
| `ghost` | `text-mint-75` | `text-mint-45` | Low emphasis |
| `destructive` | `bg-error-75 text-white` | `bg-error-45` | Delete, irreversible |
| `link` | `text-mint-75` | underline | Inline action |

Disabled (filled variants): `bg-light-l2 text-dark-45`.

| Size | Height | Radius | Text |
|---|---|---|---|
| `xs` | 28px | 8px | `text-caption-2` |
| `sm` | 36px | 12px | `text-button-sm` |
| `md` (default) | 40px | 16px | `text-button-sm` |
| `lg` | 44px | 16px | `text-button-md` |
| `icon-xs/sm/icon/lg` | 28 / 36 / 40 / 44px | full | |

Props: `loading` (spinner + `aria-busy`), `icon`, `iconPosition` (`left` / `right`), `render` for links.

### Badge

Pill, 20px tall, `text-caption-2` semibold, optional status `dot`.

| Variant | Fill / border / text |
|---|---|
| `gray` (default) | light-l2 / dark-15 / dark-75 |
| `mint` | mint-l2 / mint-l1 / mint-90 |
| `lime` | lime / lime / navy |
| `success` | mint-l3 / mint-l1 / mint-75 |
| `error` | error-l1 / error-15 / error-75 |
| `warning` | warning-l3 / warning-l1 / warning-75 |

`category={1…35}`: 24px solid badge in the category palette, white `text-body-5` medium.
`product="electrical-report"` (any product badge name): same solid style in the product's colour. Overrides `category`.

### Form controls (Input, Textarea, InputGroup, Select)

- 40px tall, `rounded-lg`, `border-dark-15`, white fill, `text-body-5 text-dark-100`, placeholder `dark-60`.
- Focus: `border-mint-45` + `ring-3 ring-mint-45/30`.
- Invalid (`aria-invalid`): `border-error-75`, red ring on focus.
- Disabled: `bg-light-l2 text-dark-45`.
- `InputField` / `SelectField` add label, hint and error slots. `Fieldset` groups them. `DatePicker` pairs the input with `Calendar`.
- Checkbox, Radio, Switch: mint-checked; labels `text-body-5 font-semibold text-navy`, descriptions `text-dark-60`.

### Card

`rounded-lg border-border bg-card shadow-xs`, padding 24px (`size="sm"`: 16px). Title `text-body-4 font-medium`, description `text-body-5 text-muted-foreground`. Parts: `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`.

### Tabs

| Variant | Look |
|---|---|
| `pill` (default) | White track with `dark-15` border, sliding `mint-60` pill, active text white |
| `line` | Underline row, 3px `mint-60` indicator, inactive `dark-60` → hover `navy` |
| `segmented` | `light-l2` track, sliding `mint-45` segment, active text white |

All triggers: `text-body-5 font-semibold tracking-button uppercase`. Indicator slides with `ease-snappy` 300ms; panels slide 0.5rem. `TabsContent panel` gives a `rounded-2xl` bordered panel. Supports vertical orientation.

### Table

Headers use `text-overline text-muted-foreground`; cells `text-body-5 text-dark-90`; rows hover `mint-l4`, selected `mint-l3`.

| Prop | Options |
|---|---|
| `variant` | `default` (row dividers), `card` (rounded-lg frame + shadow-xs, light-l1 header), `striped` (zebra rows), `bordered` (frame + column lines) |
| `size` | `sm` (head 36px, cell py 8), `md` (44 / 12), `lg` (48 / 16) |

`TableEmpty` renders an `EmptyState` across all columns. `TableCaption` displays below the frame. Selectable rows: whole row is clickable.

### Overlays

| Component | Notes |
|---|---|
| `Modal` / `Dialog` / `AlertDialog` | Backdrop `bg-dark-100/50`, white panel, title `text-body-3 font-semibold text-navy`, body `text-body-4 text-dark-90`, actions right-aligned |
| `Sheet` / `Drawer` | Edge panels for secondary flows |
| `Popover`, `HoverCard`, `Tooltip` | `rounded-lg`, floating shadow (`shadow-md` / `shadow-lg`) |
| `DropdownMenu`, `ContextMenu`, `Menubar`, `Command` | Panel `rounded-lg`, items `rounded-md`, hover `accent` |

### Feedback

| Component | Variants |
|---|---|
| `Alert` | `default`, `info` (mint-l4), `success`, `warning`, `destructive`; `rounded-xl`, tint fill + `-15` border + `-75` text |
| `Toast` | `success` (mint-l3), `warning` (warning-l3), `error` (error-l1); `rounded-xl`; `showToast()` / `dismissToast()` |
| `EmptyState` | `plain`, `dashed`, `muted`; 40px `mint-l3` icon circle, navy title, actions row |
| `Progress`, `Spinner`, `Skeleton` | Loading states |

### Navigation and structure

`Stepper` (sizes `sm/md/lg/dot`; statuses active mint-60 with ring, complete mint-l2, upcoming light-l2, error error-75) · `Breadcrumb` · `Pagination` · `NavigationMenu` · `Sidebar` · `Accordion` · `Collapsible` · `Separator` · `ScrollArea` · `Resizable` · `AspectRatio` · `Carousel`.

### Data and media

`AreaChart`, `BarChart`, `ChartFrame` (with `ChartLegendList`, `CHART_PALETTE`), `Chart` · `Avatar` · `Attachment` / `FileUploadCard` (drag-and-drop upload with status) · `BYBImage` · `BYBPillCard` · `BYBCounter` · `Toggle` / `ToggleGroup` · `Slider` · `InputOTP` · `Calendar` · `Label`.

---

## Accessibility

- Contrast: navy, dark-100 and dark-90 on white pass AA for body text. `dark-60` is for hints and placeholders only, not essential content. Lime buttons always use navy text.
- Focus is always visible: mint-45 ring on inputs, navy ring on buttons.
- Interactive targets are 36px or larger (buttons `sm` and up, form controls 40px).
- Base UI primitives provide keyboard support and ARIA; don't remove it.
- Use `aria-invalid` for error states, `aria-busy` for loading.
- Table captions stay available to screen readers even when shown below the frame.
- Respect `prefers-reduced-motion` (`motion-reduce:animate-none`).

---

## Rules for designers and engineers

1. **Never hard-code hex** or arbitrary values (`text-[#090034]`, `p-[13px]`). Add a token instead.
2. **Primitives for marketing, semantic tokens inside components.**
3. **One lime CTA per view.**
4. **Content width is `max-w-site`.**
5. **No inline styles, no MUI.** Use `cva` for variants, `cn()` for merging, Base UI `render` for links.
6. **New tokens:** add to `globals.css` `:root` (OKLCH + hex comment) → `@theme inline` → run `pnpm check-tokens` → `src/tokens.ts` if needed → `cn()` group in `src/lib/utils.ts`.
7. **Typography by role + step** (`text-h3`, `text-body-4`), never pixel sizes. Tag for structure, class for looks.
8. **Mobile-first breakpoints:** `md:` 768, `lg:` 1024, `xl:` 1440. No `sm:`/`2xl:` in page layout.
9. **Badge colours keep white text at AA.** New category colours must pass 4.5:1 against white.
