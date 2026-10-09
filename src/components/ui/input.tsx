import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

/**
 * Shared BYB "control" chrome, used by Input, Textarea and InputGroup.
 * 40px tall, 12px radius, dark-15 hairline, mint focus ring, error-75 invalid.
 */
const inputControlBase =
  "w-full min-w-0 rounded-lg border border-dark-15 bg-white px-3 text-body-sm text-dark-100 transition outline-none placeholder:text-dark-60 focus-visible:border-mint-45 focus-visible:ring-3 focus-visible:ring-mint-45/30 aria-invalid:border-error-75 aria-invalid:focus-visible:border-error-75 aria-invalid:focus-visible:ring-error-75/20 disabled:cursor-not-allowed disabled:bg-light-l2 disabled:text-dark-45"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        inputControlBase,
        "h-10 py-1 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-body-sm file:font-medium file:text-dark-100",
        className
      )}
      {...props}
    />
  )
}

export { Input, inputControlBase }
