import * as React from "react"
import { cn } from "@/lib/utils"
import { IconSelector } from "@tabler/icons-react"

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default"
}

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "group/native-select relative w-full",
        className
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className="h-(--_native-select-height) w-full min-w-0 appearance-none rounded-(--_native-select-radius) border border-(--_native-select-border) bg-(--_native-select) py-(--_native-select-padding-y) pe-8 ps-3 transition-colors outline-none select-none selection:bg-primary selection:text-primary-foreground placeholder:text-(--_native-select-placeholder) focus-visible:border-(--_native-select-focus-border) focus-visible:ring-[3px] focus-visible:ring-(--_native-select-focus-ring) disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-(--_native-select-invalid-border) data-[size=sm]:h-(--_native-select-sm-height) dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 text-body-5 text-(--_native-select-foreground) aria-invalid:focus-visible:ring-(--_native-select-invalid-ring) disabled:bg-(--_native-select-disabled) disabled:text-(--_native-select-disabled-foreground)"
        {...props}
      />
      <IconSelector className="pointer-events-none absolute top-1/2 end-3.5 size-(--_native-select-icon-size) -translate-y-1/2 text-(--_native-select-icon-foreground) select-none group-has-[select:disabled]/native-select:text-(--_native-select-icon-disabled-foreground)" aria-hidden="true" data-slot="native-select-icon" />
    </div>
  )
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-(--_native-select-option) text-(--_native-select-option-foreground)", className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-(--_native-select-optgroup) text-(--_native-select-optgroup-foreground)", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
