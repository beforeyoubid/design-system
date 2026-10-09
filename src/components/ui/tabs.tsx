"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
        className
      )}
      {...props}
    />
  )
}

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
        pill: "h-7 rounded-full px-2.5 text-body-sm font-semibold tracking-button text-navy uppercase not-data-active:hover:bg-light-l1 data-active:text-white",
        line: "h-10 rounded-sm px-1 text-body-sm font-semibold tracking-button text-dark-60 uppercase hover:text-navy data-active:text-navy group-data-[orientation=horizontal]/tabs:after:absolute group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:-bottom-px group-data-[orientation=horizontal]/tabs:after:h-0.75 group-data-[orientation=horizontal]/tabs:after:rounded-t-full group-data-[orientation=horizontal]/tabs:after:bg-dark-15 group-data-[orientation=horizontal]/tabs:after:opacity-0 group-data-[orientation=horizontal]/tabs:after:transition-opacity group-data-[orientation=horizontal]/tabs:not-data-active:hover:after:opacity-100 group-data-[orientation=vertical]/tabs:h-9 group-data-[orientation=vertical]/tabs:px-4 group-data-[orientation=vertical]/tabs:not-data-active:hover:bg-light-l1",
        segmented: "h-8 flex-1 rounded-md px-3 text-body-sm font-semibold tracking-button text-navy uppercase data-active:text-white",
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

function TabsList({
  className,
  variant = "pill",
  children,
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  const resolved = variant ?? "pill"
  return (
    <TabsVariantContext.Provider value={resolved}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={resolved}
        className={cn(tabsListVariants({ variant: resolved }), className)}
        {...props}
      >
        {children}
        <TabsPrimitive.Indicator
          data-slot="tabs-indicator"
          className={cn(tabsIndicatorVariants({ variant: resolved }))}
        />
      </TabsPrimitive.List>
    </TabsVariantContext.Provider>
  )
}

function TabsTrigger({
  className,
  variant,
  ...props
}: TabsPrimitive.Tab.Props & VariantProps<typeof tabsTriggerVariants>) {
  const listVariant = React.useContext(TabsVariantContext)
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        tabsTriggerVariants({ variant: variant ?? listVariant }),
        className
      )}
      {...props}
    />
  )
}

const tabsContentVariants = cva("flex-1 text-body-sm outline-none data-ending-style:hidden data-[activation-direction=right]:animate-tab-in-right data-[activation-direction=left]:animate-tab-in-left motion-reduce:animate-none", {
  variants: {
    panel: {
      true: "flex flex-col gap-5 rounded-2xl border border-light-l3 bg-white p-6 shadow-xs",
      false: "",
    },
  },
  defaultVariants: {
    panel: false,
  },
})

function TabsContent({
  className,
  panel = false,
  ...props
}: TabsPrimitive.Panel.Props & VariantProps<typeof tabsContentVariants>) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      data-panel={panel ? "" : undefined}
      className={cn(tabsContentVariants({ panel }), className)}
      {...props}
    />
  )
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
  tabsTriggerVariants,
  tabsIndicatorVariants,
  tabsContentVariants,
}
