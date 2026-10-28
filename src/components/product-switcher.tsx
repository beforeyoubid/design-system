"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  productBadgeByKey,
  productBadges,
  type ProductBadgeKey,
} from "@/lib/product-badges"
import {
  DropdownMenu,
  DropdownMenuCardGrid,
  DropdownMenuCardItem,
  DropdownMenuCardTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/dropdown-menu"

interface ProductSwitcherProps {
  /** Selected product key. */
  value: ProductBadgeKey
  onValueChange?: (value: ProductBadgeKey) => void
  /** Products to offer, in order. Default: every product badge. */
  products?: readonly ProductBadgeKey[]
  /** Meta per product, e.g. `{ bpi: "26 jobs" }`. */
  meta?: Partial<Record<ProductBadgeKey, React.ReactNode>>
  /** Trigger overline. Default "Inspection type". */
  label?: React.ReactNode
  /** Heading inside the panel. Default "Switch inspection type". */
  heading?: React.ReactNode
  className?: string
  contentClassName?: string
}

/**
 * Ready-made product switcher: card trigger + 2-column card grid, with each
 * product's Lucide icon and badge colour from `productBadges`.
 */
function ProductSwitcher({
  value,
  onValueChange,
  products = productBadges.map((p) => p.key),
  meta,
  label = "Inspection type",
  heading = "Switch inspection type",
  className,
  contentClassName,
}: ProductSwitcherProps) {
  const current = productBadgeByKey[value]
  const CurrentIcon = current.icon
  return (
    <DropdownMenu>
      <DropdownMenuCardTrigger
        className={className}
        icon={<CurrentIcon />}
        label={label}
        dotClassName={current.bg}
        title={current.label}
        meta={meta?.[value]}
      />
      <DropdownMenuContent
        sideOffset={8}
        className={cn("w-160 max-w-(--available-width) p-3", contentClassName)}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-1 pt-0 pb-2 text-dark-90">
            {heading}
          </DropdownMenuLabel>
          <DropdownMenuCardGrid
            value={value}
            onValueChange={(next) => onValueChange?.(next as ProductBadgeKey)}
          >
            {products.map((key) => {
              const p = productBadgeByKey[key]
              const Icon = p.icon
              return (
                <DropdownMenuCardItem
                  key={key}
                  value={key}
                  icon={<Icon />}
                  dotClassName={p.bg}
                  title={p.label}
                  meta={meta?.[key]}
                />
              )
            })}
          </DropdownMenuCardGrid>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ProductSwitcher }
export type { ProductSwitcherProps }
