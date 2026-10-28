import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { cn } from "@/lib/utils"
import { IconChevronRight, IconCheck } from "@tabler/icons-react"

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn("z-50 max-h-(--available-height) w-(--anchor-width) min-w-55 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-(--_dropdown-menu-content-radius) bg-(--_dropdown-menu-content) p-(--_dropdown-menu-content-padding) text-(--_dropdown-menu-content-foreground) shadow-(--_dropdown-menu-content-shadow) duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95 border-(--_dropdown-menu-content-border) border text-body-5", className )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-(--_dropdown-menu-label-padding-x) text-body-5 text-(--_dropdown-menu-label-foreground) data-inset:ps-9 font-(--_dropdown-menu-label-font-weight) pt-2 pb-1.5",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "group/dropdown-menu-item relative flex cursor-pointer items-center gap-(--_dropdown-menu-item-gap) rounded-(--_dropdown-menu-item-radius) px-(--_dropdown-menu-item-padding-x) text-body-5 outline-hidden select-none data-inset:ps-9 data-[variant=destructive]:text-error-60 dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 h-(--_dropdown-menu-item-height) text-(--_dropdown-menu-item-foreground) data-highlighted:bg-(--_dropdown-menu-item-highlighted) data-highlighted:text-(--_dropdown-menu-item-highlighted-foreground) data-disabled:text-(--_dropdown-menu-item-disabled-foreground) data-[variant=destructive]:data-highlighted:bg-error-l1 data-[variant=destructive]:data-highlighted:text-error-75",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-pointer items-center gap-(--_dropdown-menu-sub-trigger-gap) rounded-(--_dropdown-menu-sub-trigger-radius) px-(--_dropdown-menu-sub-trigger-padding-x) text-body-5 outline-hidden select-none data-inset:ps-9 data-popup-open:bg-(--_dropdown-menu-sub-trigger-open) data-popup-open:text-(--_dropdown-menu-sub-trigger-open-foreground) [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 h-(--_dropdown-menu-sub-trigger-height) text-(--_dropdown-menu-sub-trigger-foreground) data-highlighted:bg-(--_dropdown-menu-sub-trigger-highlighted) data-highlighted:text-(--_dropdown-menu-sub-trigger-highlighted-foreground) data-disabled:text-(--_dropdown-menu-sub-trigger-disabled-foreground) data-disabled:pointer-events-none [&>svg:last-child]:size-3.5 [&>svg:last-child]:text-dark-75",
        className
      )}
      {...props}
    >
      {children}
      <IconChevronRight className="rtl:rotate-180 ms-auto" />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "inline-end",
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn("w-auto min-w-44", className )}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        "gap-(--_dropdown-menu-checkbox-item-gap) data-inset:ps-9 px-(--_dropdown-menu-checkbox-item-padding-x) group/dropdown-menu-checkbox-item min-h-(--_dropdown-menu-checkbox-item-min-height) rounded-(--_dropdown-menu-checkbox-item-radius) py-(--_dropdown-menu-checkbox-item-padding-y) text-(--_dropdown-menu-checkbox-item-foreground) data-highlighted:bg-(--_dropdown-menu-checkbox-item-highlighted) data-disabled:text-(--_dropdown-menu-checkbox-item-disabled-foreground) cursor-pointer text-body-5 relative flex items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span
        className="pointer-events-none flex items-center justify-center size-(--_dropdown-menu-checkbox-item-indicator-size) rounded-(--_dropdown-menu-checkbox-item-indicator-radius) border-(--_dropdown-menu-checkbox-item-indicator-border) bg-(--_dropdown-menu-checkbox-item-indicator) text-(--_dropdown-menu-checkbox-item-indicator-foreground) shrink-0 border transition-colors group-data-checked/dropdown-menu-checkbox-item:border-mint-45 group-data-checked/dropdown-menu-checkbox-item:bg-mint-45 group-data-disabled/dropdown-menu-checkbox-item:opacity-50"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <IconCheck
          />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(
        "gap-(--_dropdown-menu-radio-item-gap) data-inset:ps-9 px-(--_dropdown-menu-radio-item-padding-x) data-checked:bg-(--_dropdown-menu-radio-item-checked) data-checked:text-(--_dropdown-menu-radio-item-checked-foreground) min-h-(--_dropdown-menu-radio-item-min-height) rounded-(--_dropdown-menu-radio-item-radius) py-(--_dropdown-menu-radio-item-padding-y) text-(--_dropdown-menu-radio-item-foreground) data-highlighted:bg-(--_dropdown-menu-radio-item-highlighted) data-disabled:text-(--_dropdown-menu-radio-item-disabled-foreground) cursor-pointer text-body-5 relative flex items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span
        className="pointer-events-none absolute end-2 flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <IconCheck
          />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-(--_dropdown-menu-separator-height) bg-(--_dropdown-menu-separator)", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ms-auto text-caption-1 text-(--_dropdown-menu-shortcut-foreground)",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
