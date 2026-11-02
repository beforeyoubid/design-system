import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-(--_input-height) w-full min-w-0 rounded-(--_input-radius) border border-(--_input-border) bg-(--_input-fill) px-(--_input-padding-x) py-(--_input-padding-y) text-body-5 transition outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-body-5 file:font-medium file:text-dark-100 placeholder:text-(--_input-placeholder) focus-visible:border-(--_input-focus-border) focus-visible:ring-3 focus-visible:ring-(--_input-focus-ring) disabled:cursor-not-allowed aria-invalid:border-(--_input-invalid-border) dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 text-(--_input-foreground) disabled:bg-(--_input-disabled) disabled:text-(--_input-disabled-foreground) aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
