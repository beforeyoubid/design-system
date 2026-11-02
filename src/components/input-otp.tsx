"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { InputOTP as StockInputOTP } from "@/components/ui/input-otp"

export * from "@/components/ui/input-otp"

// The BYB slots style themselves from the container's state (invalid, disabled)
// through the group/input-otp name, and the container stays at full opacity
// when disabled: the slots turn grey instead. Stock's container class isn't a
// data-slot class string, so it's set here.
function InputOTP({
  containerClassName,
  ...props
}: React.ComponentProps<typeof StockInputOTP>) {
  return (
    <StockInputOTP
      containerClassName={cn(
        "group/input-otp gap-1 has-disabled:cursor-not-allowed has-disabled:opacity-100",
        containerClassName
      )}
      {...props}
    />
  )
}

export { InputOTP }
