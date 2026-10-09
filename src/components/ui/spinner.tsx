import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { IconLoader, IconLoader2 } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

const spinnerVariants = cva("shrink-0", {
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

export interface SpinnerProps
  extends Omit<React.ComponentProps<"svg">, "color">,
    VariantProps<typeof spinnerVariants> {
  /** Screen-reader text. Default "Loading". */
  label?: string
  strokeWidth?: number
}

function Spinner({
  className,
  size,
  color,
  variant,
  label = "Loading",
  strokeWidth = 2,
  ...props
}: SpinnerProps) {
  const Glyph = variant === "dots" ? IconLoader : IconLoader2
  return (
    <Glyph
      data-slot="spinner"
      role="status"
      aria-label={label}
      stroke={strokeWidth}
      className={cn(spinnerVariants({ size, color, variant }), className)}
      {...props}
    />
  )
}

export { Spinner, spinnerVariants }
