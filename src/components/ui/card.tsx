import * as React from "react"

import { cn } from "@/lib/utils"
import { IconTile, type IconTileProps } from "@/components/ui/icon-tile"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-6 overflow-hidden rounded-lg border border-border bg-card shadow-xs py-6 text-body-5 text-card-foreground has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 *:[img:first-child]:rounded-t-lg *:[img:last-child]:rounded-b-lg",
        className
      )}
      {...props}
    />
  )
}

interface CardHeaderProps extends React.ComponentProps<"div"> {
  /** Lucide icon shown in an `IconTile` above the title, e.g. `<FileText />`. */
  icon?: React.ReactNode
  /** Tile colour: `mint` (default), `navy`, `warning`, `error`, `neutral`. */
  iconTone?: IconTileProps["tone"]
  /** Tile size: `sm` 32px, `md` 40px (default), `lg` 48px. */
  iconSize?: IconTileProps["size"]
  /** Tile shape: `circle` (default) or `square`. */
  iconShape?: IconTileProps["shape"]
}

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
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-2 rounded-t-lg px-6 has-data-[slot=card-icon]:gap-y-3 group-data-[size=sm]/card:px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4",
        className
      )}
      {...props}
    >
      {icon && (
        <CardIcon tone={iconTone} size={iconSize} shape={iconShape} icon={icon} />
      )}
      {children}
    </div>
  )
}

/** IconTile sized for a card header. Use directly for custom layouts, or via `CardHeader icon`. */
function CardIcon({ className, ...props }: IconTileProps) {
  return (
    <IconTile
      data-slot="card-icon"
      className={cn("col-start-1", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-body-4 font-medium", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-body-5 text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 group-data-[size=sm]/card:px-4", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-lg px-6 group-data-[size=sm]/card:px-4 [.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-4",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardIcon,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
export type { CardHeaderProps }
