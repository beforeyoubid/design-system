"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

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
      },
    },
    defaultVariants: {
      variant: "pill",
    },
  }
)

type TabsVariant = NonNullable<VariantProps<typeof tabsListVariants>["variant"]>

const TabsVariantContext = React.createContext<TabsVariant>("pill")

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
      },
    },
    defaultVariants: {
      variant: "pill",
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
      },
    },
    defaultVariants: { variant: "pill" },
  }
)

/**
 * Stock `TabsList` plus the `pill` (default), `line` and `segmented` looks and
 * a sliding indicator under the active tab.
 */
function TabsList({
  className,
  variant = "pill",
  children,
  ...props
}: Omit<React.ComponentProps<typeof TabsListBase>, "variant"> &
  VariantProps<typeof tabsListVariants>) {
  const resolved = variant ?? "pill"
  return (
    <TabsVariantContext.Provider value={resolved}>
      <TabsListBase
        variant={resolved === "line" ? "line" : "default"}
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
        <TabsPrimitive.Indicator
          data-slot="tabs-indicator"
          className={cn(tabsIndicatorVariants({ variant: resolved }))}
        />
      </TabsListBase>
    </TabsVariantContext.Provider>
  )
}

/** Stock `TabsTrigger`, styled for its list's `variant` (or its own). */
function TabsTrigger({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof TabsTriggerBase> &
  VariantProps<typeof tabsTriggerVariants>) {
  const listVariant = React.useContext(TabsVariantContext)
  const resolved = variant ?? listVariant
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
    />
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
  tabsContentVariants,
}
