import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

import { Spinner } from "@/components/ui/spinner"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        // BYB status tones (Claude Design "Badge") — tinted fill + border
        gray: "border-dark-15 bg-light-l2 font-semibold text-dark-75",
        mint: "border-mint-l1 bg-mint-l2 font-semibold text-mint-90 [a]:hover:bg-mint-l1",
        lime: "border-lime bg-lime font-semibold text-navy [a]:hover:bg-lime/80",
        success: "border-mint-l1 bg-mint-l3 font-semibold text-mint-75",
        error: "border-error-15 bg-error-l1 font-semibold text-error-75",
        warning: "border-warning-l1 bg-warning-l3 font-semibold text-warning-75",
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
      // Tinted status badges: md is the original 20px pill
      { filled: false, size: "sm", className: "h-4 px-1.5 text-caption-2 [&>svg]:size-2.5!" },
      { filled: false, size: "md", className: "h-5 px-2 py-0.5 text-caption-2 [&>svg]:size-3!" },
      { filled: false, size: "lg", className: "h-6 px-2.5 text-caption-1 [&>svg]:size-3.5!" },
      // Solid category / product badges: md is the original 24px pill
      { filled: true, size: "sm", className: "h-5 px-2 text-caption-1 [&>svg]:size-3!" },
      { filled: true, size: "md", className: "h-6 px-2.5 text-body-5 [&>svg]:size-3.5!" },
      { filled: true, size: "lg", className: "h-7 px-3 text-body-4 [&>svg]:size-4!" },
    ],
    defaultVariants: {
      variant: "gray",
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

export type BadgeProps = useRender.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** Show a small Spinner in the tone's text colour before the label (e.g. "Syncing"). */
    spinner?: boolean
    /** Filled category badge, 1–35. When set, overrides `variant`. */
    category?: BadgeCategory
    /** Filled product badge, e.g. "electrical-report". When set, overrides `variant` and `category`. */
    product?: BadgeProduct
  }

function Badge({
  className,
  variant = "gray",
  size = "md",
  spinner = false,
  category,
  product,
  render,
  children,
  ...props
}: BadgeProps) {
  const filled = Boolean(category || product)
  const prefix =
    !filled && spinner ? (
      <Spinner size="sm" color="current" label="Loading" />
    ) : null

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(
          badgeVariants({ variant, size, filled }),
          product
            ? badgeProductVariants({ product })
            : category && badgeCategoryVariants({ category }),
          className
        ),
        children: (
          <>
            {prefix}
            {children}
          </>
        ),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
      size,
    },
  })
}

export {
  Badge,
  badgeVariants,
  badgeCategoryVariants,
  badgeProductVariants,
}
export type { BadgeCategory, BadgeProduct }
