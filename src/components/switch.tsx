"use client"

import * as React from "react"
import type { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Switch as StockSwitch } from "@/components/ui/switch"

export * from "@/components/ui/switch"

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

/**
 * `lg` has no stock size. The stock switch styles its track and thumb from
 * `data-size` (`md` renders as stock `default`), so `lg` sets `data-size="lg"`,
 * which no stock size rule matches, and sizes both here. The thumb is reached
 * through the root's className.
 */
const LG_CLASSES =
  "h-6 w-11 [&>[data-slot=switch-thumb]]:size-5 [&>[data-slot=switch-thumb][data-checked]]:translate-x-5 rtl:[&>[data-slot=switch-thumb][data-checked]]:-translate-x-5"

export interface SwitchProps extends SwitchPrimitive.Root.Props {
  /** sm 28×16 · md 36×20 (default) · lg 44×24. `default` is the stock name for `md`. */
  size?: "sm" | "md" | "lg" | "default"
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
  const bybSize = size === "default" ? "md" : size

  const control = (
    <StockSwitch
      size={bybSize === "sm" ? "sm" : "default"}
      {...(bybSize === "lg" && { "data-size": "lg" })}
      className={cn(
        bybSize === "lg" && LG_CLASSES,
        hasText && "data-disabled:opacity-100",
        className
      )}
      {...props}
    />
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
            className="text-body-5 leading-tight font-semibold text-navy"
          >
            {label}
          </span>
        )}
        {description != null && (
          <span data-slot="switch-description" className="text-body-5 text-dark-75">
            {description}
          </span>
        )}
      </span>
      {control}
    </label>
  )
}

export { Switch, switchVariants, switchThumbVariants }
