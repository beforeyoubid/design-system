"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-(--_switch-radius) transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-(--_switch-focus-ring) aria-invalid:ring-3 aria-invalid:ring-(--_switch-invalid-ring) data-[size=default]:h-5 data-[size=default]:w-9 data-[size=sm]:h-4 data-[size=sm]:w-7 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-(--_switch-checked) data-unchecked:bg-dark-30 dark:data-unchecked:bg-input/80 data-disabled:cursor-not-allowed data-disabled:opacity-(--_switch-disabled-opacity) p-(--_switch-padding) cursor-pointer",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-(--_switch-thumb-radius) bg-(--_switch-thumb) ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-4 rtl:group-data-[size=default]/switch:data-checked:-translate-x-4 group-data-[size=sm]/switch:data-checked:translate-x-3 rtl:group-data-[size=sm]/switch:data-checked:-translate-x-3 dark:data-checked:bg-primary-foreground dark:data-unchecked:bg-foreground shadow-(--_switch-thumb-shadow) data-unchecked:translate-x-0"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
