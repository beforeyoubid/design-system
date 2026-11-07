import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { cva, type VariantProps } from "class-variance-authority"
import { IconCheck, IconChevronDown, IconX } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import {
  SelectContent as StockSelectContent,
  SelectTrigger as StockSelectTrigger,
} from "@/components/ui/select"

export * from "@/components/ui/select"

/**
 * The BYB trigger ends in a chevron that turns and goes mint while open; stock's
 * ends in an up-down selector. Stock's icon is hidden (it has no slot to hook,
 * only Tabler's class) and ours follows the value. Component tokens: select-icon in
 * src/tokens/components/select.css.
 *
 * Pass `onClear` to show an × beside the chevron that clears the selection
 * (pass it only while something is selected). The × is a sibling of the
 * trigger, not inside it, so the trigger and the × are wrapped together.
 */
function SelectTrigger({
  className,
  children,
  onClear,
  clearLabel = "Clear selection",
  ...props
}: React.ComponentProps<typeof StockSelectTrigger> & {
  onClear?: () => void
  /** Accessible name of the × button. */
  clearLabel?: string
}) {
  const trigger = (
    <StockSelectTrigger
      className={cn(
        "[&>.tabler-icon-selector]:hidden",
        onClear && "*:data-[slot=select-value]:me-7",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        data-slot="select-icon"
        render={
          <span className="pointer-events-none flex size-(--_select-icon-size) items-center justify-center text-(--_select-icon-foreground) transition-transform group-data-popup-open/select-trigger:rotate-180 group-data-popup-open/select-trigger:text-(--_select-icon-open-foreground) group-data-disabled/select-trigger:text-(--_select-icon-disabled-foreground)" />
        }
      >
        <IconChevronDown className="size-(--_select-icon-size)" />
      </SelectPrimitive.Icon>
    </StockSelectTrigger>
  )
  if (!onClear) return trigger
  return (
    <div data-slot="select-trigger-wrapper" className="relative w-full">
      {trigger}
      <button
        type="button"
        data-slot="select-clear"
        onClick={onClear}
        aria-label={clearLabel}
        title={clearLabel}
        className="absolute end-8 top-1/2 flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-sm text-(--_select-clear-foreground) transition-colors outline-none hover:text-(--_select-clear-hover-foreground) focus-visible:ring-2 focus-visible:ring-(--_select-clear-focus-ring)"
      >
        <IconX className="size-3.5" />
      </button>
    </div>
  )
}

/** A selected value in a multiple select's field: optional leading content, then the label. */
function SelectChip({ className, children, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="select-chip"
      className={cn(
        "inline-flex h-(--_select-chip-height) min-w-0 shrink items-center gap-1.5 rounded-(--_select-chip-radius) bg-(--_select-chip) px-2 text-caption-1 font-medium text-(--_select-chip-foreground) [&>span:last-child]:truncate",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

/** "+N" after the chips that fit. */
function SelectChipOverflow({ count, className, ...props }: React.ComponentProps<"span"> & { count: number }) {
  return (
    <span
      data-slot="select-chip-overflow"
      className={cn(
        "inline-flex h-(--_select-chip-height) shrink-0 items-center rounded-(--_select-chip-radius) bg-(--_select-chip-overflow) px-2 text-caption-1 font-medium text-(--_select-chip-overflow-foreground)",
        className
      )}
      {...props}
    >
      +{count}
    </span>
  )
}

const selectItemVariants = cva(
  "group/select-item relative flex min-h-(--_select-item-min-height) w-full cursor-pointer items-center rounded-(--_select-item-radius) py-(--_select-item-padding-y) text-body-5 text-(--_select-item-foreground) outline-hidden select-none data-highlighted:bg-(--_select-item-highlighted) focus:bg-(--_select-item-focus) data-disabled:pointer-events-none data-disabled:text-(--_select-item-disabled-foreground) [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      indicator: {
        // Single select: mint row + trailing check (no check when the row has a `meta`)
        check: "ps-2 pe-8 data-selected:bg-(--_select-item-selected) data-selected:text-(--_select-item-selected-foreground) data-selected:data-highlighted:bg-(--_select-item-selected)",
        // Multiple select: leading checkbox, no row fill
        checkbox: "gap-2.5 px-2",
      },
    },
    defaultVariants: { indicator: "check" },
  }
)

interface SelectItemProps
  extends SelectPrimitive.Item.Props,
    VariantProps<typeof selectItemVariants> {
  /**
   * Right-aligned content: a count ("12"), hint ("VIC only") or any node, e.g.
   * a `<ColorDot />`. On single-select rows it replaces the trailing check;
   * the mint row fill still marks the selection.
   */
  meta?: React.ReactNode
  /** Leading content before the label, e.g. an icon, avatar or `<ColorDot />`. */
  start?: React.ReactNode
}

function SelectItem({
  className,
  children,
  indicator = "check",
  meta,
  start,
  ...props
}: SelectItemProps) {
  const hasMeta = meta != null
  const showCheck = indicator === "check" && !hasMeta
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      data-indicator={indicator}
      className={cn(
        selectItemVariants({ indicator }),
        indicator === "check" && hasMeta && "pe-2",
        className
      )}
      {...props}
    >
      {indicator === "checkbox" ? (
        <span
          aria-hidden="true"
          className="flex size-4 shrink-0 items-center justify-center rounded-sm border border-(--_select-item-checkbox-border) bg-(--_select-item-checkbox) text-(--_select-item-checkbox-checked-foreground) transition-colors group-data-selected/select-item:border-(--_select-item-checkbox-checked) group-data-selected/select-item:bg-(--_select-item-checkbox-checked) group-data-disabled/select-item:opacity-50"
        >
          <SelectPrimitive.ItemIndicator>
            <IconCheck className="size-3" stroke={3} />
          </SelectPrimitive.ItemIndicator>
        </span>
      ) : showCheck ? (
        <SelectPrimitive.ItemIndicator
          render={
            <span className="pointer-events-none absolute end-2 flex size-3.5 items-center justify-center" />
          }
        >
          <IconCheck className="size-3.5 text-(--_select-item-check-foreground)" />
        </SelectPrimitive.ItemIndicator>
      ) : null}
      {start != null && (
        <span
          data-slot="select-item-start"
          className={cn("flex shrink-0 items-center", indicator === "check" && "me-2.5")}
        >
          {start}
        </span>
      )}
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0">
        {children}
      </SelectPrimitive.ItemText>
      {meta != null && (
        <span
          data-slot="select-item-meta"
          className="ms-auto flex shrink-0 items-center ps-3 text-body-5 text-(--_select-item-meta-foreground) group-data-disabled/select-item:text-(--_select-item-disabled-foreground)"
        >
          {meta}
        </span>
      )}
    </SelectPrimitive.Item>
  )
}

/** Sticky row pinned to the bottom of the popup, e.g. "2 selected · CLEAR" for multi-select. */
function SelectFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-footer"
      className={cn(
        "sticky -bottom-1 -mx-1 -mb-1 mt-1 flex items-center justify-between gap-2 border-t border-light-l3 bg-white px-3 py-2 text-caption-1 text-dark-75",
        className
      )}
      {...props}
    />
  )
}

/**
 * Stock's popup is exactly the trigger's width and its labels never wrap, so a label
 * wider than the trigger was cut off. This one is at least the trigger's width (and
 * never under 9rem), grows to fit the widest option, and stops at the screen edge,
 * where long labels wrap (see SelectItem).
 */
const POPUP_WIDTH = "w-fit min-w-[max(var(--anchor-width),--spacing(36))] max-w-(--available-width)"

/** Stock `SelectContent`, opening below the field (6px gap) instead of over it. */
function SelectContent({
  sideOffset = 6,
  alignItemWithTrigger = false,
  className,
  ...props
}: React.ComponentProps<typeof StockSelectContent>) {
  return (
    <StockSelectContent
      sideOffset={sideOffset}
      alignItemWithTrigger={alignItemWithTrigger}
      className={cn(POPUP_WIDTH, className)}
      {...props}
    />
  )
}

export { SelectChip, SelectChipOverflow, SelectContent, SelectFooter, SelectItem, SelectTrigger, selectItemVariants }
export type { SelectItemProps }
