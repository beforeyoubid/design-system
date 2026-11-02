import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export * from "@/components/ui/alert"

// From ui/alert.tsx alertVariants, plus the success, warning and info looks, each reading an
// @ours component token. Update it when shadcn updates the alert.
const alertVariants = cva(
  "group/alert relative grid w-full gap-(--_alert-gap) rounded-(--_alert-radius) border px-(--_alert-padding-x) py-(--_alert-padding-y) text-start text-body-5 has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pe-(--_alert-with-action-padding-x) has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-(--_alert-with-icon-gap) *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-(--_alert-default) text-(--_alert-default-foreground) border-(--_alert-default-border)",
        destructive:
          "bg-(--_alert-destructive) text-(--_alert-destructive-foreground) *:data-[slot=alert-description]:text-destructive/90 border-(--_alert-destructive-border)",
        success:
          "bg-(--_alert-success) text-(--_alert-success-foreground) *:data-[slot=alert-description]:text-(--_alert-success-foreground)/90 border-(--_alert-success-border)",
        warning:
          "bg-(--_alert-warning) text-(--_alert-warning-foreground) *:data-[slot=alert-description]:text-(--_alert-warning-foreground)/90 border-(--_alert-warning-border)",
        info: "bg-(--_alert-info) text-(--_alert-info-foreground) *:data-[slot=alert-description]:text-(--_alert-info-foreground)/90 border-(--_alert-info-border)",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/** Stock `Alert` plus the `success`, `warning` and `info` looks. */
function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Alert, alertVariants }
