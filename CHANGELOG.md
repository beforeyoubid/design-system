# Changelog

## 2.0.0

Upgrade an app with `npx design-system-migrate` (dry run) then `--write`, in the same PR as the version bump. See DESIGN.md → "Upgrading from 1.1.x".

### Breaking

- **Type classes are role + step.** `text-display-1…4`, `text-h1…h6`, `text-body-1…5`, `text-caption-1…3`, `text-overline`, `text-button-lg/md/sm`. The 1.1.x names (`text-heading-*`, `text-medium-*`, `text-body-lg/md/sm`, `text-caption`, `text-btn-*`, the 10px `text-xs`, `text-2xs`) and `tracking-btn` are removed; the migrator maps each one.
- **Tailwind's default `text-xs` is 12px again.** 1.1.x overrode it to 10px; those uses become `text-caption-2`.
- **`rounded-xl` is 16px and `rounded-2xl` 20px** (they were 20px and 16px). Components were swapped to match; the migrator swaps app uses. `rounded-btn` is removed (→ `rounded-xl`).
- **`cobalt` is renamed `electric-blue`**, including `-l1` and the CSS variables.
- **Badge, Switch and TabsList variants renamed.** Badge `default`/`secondary`/`outline` → `gray`, `destructive` → `error`; `dot` removed. Switch size `default` → `md`. TabsList `default`/`pills` → `pill`.
- **Button gains `secondary` (navy outline) and `tertiary` (grey outline); every 1.x variant stays.** `primary` is the mint fill, with `default` as an alias, and `outline-navy` is an alias of `secondary`. `outline`, `lime` and `navy` are unchanged, and size `default` is an alias of `md`. `ghost`, `destructive` and `link` take the BYB styling.
- **`colors` and `typography` are no longer exported.** Use `generateDesignSystemTokens({ overrides })` for non-CSS contexts, or a utility class.
- **`2xl:` breakpoint is 1440px** (was 1536px). `xl:` stays at 1280px.
- **Toasts use shadcn's `toast` on Base UI; Sonner is removed.** `sonner`, `showToast`, `dismissToast` and the inline `<Toast tone>` surface are gone. Fire toasts with `toast.add({ type, title, description, actionProps })` and `toast.promise(promise, { loading, success, error })`; `<Toaster />` is still mounted once. Types, colours, timings and the inline Undo link are unchanged. The `sonner` and `next-themes` dependencies are dropped.
- **`EmptyState` is replaced by shadcn's `Empty`** (`Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, `EmptyContent`) with the same look. `plain` / `dashed` / `muted` are `default` / `outline` / `muted`. `TableEmpty` takes those parts as children instead of `icon` / `title` / `description` / `actions` / `footer` props.
- **`Fieldset` is replaced by shadcn's `Field` parts** (`FieldSet`, `FieldLegend`, `FieldDescription`, `FieldGroup`, `Field`, `FieldLabel`, `FieldError`, `FieldSeparator`) styled to match. `divided` becomes a `FieldSeparator` between sections.

### Added

- `generateDesignSystemTokens({ overrides })`: colours, product badge colours and type styles for non-CSS contexts, generated from `globals.css` so they can't drift.
- `design-system-migrate` codemod.
- `tw-animate-css` is a dependency and imported by `globals.css`, so overlay enter/exit animations (`animate-in`, `fade-in-0`, `zoom-in-95`, `slide-in-from-*`) work. Apps need no change.

### Fixed

- Accordion panels animate open and closed. They used keyframes that read Radix's height variable, which Base UI never sets; the panel now transitions to Base UI's `--accordion-panel-height`.
- Tailwind's default text sizes are no longer cleared, so `text-sm`, `text-lg` and the rest keep working in apps.

## 1.1.5

### Added

- **`PopoverContent` now forwards `positionMethod`.** Base UI's positioner renders unpositioned for
  one frame before it measures the anchor, and under the `absolute` default that unpositioned origin
  is the document's rather than the viewport's. Anything the popup mounts that calls `scrollIntoView`
  on itself therefore scrolls the whole page before the popup is ever placed — cmdk does exactly
  this to its active item, so opening a combobox low on a long page slammed the document to the top
  (measured: 1188px, leaving the dropdown off-screen). `positionMethod="fixed"` puts that first frame
  at the viewport origin, which is always in view, and the scroll becomes a no-op.

  Forwarded, not defaulted. `PopoverContent` previously neither set nor exposed the prop, so
  consumers could not reach it at all; the default stays `absolute` so no existing popover moves.
  Only the callers that mount a self-scrolling child need to opt in.

## 1.1.4

### Fixed

- **Command items no longer all render as though they were selected.** `CommandItem` styled its
  selected state with `data-selected:bg-muted`, which Tailwind v4 compiles to `&[data-selected]` — a
  test for the attribute being PRESENT, not for its value. cmdk writes `data-selected="false"` on
  every inactive item, so the attribute was always there and every row in every command list,
  combobox and command palette drew the selected background. The one row the user was actually on
  became indistinguishable from the rest, which is the entire job of the style. The classes now match
  on the value, as the neighbouring `data-[disabled=true]:` ones already did. `CommandShortcut` had
  the same bug in its group form and is fixed with it.

  `SelectItem` keeps the bare `data-selected:` form deliberately: that is Base UI, which sets the
  attribute only when the item IS selected, so presence is the correct test there. The difference is
  the library, not the class name.

  This is a visual change by design — anything holding visual-regression baselines that include a
  command list or combobox will show a diff.
