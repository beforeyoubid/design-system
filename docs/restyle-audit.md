# BYB → shadcn/BaseUI Restyle Audit

Phase 0 — no code has been changed. This document records the delta between the
BYB Figma design language and what base-maia ships, the BYB-component collapse
plan, and one token gap that needs a decision before any component is touched.

---

## 1. BYB Visual Language Summary

Sourced from: BYB Design Library Figma, existing `src/components/BYB*.tsx`
source code, and the token system in `globals.css`.

| Property | BYB value |
|---|---|
| **Primary font** | Plus Jakarta Sans |
| **Radius — buttons, badges, chips** | `rounded-btn` (18px) — pill-ish but not fully round |
| **Radius — inputs, selects, textareas** | `rounded-md` (8px) |
| **Radius — cards** | `rounded-xl` (12px) |
| **Radius — dialogs / drawers** | `rounded-xl` (12px) |
| **Radius — small inline elements** | `rounded-md` (8px) |
| **Border — surface components** | `1px solid var(--border)` (`dark-15`) |
| **Card background** | `white` |
| **Input background** | `light-l1` |
| **Button text casing** | UPPERCASE with `tracking-btn` (0.04em) |
| **Focus ring** | 2px ring in `ring-primary` (`mint-45`) |
| **Primary action button** | Lime background, navy text |
| **Secondary action button** | Navy background, white text |
| **Shadow scale** | xs–3xl already in globals.css |
| **Alert/Snackbar variants** | Success (green), Warning (amber), Error (red), Neutral (dark-60) |

---

## 2. BYB Component Collapse Plan

### Collapse into `src/components/ui/*`

| BYB component | Target shadcn primitive | What changes |
|---|---|---|
| `BYBButton` | `ui/button` | Add `lime` and `navy` variants. Keep uppercase + tracking from existing cva base classes. Retire `BYBButton` export. |
| `BYBTextButton` | `Button variant="link"` + utility classes | No new component. `variant="link"` is the base; callers apply `text-mint-45 hover:text-mint-60` etc. See §4 for icon sizing pattern. |
| `BYBCard` | `ui/card` | Fix radius (`rounded-2xl` → `rounded-xl`) and surface treatment (`ring` → `border border-border`). Retire `BYBCard`. |
| `BYBInput` | `ui/input` + new `InputField` composite | `ui/input` gets BYB visual. `InputField` is a new thin wrapper that adds `label`, `hint`, `error` slots. Retire `BYBInput`. |
| `BYBSelect` | `ui/select` + new `SelectField` composite | `ui/select` gets BYB visual. `SelectField` wraps it with label/hint/error. Retire `BYBSelect`. |
| `BYBPillTabs` | `ui/tabs` | Add `variant="pills"` to `TabsList` cva. Retire `BYBPillTabs`. |

### Keep as-is (no shadcn equivalent)

| Component | Reason |
|---|---|
| `BYBCounter` | Animated count-up + intersection observer — unique product widget |
| `BYBPillCard` | Pill-shaped feature card with icon circle — domain-specific |
| `BYBTestimonialCarousel` | Marquee + triangle decoration — domain-specific. Could internally refactor to use `ui/carousel` if desired. |
| `BYBImage` | Trivial `next/image` wrapper with opinionated `sizes`. Keep. |

---

## 3. Component Delta

### Tier 1 — High-traffic primitives

#### Button

| Property | base-maia ships | BYB target | Delta |
|---|---|---|---|
| Radius | `rounded-4xl` | `rounded-btn` (18px) | Change in base class |
| Default height | `h-9` (36px) | Taller — `h-10`/`h-11` depending on size | Size variant update |
| Base text style | `text-sm font-medium` (lowercase) | `text-btn-md font-semibold uppercase tracking-btn` | Base class update |
| Variants | default, outline, secondary, ghost, destructive, link | Add `lime` (bg-lime text-navy) and `navy` (bg-navy text-white) | New cva variants |
| Focus ring | `ring-ring/50` | `ring-primary` (mint-45) | Already handled by semantic token |
| Active press | `translate-y-px` | Keep | No change |

**Note on sizes:** BYB md = roughly `h-10 px-6`, lg = `h-12 px-8`, sm = `h-8 px-4`. Adjust size variants accordingly.

#### Input

| Property | base-maia ships | BYB target | Delta |
|---|---|---|---|
| Radius | `rounded-4xl` | `rounded-md` (8px) | Change class |
| Height | `h-9` (36px) | `h-11` (44px) — BYB inputs are taller | Change class |
| Background | `bg-input/30` | `bg-light-l1` | Change to `bg-light-l1` (semantic: `bg-muted` would work) |
| Border | `border-input` | `border-border` | Change class |
| Border hover | None | `hover:border-dark-30` | Add hover modifier |
| Padding | `px-3 py-1` | `px-4` | Change class |
| Text size | `text-base` (16px) / `md:text-sm` | `text-body-md` (16px) | Simplify to `text-body-md` |

#### Card

| Property | base-maia ships | BYB target | Delta |
|---|---|---|---|
| Radius | `rounded-2xl` (24px) | `rounded-xl` (12px) | Change class |
| Surface treatment | `ring-1 ring-foreground/10` (no explicit border) | `border border-border` | Replace ring with border |
| Background | `bg-card` | `bg-card` (white) | No change — semantic token handles it |
| Padding | `py-6` | `p-6` | Minor — add `px-6` to base |
| Hover | None | Optional `hover:shadow-md` (for hoverable cards) | Consumer adds this |
| Gap | `gap-6` | `gap-4` / `gap-6` | Minor — keep gap-6 as default, size="sm" gives gap-4 |

**Note:** `CardAction` is new in base-maia (header action slot). `BYBCard` had `imageSlot`. The composition model is different — consumers will compose sections instead of using slots.

#### Badge

| Property | base-maia ships | BYB target | Delta |
|---|---|---|---|
| Radius | `rounded-4xl` | `rounded-btn` (18px, pill-ish) | Change class |
| Height | `h-5` (20px) | `h-5` | No change |
| Text size | `text-xs` (10px — our override) | `text-xs` | No change |
| Variants | default, secondary, destructive, outline, ghost, link | Add brand variants: `mint`, `cobalt`, `teal` | New cva variants |
| Border | `border-transparent` | `border-transparent` by default | No change |

**New badge variants to add:**

```
mint:   bg-mint-l2 text-mint-90 border-mint-l1
cobalt: bg-cobalt-l1 text-cobalt
teal:   bg-teal-l1 text-teal
lime:   bg-lime-l1 text-navy
```

#### Alert

| Property | base-maia ships | BYB target | Delta |
|---|---|---|---|
| Radius | `rounded-lg` | `rounded-xl` | Change class |
| Variants | default, destructive | default, destructive, success, warning, info | Add 3 variants |
| Border | `border` (no colour) | Coloured left-border treatment (MUI-inspired) OR full border with tinted background | Design decision — see below |

**Alert variant approach:** BYB Figma has Snackbar-Error, Snackbar-Warning, Snackbar-Neutral, Snackbar-Success. Recommend: tinted background + coloured icon:

```
success: bg-success/10 text-success
warning: bg-warning/10 text-warning-45
info:    bg-muted text-foreground
```

All use existing tokens, no new tokens needed.

#### Dialog

| Property | base-maia ships | BYB target | Delta |
|---|---|---|---|
| Content radius | `rounded-4xl` | `rounded-xl` | Change class |
| Surface treatment | `ring-1 ring-foreground/5` | `border border-border` | Replace ring |
| Overlay | `bg-black/80` with `backdrop-blur-xs` | `bg-dark-100/95` (our overlay token) | Improve with brand overlay colour |
| Animation | `zoom-in-95` | Keep | No change |
| Close button | Ghost icon button top-right | Keep | No change |

---

### Tier 2 — Supporting primitives

| Component | Key delta |
|---|---|
| **Tabs** | `TabsList`: `rounded-4xl` → `rounded-btn`. Add `variant="pills"` to replicate `BYBPillTabs`. Active trigger: use `bg-background data-active:shadow-sm`. |
| **Select** | Trigger: `rounded-4xl` → `rounded-md`, `h-9` → `h-11`, `bg-input/30` → `bg-light-l1`, `border-input` → `border-border`. Popover content: `rounded-xl`, `border-border`. |
| **Checkbox** | Already uses `data-checked:bg-primary` (mint via semantic token). Radius `rounded-[6px]` is fine — no change. |
| **Switch** | Thumb: `bg-white`. Track off: `bg-input`. Track on: `bg-primary`. Base-maia defaults likely correct — verify. |
| **Avatar** | Fallback background: `bg-muted` → `bg-dark-15`. Initials: `text-foreground`. Fine as-is. |
| **Tooltip** | Content: `bg-dark-100 text-white rounded-md`. base-maia likely uses `bg-popover` — change to `bg-dark-100 text-white` for BYB look. |
| **Popover** | Content: `rounded-xl border-border`. No `ring`. Padding `p-4`. |
| **Sheet** | Content: `rounded-xl` on the opening edge, `border-border`. Otherwise fine. |
| **Slider** | Track: `bg-muted`. Range: `bg-primary`. Thumb: `bg-white ring-2 ring-primary`. base-maia likely close — verify. |
| **Accordion** | Trigger: `text-foreground font-medium`, no uppercase. Content `text-body-sm text-muted-foreground`. Fine as-is. |
| **Breadcrumb** | Separator colour: `text-dark-45`. Active: `text-foreground`. Fine as-is. |
| **Pagination** | Active page: `bg-primary text-primary-foreground rounded-btn`. Nav arrows: `border-border`. |

---

### Tier 3 — Mostly token-driven

These components carry little BYB-specific visual opinion. Once the semantic
tokens are correctly wired (already done) and Tier 1/2 components are patched,
these will look correct or near-correct.

| Component | Note |
|---|---|
| Calendar | Fine — uses semantic tokens. Verify day selection uses `bg-primary`. |
| Chart | Token-driven (`--chart-1` through `--chart-5`). Already wired. |
| Sidebar | Semantic tokens `--sidebar-*` wired. Verify it reads `bg-sidebar`. |
| Carousel | Styled by consumers. Navigation arrows use `Button variant="outline"`. |
| Resizable | Divider handle: `bg-border`. Fine. |
| ScrollArea | Scrollbar: `bg-border rounded-full`. Fine. |
| Sonner (Toaster) | Uses `bg-background border-border shadow-md`. Fine. |
| Table | Header: `text-muted-foreground font-medium`. Row hover: `hover:bg-muted/50`. Fine. |
| Progress | Track: `bg-muted`. Fill: `bg-primary`. Fine. |
| Skeleton | `bg-muted animate-pulse`. Fine. |
| Separator | `bg-border`. Fine. |
| Label | `text-body-sm font-medium text-foreground`. Verify size. |
| Textarea | Same treatment as Input: radius, height, background. |
| InputOTP | `rounded-md` per slot. Fine. |
| InputGroup | New in base-maia. `rounded-btn` on container → `rounded-md`. |
| RadioGroup | Same as Checkbox — already semantic-token correct. |
| AlertDialog | Same as Dialog — patch radius and ring/border. |
| Drawer | bottom-sheet, inherits from Dialog approach. |
| HoverCard | Same as Popover — `rounded-xl border-border`. |
| Command | Search input: same as Input. List items: `rounded-md`. |
| DropdownMenu | Content: `rounded-xl border-border`. Items: `rounded-md`. |
| ContextMenu | Same as DropdownMenu. |
| Menubar | Trigger radius: `rounded-md`. Content: `rounded-xl`. |
| NavigationMenu | Link hover: `bg-accent text-accent-foreground`. Fine. |
| Toggle | Pill shape: `rounded-btn`. Active: `bg-primary text-primary-foreground`. |
| ToggleGroup | Container: `rounded-btn`. |
| Collapsible | No visual chrome. Fine. |
| AspectRatio | No visual chrome. Fine. |

---

## 4. Token Gap — One Decision Required

### `rounded-4xl` is not defined in our `globals.css`

base-maia components hardcode `rounded-4xl` in these locations:
- `button.tsx` — base class
- `input.tsx` — base class
- `badge.tsx` — base class
- `select.tsx` (trigger) — base class
- `dialog.tsx` (content) — base class
- `tabs.tsx` (list) — base class

In Tailwind v4, there is no built-in `rounded-4xl`. Our `globals.css` defines
`--radius-sm/md/lg/xl/btn/full` but not `4xl`. So currently `rounded-4xl`
renders as zero rounding — every one of those components has square corners.

This is the single most impactful fix before anything else looks right.

**Two paths:**

**Option A — Add `--radius-4xl: var(--radius-btn)` to globals.css** (18px)

Every `rounded-4xl` element becomes pill-ish (18px). That's right for buttons
and badges. Then inputs, selects, dialogs get explicit overrides in their source
to use `rounded-md` or `rounded-xl`.

Pro: one-line token addition, fast fix, all `rounded-4xl` things immediately
rounded. Con: a few components still need individual overrides.

**Option B — Don't add `--radius-4xl`. Edit each component directly.**

In Phase 2, change each `rounded-4xl` in component source files to the correct
BYB token (`rounded-btn` for buttons/badges, `rounded-md` for inputs/selects,
`rounded-xl` for dialogs).

Pro: every component gets the *right* value, no shared token causing confusion.
Con: more component-level changes in Phase 2.

**Recommendation: Option A.** Add `--radius-4xl: var(--radius-btn)` as a
globals.css convenience alias. This immediately unbreaks the 90% case (buttons
and badges), and the outliers (inputs → `rounded-md`, dialogs → `rounded-xl`)
get explicit overrides as part of the Phase 2 component work anyway — the
override is semantically correct and obvious in the code.

---

## 5. New Components Needed

From the collapse plan and Figma component inventory:

| Component | Where it lives | Notes |
|---|---|---|
| `InputField` | `src/components/InputField.tsx` | Wraps `ui/input` with `label`, `hint`, `error` props. Replaces `BYBInput`. |
| `SelectField` | `src/components/SelectField.tsx` | Wraps `ui/select` with `label`, `hint`, `error` props. Replaces `BYBSelect`. |

No new shadcn primitives needed beyond what's already generated.

---

## 6. Approach for Phase 2

Once the token decision in §4 is locked:

1. **`globals.css`** — add `--radius-4xl` if Option A (one line).
2. **`ui/button.tsx`** — update base class (radius, height, text style), add `lime` and `navy` variants.
3. **`ui/card.tsx`** — fix radius and ring→border.
4. **`ui/input.tsx`** — fix radius, height, background.
5. **`ui/alert.tsx`** — add success/warning/info variants.
6. **`ui/badge.tsx`** — fix radius, add brand variants.
7. **`ui/dialog.tsx`** — fix radius and ring→border, update overlay colour.
8. **`ui/tabs.tsx`** — add `pills` variant.
9. **Remaining Tier 2** — select trigger, tooltip, popover, sheet, pagination, toggle, input-group, textarea.
10. **New composites** — `InputField`, `SelectField`.
11. **Collapse BYB-prefixed re-skins** — retire `BYBButton`, `BYBCard`, `BYBInput`, `BYBSelect`, `BYBTextButton`, `BYBPillTabs` with deprecated re-exports for a release cycle.
12. **Storybook stories** — update all Tier 1/2 stories to validate the new look.
