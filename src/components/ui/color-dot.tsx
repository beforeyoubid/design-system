import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Small colour swatch, e.g. a product badge colour beside a label. Set the
 * colour with a background utility: `<ColorDot className="bg-badge-product-bpi" />`
 * or from the catalogue: `<ColorDot className={productBadgeByKey.bpi.bg} />`.
 */
const colorDotVariants = cva("inline-block shrink-0 rounded-full", {
  variants: {
    size: {
      sm: "size-1.5",
      md: "size-2",
      lg: "size-2.5",
    },
  },
  defaultVariants: { size: "md" },
})

interface ColorDotProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof colorDotVariants> {}

function ColorDot({ className, size, ...props }: ColorDotProps) {
  return (
    <span
      data-slot="color-dot"
      aria-hidden="true"
      className={cn(colorDotVariants({ size }), className)}
      {...props}
    />
  )
}

export { ColorDot, colorDotVariants }
export type { ColorDotProps }
