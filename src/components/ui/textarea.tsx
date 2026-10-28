import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full min-w-0 rounded-lg border border-dark-45 bg-white px-3 text-body-5 text-dark-100 transition outline-none placeholder:text-dark-90 focus-visible:border-mint-45 focus-visible:ring-3 focus-visible:ring-mint-45/30 aria-invalid:border-error-75 aria-invalid:focus-visible:border-error-75 aria-invalid:focus-visible:ring-error-75/20 disabled:cursor-not-allowed disabled:bg-light-l2 disabled:text-dark-45",
        "flex min-h-auto resize-y py-2.5",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
