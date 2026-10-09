"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const switchVariants = cva(
  "peer group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-unchecked:bg-dark-30 data-checked:bg-mint-45 focus-visible:ring-3 focus-visible:ring-mint-45/30 aria-invalid:ring-3 aria-invalid:ring-error-75/20 data-disabled:cursor-not-allowed data-disabled:opacity-50",
  {
    variants: {
      // sm 28×16 · md 36×20 (design default) · lg 44×24
      size: {
        sm: "h-4 w-7",
        md: "h-5 w-9",
        lg: "h-6 w-11",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const switchThumbVariants = cva(
  "pointer-events-none block rounded-full bg-white shadow-xs ring-0 transition-transform data-unchecked:translate-x-0",
  {
    variants: {
      size: {
        sm: "size-3 data-checked:translate-x-3 rtl:data-checked:-translate-x-3",
        md: "size-4 data-checked:translate-x-4 rtl:data-checked:-translate-x-4",
        lg: "size-5 data-checked:translate-x-5 rtl:data-checked:-translate-x-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface SwitchProps extends SwitchPrimitive.Root.Props {
  /** sm 28×16 · md 36×20 (default) · lg 44×24 */
  size?: "sm" | "md" | "lg"
  /** Optional label. When provided (or `description`), renders a row with text on the left and the switch on the right. */
  label?: React.ReactNode
  /** Optional helper text rendered under the label. */
  description?: React.ReactNode
  /** className for the wrapping `<label>` row (only used when `label`/`description` is set). */
  wrapperClassName?: string
}

function Switch({
  className,
  size = "md",
  label,
  description,
  wrapperClassName,
  ...props
}: SwitchProps) {
  const hasText = label != null || description != null

  const control = (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        switchVariants({ size }),
        hasText && "data-disabled:opacity-100",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={switchThumbVariants({ size })}
      />
    </SwitchPrimitive.Root>
  )

  if (!hasText) return control

  return (
    <label
      data-slot="switch-field"
      className={cn(
        "flex cursor-pointer items-start justify-between gap-4 has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50",
        wrapperClassName
      )}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        {label != null && (
          <span
            data-slot="switch-label"
            className="text-body-sm leading-tight font-semibold text-navy"
          >
            {label}
          </span>
        )}
        {description != null && (
          <span data-slot="switch-description" className="text-body-sm text-dark-60">
            {description}
          </span>
        )}
      </span>
      {control}
    </label>
  )
}

export { Switch, switchVariants, switchThumbVariants }
