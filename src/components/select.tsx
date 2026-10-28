import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { cva, type VariantProps } from "class-variance-authority"
import { IconCheck, IconChevronDown } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { SelectTrigger as StockSelectTrigger } from "@/components/ui/select"

export * from "@/components/ui/select"

/**
 * Rey's trigger ends in a chevron that turns and goes mint while open; stock's
 * ends in an up-down selector. Stock's icon is hidden (it has no slot to hook,
 * only Tabler's class) and ours follows the value. Levers: select-icon in
 * src/tokens/components/select.css.
 */
function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof StockSelectTrigger>) {
  return (
    <StockSelectTrigger className={cn("[&>.tabler-icon-selector]:hidden", className)} {...props}>
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
}

const selectItemVariants = cva(
  "group/select-item relative flex min-h-8 w-full cursor-pointer items-center rounded-md py-1.5 text-body-5 text-dark-100 outline-hidden select-none data-highlighted:bg-light-l1 focus:bg-light-l1 data-disabled:pointer-events-none data-disabled:text-dark-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      indicator: {
        // Single select: mint row + trailing check (no check when the row has a `meta`)
        check: "ps-2 pe-8 data-selected:bg-mint-l2 data-selected:text-mint-75 data-selected:data-highlighted:bg-mint-l2",
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
   * a `<BYBColorDot />`. On single-select rows it replaces the trailing check;
   * the mint row fill still marks the selection.
   */
  meta?: React.ReactNode
  /** Leading content before the label, e.g. an icon, avatar or `<BYBColorDot />`. */
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
          className="flex size-4 shrink-0 items-center justify-center rounded-sm border border-dark-45 bg-white text-white transition-colors group-data-selected/select-item:border-mint-45 group-data-selected/select-item:bg-mint-45 group-data-disabled/select-item:opacity-50"
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
          <IconCheck className="size-3.5 text-mint-75" />
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
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      {meta != null && (
        <span
          data-slot="select-item-meta"
          className="ms-auto flex shrink-0 items-center ps-3 text-body-5 text-dark-75 group-data-disabled/select-item:text-dark-45"
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

export { SelectFooter, SelectItem, SelectTrigger, selectItemVariants }
export type { SelectItemProps }
