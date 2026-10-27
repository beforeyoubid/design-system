import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { IconLoader, IconLoader2 } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

const bybSpinnerVariants = cva("shrink-0", {
  variants: {
    size: {
      sm: "size-3",
      md: "size-4",
      lg: "size-5",
      xl: "size-6",
    },
    color: {
      mint: "text-mint-45",
      lime: "text-lime",
      navy: "text-navy",
      current: "text-current",
    },
    variant: {
      // Tabler loader-2 arc
      ring: "animate-spin",
      // Tabler loader rays
      dots: "animate-spin",
    },
  },
  defaultVariants: {
    size: "md",
    color: "mint",
    variant: "ring",
  },
})

export interface BYBSpinnerProps
  extends Omit<React.ComponentProps<"svg">, "color">,
    VariantProps<typeof bybSpinnerVariants> {
  /** Screen-reader text. Default "Loading". */
  label?: string
  strokeWidth?: number
}

function BYBSpinner({
  className,
  size,
  color,
  variant,
  label = "Loading",
  strokeWidth = 2,
  ...props
}: BYBSpinnerProps) {
  const Glyph = variant === "dots" ? IconLoader : IconLoader2
  return (
    <Glyph
      data-slot="spinner"
      role="status"
      aria-label={label}
      stroke={strokeWidth}
      className={cn(bybSpinnerVariants({ size, color, variant }), className)}
      {...props}
    />
  )
}

export { BYBSpinner, bybSpinnerVariants }
