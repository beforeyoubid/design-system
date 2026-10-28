import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * A Lucide (or any SVG) icon on a tinted tile. Shared by Card,
 * Dialog and the product DropdownMenu so every icon chip in the library looks
 * the same.
 */
const iconTileVariants = cva(
  "inline-flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        mint: "bg-(--_icon-tile-mint) text-(--_icon-tile-mint-foreground)",
        navy: "bg-(--_icon-tile-navy) text-(--_icon-tile-navy-foreground)",
        warning: "bg-(--_icon-tile-warning) text-(--_icon-tile-warning-foreground)",
        error: "bg-(--_icon-tile-error) text-(--_icon-tile-error-foreground)",
        lime: "bg-(--_icon-tile-lime) text-(--_icon-tile-lime-foreground)",
        neutral: "bg-(--_icon-tile-neutral) text-(--_icon-tile-neutral-foreground)",
      },
      size: {
        sm: "size-(--_icon-tile-sm-size) [&_svg:not([class*='size-'])]:size-4",
        md: "size-(--_icon-tile-md-size) [&_svg:not([class*='size-'])]:size-5",
        lg: "size-(--_icon-tile-lg-size) [&_svg:not([class*='size-'])]:size-6",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-(--_icon-tile-square-radius)",
      },
    },
    defaultVariants: { variant: "mint", size: "md", shape: "circle" },
  }
)

type IconTileVariant = NonNullable<VariantProps<typeof iconTileVariants>["variant"]>

interface IconTileProps
  extends Omit<React.ComponentProps<"span">, "children">,
    VariantProps<typeof iconTileVariants> {
  /** The icon element, e.g. `<Bug />` from `@beforeyoubid/design-system/icons/lucide`. */
  icon?: React.ReactNode
  children?: React.ReactNode
}

function IconTile({
  icon,
  children,
  variant,
  size,
  shape,
  className,
  ...props
}: IconTileProps) {
  return (
    <span
      data-slot="icon-tile"
      data-variant={variant ?? "mint"}
      aria-hidden={props["aria-label"] ? undefined : true}
      className={cn(iconTileVariants({ variant, size, shape }), className)}
      {...props}
    >
      {icon ?? children}
    </span>
  )
}

export { IconTile, iconTileVariants }
export type { IconTileProps, IconTileVariant }
