"use client"

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
      className={cn(
        "group/tabs flex gap-(--_tabs-gap) data-[orientation=horizontal]:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center relative group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "bg-(--_tabs-list-default) gap-(--_tabs-list-default-gap) rounded-(--_tabs-list-default-radius) border-(--_tabs-list-default-border) p-(--_tabs-list-default-padding) self-start border",
        line: "gap-(--_tabs-list-line-gap) border-(--_tabs-list-line-border) w-full justify-start border-b group-data-[orientation=vertical]/tabs:w-fit group-data-[orientation=vertical]/tabs:items-stretch group-data-[orientation=vertical]/tabs:gap-(--_tabs-list-line-vertical-gap) group-data-[orientation=vertical]/tabs:border-b-0 group-data-[orientation=vertical]/tabs:border-s",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-(--_tabs-trigger-height) items-center justify-center gap-(--_tabs-trigger-gap) rounded-(--_tabs-trigger-radius) px-(--_tabs-trigger-padding-x) text-(length:--_tabs-trigger-font-size) font-(--_tabs-trigger-font-weight) whitespace-nowrap text-(--_tabs-trigger-foreground) transition-colors focus-visible:ring-2 focus-visible:ring-(--_tabs-trigger-focus-ring) dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-disabled:text-(--_tabs-trigger-disabled-foreground) data-active:text-(--_tabs-trigger-active-foreground) z-10 cursor-pointer duration-300 ease-snappy outline-none focus-visible:ring-offset-1 data-active:transition-[color] motion-reduce:data-active:transition-none data-disabled:pointer-events-none data-disabled:cursor-not-allowed motion-reduce:transition-none group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start uppercase leading-(--_tabs-trigger-leading) tracking-(--_tabs-trigger-tracking) not-data-active:hover:text-(--_tabs-trigger-hover-foreground)",
        "dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent",
        "dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground",
        "",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-(length:--_tabs-content-font-size) outline-none data-ending-style:hidden data-[activation-direction=right]:animate-tab-in-right data-[activation-direction=left]:animate-tab-in-left motion-reduce:animate-none leading-(--_tabs-content-leading)", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
