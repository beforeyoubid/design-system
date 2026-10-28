import * as React from "react"

import { cn } from "@/lib/utils"
import { CardHeader as CardHeaderBase } from "@/components/ui/card"
import { BYBIconTile, type BYBIconTileProps } from "@/components/BYBIconTile"

export * from "@/components/ui/card"

interface CardHeaderProps extends React.ComponentProps<"div"> {
  /** Lucide icon shown in an `BYBIconTile` above the title, e.g. `<FileText />`. */
  icon?: React.ReactNode
  /** Tile colour: `mint` (default), `navy`, `warning`, `error`, `neutral`. */
  iconTone?: BYBIconTileProps["tone"]
  /** Tile size: `sm` 32px, `md` 40px (default), `lg` 48px. */
  iconSize?: BYBIconTileProps["size"]
  /** Tile shape: `circle` (default) or `square`. */
  iconShape?: BYBIconTileProps["shape"]
}

/** Stock `CardHeader` plus an optional icon tile above the title. */
function CardHeader({
  className,
  icon,
  iconTone,
  iconSize,
  iconShape,
  children,
  ...props
}: CardHeaderProps) {
  return (
    <CardHeaderBase
      className={cn("has-data-[slot=card-icon]:gap-y-3", className)}
      {...props}
    >
      {icon && (
        <CardIcon tone={iconTone} size={iconSize} shape={iconShape} icon={icon} />
      )}
      {children}
    </CardHeaderBase>
  )
}

/** BYBIconTile sized for a card header. Use directly for custom layouts, or via `CardHeader icon`. */
function CardIcon({ className, ...props }: BYBIconTileProps) {
  return (
    <BYBIconTile
      data-slot="card-icon"
      className={cn("col-start-1", className)}
      {...props}
    />
  )
}

export { CardHeader, CardIcon }
export type { CardHeaderProps }
