import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Empty as EmptyBase } from "@/components/ui/empty"

export * from "@/components/ui/empty"

const emptyVariants = cva(
  // The layout is the stock empty part (empty component tokens); variants add a border or fill.
  "",
  {
    variants: {
      variant: {
        default: "",
        outline: "border border-dashed border-(--_empty-outline-border)",
        muted: "bg-(--_empty-muted)",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/** Stock `Empty` plus a `variant`: `default`, `outline` (dashed border) or `muted` (filled). */
function Empty({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyVariants>) {
  return (
    <EmptyBase
      data-variant={variant}
      className={cn(emptyVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Empty, emptyVariants }
