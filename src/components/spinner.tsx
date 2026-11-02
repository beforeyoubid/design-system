import * as React from "react"
import { IconLoader, IconLoader2 } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

export * from "@/components/ui/spinner"

/**
 * The BYB Spinner is the loader-2 arc (`ring`, default); stock's is the loader
 * rays, kept as `dots`. Both read the spinner component tokens. Inside a control, placed
 * with data-icon, it takes the control's text colour.
 */
function Spinner({
  className,
  variant = "ring",
  ...props
}: React.ComponentProps<"svg"> & { variant?: "ring" | "dots" }) {
  const Glyph = variant === "dots" ? IconLoader : IconLoader2
  return (
    <Glyph
      data-slot="spinner"
      data-variant={variant}
      role="status"
      aria-label="Loading"
      className={cn(
        "size-(--_spinner-size) shrink-0 animate-spin text-(--_spinner-foreground) data-[icon]:text-current",
        className
      )}
      {...props}
    />
  )
}

export { Spinner }
