# Component registry

Every component `@beforeyoubid/design-system` exports. Generated from the code by `scripts/registry/build.mjs`; don't edit by hand.

Import from the package root: `import { Button } from '@beforeyoubid/design-system'`. Icons come from `@beforeyoubid/design-system/icons`.

Component tokens change a component's look without touching its code: set them in the app's CSS on `:root` or on a class around the area. See [components.md](./components.md#changing-how-a-component-looks).

[Accordion](#accordion) · [Alert](#alert) · [AlertDialog](#alertdialog) · [AspectRatio](#aspectratio) · [Attachment](#attachment) · [Avatar](#avatar) · [Badge](#badge) · [Breadcrumb](#breadcrumb) · [Button](#button) · [ButtonGroup](#buttongroup) · [BYBAreaChart](#bybareachart) · [BYBBarChart](#bybbarchart) · [Calendar](#calendar) · [Card](#card) · [Carousel](#carousel) · [Chart](#chart) · [Checkbox](#checkbox) · [Collapsible](#collapsible) · [Combobox](#combobox) · [Command](#command) · [ContextMenu](#contextmenu) · [Counter](#counter) · [Dialog](#dialog) · [Drawer](#drawer) · [DropdownMenu](#dropdownmenu) · [Empty](#empty) · [Field](#field) · [FileDropZone](#filedropzone) · [FileUpload](#fileupload) · [HoverCard](#hovercard) · [IconTile](#icontile) · [Input](#input) · [InputGroup](#inputgroup) · [InputOTP](#inputotp) · [Item](#item) · [Kbd](#kbd) · [Label](#label) · [Menubar](#menubar) · [NativeSelect](#nativeselect) · [NavigationMenu](#navigationmenu) · [Pagination](#pagination) · [Popover](#popover) · [Progress](#progress) · [RadioGroup](#radiogroup) · [Resizable](#resizable) · [ScrollArea](#scrollarea) · [Select](#select) · [Separator](#separator) · [Sheet](#sheet) · [Sidebar](#sidebar) · [Skeleton](#skeleton) · [Slider](#slider) · [Spinner](#spinner) · [Stepper](#stepper) · [Switch](#switch) · [Table](#table) · [Tabs](#tabs) · [Textarea](#textarea) · [TimePicker](#timepicker) · [Toast](#toast) · [Toggle](#toggle) · [ToggleGroup](#togglegroup) · [Tooltip](#tooltip)

## Accordion

Stacked sections that expand one at a time or several at once. For FAQs and long settings pages.

**Exports:** `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`, `accordionTriggerVariants`, `accordionContentVariants`

**size:** `sm` · `md` · `lg`

<details><summary>12 component tokens</summary>

`--accordion-item-border` `--accordion-trigger-font-weight` `--accordion-trigger-foreground` `--accordion-trigger-hover-foreground` `--accordion-trigger-open-foreground` `--accordion-trigger-disabled-opacity` `--accordion-trigger-gap` `--accordion-trigger-padding-y` `--accordion-trigger-sm-gap` `--accordion-trigger-sm-padding-y` `--accordion-trigger-lg-padding-y` `--accordion-content-foreground`

</details>

## Alert

A message that stays on the page: info, success, warning or destructive. For passing news use a toast instead.

**Exports:** `Alert`, `AlertTitle`, `AlertDescription`, `AlertAction`

<details><summary>14 component tokens</summary>

`--alert-gap` `--alert-radius` `--alert-padding-x` `--alert-padding-y` `--alert-default` `--alert-default-border` `--alert-default-foreground` `--alert-destructive` `--alert-destructive-border` `--alert-destructive-foreground` `--alert-with-icon-gap` `--alert-with-action-padding-x` `--alert-title-font-weight` `--alert-description-foreground`

</details>

## AlertDialog

A modal that interrupts for a decision the user must make. For a confirm-then-act step prefer ConfirmDialog.

**Exports:** `AlertDialog`, `AlertDialogAction`, `AlertDialogCancel`, `AlertDialogContent`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogHeader`, `AlertDialogMedia`, `AlertDialogOverlay`, `AlertDialogPortal`, `AlertDialogTitle`, `AlertDialogTrigger`

<details><summary>16 component tokens</summary>

`--alert-dialog-overlay` `--alert-dialog-content-gap` `--alert-dialog-content-radius` `--alert-dialog-content-border` `--alert-dialog-content` `--alert-dialog-content-padding` `--alert-dialog-content-foreground` `--alert-dialog-content-shadow` `--alert-dialog-header-gap` `--alert-dialog-header-with-media-gap` `--alert-dialog-footer-gap` `--alert-dialog-media-size` `--alert-dialog-media-radius` `--alert-dialog-media` `--alert-dialog-title-font-weight` `--alert-dialog-description-foreground`

</details>

## AspectRatio

Keeps media at a fixed width-to-height ratio as its width changes.

**Exports:** `AspectRatio`

## Attachment

One file in an upload list: name, size, status (uploading, completed, error, uploaded) and actions.

**Exports:** `Attachment`, `AttachmentGroup`, `AttachmentMedia`, `AttachmentContent`, `AttachmentTitle`, `AttachmentDescription`, `AttachmentActions`, `AttachmentAction`, `AttachmentTrigger`, `AttachmentStatus`, `AttachmentProgress`, `AttachmentError`

<details><summary>43 component tokens</summary>

`--attachment-radius` `--attachment` `--attachment-foreground` `--attachment-shadow` `--attachment-error-border` `--attachment-focus-ring` `--attachment-default-gap` `--attachment-default-padding` `--attachment-sm-gap` `--attachment-sm-padding` `--attachment-xs-gap` `--attachment-xs-radius` `--attachment-vertical-width` `--attachment-vertical-with-content-width` `--attachment-media-width` `--attachment-media-radius` `--attachment-media` `--attachment-media-foreground` `--attachment-media-error` `--attachment-media-error-foreground` `--attachment-media-icon-size` `--attachment-media-sm-icon-size` `--attachment-media-image-opacity` `--attachment-media-sm-width` `--attachment-media-xs-width` `--attachment-media-xs-radius` `--attachment-title-font-weight` `--attachment-title-foreground` `--attachment-description-foreground` `--attachment-description-error-foreground` `--attachment-group-gap` `--attachment-group-padding-y` `--attachment-status-gap` `--attachment-status-foreground` `--attachment-status-completed-foreground` `--attachment-status-error-foreground` `--attachment-progress-height` `--attachment-progress-radius` `--attachment-progress` `--attachment-progress-indicator` `--attachment-error-foreground` `--attachment-retry-foreground` `--attachment-retry-font-weight`

</details>

## Avatar

A person's photo or initials, with an optional status badge, in groups with a +N count.

**Exports:** `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarGroup`, `AvatarGroupCount`, `AvatarBadge`

<details><summary>19 component tokens</summary>

`--avatar-size` `--avatar-radius` `--avatar-sm-size` `--avatar-lg-size` `--avatar-image-radius` `--avatar-fallback-radius` `--avatar-fallback` `--avatar-fallback-foreground` `--avatar-badge-radius` `--avatar-badge` `--avatar-badge-foreground` `--avatar-badge-ring` `--avatar-badge-size` `--avatar-badge-sm-size` `--avatar-badge-lg-size` `--avatar-group-count-radius` `--avatar-group-count` `--avatar-group-count-foreground` `--avatar-group-count-ring`

</details>

## Badge

A short status or category label. Status variants (success, warning, error), product colours, soft or solid appearance.

**Exports:** `Badge`, `badgeVariants`, `badgeCategoryVariants`, `badgeProductVariants`

**variant:** `gray` · `mint` · `lime` · `success` · `error` · `warning` · `electric-blue`

**appearance:** `tint` · `solid`

**iconPosition:** `left` · `right`

**product:** `bpi` · `building-inspection` · `pest-inspection` · `strata-report` · `owners-corp-cert` · `pool-inspection` · `electrical-report` · `electrical-safety-cert` · `plumbing-report` · `handover-inspection` · `valuations` · `asbestos-testing` · `dilapidation-report` · `depreciation-schedule` · `owner-builder-report` · `minimum-standards` · `new-building-inspection` · `home-energy-rating` · `bmc`

**size:** `sm` · `md` · `lg`

<details><summary>65 component tokens</summary>

`--badge-height` `--badge-gap` `--badge-radius` `--badge-padding-x` `--badge-padding-y` `--badge-font-weight` `--badge-focus-border` `--badge-focus-ring` `--badge-invalid-border` `--badge-invalid-ring` `--badge-default-border` `--badge-default` `--badge-default-font-weight` `--badge-default-foreground` `--badge-secondary-border` `--badge-secondary` `--badge-secondary-font-weight` `--badge-secondary-foreground` `--badge-destructive-border` `--badge-destructive` `--badge-destructive-font-weight` `--badge-destructive-foreground` `--badge-outline-border` `--badge-outline` `--badge-outline-foreground` `--badge-ghost-hover` `--badge-ghost-hover-foreground` `--badge-link-foreground` `--badge-lime-border` `--badge-lime` `--badge-lime-foreground` `--badge-lime-font-weight` `--badge-success-border` `--badge-success` `--badge-success-foreground` `--badge-success-font-weight` `--badge-warning-border` `--badge-warning` `--badge-warning-foreground` `--badge-warning-font-weight` `--badge-electric-blue-border` `--badge-electric-blue` `--badge-electric-blue-foreground` `--badge-electric-blue-font-weight` `--badge-gray-solid` `--badge-gray-solid-foreground` `--badge-mint-solid` `--badge-mint-solid-foreground` `--badge-lime-solid` `--badge-lime-solid-foreground` `--badge-success-solid` `--badge-success-solid-foreground` `--badge-error-solid` `--badge-error-solid-foreground` `--badge-warning-solid` `--badge-warning-solid-foreground` `--badge-electric-blue-solid` `--badge-electric-blue-solid-foreground` `--badge-sm-height` `--badge-sm-padding-x` `--badge-lg-height` `--badge-lg-gap` `--badge-lg-padding-x` `--badge-filled-font-weight` `--badge-with-icon-padding-x`

</details>

## Breadcrumb

The path from the top of the app to the current page.

**Exports:** `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`

<details><summary>8 component tokens</summary>

`--breadcrumb-list-gap` `--breadcrumb-list-foreground` `--breadcrumb-list-gap\:sm` `--breadcrumb-item-gap` `--breadcrumb-link-hover-foreground` `--breadcrumb-page-font-weight` `--breadcrumb-page-foreground` `--breadcrumb-ellipsis-size`

</details>

## Button

Runs an action or, with render, navigates. Variants primary, secondary, tertiary, ghost, destructive, link, lime and navy; built-in loading and icon props.

**Exports:** `Button`, `buttonVariants`

**variant:** `primary` · `secondary` · `tertiary` · `ghost` · `destructive` · `link` · `default` · `outline-navy` · `outline` · `lime` · `navy`

**size:** `sm` · `md` · `lg` · `xs` · `icon` · `icon-xs` · `icon-sm` · `icon-lg`

**iconPosition:** `left` · `right`

<details><summary>81 component tokens</summary>

`--button-radius` `--button-font-weight` `--button-focus-ring` `--button-invalid-ring` `--button-default` `--button-default-foreground` `--button-default-shadow` `--button-default-hover` `--button-default-open` `--button-default-disabled` `--button-default-disabled-foreground` `--button-default-disabled-shadow` `--button-outline-border` `--button-outline` `--button-outline-foreground` `--button-outline-hover-border` `--button-outline-hover` `--button-outline-hover-foreground` `--button-outline-open-border` `--button-outline-open` `--button-outline-open-foreground` `--button-outline-open-ring` `--button-outline-disabled-border` `--button-outline-disabled` `--button-outline-disabled-foreground` `--button-secondary-border` `--button-secondary` `--button-secondary-foreground` `--button-secondary-hover` `--button-secondary-hover-foreground` `--button-secondary-open` `--button-secondary-open-foreground` `--button-secondary-disabled-border` `--button-secondary-disabled` `--button-secondary-disabled-foreground` `--button-ghost-foreground` `--button-ghost-hover-foreground` `--button-ghost-open-foreground` `--button-ghost-disabled-foreground` `--button-destructive` `--button-destructive-foreground` `--button-destructive-shadow` `--button-destructive-hover` `--button-destructive-focus-ring` `--button-destructive-disabled` `--button-destructive-disabled-foreground` `--button-destructive-disabled-shadow` `--button-link-foreground` `--button-link-hover-foreground` `--button-link-disabled-foreground` `--button-md-height` `--button-md-gap` `--button-md-padding-x` `--button-xs-height` `--button-xs-gap` `--button-xs-radius` `--button-xs-padding-x` `--button-xs-padding-y` `--button-sm-height` `--button-sm-gap` `--button-sm-radius` `--button-sm-padding-x` `--button-lg-height` `--button-lg-gap` `--button-lg-padding-x` `--button-icon-size` `--button-icon-radius` `--button-icon-xs-size` `--button-icon-xs-radius` `--button-icon-sm-size` `--button-icon-sm-radius` `--button-icon-lg-size` `--button-icon-lg-radius` `--button-lime` `--button-lime-foreground` `--button-navy` `--button-navy-foreground` `--button-md-with-icon-padding-x` `--button-xs-with-icon-padding-x` `--button-sm-with-icon-padding-x` `--button-lg-with-icon-padding-x`

</details>

## ButtonGroup

Joins related buttons into one control with shared edges.

**Exports:** `ButtonGroup`, `ButtonGroupSeparator`, `ButtonGroupText`, `buttonGroupVariants`

<details><summary>6 component tokens</summary>

`--button-group-text-gap` `--button-group-text-radius` `--button-group-text` `--button-group-text-padding-x` `--button-group-text-font-weight` `--button-group-separator`

</details>

## BYBAreaChart

Area chart for a trend over time, in a card with title, trend line and caption. Use over a raw Recharts chart so axes, grid and colours match.

**Exports:** `BYBAreaChart`

**curve:** `natural` · `linear` · `step`

## BYBBarChart

Bar chart for comparing values across categories, in a card with title and optional stat toggles. Use over a raw Recharts chart.

**Exports:** `BYBBarChart`, `bybStatToggleVariants`

**layout:** `vertical` · `horizontal`

**labels:** `none` · `value` · `category` · `inside`

**colorBy:** `series` · `category`

## Calendar

A month grid for picking a date or range. For a field use the date picker built on it.

**Exports:** `Calendar`, `CalendarDayButton`

<details><summary>14 component tokens</summary>

`--calendar-day-selected` `--calendar-day-selected-foreground` `--calendar-day-foreground` `--calendar-day-hover` `--calendar-day-radius` `--calendar-range` `--calendar-today` `--calendar-today-foreground` `--calendar-outside-foreground` `--calendar-disabled-foreground` `--calendar-caption-foreground` `--calendar-weekday-foreground` `--calendar-nav-foreground` `--calendar-nav-hover-foreground`

</details>

## Card

A bordered surface that groups related content, with header, title, description, content and footer parts.

**Exports:** `Card`, `CardHeader`, `CardFooter`, `CardTitle`, `CardAction`, `CardDescription`, `CardContent`, `CardIcon`

<details><summary>17 component tokens</summary>

`--card-gap` `--card-radius` `--card-border` `--card-fill` `--card-shadow` `--card-padding-y` `--card-sm-gap` `--card-sm-padding-y` `--card-header-gap` `--card-header-padding-x` `--card-header-sm-padding-x` `--card-title-font-weight` `--card-description-foreground` `--card-content-padding-x` `--card-content-sm-padding-x` `--card-footer-padding-x` `--card-footer-sm-padding-x`

</details>

## Carousel

Horizontally scrolling slides with previous and next controls.

**Exports:** `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`, `useCarousel`

<details><summary>2 component tokens</summary>

`--carousel-previous-radius` `--carousel-next-radius`

</details>

## Chart

Recharts wrapper with BYB colours, tooltip and legend. Start from BYBAreaChart or BYBBarChart; use this for other chart types.

**Exports:** `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent`, `ChartStyle`

## Checkbox

An on/off choice in a list or form, or a checkbox card for a richer option.

**Exports:** `Checkbox`, `checkboxFieldVariants`

**variant:** `default` · `card`

<details><summary>19 component tokens</summary>

`--checkbox-size` `--checkbox-radius` `--checkbox-border` `--checkbox` `--checkbox-foreground` `--checkbox-focus-border` `--checkbox-focus-ring` `--checkbox-checked-border` `--checkbox-checked` `--checkbox-invalid-border` `--checkbox-invalid-ring` `--checkbox-disabled-opacity` `--checkbox-label-foreground` `--checkbox-description-foreground` `--checkbox-field-card` `--checkbox-field-card-border` `--checkbox-field-card-radius` `--checkbox-field-card-checked` `--checkbox-field-card-checked-border`

</details>

## Collapsible

One section that shows and hides its content.

**Exports:** `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`

## Combobox

Pick one or many options by typing to filter. Use over Select when the list is long or searchable; chips for multiple.

**Exports:** `Combobox`, `ComboboxInput`, `ComboboxContent`, `ComboboxList`, `ComboboxItem`, `ComboboxGroup`, `ComboboxLabel`, `ComboboxCollection`, `ComboboxEmpty`, `ComboboxSeparator`, `ComboboxChips`, `ComboboxChip`, `ComboboxChipsInput`, `ComboboxTrigger`, `ComboboxValue`, `useComboboxAnchor`

<details><summary>41 component tokens</summary>

`--combobox-content-radius` `--combobox-content` `--combobox-content-foreground` `--combobox-content-shadow` `--combobox-content-ring` `--combobox-list-padding` `--combobox-item-gap` `--combobox-item-radius` `--combobox-item-padding-y` `--combobox-item-highlighted` `--combobox-item-highlighted-foreground` `--combobox-item-disabled-opacity` `--combobox-label-padding-x` `--combobox-label-padding-y` `--combobox-label-foreground` `--combobox-empty-padding-y` `--combobox-empty-foreground` `--combobox-separator-height` `--combobox-separator` `--combobox-chips-min-height` `--combobox-chips-gap` `--combobox-chips-radius` `--combobox-chips-border` `--combobox-chips` `--combobox-chips-padding-x` `--combobox-chips-padding-y` `--combobox-chips-focus-border` `--combobox-chips-focus-ring` `--combobox-chips-invalid-border` `--combobox-chips-invalid-ring` `--combobox-chips-with-chips-padding-x` `--combobox-chip-gap` `--combobox-chip-radius` `--combobox-chip` `--combobox-chip-padding-x` `--combobox-chip-font-weight` `--combobox-chip-foreground` `--combobox-chip-disabled-opacity` `--combobox-chip-with-remove-padding-x` `--combobox-chip-remove-opacity` `--combobox-chip-remove-hover-opacity`

</details>

## Command

A searchable list of commands or options, on its own or in a dialog (a command palette).

**Exports:** `Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandShortcut`, `CommandSeparator`

<details><summary>27 component tokens</summary>

`--command-radius` `--command-border` `--command` `--command-foreground` `--command-shadow` `--command-input-wrapper-height` `--command-input-wrapper-gap` `--command-input-wrapper-border` `--command-input-wrapper-padding-x` `--command-input-foreground` `--command-input-placeholder` `--command-input-disabled-foreground` `--command-list-padding` `--command-empty-padding-y` `--command-empty-foreground` `--command-group-foreground` `--command-separator-height` `--command-separator` `--command-item-height` `--command-item-gap` `--command-item-radius` `--command-item-padding-x` `--command-item-foreground` `--command-item-selected` `--command-item-selected-foreground` `--command-shortcut-foreground` `--command-dialog-radius`

</details>

## ContextMenu

Actions on right-click (or long-press) for the thing under the pointer.

**Exports:** `ContextMenu`, `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuCheckboxItem`, `ContextMenuRadioItem`, `ContextMenuLabel`, `ContextMenuSeparator`, `ContextMenuShortcut`, `ContextMenuGroup`, `ContextMenuPortal`, `ContextMenuSub`, `ContextMenuSubContent`, `ContextMenuSubTrigger`, `ContextMenuRadioGroup`

<details><summary>40 component tokens</summary>

`--context-menu-content-radius` `--context-menu-content-border` `--context-menu-content` `--context-menu-content-padding` `--context-menu-content-foreground` `--context-menu-content-shadow` `--context-menu-label-padding-x` `--context-menu-label-padding-y` `--context-menu-label-foreground` `--context-menu-item-gap` `--context-menu-item-radius` `--context-menu-item-padding-x` `--context-menu-item-padding-y` `--context-menu-item-focus` `--context-menu-item-focus-foreground` `--context-menu-item-disabled-opacity` `--context-menu-item-inset-padding-x` `--context-menu-sub-trigger-radius` `--context-menu-sub-trigger-padding-x` `--context-menu-sub-trigger-padding-y` `--context-menu-sub-trigger-focus` `--context-menu-sub-trigger-focus-foreground` `--context-menu-sub-trigger-open` `--context-menu-sub-trigger-open-foreground` `--context-menu-sub-content-shadow` `--context-menu-checkbox-item-gap` `--context-menu-checkbox-item-radius` `--context-menu-checkbox-item-padding-y` `--context-menu-checkbox-item-focus` `--context-menu-checkbox-item-focus-foreground` `--context-menu-checkbox-item-disabled-opacity` `--context-menu-radio-item-gap` `--context-menu-radio-item-radius` `--context-menu-radio-item-padding-y` `--context-menu-radio-item-focus` `--context-menu-radio-item-focus-foreground` `--context-menu-radio-item-disabled-opacity` `--context-menu-separator-height` `--context-menu-separator` `--context-menu-shortcut-foreground`

</details>

## Counter

A headline stat that counts up to its value ("1,200+") with a label under it. For marketing and dashboard figures.

**Exports:** `Counter`

**variant:** `navy` · `lime` · `white`

<details><summary>6 component tokens</summary>

`--counter-value-navy-foreground` `--counter-value-lime-foreground` `--counter-value-white-foreground` `--counter-label-navy-foreground` `--counter-label-lime-foreground` `--counter-label-white-foreground`

</details>

## Dialog

A modal for a focused task (a form, details) with sizes sm to xl, an icon header and a scrolling body. Includes ConfirmDialog for confirm-then-act.

**Exports:** `Dialog`, `DialogClose`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogOverlay`, `DialogPortal`, `DialogTitle`, `DialogTrigger`, `DialogBody`, `DialogCollapsible`, `dialogContentVariants`

<details><summary>22 component tokens</summary>

`--dialog-overlay` `--dialog-content-radius` `--dialog-content-gap` `--dialog-content` `--dialog-content-padding` `--dialog-content-foreground` `--dialog-content-shadow` `--dialog-header-gap` `--dialog-footer-gap` `--dialog-title-font-weight` `--dialog-title-foreground` `--dialog-description-foreground` `--dialog-close-foreground` `--dialog-close-hover-foreground` `--dialog-collapsible-border` `--dialog-collapsible-foreground` `--dialog-collapsible-trigger-foreground` `--dialog-collapsible-trigger-hover-foreground` `--dialog-collapsible-icon-foreground` `--dialog-collapsible-toggle-foreground` `--dialog-collapsible-toggle-hover-foreground` `--dialog-collapsible-focus-ring`

</details>

## Drawer

A panel that slides up from the bottom, mostly for mobile flows.

**Exports:** `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerSwipeHandle`, `DrawerTrigger`, `DrawerClose`, `DrawerContent`, `DrawerHeader`, `DrawerFooter`, `DrawerTitle`, `DrawerDescription`

<details><summary>15 component tokens</summary>

`--drawer-overlay` `--drawer-popup-min-height` `--drawer-popup-radius` `--drawer-popup-border` `--drawer-popup` `--drawer-popup-foreground` `--drawer-content-min-height` `--drawer-header-gap` `--drawer-header-padding` `--drawer-header-gap\:md` `--drawer-footer-gap` `--drawer-footer-padding` `--drawer-title-font-weight` `--drawer-title-foreground` `--drawer-description-foreground`

</details>

## DropdownMenu

Actions or choices behind a trigger button, with checkbox, radio, product and card-grid items and an icon-only trigger.

**Exports:** `DropdownMenu`, `DropdownMenuPortal`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuLabel`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`, `DropdownMenuIconTrigger`, `dropdownMenuIconTriggerVariants`, `DropdownMenuProductItem`, `DropdownMenuCardTrigger`, `DropdownMenuCardGrid`, `dropdownMenuCardGridVariants`, `DropdownMenuCardItem`

<details><summary>86 component tokens</summary>

`--dropdown-menu-content-radius` `--dropdown-menu-content-border` `--dropdown-menu-content` `--dropdown-menu-content-padding` `--dropdown-menu-content-foreground` `--dropdown-menu-content-shadow` `--dropdown-menu-label-padding-x` `--dropdown-menu-label-font-weight` `--dropdown-menu-label-foreground` `--dropdown-menu-item-height` `--dropdown-menu-item-gap` `--dropdown-menu-item-radius` `--dropdown-menu-item-padding-x` `--dropdown-menu-item-foreground` `--dropdown-menu-item-highlighted` `--dropdown-menu-item-highlighted-foreground` `--dropdown-menu-item-disabled-foreground` `--dropdown-menu-item-inset-padding-x` `--dropdown-menu-item-destructive-foreground` `--dropdown-menu-item-destructive-highlighted` `--dropdown-menu-item-destructive-highlighted-foreground` `--dropdown-menu-sub-trigger-height` `--dropdown-menu-sub-trigger-gap` `--dropdown-menu-sub-trigger-radius` `--dropdown-menu-sub-trigger-padding-x` `--dropdown-menu-sub-trigger-foreground` `--dropdown-menu-sub-trigger-highlighted` `--dropdown-menu-sub-trigger-highlighted-foreground` `--dropdown-menu-sub-trigger-disabled-foreground` `--dropdown-menu-sub-trigger-open` `--dropdown-menu-sub-trigger-open-foreground` `--dropdown-menu-checkbox-item-min-height` `--dropdown-menu-checkbox-item-radius` `--dropdown-menu-checkbox-item-padding-y` `--dropdown-menu-checkbox-item-foreground` `--dropdown-menu-checkbox-item-highlighted` `--dropdown-menu-checkbox-item-disabled-foreground` `--dropdown-menu-checkbox-item-gap` `--dropdown-menu-checkbox-item-padding-x` `--dropdown-menu-checkbox-item-indicator-size` `--dropdown-menu-checkbox-item-indicator-radius` `--dropdown-menu-checkbox-item-indicator-border` `--dropdown-menu-checkbox-item-indicator` `--dropdown-menu-checkbox-item-indicator-foreground` `--dropdown-menu-radio-item-min-height` `--dropdown-menu-radio-item-radius` `--dropdown-menu-radio-item-padding-y` `--dropdown-menu-radio-item-foreground` `--dropdown-menu-radio-item-highlighted` `--dropdown-menu-radio-item-disabled-foreground` `--dropdown-menu-radio-item-gap` `--dropdown-menu-radio-item-padding-x` `--dropdown-menu-radio-item-checked` `--dropdown-menu-radio-item-checked-foreground` `--dropdown-menu-separator-height` `--dropdown-menu-separator` `--dropdown-menu-shortcut-foreground` `--dropdown-menu-icon-trigger-mint-foreground` `--dropdown-menu-icon-trigger-mint-hover-foreground` `--dropdown-menu-icon-trigger-dark-foreground` `--dropdown-menu-icon-trigger-dark-hover-foreground` `--dropdown-menu-icon-trigger-navy-foreground` `--dropdown-menu-icon-trigger-navy-hover-foreground` `--dropdown-menu-icon-trigger-focus-ring` `--dropdown-menu-icon-trigger-disabled-foreground` `--dropdown-menu-card-trigger` `--dropdown-menu-card-trigger-border` `--dropdown-menu-card-trigger-radius` `--dropdown-menu-card-trigger-hover-border` `--dropdown-menu-card-trigger-open` `--dropdown-menu-card-trigger-open-border` `--dropdown-menu-card-trigger-open-ring` `--dropdown-menu-card-trigger-open-icon-foreground` `--dropdown-menu-card-trigger-disabled` `--dropdown-menu-card-trigger-label-foreground` `--dropdown-menu-card-trigger-foreground` `--dropdown-menu-card-trigger-meta-foreground` `--dropdown-menu-card-item` `--dropdown-menu-card-item-border` `--dropdown-menu-card-item-radius` `--dropdown-menu-card-item-highlighted` `--dropdown-menu-card-item-highlighted-border` `--dropdown-menu-card-item-checked` `--dropdown-menu-card-item-checked-border` `--dropdown-menu-card-item-foreground` `--dropdown-menu-card-item-meta-foreground`

</details>

## Empty

What to show when there's nothing yet: an icon, a title, a line of help and an action.

**Exports:** `Empty`, `EmptyHeader`, `EmptyTitle`, `EmptyDescription`, `EmptyContent`, `EmptyMedia`, `emptyVariants`

<details><summary>15 component tokens</summary>

`--empty-gap` `--empty-radius` `--empty-padding-x` `--empty-padding-y` `--empty-outline-border` `--empty-muted` `--empty-header-gap` `--empty-icon-icon-size` `--empty-icon-icon-radius` `--empty-icon-icon` `--empty-icon-icon-foreground` `--empty-title-font-weight` `--empty-title-foreground` `--empty-description-foreground` `--empty-content-gap`

</details>

## Field

Form layout parts: FieldGroup, Field, FieldLabel, FieldDescription, FieldError, FieldSet and FieldLegend. Apps with @beforeyoubid/form use its fields instead.

**Exports:** `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup`, `FieldLegend`, `FieldSeparator`, `FieldSet`, `FieldContent`, `FieldTitle`

<details><summary>21 component tokens</summary>

`--field-set-gap` `--field-set-with-choices-gap` `--field-legend-font-weight` `--field-legend-foreground` `--field-group-gap` `--field-group-checkbox-group-gap` `--field-gap` `--field-content-gap` `--field-label-gap` `--field-label-font-weight` `--field-label-foreground` `--field-label-disabled-opacity` `--field-description-font-weight` `--field-description-foreground` `--field-separator-height` `--field-separator-content` `--field-separator-content-padding-x` `--field-separator-content-foreground` `--field-error-font-weight` `--field-error-foreground` `--field-label-required-foreground`

</details>

## FileDropZone

A drop area for files with a browse link. The bare zone; use FileUpload for the full upload list.

**Exports:** `FileDropZone`

<details><summary>20 component tokens</summary>

`--file-drop-zone-min-height` `--file-drop-zone-gap` `--file-drop-zone-padding` `--file-drop-zone-radius` `--file-drop-zone` `--file-drop-zone-foreground` `--file-drop-zone-border` `--file-drop-zone-hover` `--file-drop-zone-hover-foreground` `--file-drop-zone-hover-border` `--file-drop-zone-focus-ring` `--file-drop-zone-invalid` `--file-drop-zone-invalid-border` `--file-drop-zone-invalid-focus-ring` `--file-drop-zone-disabled` `--file-drop-zone-disabled-foreground` `--file-drop-zone-icon-foreground` `--file-drop-zone-icon-hover-foreground` `--file-drop-zone-browse-foreground` `--file-drop-zone-browse-font-weight`

</details>

## FileUpload

Upload files with a drop zone, a progress list, retry and delete (with confirmation). Uploads straight to S3 through a presigned URL from the app.

**Exports:** `FileUpload`, `FileUploadCard`

<details><summary>13 component tokens</summary>

`--file-upload-gap` `--file-upload-list-gap` `--file-upload-message-foreground` `--file-upload-action-size` `--file-upload-action-icon-size` `--file-upload-action-sm-icon-size` `--file-upload-action-focus-ring` `--file-upload-action-download-foreground` `--file-upload-action-download-hover-foreground` `--file-upload-action-delete-foreground` `--file-upload-action-delete-hover-foreground` `--file-upload-action-cancel-foreground` `--file-upload-action-cancel-hover-foreground`

</details>

## HoverCard

A preview card on hover, for extra detail about a link or person.

**Exports:** `HoverCard`, `HoverCardTrigger`, `HoverCardContent`

<details><summary>8 component tokens</summary>

`--hover-card-content-width` `--hover-card-content-gap` `--hover-card-content-radius` `--hover-card-content-border` `--hover-card-content` `--hover-card-content-padding` `--hover-card-content-foreground` `--hover-card-content-shadow`

</details>

## IconTile

An icon on a tinted rounded tile. The icon chip used by Card, Dialog headers and product menus.

**Exports:** `IconTile`, `iconTileVariants`

**variant:** `mint` · `navy` · `lime` · `warning` · `error` · `neutral`

**size:** `sm` · `md` · `lg`

**shape:** `circle` · `square`

<details><summary>16 component tokens</summary>

`--icon-tile-mint` `--icon-tile-mint-foreground` `--icon-tile-navy` `--icon-tile-navy-foreground` `--icon-tile-warning` `--icon-tile-warning-foreground` `--icon-tile-error` `--icon-tile-error-foreground` `--icon-tile-lime` `--icon-tile-lime-foreground` `--icon-tile-neutral` `--icon-tile-neutral-foreground` `--icon-tile-sm-size` `--icon-tile-md-size` `--icon-tile-lg-size` `--icon-tile-square-radius`

</details>

## Input

A single-line text field. Wrap it in InputGroup to add icons, buttons or text inside the edge.

**Exports:** `Input`

<details><summary>13 component tokens</summary>

`--input-radius` `--input-border` `--input-fill` `--input-padding-x` `--input-foreground` `--input-placeholder` `--input-focus-border` `--input-focus-ring` `--input-invalid-border` `--input-disabled` `--input-disabled-foreground` `--input-height` `--input-padding-y`

</details>

## InputGroup

An input or textarea with addons inside its border: icons, prefixes, buttons.

**Exports:** `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupText`, `InputGroupInput`, `InputGroupTextarea`, `inputGroupAddonVariants`, `inputGroupButtonVariants`

<details><summary>22 component tokens</summary>

`--input-group-min-height` `--input-group-gap` `--input-group-radius` `--input-group-border` `--input-group` `--input-group-padding-x` `--input-group-focus-border` `--input-group-focus-ring` `--input-group-addon-gap` `--input-group-addon-foreground` `--input-group-button-gap` `--input-group-button-radius` `--input-group-button-xs-height` `--input-group-button-xs-padding-x` `--input-group-button-sm-height` `--input-group-button-sm-padding-x` `--input-group-button-icon-xs-size` `--input-group-button-icon-sm-size` `--input-group-control-min-height` `--input-group-control-radius` `--input-group-control-padding-x` `--input-group-control-shadow`

</details>

## InputOTP

Enter a one-time code, one box per character.

**Exports:** `InputOTP`, `InputOTPGroup`, `InputOTPSlot`, `InputOTPSeparator`

<details><summary>13 component tokens</summary>

`--input-otp-group-gap` `--input-otp-slot-size` `--input-otp-slot-radius` `--input-otp-slot-border` `--input-otp-slot` `--input-otp-slot-font-weight` `--input-otp-slot-foreground` `--input-otp-slot-active-border` `--input-otp-slot-active-foreground` `--input-otp-slot-active-ring` `--input-otp-slot-invalid-border` `--input-otp-separator-padding-x` `--input-otp-separator-foreground`

</details>

## Item

A row of media, title, description and actions, for lists and settings.

**Exports:** `Item`, `ItemMedia`, `ItemContent`, `ItemActions`, `ItemGroup`, `ItemSeparator`, `ItemTitle`, `ItemDescription`, `ItemHeader`, `ItemFooter`

**variant:** `default` · `outline` · `muted`

**size:** `default` · `sm` · `xs`

<details><summary>32 component tokens</summary>

`--item-group-gap` `--item-group-sm-gap` `--item-group-xs-gap` `--item-radius` `--item-focus-border` `--item-focus-ring` `--item-outline-border` `--item-muted` `--item-md-gap` `--item-md-padding-x` `--item-md-padding-y` `--item-sm-gap` `--item-sm-padding-x` `--item-sm-padding-y` `--item-xs-gap` `--item-xs-padding-x` `--item-xs-padding-y` `--item-media-gap` `--item-media-image-size` `--item-media-image-radius` `--item-media-image-sm-size` `--item-media-image-xs-size` `--item-media-image-xs-radius` `--item-content-gap` `--item-content-xs-gap` `--item-title-gap` `--item-title-font-weight` `--item-description-font-weight` `--item-description-foreground` `--item-actions-gap` `--item-header-gap` `--item-footer-gap`

</details>

## Kbd

Shows a keyboard key or shortcut.

**Exports:** `Kbd`, `KbdGroup`

<details><summary>8 component tokens</summary>

`--kbd-height` `--kbd-gap` `--kbd-radius` `--kbd` `--kbd-padding-x` `--kbd-font-weight` `--kbd-foreground` `--kbd-group-gap`

</details>

## Label

A label for a form control. Inside forms use FieldLabel.

**Exports:** `Label`

<details><summary>3 component tokens</summary>

`--label-gap` `--label-font-weight` `--label-foreground`

</details>

## Menubar

A desktop-style menu bar with dropdown menus.

**Exports:** `Menubar`, `MenubarPortal`, `MenubarMenu`, `MenubarTrigger`, `MenubarContent`, `MenubarGroup`, `MenubarSeparator`, `MenubarLabel`, `MenubarItem`, `MenubarShortcut`, `MenubarCheckboxItem`, `MenubarRadioGroup`, `MenubarRadioItem`, `MenubarSub`, `MenubarSubTrigger`, `MenubarSubContent`

<details><summary>56 component tokens</summary>

`--menubar-height` `--menubar-radius` `--menubar-border` `--menubar-padding` `--menubar-trigger-radius` `--menubar-trigger-padding-x` `--menubar-trigger-padding-y` `--menubar-trigger-font-weight` `--menubar-trigger-hover-foreground` `--menubar-trigger-open` `--menubar-content-radius` `--menubar-content-border` `--menubar-content` `--menubar-content-padding` `--menubar-content-foreground` `--menubar-content-shadow` `--menubar-item-gap` `--menubar-item-radius` `--menubar-item-padding-x` `--menubar-item-padding-y` `--menubar-item-focus` `--menubar-item-focus-foreground` `--menubar-item-disabled-opacity` `--menubar-item-inset-padding-x` `--menubar-checkbox-item-gap` `--menubar-checkbox-item-radius` `--menubar-checkbox-item-padding-y` `--menubar-checkbox-item-focus` `--menubar-checkbox-item-focus-foreground` `--menubar-checkbox-item-disabled-opacity` `--menubar-radio-item-gap` `--menubar-radio-item-radius` `--menubar-radio-item-padding-y` `--menubar-radio-item-focus` `--menubar-radio-item-focus-foreground` `--menubar-radio-item-disabled-opacity` `--menubar-label-padding-x` `--menubar-label-padding-y` `--menubar-label-foreground` `--menubar-separator-height` `--menubar-separator` `--menubar-shortcut-foreground` `--menubar-sub-trigger-gap` `--menubar-sub-trigger-radius` `--menubar-sub-trigger-padding-x` `--menubar-sub-trigger-padding-y` `--menubar-sub-trigger-focus` `--menubar-sub-trigger-focus-foreground` `--menubar-sub-trigger-open` `--menubar-sub-trigger-open-foreground` `--menubar-sub-content-radius` `--menubar-sub-content-border` `--menubar-sub-content` `--menubar-sub-content-padding` `--menubar-sub-content-foreground` `--menubar-sub-content-shadow`

</details>

## NativeSelect

The browser's own select, styled to match. Use where the native picker is better (mobile, very long lists without search).

**Exports:** `NativeSelect`, `NativeSelectOptGroup`, `NativeSelectOption`

<details><summary>21 component tokens</summary>

`--native-select-height` `--native-select-radius` `--native-select-border` `--native-select` `--native-select-padding-y` `--native-select-foreground` `--native-select-placeholder` `--native-select-focus-border` `--native-select-focus-ring` `--native-select-invalid-border` `--native-select-invalid-ring` `--native-select-disabled` `--native-select-disabled-foreground` `--native-select-sm-height` `--native-select-icon-size` `--native-select-icon-foreground` `--native-select-icon-disabled-foreground` `--native-select-option` `--native-select-option-foreground` `--native-select-optgroup` `--native-select-optgroup-foreground`

</details>

## NavigationMenu

Site navigation with links and dropdown panels.

**Exports:** `NavigationMenu`, `NavigationMenuContent`, `NavigationMenuIndicator`, `NavigationMenuItem`, `NavigationMenuLink`, `NavigationMenuList`, `NavigationMenuTrigger`, `navigationMenuTriggerStyle`, `NavigationMenuPositioner`

<details><summary>25 component tokens</summary>

`--navigation-menu-list-gap` `--navigation-menu-trigger-height` `--navigation-menu-trigger-gap` `--navigation-menu-trigger-radius` `--navigation-menu-trigger-padding-x` `--navigation-menu-trigger-font-weight` `--navigation-menu-trigger-foreground` `--navigation-menu-trigger-hover-foreground` `--navigation-menu-trigger-focus-ring` `--navigation-menu-trigger-disabled-foreground` `--navigation-menu-trigger-open` `--navigation-menu-trigger-open-foreground` `--navigation-menu-content-padding` `--navigation-menu-link-min-height` `--navigation-menu-link-gap` `--navigation-menu-link-radius` `--navigation-menu-link-padding-x` `--navigation-menu-link-padding-y` `--navigation-menu-link-foreground` `--navigation-menu-link-hover` `--navigation-menu-link-focus` `--navigation-menu-link-focus-ring` `--navigation-menu-link-active` `--navigation-menu-link-active-foreground` `--navigation-menu-indicator-height`

</details>

## Pagination

Moves between pages of results.

**Exports:** `Pagination`, `PaginationContent`, `PaginationEllipsis`, `PaginationItem`, `PaginationLink`, `PaginationNext`, `PaginationPrevious`

<details><summary>7 component tokens</summary>

`--pagination-content-gap` `--pagination-ellipsis-size` `--pagination-ellipsis-foreground` `--pagination-link-foreground` `--pagination-link-hover-foreground` `--pagination-link-active` `--pagination-link-active-foreground`

</details>

## Popover

Floating content anchored to a trigger, for small forms and extra detail.

**Exports:** `Popover`, `PopoverContent`, `PopoverDescription`, `PopoverHeader`, `PopoverTitle`, `PopoverTrigger`

<details><summary>11 component tokens</summary>

`--popover-content-width` `--popover-content-gap` `--popover-content-radius` `--popover-content-border` `--popover-content` `--popover-content-padding` `--popover-content-foreground` `--popover-content-shadow` `--popover-header-gap` `--popover-title-font-weight` `--popover-description-foreground`

</details>

## Progress

How far through a known amount of work something is.

**Exports:** `Progress`, `ProgressTrack`, `ProgressIndicator`, `ProgressLabel`, `ProgressValue`

<details><summary>7 component tokens</summary>

`--progress-gap` `--progress-track-height` `--progress-track-radius` `--progress-track` `--progress-indicator` `--progress-label-font-weight` `--progress-value-foreground`

</details>

## RadioGroup

One choice from a short list, as radios or radio cards.

**Exports:** `RadioGroup`, `RadioGroupItem`, `radioGroupVariants`, `radioControlVariants`

**variant:** `default` · `card`

**size:** `sm` · `md` · `lg`

<details><summary>24 component tokens</summary>

`--radio-group-gap` `--radio-group-sm-gap` `--radio-group-lg-gap` `--radio-group-card-gap` `--radio-group-item-radius` `--radio-group-item-border` `--radio-group-item` `--radio-group-item-size` `--radio-group-item-sm-size` `--radio-group-item-lg-size` `--radio-group-item-focus-border` `--radio-group-item-focus-ring` `--radio-group-item-checked-border` `--radio-group-item-invalid-border` `--radio-group-item-invalid-ring` `--radio-group-item-disabled-opacity` `--radio-group-indicator` `--radio-group-field-card` `--radio-group-field-card-border` `--radio-group-field-card-radius` `--radio-group-field-card-checked` `--radio-group-field-card-checked-border` `--radio-group-label-foreground` `--radio-group-description-foreground`

</details>

## Resizable

Panels the user can resize by dragging the handle between them.

**Exports:** `ResizableHandle`, `ResizablePanel`, `ResizablePanelGroup`

<details><summary>3 component tokens</summary>

`--resizable-handle-width` `--resizable-handle` `--resizable-handle-focus-ring`

</details>

## ScrollArea

A scroll container with styled scrollbars.

**Exports:** `ScrollArea`, `ScrollBar`

<details><summary>4 component tokens</summary>

`--scroll-area-viewport-focus-ring` `--scroll-area-scrollbar-padding` `--scroll-area-thumb-radius` `--scroll-area-thumb`

</details>

## Select

Pick one or more options from a list. For type-to-filter use Combobox.

**Exports:** `Select`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectLabel`, `SelectScrollDownButton`, `SelectScrollUpButton`, `SelectSeparator`, `SelectTrigger`, `SelectValue`, `SelectChip`, `SelectChipOverflow`, `SelectFooter`, `selectItemVariants`

<details><summary>63 component tokens</summary>

`--select-trigger-height` `--select-trigger-gap` `--select-trigger-radius` `--select-trigger-border` `--select-trigger` `--select-trigger-padding-x` `--select-trigger-foreground` `--select-trigger-hover-border` `--select-trigger-focus-border` `--select-trigger-focus-ring` `--select-trigger-placeholder` `--select-trigger-open-border` `--select-trigger-open` `--select-trigger-open-foreground` `--select-trigger-open-ring` `--select-trigger-invalid-border` `--select-trigger-disabled` `--select-trigger-disabled-foreground` `--select-trigger-sm-height` `--select-icon-size` `--select-icon-foreground` `--select-icon-open-foreground` `--select-icon-disabled-foreground` `--select-clear-foreground` `--select-clear-hover-foreground` `--select-clear-focus-ring` `--select-chip` `--select-chip-foreground` `--select-chip-height` `--select-chip-radius` `--select-chip-overflow` `--select-chip-overflow-foreground` `--select-content-radius` `--select-content-border` `--select-content` `--select-content-padding` `--select-content-foreground` `--select-content-shadow` `--select-label-padding-x` `--select-label-foreground` `--select-item-min-height` `--select-item-radius` `--select-item-padding-y` `--select-item-foreground` `--select-item-highlighted` `--select-item-focus` `--select-item-selected` `--select-item-selected-foreground` `--select-item-disabled-foreground` `--select-item-checkbox` `--select-item-checkbox-border` `--select-item-checkbox-checked` `--select-item-checkbox-checked-foreground` `--select-item-check-foreground` `--select-item-meta-foreground` `--select-separator-height` `--select-separator` `--select-scroll-up-button` `--select-scroll-up-button-padding-y` `--select-scroll-up-button-foreground` `--select-scroll-down-button` `--select-scroll-down-button-padding-y` `--select-scroll-down-button-foreground`

</details>

## Separator

A thin line between groups of content.

**Exports:** `Separator`

<details><summary>1 component tokens</summary>

`--separator`

</details>

## Sheet

A panel that slides in from an edge for a secondary flow.

**Exports:** `Sheet`, `SheetTrigger`, `SheetClose`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription`

<details><summary>11 component tokens</summary>

`--sheet-overlay` `--sheet-content` `--sheet-content-foreground` `--sheet-content-shadow` `--sheet-header-gap` `--sheet-header-padding` `--sheet-footer-gap` `--sheet-footer-padding` `--sheet-title-font-weight` `--sheet-title-foreground` `--sheet-description-foreground`

</details>

## Sidebar

The app's side navigation: collapsible, with groups, menus and a mobile sheet.

**Exports:** `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarGroupAction`, `SidebarGroupContent`, `SidebarGroupLabel`, `SidebarHeader`, `SidebarInput`, `SidebarInset`, `SidebarMenu`, `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarMenuSkeleton`, `SidebarMenuSub`, `SidebarMenuSubButton`, `SidebarMenuSubItem`, `SidebarProvider`, `SidebarRail`, `SidebarSeparator`, `SidebarTrigger`, `useSidebar`

<details><summary>81 component tokens</summary>

`--sidebar-fill` `--sidebar-inner` `--sidebar-rail-width` `--sidebar-inset` `--sidebar-inset-offset\:md` `--sidebar-inset-radius\:md` `--sidebar-inset-shadow\:md` `--sidebar-input-height` `--sidebar-input` `--sidebar-input-shadow` `--sidebar-header-gap` `--sidebar-header-padding` `--sidebar-footer-gap` `--sidebar-footer-padding` `--sidebar-separator` `--sidebar-content-min-height` `--sidebar-content-gap` `--sidebar-group-padding` `--sidebar-group-label-height` `--sidebar-group-label-radius` `--sidebar-group-label-padding-x` `--sidebar-group-label-font-weight` `--sidebar-group-label-foreground` `--sidebar-group-label-ring` `--sidebar-group-action-width` `--sidebar-group-action-radius` `--sidebar-group-action-padding` `--sidebar-group-action-foreground` `--sidebar-group-action-ring` `--sidebar-group-action-hover-foreground` `--sidebar-menu-gap` `--sidebar-menu-button-gap` `--sidebar-menu-button-radius` `--sidebar-menu-button-padding-x` `--sidebar-menu-button-padding-y` `--sidebar-menu-button-ring` `--sidebar-menu-button-hover` `--sidebar-menu-button-hover-foreground` `--sidebar-menu-button-active` `--sidebar-menu-button-active-foreground` `--sidebar-menu-button-disabled-opacity` `--sidebar-menu-button-active-font-weight` `--sidebar-menu-button-default-hover` `--sidebar-menu-button-default-hover-foreground` `--sidebar-menu-button-outline` `--sidebar-menu-button-outline-hover` `--sidebar-menu-button-outline-hover-foreground` `--sidebar-menu-button-md-height` `--sidebar-menu-button-sm-height` `--sidebar-menu-button-lg-height` `--sidebar-menu-button-lg-padding-x` `--sidebar-menu-action-width` `--sidebar-menu-action-radius` `--sidebar-menu-action-padding` `--sidebar-menu-action-foreground` `--sidebar-menu-action-ring` `--sidebar-menu-action-hover-foreground` `--sidebar-menu-badge-height` `--sidebar-menu-badge-radius` `--sidebar-menu-badge-padding-x` `--sidebar-menu-badge-font-weight` `--sidebar-menu-badge-foreground` `--sidebar-menu-skeleton-height` `--sidebar-menu-skeleton-gap` `--sidebar-menu-skeleton-radius` `--sidebar-menu-skeleton-padding-x` `--sidebar-menu-sub-gap` `--sidebar-menu-sub-border` `--sidebar-menu-sub-padding-x` `--sidebar-menu-sub-padding-y` `--sidebar-menu-sub-button-height` `--sidebar-menu-sub-button-gap` `--sidebar-menu-sub-button-radius` `--sidebar-menu-sub-button-padding-x` `--sidebar-menu-sub-button-foreground` `--sidebar-menu-sub-button-ring` `--sidebar-menu-sub-button-hover` `--sidebar-menu-sub-button-hover-foreground` `--sidebar-menu-sub-button-active` `--sidebar-menu-sub-button-active-foreground` `--sidebar-menu-sub-button-disabled-opacity`

</details>

## Skeleton

A placeholder in the shape of content that is loading.

**Exports:** `Skeleton`

<details><summary>2 component tokens</summary>

`--skeleton-radius` `--skeleton`

</details>

## Slider

Pick a value or range by dragging along a track.

**Exports:** `Slider`

<details><summary>10 component tokens</summary>

`--slider-track-height` `--slider-track-radius` `--slider-track` `--slider-range` `--slider-thumb-size` `--slider-thumb-radius` `--slider-thumb-border` `--slider-thumb` `--slider-thumb-shadow` `--slider-thumb-ring`

</details>

## Spinner

Shows a short wait. For content loading in place use Skeleton.

**Exports:** `Spinner`

<details><summary>2 component tokens</summary>

`--spinner-size` `--spinner-foreground`

</details>

## Stepper

Progress through a fixed sequence of steps (a checkout, an onboarding flow), horizontal or vertical, with active, complete, upcoming and error states.

**Exports:** `Stepper`, `stepIndicatorVariants`

**orientation:** `horizontal` · `vertical` · `responsive`

**indicator:** `number` · `icon` · `dot`

**labelPlacement:** `end` · `bottom`

**clickable:** `completed` · `all` · `none`

**size:** `sm` · `md` · `lg`

<details><summary>16 component tokens</summary>

`--stepper-indicator-active` `--stepper-indicator-active-foreground` `--stepper-indicator-active-ring` `--stepper-indicator-complete` `--stepper-indicator-complete-foreground` `--stepper-indicator-upcoming` `--stepper-indicator-upcoming-border` `--stepper-indicator-upcoming-foreground` `--stepper-indicator-error` `--stepper-indicator-error-foreground` `--stepper-indicator-dot-upcoming` `--stepper-connector` `--stepper-connector-complete` `--stepper-title-foreground` `--stepper-title-error-foreground` `--stepper-description-foreground`

</details>

## Switch

Turns a setting on or off straight away.

**Exports:** `Switch`, `switchVariants`, `switchThumbVariants`

**size:** `default` · `sm`

<details><summary>11 component tokens</summary>

`--switch-radius` `--switch-padding` `--switch-checked` `--switch-focus-ring` `--switch-invalid-ring` `--switch-disabled-opacity` `--switch-thumb-radius` `--switch-thumb` `--switch-thumb-shadow` `--switch-label-foreground` `--switch-description-foreground`

</details>

## Table

Data table with BYB typography: uppercase `text-overline` headers in `dark-100` and `text-body-5` cells. Headers can sort (`sortable`), rows can expand (`TableExpandableRow`) and long tables can collapse behind `TableViewMore`. Set `variant` and `size` on `Table`; rows and cells pick them up automatically.

**Exports:** `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableHead`, `TableRow`, `TableCell`, `TableCaption`, `TableEmpty`, `TableExpandableRow`, `TableControlsHead`, `TableViewMore`, `tableVariants`, `tableContainerVariants`

**variant:** `default` · `card` · `striped` · `bordered`

**size:** `sm` · `md` · `lg`

<details><summary>25 component tokens</summary>

`--table-header-tinted` `--table-footer-border` `--table-footer` `--table-footer-font-weight` `--table-footer-foreground` `--table-row-border` `--table-row-hover` `--table-row-striped` `--table-row-striped-hover` `--table-row-open` `--table-head-padding-x` `--table-head-border` `--table-head-height` `--table-head-foreground` `--table-cell-padding-x` `--table-cell-border` `--table-cell-padding-y` `--table-cell-foreground` `--table-caption-foreground` `--table-sort-button-foreground` `--table-sort-button-hover-foreground` `--table-sort-button-focus-ring` `--table-sort-button-icon-foreground` `--table-detail-row` `--table-detail-row-foreground`

</details>

## Tabs

Tabs switch between related views. Set `variant` on `TabsList` (`pill`, `line` or `segmented`; default `pill`) and every `TabsTrigger` inside follows it.

**Exports:** `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `tabsListVariants`, `tabsTriggerVariants`, `tabsIndicatorVariants`, `tabsContentVariants`

**variant:** `pill` · `line` · `segmented`

<details><summary>45 component tokens</summary>

`--tabs-gap` `--tabs-list-default-gap` `--tabs-list-default-radius` `--tabs-list-default-border` `--tabs-list-default` `--tabs-list-default-padding` `--tabs-list-line-gap` `--tabs-list-line-border` `--tabs-list-segmented` `--tabs-list-segmented-gap` `--tabs-list-segmented-radius` `--tabs-list-segmented-padding` `--tabs-list-line-vertical-gap` `--tabs-trigger-gap` `--tabs-trigger-focus-ring` `--tabs-trigger-disabled-foreground` `--tabs-trigger-height` `--tabs-trigger-radius` `--tabs-trigger-padding-x` `--tabs-trigger-font-weight` `--tabs-trigger-foreground` `--tabs-trigger-active-foreground` `--tabs-trigger-line-height` `--tabs-trigger-line-radius` `--tabs-trigger-line-padding-x` `--tabs-trigger-line-foreground` `--tabs-trigger-line-hover-foreground` `--tabs-trigger-line-active-foreground` `--tabs-trigger-line-hover-indicator` `--tabs-trigger-segmented-height` `--tabs-trigger-segmented-radius` `--tabs-trigger-segmented-padding-x` `--tabs-trigger-segmented-foreground` `--tabs-trigger-segmented-active-foreground` `--tabs-indicator` `--tabs-indicator-radius` `--tabs-indicator-line` `--tabs-indicator-line-height` `--tabs-indicator-segmented` `--tabs-indicator-segmented-radius` `--tabs-content-panel` `--tabs-content-panel-border` `--tabs-content-panel-radius` `--tabs-content-panel-padding` `--tabs-content-panel-gap`

</details>

## Textarea

A multi-line text field.

**Exports:** `Textarea`

<details><summary>12 component tokens</summary>

`--textarea-radius` `--textarea-border` `--textarea` `--textarea-padding-x` `--textarea-foreground` `--textarea-placeholder` `--textarea-focus-border` `--textarea-focus-ring` `--textarea-invalid-border` `--textarea-disabled` `--textarea-disabled-foreground` `--textarea-padding-y`

</details>

## TimePicker

Pick a time of day (24-hour) from a popover with hour, minute and optional second columns.

**Exports:** `TimePicker`

## Toast

Brief news after an action, fired with toast.add({ type, title }) and shown by <Toaster /> mounted once at the app root.

**Exports:** `Toaster`, `Toast`, `ToastAction`, `ToastClose`, `ToastContent`, `ToastDescription`, `ToastPortal`, `ToastProvider`, `ToastTitle`, `ToastViewport`, `createToastManager`, `toast`, `useToastManager`, `toastVariants`, `TOAST_TIMEOUTS`

<details><summary>26 component tokens</summary>

`--toast-viewport-offset` `--toast-viewport-offset\:sm` `--toast-viewport-width\:md` `--toast-radius` `--toast-focus-ring` `--toast` `--toast-foreground` `--toast-success` `--toast-success-foreground` `--toast-warning` `--toast-warning-foreground` `--toast-error` `--toast-error-foreground` `--toast-info` `--toast-info-foreground` `--toast-content-gap` `--toast-content-padding-x` `--toast-content-padding-y` `--toast-title-font-weight` `--toast-description-foreground` `--toast-action-font-weight` `--toast-close-padding` `--toast-close-hover-foreground` `--toast-icon-size` `--toast-icon-radius` `--toast-icon`

</details>

## Toggle

A button that stays pressed or unpressed.

**Exports:** `Toggle`, `toggleVariants`

<details><summary>23 component tokens</summary>

`--toggle-gap` `--toggle-radius` `--toggle-font-weight` `--toggle-hover` `--toggle-hover-foreground` `--toggle-focus-border` `--toggle-focus-ring` `--toggle-disabled-opacity` `--toggle-invalid-border` `--toggle-invalid-ring` `--toggle-pressed` `--toggle-pressed-foreground` `--toggle-outline-border` `--toggle-outline-hover` `--toggle-md-height` `--toggle-md-padding-x` `--toggle-sm-height` `--toggle-sm-padding-x` `--toggle-lg-height` `--toggle-lg-padding-x` `--toggle-md-with-icon-padding-x` `--toggle-sm-with-icon-padding-x` `--toggle-lg-with-icon-padding-x`

</details>

## ToggleGroup

A set of toggles for picking one or several of 2 to 7 options.

**Exports:** `ToggleGroup`, `ToggleGroupItem`

## Tooltip

A short label on hover or focus, for icon-only buttons and truncated text.

**Exports:** `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`

<details><summary>7 component tokens</summary>

`--tooltip-content-gap` `--tooltip-content-radius` `--tooltip-content` `--tooltip-content-padding-x` `--tooltip-content-padding-y` `--tooltip-content-foreground` `--tooltip-content-with-kbd-padding-x`

</details>

## Other exports

Helpers, hooks and parts without a story of their own.

`CHART_PALETTE`, `ChartFrame`, `ChartLegendList`, `ColorDot`, `ConfirmDialog`, `DirectionProvider`, `ProductSwitcher`, `cn`, `colorDotVariants`, `formatDateDMY`, `generateDesignSystemTokens`, `inputControlBase`, `productBadgeByKey`, `productBadges`, `useDirection`, `useIsMobile`
