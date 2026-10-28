import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-auto w-full resize-y rounded-(--_textarea-radius) border border-(--_textarea-border) bg-(--_textarea) px-(--_textarea-padding-x) py-(--_textarea-padding-y) text-body-5 transition outline-none placeholder:text-(--_textarea-placeholder) focus-visible:border-(--_textarea-focus-border) focus-visible:ring-3 focus-visible:ring-(--_textarea-focus-ring) disabled:cursor-not-allowed aria-invalid:border-(--_textarea-invalid-border) dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 text-(--_textarea-foreground) disabled:bg-(--_textarea-disabled) disabled:text-(--_textarea-disabled-foreground) min-w-0 aria-invalid:focus-visible:border-error-75 aria-invalid:focus-visible:ring-error-75/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
