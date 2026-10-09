"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { IconCheck } from "@tabler/icons-react"

const checkboxFieldVariants = cva(
  "group/checkbox-field flex cursor-pointer items-start gap-2.5 has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        card: "rounded-lg border border-dark-15 bg-white px-4 py-3.5 transition-colors has-data-checked:border-mint-45 has-data-checked:bg-mint-l4",
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
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 cursor-pointer data-disabled:cursor-not-allowed shrink-0 items-center justify-center rounded-sm border border-dark-30 bg-white text-white transition-[color,background-color,border-color,box-shadow] outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2",
        "focus-visible:border-mint-45 focus-visible:ring-3 focus-visible:ring-mint-45/30",
        "data-checked:border-mint-45 data-checked:bg-mint-45",
        "aria-invalid:border-error-75 aria-invalid:ring-3 aria-invalid:ring-error-75/20 aria-invalid:data-checked:border-mint-45",
        "disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        hasText && "mt-px data-disabled:opacity-100",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <IconCheck className="size-3" stroke={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
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
            className="text-body-sm leading-tight font-semibold text-navy"
          >
            {label}
          </span>
        )}
        {description != null && (
          <span
            data-slot="checkbox-description"
            className="text-body-sm text-dark-60"
          >
            {description}
          </span>
        )}
      </span>
    </label>
  )
}

export { Checkbox, checkboxFieldVariants }
