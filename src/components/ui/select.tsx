import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { IconCheck, IconChevronUp, IconChevronDown } from "@tabler/icons-react"

const Select = SelectPrimitive.Root

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1", className)}
      {...props}
    />
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-start", className)}
      {...props}
    />
  )
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "group/select-trigger flex h-10 cursor-pointer w-full items-center justify-between gap-2 rounded-lg border border-dark-15 bg-white px-3 text-body-sm text-dark-100 whitespace-nowrap transition-[color,background-color,border-color,box-shadow] outline-none",
        "hover:border-dark-30 focus-visible:border-mint-45 focus-visible:ring-3 focus-visible:ring-mint-45/30",
        "data-placeholder:text-dark-60",
        "data-popup-open:border-mint-45 data-popup-open:bg-mint-l4 data-popup-open:text-mint-75 data-popup-open:ring-3 data-popup-open:ring-mint-45/30 data-popup-open:data-placeholder:text-mint-75",
        "aria-invalid:border-error-75 aria-invalid:hover:border-error-75",
        "disabled:cursor-not-allowed disabled:bg-light-l2 disabled:text-dark-45 data-disabled:cursor-not-allowed data-disabled:bg-light-l2 data-disabled:text-dark-45 data-disabled:hover:border-dark-15",
        "data-[size=sm]:h-9",
        "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        data-slot="select-icon"
        render={
          <span className="pointer-events-none flex size-3.5 items-center justify-center text-dark-60 transition-transform group-data-popup-open/select-trigger:rotate-180 group-data-popup-open/select-trigger:text-mint-75 group-data-disabled/select-trigger:text-dark-45" />
        }
      >
        <IconChevronDown className="size-3.5" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  side = "bottom",
  // Design: the list opens 6px below the field, start-aligned, never over it.
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  alignItemWithTrigger = false,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={cn("relative isolate z-50 max-h-70 w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg border border-light-l3 bg-white p-1 text-dark-100 shadow-md duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("px-2 pt-1.5 pb-1 text-caption text-dark-60", className)}
      {...props}
    />
  )
}

const selectItemVariants = cva(
  "group/select-item relative flex min-h-8 w-full cursor-pointer items-center rounded-md py-1.5 text-body-sm text-dark-100 outline-hidden select-none data-highlighted:bg-light-l1 focus:bg-light-l1 data-disabled:pointer-events-none data-disabled:text-dark-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      indicator: {
        // Single select: mint row + trailing check
        check: "ps-2 pe-8 data-selected:bg-mint-l2 data-selected:text-mint-75",
        // Multiple select: leading checkbox, no row fill
        checkbox: "gap-2.5 px-2",
      },
    },
    defaultVariants: { indicator: "check" },
  }
)

export interface SelectItemProps
  extends SelectPrimitive.Item.Props,
    VariantProps<typeof selectItemVariants> {}

function SelectItem({
  className,
  children,
  indicator = "check",
  ...props
}: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      data-indicator={indicator}
      className={cn(selectItemVariants({ indicator }), className)}
      {...props}
    >
      {indicator === "checkbox" ? (
        <span
          aria-hidden="true"
          className="flex size-4 shrink-0 items-center justify-center rounded-sm border border-dark-30 bg-white text-white transition-colors group-data-selected/select-item:border-mint-45 group-data-selected/select-item:bg-mint-45 group-data-disabled/select-item:opacity-50"
        >
          <SelectPrimitive.ItemIndicator>
            <IconCheck className="size-3" stroke={3} />
          </SelectPrimitive.ItemIndicator>
        </span>
      ) : (
        <SelectPrimitive.ItemIndicator
          render={
            <span className="pointer-events-none absolute end-2 flex size-3.5 items-center justify-center" />
          }
        >
          <IconCheck className="size-3.5 text-mint-75" />
        </SelectPrimitive.ItemIndicator>
      )}
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

/** Sticky row pinned to the bottom of the popup, e.g. "2 selected · Clear" for multi-select. */
function SelectFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-footer"
      className={cn(
        "sticky bottom-0 -mx-1 -mb-1 mt-1 flex items-center justify-between gap-2 border-t border-light-l3 bg-white px-3 py-2 text-caption text-dark-60",
        className
      )}
      {...props}
    />
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        "pointer-events-none -mx-1 my-1 h-px bg-light-l3",
        className
      )}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-white py-1 text-dark-60 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <IconChevronUp
      />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-white py-1 text-dark-60 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <IconChevronDown
      />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectFooter,
  SelectItem,
  selectItemVariants,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
