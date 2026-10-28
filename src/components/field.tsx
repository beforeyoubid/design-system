import * as React from "react"

import { FieldLabel as StockFieldLabel } from "@/components/ui/field"

export * from "@/components/ui/field"

/**
 * FieldLabel with `required`: a mint asterisk after the label, the same mark
 * InputField and SelectField show. It's hidden from screen readers; mark the
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

export { FieldLabel }
