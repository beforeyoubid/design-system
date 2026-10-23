import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * A Lucide (or any SVG) icon on a tinted tile. Shared by Card, EmptyState,
 * Dialog and the product DropdownMenu so every icon chip in the library looks
 * the same.
 */
const iconTileVariants = cva(
  "inline-flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        mint: "bg-mint-l3 text-mint-75",
        navy: "bg-navy text-white",
        warning: "bg-warning-l2 text-warning-75",
        error: "bg-error-l1 text-error-75",
        lime: "bg-lime text-navy",
        neutral: "bg-light-l2 text-navy",
      },
      size: {
        sm: "size-8 [&_svg:not([class*='size-'])]:size-4",
        md: "size-10 [&_svg:not([class*='size-'])]:size-5",
        lg: "size-12 [&_svg:not([class*='size-'])]:size-6",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-lg",
      },
    },
    defaultVariants: { tone: "mint", size: "md", shape: "circle" },
  }
)

type IconTileTone = NonNullable<VariantProps<typeof iconTileVariants>["tone"]>

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
  tone,
  size,
  shape,
  className,
  ...props
}: IconTileProps) {
  return (
    <span
      data-slot="icon-tile"
      data-tone={tone ?? "mint"}
      aria-hidden={props["aria-label"] ? undefined : true}
      className={cn(iconTileVariants({ tone, size, shape }), className)}
      {...props}
    >
      {icon ?? children}
    </span>
  )
}

export { IconTile, iconTileVariants }
export type { IconTileProps, IconTileTone }
