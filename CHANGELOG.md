# Changelog

## 2.0.1

### Breaking

- **React 19 is required.** The components take `ref` as a plain prop, which React 18 drops, so on React 18 they lose their refs: a combobox can't reach its own input (a pick doesn't show, typed characters go missing) and its popup loses its anchor. The `react` and `react-dom` peer ranges were `>=18`, so nothing warned; they are now `>=19`.

### Added

- **FileUpload takes its size limit in megabytes.** `maxSizeMb` sets the limit in megabytes (1 MB = 1024 × 1024 bytes, as the file cards count it) alongside `maxSize` in bytes, which wins when both are set. The form package's `FileUploadField` passes it through.
- **Apps only ship the components they use.** The ES module build was one file marked `'use client'`, so importing any component put the whole design system (charts, calendars, the command palette) into every page that used one. It is now one file per component with shared chunks, behind an index of plain re-exports. In a Next.js app, add `experimental: { optimizePackageImports: ['@beforeyoubid/design-system'] }` to `next.config` so imports from the package root resolve to those files. The CommonJS build and the type declarations are unchanged.
- **Button text size, line height, border and disabled look are component tokens.** Each size has `--button-<size>-font-size` and `--button-<size>-leading` (defaults: the type scale's button and caption sizes, as before). `--button-border-width` (default 0) gives every variant a border: outline and secondary keep their one-pixel line, the others get a transparent one with the fill stopping inside it. `--button-disabled-opacity` (default 1) fades a disabled button, and `--button-lime-disabled(-foreground)` and `--button-navy-disabled(-foreground)` set those variants' disabled colours (defaults: the primary button's). Nothing looks different until an app sets them; the website sets them to keep its signed-off 1.x buttons.
- **Tabs trigger and panel type are component tokens.** `--tabs-trigger-font-size`, `--tabs-trigger-leading`, `--tabs-trigger-tracking`, `--tabs-trigger-hover-foreground`, `--tabs-content-font-size` and `--tabs-content-leading`, defaulting to the shipped look.
- **Accordion chevron colours are component tokens.** `--accordion-trigger-icon-foreground`, `-hover-foreground` and `-open-foreground`, defaulting to the title's colour as before.
- **Form text size and line height are component tokens.** `--field-label-font-size`, `--field-label-leading`, `--input-font-size`, `--input-leading`, `--select-trigger-font-size`, `--select-trigger-leading`, `--textarea-font-size` and `--textarea-leading`, defaulting to the shipped look (body-5; the label keeps its tight line height).
- **`font-size` and `leading` are component token properties,** with type-scale and line-height pickers in the Design Console.

### Fixed

- **Dialog buttons that wrap on a phone stack evenly.** `DialogFooter` wraps when its buttons don't fit on one row, and each row stayed right-aligned at its own width, with the main action on the bottom row. Below `sm`, a footer whose buttons wrap now puts the main action on the top row and stretches every button to fill its row. Footers whose buttons fit, and every footer from `sm` up, look the same.
- **Long content stays inside a dialog.** An unbroken string (an email address, a URL, a long name) didn't wrap, so it pushed a Dialog or AlertDialog wider than a phone screen and the actions with it. Text in both now wraps anywhere. A Dialog whose content isn't in a `DialogBody` now scrolls as a whole instead of running its footer off the bottom of the screen, and an AlertDialog stops at the screen's height and scrolls. Put long content in `DialogBody` to keep the header and footer pinned.
- **Combobox buttons have names.** The chevron, the clear button and each chip's remove button were icon-only with no accessible name, so a screen reader announced each as just "button". They are now "Show options", "Clear" and "Remove" plus the chip's text ("Remove Apple"); `ComboboxInput` takes `triggerLabel` and `clearLabel`, and `ComboboxChip` takes `removeLabel` for a chip whose content isn't plain text. The chevron also leaves the tab order: the input already opens the list, so it was a second tab stop doing the same thing.
- **Select options are never cut off.** The popup was exactly the trigger's width and labels never wrapped, so a label wider than the trigger was clipped with no ellipsis. The popup is now at least the trigger's width (and at least 9rem), grows to fit the widest option and stops at the screen edge, where long labels wrap. A `className` width on `SelectContent` still wins. Apps that widened the popup themselves (e.g. `w-fit min-w-(--anchor-width) max-w-(--available-width)`) can drop that.
- **Combobox popups grow to fit their options.** The popup was exactly the field's width, so in a narrow field most labels wrapped onto two or three lines. Like Select, it now grows to the widest option, stays at least the field's width, and stops at the screen edge, where labels wrap. A `className` width on `ComboboxContent` still wins.
- **A long Combobox chip stays inside its field.** A chip was as wide as its text and never wrapped, so a long value (an email address in a multi-select) ran out past the field's edge. A chip now stops at the field's width and its text truncates, with the full value on hover.
- **A single-value Slider has one thumb.** The thumbs came from `[min, max]` unless the value was an array, so `value={40}`, `defaultValue={40}` or no value at all drew two thumbs on top of each other. Now there is one thumb per value in an array, and one otherwise.
- **TimePicker and FileUpload pass other props through.** Both took a fixed list of props and dropped the rest, so a `data-testid`, `title` or `data-*` never rendered (TypeScript doesn't flag hyphenated props, so nothing warned). TimePicker passes them to its trigger button. FileUpload passes them to its root, which stays in place when a file's card replaces the drop zone, so a test id there always finds the field; its `aria-label` and `aria-labelledby` name the drop zone.
- **Calendar range ends are round on a Sunday or Saturday.** The band between a range's ends rounds off at the edge of a week row, but that rule also reached the ends themselves, and a small corner radius beside their full one is scaled down to almost nothing, so an end on the first or last day of a row had one flat side. The rounding now applies to the band only, and an end on a row's edge no longer carries the band past it.
- **A one-day Calendar range has no grey beside it.** Picking the same day as a range's start and end (e.g. 12 Nov – 12 Nov in a date range field) left a grey tab on the day's left edge: the day is both start and end, and the start's and end's bridges to the band share one pseudo-element, which landed on the start side. A one-day range now shows only the selected circle.
- **A field at the top of a dialog keeps its focus ring.** `DialogBody` scrolls, and a scrolling box clips what its children draw outside themselves, so the ring around a focused input or select in the body's first or last row was cut off along that edge. The body now keeps a 4px band inside its scroll area for the ring, with a matching negative margin so nothing moves.
- **Stepper numbers sit in the centre of their circle.** The indicator's `leading-none` came before its text size, so `cn` dropped it and the number sat in a 1.4 line box, about 1px above centre. Apps that set `[&_[data-slot=stepper-indicator]]:leading-none` to work around it can drop that class.

## 2.0.0

Upgrade an app with `npx design-system-migrate` (dry run) then `--write`, in the same PR as the version bump. See DESIGN.md → "Upgrading from 1.1.x".

### Breaking

- **Type classes are role + step.** `text-display-1…4`, `text-h1…h6`, `text-body-1…5`, `text-caption-1…3`, `text-overline`, `text-button-lg/md/sm`. The 1.1.x names (`text-heading-*`, `text-medium-*`, `text-body-lg/md/sm`, `text-caption`, `text-btn-*`, the 10px `text-xs`, `text-2xs`) and `tracking-btn` are removed; the migrator maps each one.
- **Tailwind's default `text-xs` is 12px again.** 1.1.x overrode it to 10px; those uses become `text-caption-2`.
- **`rounded-xl` is 16px and `rounded-2xl` 20px** (they were 20px and 16px). Components were swapped to match; the migrator swaps app uses. `rounded-btn` is removed (→ `rounded-xl`).
- **`cobalt` is renamed `electric-blue`**, including `-l1`, the CSS variables and Badge `variant="cobalt"`.
- **`--primary-foreground` is navy** (was white): white on mint-45 is 2.80:1, under WCAG AA. The primary button text, an icon in the avatar status dot and selected text in a native select follow it. The migrator turns app uses of `*-primary-foreground` and `var(--primary-foreground)` into `white`, so app markup keeps the colour it had.
- **`--success` is a light mint tint** (`mint-15`, was a solid green) with `--success-foreground` `mint-90`, so success text on it passes WCAG AA. Every component text pair now passes AA with no exceptions: mint text darkened to `mint-75` / `mint-90` on light fills (badges, toasts, selected menu, select, command and navigation rows), checkbox ticks and the stepper's active number are navy, toast warning text is `warning-75`, and dropdown menu borders are `dark-15`.
- **Badge, Switch and TabsList variants renamed.** Badge `default`/`secondary`/`outline` → `gray`, `destructive` → `error`; `dot` removed. Switch size `default` → `md`. TabsList `default` → `segmented` (still the default: a grey track with the selected tab raised), `pills` → `pill`.
- **Button gains `secondary` (navy outline) and `tertiary` (grey outline); every 1.x variant stays.** `primary` is the mint fill, with `default` as an alias, and `outline-navy` is an alias of `secondary`. `outline`, `lime` and `navy` are unchanged, and size `default` is an alias of `md`. `ghost`, `destructive` and `link` take the BYB styling.
- **`BYBPillCard` is removed.** No app used it; the website builds its own pill cards. The migrator lists any import of it.
- **`colors` and `typography` are no longer exported.** Use `generateDesignSystemTokens({ overrides })` for non-CSS contexts, or a utility class.
- **`2xl:` breakpoint is 1440px** (was 1536px). `xl:` stays at 1280px.
- **Toasts use shadcn's `toast` on Base UI; Sonner is removed.** `sonner`, `showToast`, `dismissToast` and the inline `<Toast tone>` surface are gone. Fire toasts with `toast.add({ type, title, description, actionProps })` and `toast.promise(promise, { loading, success, error })`; `<Toaster />` is still mounted once. Types, colours, timings and the inline Undo link are unchanged. The `sonner` and `next-themes` dependencies are dropped.
- **`EmptyState` is replaced by shadcn's `Empty`** (`Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, `EmptyContent`) with the same look. `plain` / `dashed` / `muted` are `default` / `outline` / `muted`. `TableEmpty` takes those parts as children instead of `icon` / `title` / `description` / `actions` / `footer` props.
- **`Fieldset` is replaced by shadcn's `Field` parts** (`FieldSet`, `FieldLegend`, `FieldDescription`, `FieldGroup`, `Field`, `FieldLabel`, `FieldError`, `FieldSeparator`) styled to match. `divided` becomes a `FieldSeparator` between sections.

### Added

- **Guardrail docs for apps** ship in the package: `docs/README.md` (start here), `styling.md`, `components.md`, and `registry.md`, every export with its purpose, variant props and component tokens. Point an app's CLAUDE.md at `node_modules/@beforeyoubid/design-system/docs/README.md`.
- `npx design-system-check [paths]` reports guardrail findings in app code with what to use instead (classes 2.0 removed, logical sides, arbitrary values, type classes, semantic colours, `gap`, `size-*`, `dark:`, inline styles, icon imports, `asChild`). `--changed` limits it to lines changed since the last commit, `--commits` to the lines given commits or ranges changed, and `--fix` applies the findings with one safe answer: logical sides, arbitrary values that are on a scale (spacing, radius, opacity, z, aspect, brand hex colours, tracking), Tailwind and px text sizes on the type scale, semantic colours, `size-*`, icon imports and dropping `dark:`. `--nearest` also snaps text sizes between two steps to the nearer one. It never fails a build.
- `generateDesignSystemTokens({ overrides })`: brand colours, semantic roles (`colors.primary`, `colors.mutedForeground`, each following its brand colour), product badge colours and type styles for non-CSS contexts, generated from `globals.css` so they can't drift.
- `design-system-migrate` codemod.
- BYB product components with no shadcn equivalent: `IconTile`, `Stepper`, `ColorDot`.
- `shadcn.css`: a copy of shadcn's stylesheet (custom variants, `no-scrollbar`, `scroll-fade-*`, `shimmer`), refreshed with `pnpm sync-shadcn-css`. Fixes Separator and ScrollArea scrollbars, which rendered 0px.
- `tw-animate-css` is a dependency and imported by `globals.css`, so overlay enter/exit animations (`animate-in`, `fade-in-0`, `zoom-in-95`, `slide-in-from-*`) work. Apps need no change.

### Fixed

- Accordion panels animate open and closed. They used keyframes that read Radix's height variable, which Base UI never sets; the panel now transitions to Base UI's `--accordion-panel-height`.
- `--input` is dark-45, the form-control border in DESIGN.md (it was dark-15, shared with `--border`). Stock shadcn controls that read `border-input` now match the BYB ones.
- Dropdown menu and command items grow to fit a second line (a description under the label). They had a fixed 32px height, so the second line spilled onto the next item; 32px is now the minimum, and `--dropdown-menu-item-height` / `--command-item-height` are `--dropdown-menu-item-min-height` / `--command-item-min-height` with a `-padding-y` token each.
- A single Combobox's popup lines up with its field: same left edge, same width. It was anchored to the text input inside the field, so it sat indented and narrower. Pass `anchor` to anchor it elsewhere.
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
