import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cn } from "@/lib/utils"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-(--_radio-group-gap)", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-(--_radio-group-item-size) shrink-0 rounded-(--_radio-group-item-radius) border border-(--_radio-group-item-border) outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-(--_radio-group-item-focus-border) focus-visible:ring-3 focus-visible:ring-(--_radio-group-item-focus-ring) disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-(--_radio-group-item-invalid-border) aria-invalid:ring-3 aria-invalid:ring-(--_radio-group-item-invalid-ring) dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-(--_radio-group-item-checked-border) dark:data-checked:bg-primary bg-(--_radio-group-item) cursor-pointer data-disabled:cursor-not-allowed items-center justify-center transition-[border-color,box-shadow] [&_[data-slot=radio-group-indicator]>span]:size-2 aria-invalid:data-checked:border-mint-45 data-disabled:opacity-(--_radio-group-item-disabled-opacity)",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center [&>span]:bg-(--_radio-group-indicator)"
      >
        <span className="absolute top-1/2 start-1/2 size-2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
