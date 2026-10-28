"use client"

import * as React from "react"
import type { Radio as RadioPrimitive } from "@base-ui/react/radio"
import type { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  RadioGroup as StockRadioGroup,
  RadioGroupItem as StockRadioGroupItem,
} from "@/components/ui/radio-group"

export * from "@/components/ui/radio-group"

type RadioGroupVariant = "default" | "card"
type RadioSize = "sm" | "md" | "lg"

const RadioGroupContext = React.createContext<{
  variant: RadioGroupVariant
  size: RadioSize
}>({ variant: "default", size: "md" })

const radioGroupVariants = cva("", {
  variants: {
    variant: {
      default: "",
      card: "",
    },
    // md is the stock radio-group gap
    size: {
      sm: "gap-(--_radio-group-sm-gap)",
      md: "",
      lg: "gap-(--_radio-group-lg-gap)",
    },
  },
  compoundVariants: [{ variant: "card", className: "gap-(--_radio-group-card-gap)" }],
  defaultVariants: {
    variant: "default",
    size: "md",
  },
})

const radioItemFieldVariants = cva(
  "group/radio-field flex cursor-pointer items-start has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        card: "flex-row-reverse justify-between gap-4 rounded-(--_radio-group-field-card-radius) border border-(--_radio-group-field-card-border) bg-(--_radio-group-field-card) transition-colors has-data-checked:border-(--_radio-group-field-card-checked-border) has-data-checked:bg-(--_radio-group-field-card-checked)",
      },
      size: {
        sm: "gap-2",
        md: "gap-2.5",
        lg: "gap-3",
      },
    },
    compoundVariants: [
      { variant: "card", size: "sm", className: "gap-3 px-3 py-2.5" },
      { variant: "card", size: "md", className: "gap-4 px-4 py-3.5" },
      { variant: "card", size: "lg", className: "gap-4 px-5 py-4" },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

/** The radio circle and its checked dot, per size. */
const radioControlVariants = cva("", {
  variants: {
    size: {
      // md is the stock radio-group-item size
      sm: "size-(--_radio-group-item-sm-size) [&_[data-slot=radio-group-indicator]>span]:size-1.5",
      md: "",
      lg: "size-(--_radio-group-item-lg-size) [&_[data-slot=radio-group-indicator]>span]:size-2.5",
    },
  },
  defaultVariants: { size: "md" },
})

const radioLabelVariants = cva("leading-tight text-(--_radio-group-label-foreground)", {
  variants: {
    size: {
      sm: "text-caption-1",
      md: "text-body-5",
      lg: "text-body-4",
    },
  },
  defaultVariants: { size: "md" },
})

const radioDescriptionVariants = cva("text-(--_radio-group-description-foreground)", {
  variants: {
    size: {
      sm: "text-caption-1",
      md: "text-body-5",
      lg: "text-body-5",
    },
  },
  defaultVariants: { size: "md" },
})

export interface RadioGroupProps
  extends RadioGroupPrimitive.Props,
    VariantProps<typeof radioGroupVariants> {}

function RadioGroup({ className, variant, size, ...props }: RadioGroupProps) {
  const resolvedVariant: RadioGroupVariant = variant ?? "default"
  const resolvedSize: RadioSize = size ?? "md"
  return (
    <RadioGroupContext.Provider
      value={{ variant: resolvedVariant, size: resolvedSize }}
    >
      <StockRadioGroup
        data-variant={resolvedVariant}
        data-size={resolvedSize}
        className={cn(
          radioGroupVariants({ variant: resolvedVariant, size: resolvedSize }),
          className
        )}
        {...props}
      />
    </RadioGroupContext.Provider>
  )
}

export interface RadioGroupItemProps extends RadioPrimitive.Root.Props {
  /** Optional label. When provided (or `description`), the radio is wrapped in a `<label>`. */
  label?: React.ReactNode
  /** Optional helper text rendered under the label. */
  description?: React.ReactNode
  /** className for the wrapping `<label>` (only used when `label`/`description` is set). */
  wrapperClassName?: string
  /** Override the group's size for this item. */
  size?: RadioSize
}

function RadioGroupItem({
  className,
  label,
  description,
  wrapperClassName,
  size: sizeProp,
  ...props
}: RadioGroupItemProps) {
  const group = React.useContext(RadioGroupContext)
  const variant = group.variant
  const size = sizeProp ?? group.size
  const hasText = label != null || description != null

  const control = (
    <StockRadioGroupItem
      data-size={size}
      className={cn(
        radioControlVariants({ size }),
        hasText && size !== "lg" && "mt-px",
        hasText && "data-disabled:opacity-100",
        className
      )}
      {...props}
    />
  )

  if (!hasText) return control

  return (
    <label
      data-slot="radio-group-field"
      data-variant={variant}
      data-size={size}
      className={cn(radioItemFieldVariants({ variant, size }), wrapperClassName)}
    >
      {control}
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        {label != null && (
          <span
            data-slot="radio-group-label"
            className={cn(
              radioLabelVariants({ size }),
              variant === "card" ? "font-semibold" : "font-medium"
            )}
          >
            {label}
          </span>
        )}
        {description != null && (
          <span
            data-slot="radio-group-description"
            className={radioDescriptionVariants({ size })}
          >
            {description}
          </span>
        )}
      </span>
    </label>
  )
}

export { RadioGroup, RadioGroupItem, radioGroupVariants, radioControlVariants }
