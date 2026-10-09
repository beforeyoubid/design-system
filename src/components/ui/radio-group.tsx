"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

type RadioGroupVariant = "default" | "card"

const RadioGroupVariantContext = React.createContext<RadioGroupVariant>("default")

const radioGroupVariants = cva("grid w-full", {
  variants: {
    variant: {
      default: "gap-2.5",
      card: "gap-2",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const radioItemFieldVariants = cva(
  "group/radio-field flex cursor-pointer items-start gap-2.5 has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        card: "flex-row-reverse justify-between gap-4 rounded-lg border border-dark-15 bg-white px-4 py-3.5 transition-colors has-data-checked:border-mint-45 has-data-checked:bg-mint-l4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface RadioGroupProps
  extends RadioGroupPrimitive.Props,
    VariantProps<typeof radioGroupVariants> {}

function RadioGroup({ className, variant, ...props }: RadioGroupProps) {
  const resolved: RadioGroupVariant = variant ?? "default"
  return (
    <RadioGroupVariantContext.Provider value={resolved}>
      <RadioGroupPrimitive
        data-slot="radio-group"
        data-variant={resolved}
        className={cn(radioGroupVariants({ variant: resolved }), className)}
        {...props}
      />
    </RadioGroupVariantContext.Provider>
  )
}

export interface RadioGroupItemProps extends RadioPrimitive.Root.Props {
  /** Optional label. When provided (or `description`), the radio is wrapped in a `<label>`. */
  label?: React.ReactNode
  /** Optional helper text rendered under the label. */
  description?: React.ReactNode
  /** className for the wrapping `<label>` (only used when `label`/`description` is set). */
  wrapperClassName?: string
}

function RadioGroupItem({
  className,
  label,
  description,
  wrapperClassName,
  ...props
}: RadioGroupItemProps) {
  const variant = React.useContext(RadioGroupVariantContext)
  const hasText = label != null || description != null

  const control = (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square cursor-pointer data-disabled:cursor-not-allowed size-4 shrink-0 items-center justify-center rounded-full border border-dark-30 bg-white transition-[border-color,box-shadow] outline-none after:absolute after:-inset-x-3 after:-inset-y-2",
        "focus-visible:border-mint-45 focus-visible:ring-3 focus-visible:ring-mint-45/30",
        "data-checked:border-mint-45",
        "aria-invalid:border-error-75 aria-invalid:ring-3 aria-invalid:ring-error-75/20 aria-invalid:data-checked:border-mint-45",
        "disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        hasText && "mt-px data-disabled:opacity-100",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        <span className="size-2 rounded-full bg-mint-45" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )

  if (!hasText) return control

  return (
    <label
      data-slot="radio-group-field"
      data-variant={variant}
      className={cn(radioItemFieldVariants({ variant }), wrapperClassName)}
    >
      {control}
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        {label != null && (
          <span
            data-slot="radio-group-label"
            className={cn(
              "text-body-sm leading-tight text-navy",
              variant === "card" ? "font-semibold" : "font-medium"
            )}
          >
            {label}
          </span>
        )}
        {description != null && (
          <span
            data-slot="radio-group-description"
            className="text-body-sm text-dark-60"
          >
            {description}
          </span>
        )}
      </span>
    </label>
  )
}

export { RadioGroup, RadioGroupItem, radioGroupVariants }
