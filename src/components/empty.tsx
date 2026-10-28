import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Empty as EmptyBase } from "@/components/ui/empty"

export * from "@/components/ui/empty"

const emptyVariants = cva(
  "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-lg px-6 py-10 text-center text-balance",
  {
    variants: {
      variant: {
        default: "",
        outline: "border border-dashed border-border",
        muted: "bg-muted",
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
