"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cn } from "@/lib/utils"
import { IconCheck } from "@tabler/icons-react"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-(--_checkbox-size) shrink-0 items-center justify-center rounded-(--_checkbox-radius) border border-(--_checkbox-border) transition-[color,background-color,border-color,box-shadow] outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-(--_checkbox-focus-border) focus-visible:ring-3 focus-visible:ring-(--_checkbox-focus-ring) disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-(--_checkbox-invalid-border) aria-invalid:ring-3 aria-invalid:ring-(--_checkbox-invalid-ring) dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-(--_checkbox-checked-border) data-checked:bg-(--_checkbox-checked) dark:data-checked:bg-primary bg-(--_checkbox) text-(--_checkbox-foreground) cursor-pointer data-disabled:cursor-not-allowed aria-invalid:data-checked:border-mint-45 data-disabled:opacity-(--_checkbox-disabled-opacity)",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3 [&>svg]:stroke-3"
      >
        <IconCheck
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
