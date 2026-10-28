"use client"

import * as React from "react"

import { Drawer as StockDrawer } from "@/components/ui/drawer"

export * from "@/components/ui/drawer"

/** Stock `Drawer`; a bottom drawer shows its drag handle by default, as in Rey's design. */
function Drawer({
  swipeDirection = "down",
  showSwipeHandle = swipeDirection === "down",
  ...props
}: React.ComponentProps<typeof StockDrawer>) {
  return (
    <StockDrawer
      swipeDirection={swipeDirection}
      showSwipeHandle={showSwipeHandle}
      {...props}
    />
  )
}

export { Drawer }
