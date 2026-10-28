import * as React from "react"
import type { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  Badge as StockBadge,
  type badgeVariants as stockBadgeVariants,
} from "@/components/ui/badge"
import { BYBSpinner } from "@/components/BYBSpinner"

export * from "@/components/ui/badge"

// The badge part's look comes from the stock levers (badge.css): the md status
// pill is the stock size, and mint / gray / error are the stock default /
// secondary / destructive keys. Here: the tones, sizes and solid look stock
// doesn't have, each reading an @ours lever.
const badgeVariants = cva(
  "",
  {
    variants: {
      variant: {
        gray: "",
        mint: "",
        error: "",
        lime: "border-(--_badge-lime-border) bg-(--_badge-lime) font-semibold text-(--_badge-lime-foreground) [a]:hover:bg-(--_badge-lime)/80",
        success: "border-(--_badge-success-border) bg-(--_badge-success) font-semibold text-(--_badge-success-foreground)",
        warning: "border-(--_badge-warning-border) bg-(--_badge-warning) font-semibold text-(--_badge-warning-foreground)",
        "electric-blue":
          "border-(--_badge-electric-blue-border) bg-(--_badge-electric-blue) font-semibold text-(--_badge-electric-blue-foreground)",
      },
      /**
       * `tint` (default): light fill + border, coloured text.
       * `solid`: the tone's full colour with white (or navy) text, e.g. status pills
       * like "Awaiting authority", "Live", "Booked".
       */
      appearance: {
        tint: "",
        solid: "font-semibold",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
      },
      /** Solid category / product fill. Set automatically by `category` and `product`. */
      filled: {
        true: "border-transparent font-medium text-white",
        false: "",
      },
    },
    compoundVariants: [
      // Status badges (tint or solid): md is the stock size; sm and lg are ours
      { filled: false, size: "sm", className: "h-(--_badge-sm-height) px-(--_badge-sm-padding-x) py-0 [&>svg]:size-2.5!" },
      { filled: false, size: "lg", className: "h-(--_badge-lg-height) gap-(--_badge-lg-gap) px-(--_badge-lg-padding-x) py-0 text-body-5 [&>svg]:size-4!" },
      // Solid status fills
      { appearance: "solid", variant: "gray", className: "border-(--_badge-gray-solid) bg-(--_badge-gray-solid) text-(--_badge-gray-solid-foreground)" },
      { appearance: "solid", variant: "mint", className: "border-(--_badge-mint-solid) bg-(--_badge-mint-solid) text-(--_badge-mint-solid-foreground)" },
      { appearance: "solid", variant: "lime", className: "border-(--_badge-lime-solid) bg-(--_badge-lime-solid) text-(--_badge-lime-solid-foreground)" },
      { appearance: "solid", variant: "success", className: "border-(--_badge-success-solid) bg-(--_badge-success-solid) text-(--_badge-success-solid-foreground)" },
      { appearance: "solid", variant: "error", className: "border-(--_badge-error-solid) bg-(--_badge-error-solid) text-(--_badge-error-solid-foreground)" },
      { appearance: "solid", variant: "warning", className: "border-(--_badge-warning-solid) bg-(--_badge-warning-solid) text-(--_badge-warning-solid-foreground)" },
      { appearance: "solid", variant: "electric-blue", className: "border-(--_badge-electric-blue-solid) bg-(--_badge-electric-blue-solid) text-(--_badge-electric-blue-solid-foreground)" },
      { appearance: "solid", variant: "mint", className: "[a]:hover:bg-mint-60" },
      // Solid category / product badges: md is the original 24px pill
      { filled: true, size: "sm", className: "h-5 px-2 py-0 text-caption-1 [&>svg]:size-3!" },
      { filled: true, size: "md", className: "h-6 px-2.5 py-0 text-body-5 [&>svg]:size-3.5!" },
      { filled: true, size: "lg", className: "h-7 px-3 py-0 text-body-4 [&>svg]:size-4!" },
    ],
    defaultVariants: {
      variant: "gray",
      appearance: "tint",
      size: "md",
      filled: false,
    },
  }
)

/** Filled category badge colour (data-viz palette 1–35). Overrides `variant`; size comes from `size`. */
const badgeCategoryVariants = cva(
  "",
  {
    variants: {
      category: {
        1: "bg-category-01",
        2: "bg-category-02",
        3: "bg-category-03",
        4: "bg-category-04",
        5: "bg-category-05",
        6: "bg-category-06",
        7: "bg-category-07",
        8: "bg-category-08",
        9: "bg-category-09",
        10: "bg-category-10",
        11: "bg-category-11",
        12: "bg-category-12",
        13: "bg-category-13",
        14: "bg-category-14",
        15: "bg-category-15",
        16: "bg-category-16",
        17: "bg-category-17",
        18: "bg-category-18",
        19: "bg-category-19",
        20: "bg-category-20",
        21: "bg-category-21",
        22: "bg-category-22",
        23: "bg-category-23",
        24: "bg-category-24",
        25: "bg-category-25",
        26: "bg-category-26",
        27: "bg-category-27",
        28: "bg-category-28",
        29: "bg-category-29",
        30: "bg-category-30",
        31: "bg-category-31",
        32: "bg-category-32",
        33: "bg-category-33",
        34: "bg-category-34",
        35: "bg-category-35",
      },
    },
  }
)

/** Filled product badge colour (Product Badges token map). Overrides `variant`; size comes from `size`. */
const badgeProductVariants = cva(
  "",
  {
    variants: {
      product: {
        bpi: "bg-badge-product-bpi",
        "building-inspection": "bg-badge-product-building-inspection",
        "pest-inspection": "bg-badge-product-pest-inspection",
        "strata-report": "bg-badge-product-strata-report",
        "owners-corp-cert": "bg-badge-product-owners-corp-cert",
        "pool-inspection": "bg-badge-product-pool-inspection",
        "electrical-report": "bg-badge-product-electrical-report",
        "electrical-safety-cert": "bg-badge-product-electrical-safety-cert",
        "plumbing-report": "bg-badge-product-plumbing-report",
        "handover-inspection": "bg-badge-product-handover-inspection",
        valuations: "bg-badge-product-valuations",
        "asbestos-testing": "bg-badge-product-asbestos-testing",
        "dilapidation-report": "bg-badge-product-dilapidation-report",
        "depreciation-schedule": "bg-badge-product-depreciation-schedule",
        "owner-builder-report": "bg-badge-product-owner-builder-report",
        "minimum-standards": "bg-badge-product-minimum-standards",
        "new-building-inspection": "bg-badge-product-new-building-inspection",
        "home-energy-rating": "bg-badge-product-home-energy-rating",
        bmc: "bg-badge-product-bmc",
      },
    },
  }
)

type BadgeCategory = NonNullable<
  VariantProps<typeof badgeCategoryVariants>["category"]
>

type BadgeProduct = NonNullable<
  VariantProps<typeof badgeProductVariants>["product"]
>

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>
type StockBadgeVariant = NonNullable<
  VariantProps<typeof stockBadgeVariants>["variant"]
>

/** Our tones that are the stock key's look. The rest pass no stock variant. */
const STOCK_VARIANT: Partial<Record<BadgeVariant, StockBadgeVariant>> = {
  mint: "default",
  gray: "secondary",
  error: "destructive",
}

export type BadgeProps = useRender.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** Show a small BYBSpinner in the tone's text colour before the label (e.g. "Syncing"). */
    spinner?: boolean
    /** Icon element, e.g. `<Clock />` from Lucide. Sized by `size` (16px on `lg`). */
    icon?: React.ReactNode
    /** Which side of the label the icon sits on. Default `left`. */
    iconPosition?: "left" | "right"
    /** Filled category badge, 1–35. When set, overrides `variant`. */
    category?: BadgeCategory
    /** Filled product badge, e.g. "electrical-report". When set, overrides `variant` and `category`. */
    product?: BadgeProduct
  }

function Badge({
  className,
  variant = "gray",
  appearance = "tint",
  size = "md",
  spinner = false,
  icon,
  iconPosition = "left",
  category,
  product,
  children,
  ...props
}: BadgeProps) {
  const filled = Boolean(category || product)
  // Mark the icon so the badge trims its padding on that side.
  const iconNode = React.isValidElement<{ "data-icon"?: string; "aria-hidden"?: boolean }>(icon)
    ? React.cloneElement(icon, {
        "data-icon": iconPosition === "left" ? "inline-start" : "inline-end",
        "aria-hidden": true,
      })
    : icon
  const prefix =
    !filled && spinner ? (
      <BYBSpinner size="sm" color="current" label="Loading" />
    ) : iconPosition === "left" ? (
      iconNode
    ) : null
  const suffix = iconPosition === "right" ? iconNode : null

  return (
    <StockBadge
      variant={variant ? (STOCK_VARIANT[variant] ?? null) : null}
      data-variant={variant ?? undefined}
      data-appearance={appearance ?? undefined}
      data-size={size ?? undefined}
      className={cn(
        badgeVariants({ variant, appearance, size, filled }),
        product
          ? badgeProductVariants({ product })
          : category && badgeCategoryVariants({ category }),
        className
      )}
      {...props}
    >
      {prefix}
      {children}
      {suffix}
    </StockBadge>
  )
}

export {
  Badge,
  badgeVariants,
  badgeCategoryVariants,
  badgeProductVariants,
}
export type { BadgeCategory, BadgeProduct }
