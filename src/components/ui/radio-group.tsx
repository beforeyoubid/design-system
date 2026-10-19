"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

type RadioGroupVariant = "default" | "card"
type RadioSize = "sm" | "md" | "lg"

const RadioGroupContext = React.createContext<{
  variant: RadioGroupVariant
  size: RadioSize
}>({ variant: "default", size: "md" })

const radioGroupVariants = cva("grid w-full", {
  variants: {
    variant: {
      default: "",
      card: "",
    },
    size: {
      sm: "gap-2",
      md: "gap-2.5",
      lg: "gap-3",
    },
  },
  compoundVariants: [{ variant: "card", className: "gap-2" }],
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
        card: "flex-row-reverse justify-between gap-4 rounded-lg border border-dark-15 bg-white transition-colors has-data-checked:border-mint-45 has-data-checked:bg-mint-l4",
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
      sm: "size-3.5 [&_[data-slot=radio-group-dot]]:size-1.5",
      md: "size-4 [&_[data-slot=radio-group-dot]]:size-2",
      lg: "size-5 [&_[data-slot=radio-group-dot]]:size-2.5",
    },
  },
  defaultVariants: { size: "md" },
})

const radioLabelVariants = cva("leading-tight text-navy", {
  variants: {
    size: {
      sm: "text-caption-1",
      md: "text-body-5",
      lg: "text-body-4",
    },
  },
  defaultVariants: { size: "md" },
})

const radioDescriptionVariants = cva("text-dark-75", {
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
      <RadioGroupPrimitive
        data-slot="radio-group"
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
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      data-size={size}
      className={cn(
        "group/radio-group-item peer relative flex aspect-square cursor-pointer data-disabled:cursor-not-allowed shrink-0 items-center justify-center rounded-full border border-dark-30 bg-white transition-[border-color,box-shadow] outline-none after:absolute after:-inset-x-3 after:-inset-y-2",
        radioControlVariants({ size }),
        "focus-visible:border-mint-45 focus-visible:ring-3 focus-visible:ring-mint-45/30",
        "data-checked:border-mint-45",
        "aria-invalid:border-error-75 aria-invalid:ring-3 aria-invalid:ring-error-75/20 aria-invalid:data-checked:border-mint-45",
        "disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        hasText && size !== "lg" && "mt-px",
        hasText && "data-disabled:opacity-100",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        <span
          data-slot="radio-group-dot"
          className="rounded-full bg-mint-45"
        />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
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
