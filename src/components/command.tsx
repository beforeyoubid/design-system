"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { CommandDialog as StockCommandDialog } from "@/components/ui/command"

export * from "@/components/ui/command"

/** Stock `CommandDialog` with Rey's dialog: 12px corners, no gap between the input and the list. */
function CommandDialog({ className, ...props }: React.ComponentProps<typeof StockCommandDialog>) {
  return (
    <StockCommandDialog
      className={cn("gap-0 rounded-(--_command-dialog-radius)!", className)}
      {...props}
    />
  )
}

export { CommandDialog }
