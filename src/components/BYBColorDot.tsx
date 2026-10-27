import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Small colour swatch, e.g. a product badge colour beside a label. Set the
 * colour with a background utility: `<BYBColorDot className="bg-badge-product-bpi" />`
 * or from the catalogue: `<BYBColorDot className={productBadgeByKey.bpi.bg} />`.
 */
const bybColorDotVariants = cva("inline-block shrink-0 rounded-full", {
  variants: {
    size: {
      sm: "size-1.5",
      md: "size-2",
      lg: "size-2.5",
    },
  },
  defaultVariants: { size: "md" },
})

interface BYBColorDotProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof bybColorDotVariants> {}

function BYBColorDot({ className, size, ...props }: BYBColorDotProps) {
  return (
    <span
      data-slot="color-dot"
      aria-hidden="true"
      className={cn(bybColorDotVariants({ size }), className)}
      {...props}
    />
  )
}

export { BYBColorDot, bybColorDotVariants }
export type { BYBColorDotProps }
