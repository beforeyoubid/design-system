"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { IconCircleCheck } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import {
  TabsContent as TabsContentBase,
  TabsList as TabsListBase,
  TabsTrigger as TabsTriggerBase,
} from "@/components/ui/tabs"

export * from "@/components/ui/tabs"

// The pill list and trigger are the stock default (tabs-list / tabs-trigger
// component tokens) and the line list is stock `line`. Here: the segmented list, the line
// and segmented triggers, and the sliding indicator, each reading an @ours component token.
const tabsListVariants = cva(
  "",
  {
    variants: {
      variant: {
        // BYB design-system pill switcher (Claude Design "Tabs")
        pill: "",
        // Underline tabs sitting on a full-width hairline track
        line: "",
        // Segmented control — grey track, mint thumb on the active segment
        segmented: "gap-(--_tabs-list-segmented-gap) rounded-(--_tabs-list-segmented-radius) bg-(--_tabs-list-segmented) p-(--_tabs-list-segmented-padding) group-data-[orientation=vertical]/tabs:items-stretch",
        // Cards: one bordered card per tab (icon, dot, title, description); the active card turns mint with a tick
        card: "flex w-full flex-wrap items-stretch gap-(--_tabs-list-card-gap) group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:flex-nowrap",
      },
    },
    defaultVariants: {
      variant: "segmented",
    },
  }
)

type TabsVariant = NonNullable<VariantProps<typeof tabsListVariants>["variant"]>

const TabsVariantContext = React.createContext<TabsVariant>("segmented")

/** The round icon at the start of a card tab: grey with a navy icon, mint with a white icon when active. */
const tabsTriggerIconVariants = cva(
  "flex size-(--_tabs-trigger-icon-size) shrink-0 items-center justify-center rounded-full bg-(--_tabs-trigger-icon) text-(--_tabs-trigger-icon-foreground) transition-colors group-data-active/tabs-card:bg-(--_tabs-trigger-icon-active) group-data-active/tabs-card:text-(--_tabs-trigger-icon-active-foreground) [&_svg:not([class*='size-'])]:size-5"
)

// Triggers sit above the indicator (z-10). Only `color` transitions once a tab
// is active — a fading hover background would paint over the indicator as it
// slides in, which is what made switching feel clunky.
const tabsTriggerVariants = cva(
  "",
  {
    variants: {
      variant: {
        pill: "",
        line: "h-(--_tabs-trigger-line-height) rounded-(--_tabs-trigger-line-radius) px-(--_tabs-trigger-line-padding-x) text-(--_tabs-trigger-line-foreground) data-active:text-(--_tabs-trigger-line-active-foreground) group-data-[orientation=horizontal]/tabs:after:absolute group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:-bottom-px group-data-[orientation=horizontal]/tabs:after:h-0.75 group-data-[orientation=horizontal]/tabs:after:rounded-t-full group-data-[orientation=horizontal]/tabs:after:bg-(--_tabs-trigger-line-hover-indicator) group-data-[orientation=horizontal]/tabs:after:opacity-0 group-data-[orientation=horizontal]/tabs:after:transition-opacity group-data-[orientation=horizontal]/tabs:not-data-active:hover:after:opacity-100 group-data-[orientation=vertical]/tabs:h-9 group-data-[orientation=vertical]/tabs:px-4",
        segmented: "h-(--_tabs-trigger-segmented-height) flex-1 rounded-(--_tabs-trigger-segmented-radius) px-(--_tabs-trigger-segmented-padding-x) text-(--_tabs-trigger-segmented-foreground) data-active:text-(--_tabs-trigger-segmented-active-foreground)",
        card: "group/tabs-card h-auto justify-start gap-(--_tabs-trigger-card-gap) rounded-(--_tabs-trigger-card-radius) border border-(--_tabs-trigger-card-border) bg-(--_tabs-trigger-card) p-(--_tabs-trigger-card-padding) text-start tracking-normal whitespace-normal normal-case text-(--_tabs-trigger-title-foreground) transition-[background-color,border-color,box-shadow] not-data-active:hover:border-(--_tabs-trigger-card-hover-border) not-data-active:hover:text-(--_tabs-trigger-title-foreground) data-active:border-(--_tabs-trigger-card-active-border) data-active:bg-(--_tabs-trigger-card-active) data-active:text-(--_tabs-trigger-title-foreground) data-active:inset-ring-1 data-active:inset-ring-(--_tabs-trigger-card-active-border) data-disabled:opacity-50",
      },
    },
    defaultVariants: {
      variant: "segmented",
    },
  }
)

/**
 * Sliding highlight that moves to the active tab. Base UI measures the active
 * tab into CSS vars; we move with `translate` (GPU-composited) rather than
 * animating `left`/`top`.
 */
const tabsIndicatorVariants = cva(
  "pointer-events-none absolute z-0 transition-[translate,width,height] duration-300 ease-snappy motion-reduce:transition-none",
  {
    variants: {
      variant: {
        pill: "top-0 left-0 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) translate-y-(--active-tab-top) rounded-(--_tabs-indicator-radius) bg-(--_tabs-indicator)",
        line: "rounded-full bg-(--_tabs-indicator-line) group-data-[orientation=horizontal]/tabs:-bottom-px group-data-[orientation=horizontal]/tabs:left-0 group-data-[orientation=horizontal]/tabs:h-(--_tabs-indicator-line-height) group-data-[orientation=horizontal]/tabs:w-(--active-tab-width) group-data-[orientation=horizontal]/tabs:translate-x-(--active-tab-left) group-data-[orientation=horizontal]/tabs:rounded-b-none group-data-[orientation=vertical]/tabs:-start-px group-data-[orientation=vertical]/tabs:top-0 group-data-[orientation=vertical]/tabs:h-(--active-tab-height) group-data-[orientation=vertical]/tabs:w-(--_tabs-indicator-line-height) group-data-[orientation=vertical]/tabs:translate-y-(--active-tab-top) group-data-[orientation=vertical]/tabs:rounded-s-none",
        segmented: "top-0 left-0 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) translate-y-(--active-tab-top) rounded-(--_tabs-indicator-segmented-radius) bg-(--_tabs-indicator-segmented) shadow-xs",
        // Card tabs mark the active tab on the card itself; no indicator.
        card: "hidden",
      },
    },
    defaultVariants: { variant: "segmented" },
  }
)

/**
 * Stock `TabsList` plus the `segmented` (default), `pill` and `line` looks and
 * a sliding indicator under the active tab.
 */
function TabsList({
  className,
  variant = "segmented",
  children,
  ...props
}: Omit<React.ComponentProps<typeof TabsListBase>, "variant"> &
  VariantProps<typeof tabsListVariants>) {
  const resolved = variant ?? "segmented"
  return (
    <TabsVariantContext.Provider value={resolved}>
      <TabsListBase
        variant={resolved === "line" ? "line" : resolved === "card" ? null : "default"}
        data-variant={resolved}
        className={cn(
          tabsListVariants({ variant: resolved }),
          // Undo the stock list's pill-only border and alignment.
          resolved === "segmented" && "self-auto border-0",
          className
        )}
        {...props}
      >
        {children}
        {resolved !== "card" && (
          <TabsPrimitive.Indicator
            data-slot="tabs-indicator"
            className={cn(tabsIndicatorVariants({ variant: resolved }))}
          />
        )}
      </TabsListBase>
    </TabsVariantContext.Provider>
  )
}

interface TabsTriggerProps
  extends React.ComponentProps<typeof TabsTriggerBase>,
    VariantProps<typeof tabsTriggerVariants> {
  /** Card tabs: icon in the round tile at the start, e.g. `<IconBug />`. */
  icon?: React.ReactNode
  /** Card tabs: a mark before the title, e.g. `<ColorDot className="bg-badge-product-bpi" />`. */
  dot?: React.ReactNode
  /** Card tabs: the line under the title, e.g. "26 jobs this period". */
  description?: React.ReactNode
}

/**
 * Stock `TabsTrigger`, styled for its list's `variant` (or its own). Card tabs
 * lay out `icon`, `dot`, the children (the title) and `description`, with a
 * tick on the active card.
 */
function TabsTrigger({
  className,
  variant,
  icon,
  dot,
  description,
  children,
  ...props
}: TabsTriggerProps) {
  const listVariant = React.useContext(TabsVariantContext)
  const resolved = variant ?? listVariant
  const card = resolved === "card"
  return (
    <TabsTriggerBase
      className={cn(
        tabsTriggerVariants({ variant: resolved }),
        // Segments don't change colour on hover.
        resolved === "segmented" && "not-data-active:hover:text-(--_tabs-trigger-segmented-foreground)",
        resolved === "line" && "not-data-active:hover:text-(--_tabs-trigger-line-hover-foreground)",
        className
      )}
      {...props}
    >
      {card ? (
        <>
          {icon && (
            <span data-slot="tabs-trigger-icon" className={tabsTriggerIconVariants()}>
              {icon}
            </span>
          )}
          <span className="flex min-w-0 flex-1 flex-col gap-(--_tabs-trigger-title-gap)">
            <span
              data-slot="tabs-trigger-title"
              className="flex items-center gap-2 text-body-4 font-(--_tabs-trigger-title-font-weight)"
            >
              {dot}
              {children}
            </span>
            {description != null && (
              <span
                data-slot="tabs-trigger-description"
                className="text-body-5 font-normal text-(--_tabs-trigger-description-foreground)"
              >
                {description}
              </span>
            )}
          </span>
          <IconCircleCheck
            data-slot="tabs-trigger-check"
            aria-hidden
            className="invisible size-6 shrink-0 text-(--_tabs-trigger-check-foreground) group-data-active/tabs-card:visible"
          />
        </>
      ) : (
        children
      )}
    </TabsTriggerBase>
  )
}

const tabsContentVariants = cva("", {
  variants: {
    panel: {
      true: "flex flex-col gap-(--_tabs-content-panel-gap) rounded-(--_tabs-content-panel-radius) border border-(--_tabs-content-panel-border) bg-(--_tabs-content-panel) p-(--_tabs-content-panel-padding) shadow-xs",
      false: "",
    },
  },
  defaultVariants: {
    panel: false,
  },
})

/** Stock `TabsContent` plus `panel`: a white bordered card around the content. */
function TabsContent({
  className,
  panel = false,
  ...props
}: React.ComponentProps<typeof TabsContentBase> &
  VariantProps<typeof tabsContentVariants>) {
  return (
    <TabsContentBase
      data-panel={panel ? "" : undefined}
      className={cn(tabsContentVariants({ panel }), className)}
      {...props}
    />
  )
}

export {
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
  tabsTriggerVariants,
  tabsIndicatorVariants,
  tabsTriggerIconVariants,
  tabsContentVariants,
}
export type { TabsTriggerProps }
