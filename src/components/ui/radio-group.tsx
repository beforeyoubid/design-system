"use client"

import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-2.5", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square cursor-pointer data-disabled:cursor-not-allowed shrink-0 items-center justify-center rounded-full border border-dark-45 bg-white transition-[border-color,box-shadow] outline-none after:absolute after:-inset-x-3 after:-inset-y-2",
        "size-4 [&_[data-slot=radio-group-dot]]:size-2",
        "focus-visible:border-mint-45 focus-visible:ring-3 focus-visible:ring-mint-45/30",
        "data-checked:border-mint-45",
        "aria-invalid:border-error-75 aria-invalid:ring-3 aria-invalid:ring-error-75/20 aria-invalid:data-checked:border-mint-45",
        "disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        <span
          data-slot="radio-group-dot"
          className="rounded-full bg-mint-45"
        />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
