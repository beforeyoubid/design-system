import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils"
import { BYBIconTile } from "./BYBIconTile"

const bybEmptyStateVariants = cva(
  "flex w-full flex-col items-center gap-4 px-6 py-10 text-center",
  {
    variants: {
      variant: {
        plain: "",
        dashed: "rounded-lg border border-dashed border-dark-15",
        muted: "rounded-lg bg-light-l1",
      },
    },
    defaultVariants: { variant: "plain" },
  }
)

export interface BYBEmptyStateProps
  extends Omit<React.ComponentProps<"div">, "title">,
    VariantProps<typeof bybEmptyStateVariants> {
  /** Icon element (e.g. `<FolderOpen />`), shown in a 40px mint `BYBIconTile`. */
  icon?: React.ReactNode
  /** Custom visual instead of the icon, e.g. an avatar or avatar group. */
  media?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  /** Buttons row, e.g. primary + tertiary. */
  actions?: React.ReactNode
  /** Small line under the actions, e.g. a link button or "Need help? Contact support". */
  footer?: React.ReactNode
  /** Extra content between the text and the actions, e.g. a search InputGroup. */
  children?: React.ReactNode
}

function BYBEmptyState({
  icon,
  media,
  title,
  description,
  actions,
  footer,
  variant,
  className,
  children,
  ...props
}: BYBEmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(bybEmptyStateVariants({ variant }), className)}
      {...props}
    >
      {media ??
        (icon && (
          <BYBIconTile tone="mint" size="md" icon={icon} />
        ))}
      {(title || description) && (
        <div className="flex max-w-sm flex-col gap-1.5">
          {title && (
            <h3 className="m-0 text-body-4 leading-tight font-semibold text-navy">
              {title}
            </h3>
          )}
          {description && (
            <p className="m-0 text-body-5 leading-normal text-dark-75">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
      {actions && (
        <div className="flex flex-wrap justify-center gap-2">{actions}</div>
      )}
      {footer && <div className="text-body-5 text-dark-75">{footer}</div>}
    </div>
  )
}

export { BYBEmptyState, bybEmptyStateVariants }
