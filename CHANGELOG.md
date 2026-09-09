# Changelog

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
