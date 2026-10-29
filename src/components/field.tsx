import * as React from "react"

import { cn } from "@/lib/utils"
import { FieldLabel as StockFieldLabel, FieldTitle as StockFieldTitle } from "@/components/ui/field"

export * from "@/components/ui/field"

/**
 * FieldLabel with `required`: a mint asterisk after the label, the same mark
 * the form library's fields show. It's hidden from screen readers; mark the
 * control itself `required` (or `aria-required`) so they announce it.
 */
function FieldLabel({
  required,
  children,
  ...props
}: React.ComponentProps<typeof StockFieldLabel> & { required?: boolean }) {
  return (
    <StockFieldLabel {...props}>
      {children}
      {required && (
        <span aria-hidden="true" data-slot="field-label-required" className="-ms-1.5 text-(--_field-label-required-foreground)">
          *
        </span>
      )}
    </StockFieldLabel>
  )
}

/**
 * Stock FieldTitle (a choice card's title) shares the label's data-slot, so it
 * follows the label's disabled-opacity lever too.
 */
function FieldTitle({ className, ...props }: React.ComponentProps<typeof StockFieldTitle>) {
  return (
    <StockFieldTitle
      className={cn("group-data-[disabled=true]/field:opacity-(--_field-label-disabled-opacity)", className)}
      {...props}
    />
  )
}

export { FieldLabel, FieldTitle }
