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

const tabsListVariants = cva(
  "group/tabs-list relative inline-flex w-fit items-center group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
  {
    variants: {
      variant: {
        // BYB design-system pill switcher (Claude Design "Tabs")
        pill: "gap-0.5 self-start rounded-full border border-dark-15 bg-white p-0.75",
        // Underline tabs sitting on a full-width hairline track
        line: "w-full justify-start gap-6 border-b border-border group-data-[orientation=vertical]/tabs:w-fit group-data-[orientation=vertical]/tabs:items-stretch group-data-[orientation=vertical]/tabs:gap-0.5 group-data-[orientation=vertical]/tabs:border-b-0 group-data-[orientation=vertical]/tabs:border-s",
        // Segmented control — grey track, mint-45 thumb on the active segment
        segmented: "gap-1 rounded-lg bg-light-l2 p-1 group-data-[orientation=vertical]/tabs:items-stretch",
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
  "relative z-10 inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap transition-colors duration-300 ease-snappy outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-1 data-active:transition-[color] motion-reduce:data-active:transition-none data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:text-dark-45 motion-reduce:transition-none group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        pill: "h-7 rounded-full px-2.5 text-body-5 font-semibold tracking-button text-navy uppercase not-data-active:hover:text-dark-75 data-active:text-white",
        line: "h-10 rounded-sm px-1 text-body-5 font-semibold tracking-button text-dark-100 uppercase not-data-active:hover:text-dark-75 data-active:text-navy group-data-[orientation=horizontal]/tabs:after:absolute group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:-bottom-px group-data-[orientation=horizontal]/tabs:after:h-0.75 group-data-[orientation=horizontal]/tabs:after:rounded-t-full group-data-[orientation=horizontal]/tabs:after:bg-dark-15 group-data-[orientation=horizontal]/tabs:after:opacity-0 group-data-[orientation=horizontal]/tabs:after:transition-opacity group-data-[orientation=horizontal]/tabs:not-data-active:hover:after:opacity-100 group-data-[orientation=vertical]/tabs:h-9 group-data-[orientation=vertical]/tabs:px-4",
        segmented: "h-8 flex-1 rounded-md px-3 text-body-5 font-semibold tracking-button text-navy uppercase data-active:text-white",
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
        pill: "top-0 left-0 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) translate-y-(--active-tab-top) rounded-full bg-mint-60",
        line: "rounded-full bg-mint-60 group-data-[orientation=horizontal]/tabs:-bottom-px group-data-[orientation=horizontal]/tabs:left-0 group-data-[orientation=horizontal]/tabs:h-0.75 group-data-[orientation=horizontal]/tabs:w-(--active-tab-width) group-data-[orientation=horizontal]/tabs:translate-x-(--active-tab-left) group-data-[orientation=horizontal]/tabs:rounded-b-none group-data-[orientation=vertical]/tabs:-start-px group-data-[orientation=vertical]/tabs:top-0 group-data-[orientation=vertical]/tabs:h-(--active-tab-height) group-data-[orientation=vertical]/tabs:w-0.75 group-data-[orientation=vertical]/tabs:translate-y-(--active-tab-top) group-data-[orientation=vertical]/tabs:rounded-s-none",
        segmented: "top-0 left-0 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) translate-y-(--active-tab-top) rounded-md bg-mint-45 shadow-xs",
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
        // Undo the stock trigger's pill hover colour; segments don't change on hover.
        resolved === "segmented" && "not-data-active:hover:text-navy",
        className
      )}
      {...props}
    />
  )
}

const tabsContentVariants = cva("flex-1 text-body-5 outline-none data-ending-style:hidden data-[activation-direction=right]:animate-tab-in-right data-[activation-direction=left]:animate-tab-in-left motion-reduce:animate-none", {
  variants: {
    panel: {
      true: "flex flex-col gap-5 rounded-xl border border-light-l3 bg-white p-6 shadow-xs",
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
