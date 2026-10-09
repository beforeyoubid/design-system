import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

import { Spinner } from "@/components/ui/spinner"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-caption-sm font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        // BYB status tones (Claude Design "Badge") — tinted fill + border + dot
        gray: "border-dark-15 bg-light-l2 font-semibold text-dark-75",
        mint: "border-mint-l1 bg-mint-l2 font-semibold text-mint-90 [a]:hover:bg-mint-l1",
        lime: "border-lime bg-lime font-semibold text-navy [a]:hover:bg-lime/80",
        success: "border-mint-l1 bg-mint-l3 font-semibold text-mint-75",
        error: "border-error-15 bg-error-l1 font-semibold text-error-75",
        warning: "border-warning-l1 bg-warning-l3 font-semibold text-warning-75",
      },
    },
    defaultVariants: {
      variant: "gray",
    },
  }
)

/** Status dot colour per tone, only rendered when `dot` is set. */
const badgeDotVariants = cva("size-1.5 shrink-0 rounded-full", {
  variants: {
    variant: {
      gray: "bg-dark-60",
      mint: "bg-mint-60",
      lime: "bg-navy",
      success: "bg-mint-60",
      error: "bg-error-75",
      warning: "bg-warning-30",
    },
  },
  defaultVariants: { variant: "gray" },
})

/** Filled category badge (data-viz palette 1–16). Overrides `variant` and `dot`. */
const badgeCategoryVariants = cva(
  "h-6 border-transparent px-2.5 text-body-sm font-medium text-white",
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
      },
    },
  }
)

type BadgeCategory = NonNullable<
  VariantProps<typeof badgeCategoryVariants>["category"]
>

export type BadgeProps = useRender.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** Show the coloured status dot before the label. */
    dot?: boolean
    /** Replace the dot with a 12px Spinner in the tone's text colour (e.g. "Syncing"). */
    spinner?: boolean
    /** Filled category badge, 1–16. When set, overrides `variant` and `dot`. */
    category?: BadgeCategory
  }

function Badge({
  className,
  variant = "gray",
  dot = false,
  spinner = false,
  category,
  render,
  children,
  ...props
}: BadgeProps) {
  const prefix = category
    ? null
    : spinner
      ? <Spinner size="sm" color="current" label="Loading" />
      : dot
        ? <span aria-hidden="true" className={badgeDotVariants({ variant })} />
        : null

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(
          badgeVariants({ variant }),
          category && badgeCategoryVariants({ category }),
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
    },
  })
}

export { Badge, badgeVariants, badgeDotVariants, badgeCategoryVariants }
