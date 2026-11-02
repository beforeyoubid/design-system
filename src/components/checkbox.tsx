"use client"

import * as React from "react"
import type { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Checkbox as StockCheckbox } from "@/components/ui/checkbox"

export * from "@/components/ui/checkbox"

const checkboxFieldVariants = cva(
  "group/checkbox-field flex cursor-pointer items-start gap-2.5 has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        card: "rounded-(--_checkbox-field-card-radius) border border-(--_checkbox-field-card-border) bg-(--_checkbox-field-card) px-4 py-3.5 transition-colors has-data-checked:border-(--_checkbox-field-card-checked-border) has-data-checked:bg-(--_checkbox-field-card-checked)",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface CheckboxProps
  extends CheckboxPrimitive.Root.Props,
    VariantProps<typeof checkboxFieldVariants> {
  /** Optional label. When provided (or `description`), the control is wrapped in a `<label>`. */
  label?: React.ReactNode
  /** Optional helper text rendered under the label. */
  description?: React.ReactNode
  /** className for the wrapping `<label>` (only used when `label`/`description` is set). */
  wrapperClassName?: string
}

function Checkbox({
  className,
  label,
  description,
  variant,
  wrapperClassName,
  ...props
}: CheckboxProps) {
  const hasText = label != null || description != null

  const control = (
    <StockCheckbox
      className={cn(hasText && "mt-px data-disabled:opacity-100", className)}
      {...props}
    />
  )

  if (!hasText) return control

  return (
    <label
      data-slot="checkbox-field"
      data-variant={variant ?? "default"}
      className={cn(checkboxFieldVariants({ variant }), wrapperClassName)}
    >
      {control}
      <span className="flex min-w-0 flex-col gap-1">
        {label != null && (
          <span
            data-slot="checkbox-label"
            className="text-body-5 leading-tight font-semibold text-(--_checkbox-label-foreground)"
          >
            {label}
          </span>
        )}
        {description != null && (
          <span
            data-slot="checkbox-description"
            className="text-body-5 text-(--_checkbox-description-foreground)"
          >
            {description}
          </span>
        )}
      </span>
    </label>
  )
}

export { Checkbox, checkboxFieldVariants }
