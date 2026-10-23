import * as React from "react"

import { cn } from "@/lib/utils"
import { inputControlBase } from "@/components/ui/input"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(inputControlBase, "flex min-h-auto resize-y py-2.5", className)}
      {...props}
    />
  )
}

export { Textarea }
