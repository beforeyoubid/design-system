"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"

import { cn } from "@/lib/utils"

export * from "@/components/ui/popover"

/**
 * Stock `PopoverContent` plus `positionMethod`, forwarded rather than defaulted
 * (it was in 1.1.5 and the regenerated ui file dropped it). Base UI renders the
 * positioner unpositioned for a frame before it measures the anchor, and under
 * the `absolute` default that origin is the document's, so anything in the
 * popup that calls `scrollIntoView` on mount (cmdk does, on its active item)
 * scrolls the page to the top. `fixed` makes that first frame land in the
 * viewport. Only callers that hit this opt in; @beforeyoubid/form's combobox
 * and multi-select do.
 *
 * The class string is the stock one; keep the two in step.
 */
function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  positionMethod,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "positionMethod"
  >) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        positionMethod={positionMethod}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "z-50 flex w-(--_popover-content-width) origin-(--transform-origin) flex-col gap-(--_popover-content-gap) rounded-(--_popover-content-radius) bg-(--_popover-content) p-(--_popover-content-padding) text-body-5 text-(--_popover-content-foreground) shadow-(--_popover-content-shadow) outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 border-(--_popover-content-border) border",
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

export { PopoverContent }
