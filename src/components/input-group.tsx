"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/button"

export * from "@/components/ui/input-group"

/*
 * The variant helpers below are public API. The stock ui file keeps private
 * copies with the same classes (reading the same component tokens); keep the two in step.
 */

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-(--_input-group-addon-gap) text-body-5 text-(--_input-group-addon-foreground) select-none group-data-[disabled=true]/input-group:opacity-50 **:data-[slot=kbd]:rounded-sm **:data-[slot=kbd]:bg-light-l2 **:data-[slot=kbd]:px-1.5 [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start": "order-first has-[>button]:-ms-1.5",
        "inline-end": "order-last has-[>button]:-me-1.5",
        "block-start":
          "order-first w-full justify-start pt-2.5 [.border-b]:pb-2.5",
        "block-end": "order-last w-full justify-start pb-2.5 [.border-t]:pt-2.5",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

const inputGroupButtonVariants = cva(
  "flex items-center gap-(--_input-group-button-gap) rounded-(--_input-group-button-radius) shadow-none text-overline",
  {
    variants: {
      size: {
        xs: "h-(--_input-group-button-xs-height) px-(--_input-group-button-xs-padding-x) py-0 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "h-(--_input-group-button-sm-height) px-(--_input-group-button-sm-padding-x) py-0 [&>svg:not([class*='size-'])]:size-4",
        "icon-xs": "size-(--_input-group-button-icon-xs-size) p-0 has-[>svg]:p-0 [&>svg:not([class*='size-'])]:size-4",
        "icon-sm": "size-(--_input-group-button-icon-sm-size) p-0 has-[>svg]:p-0 [&>svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
)

/**
 * Compact button that sits inside the group. Defaults to `ghost` (icon /
 * text action); use `primary` (mint), `secondary` (navy outline) or `tertiary`
 * (grey outline) for an inline CTA. Takes every BYB `Button` variant.
 */
function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset"
  }) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      size="xs"
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

export { InputGroupButton, inputGroupAddonVariants, inputGroupButtonVariants }
