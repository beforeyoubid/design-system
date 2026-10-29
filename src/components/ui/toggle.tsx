import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-(--_toggle-gap) rounded-(--_toggle-radius) text-body-5 font-(--_toggle-font-weight) whitespace-nowrap transition-colors outline-none hover:bg-(--_toggle-hover) hover:text-(--_toggle-hover-foreground) focus-visible:border-(--_toggle-focus-border) focus-visible:ring-3 focus-visible:ring-(--_toggle-focus-ring) disabled:pointer-events-none disabled:opacity-(--_toggle-disabled-opacity) aria-invalid:border-(--_toggle-invalid-border) aria-invalid:ring-(--_toggle-invalid-ring) aria-pressed:bg-(--_toggle-pressed) dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer aria-pressed:text-(--_toggle-pressed-foreground)",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-(--_toggle-outline-border) bg-transparent hover:bg-(--_toggle-outline-hover)",
      },
      size: {
        default:
          "h-(--_toggle-md-height) min-w-9 px-(--_toggle-md-padding-x) has-data-[icon=inline-end]:pe-(--_toggle-md-with-icon-padding-x) has-data-[icon=inline-start]:ps-(--_toggle-md-with-icon-padding-x)",
        sm: "h-(--_toggle-sm-height) min-w-8 px-(--_toggle-sm-padding-x) has-data-[icon=inline-end]:pe-(--_toggle-sm-with-icon-padding-x) has-data-[icon=inline-start]:ps-(--_toggle-sm-with-icon-padding-x)",
        lg: "h-(--_toggle-lg-height) min-w-10 px-(--_toggle-lg-padding-x) has-data-[icon=inline-end]:pe-(--_toggle-lg-with-icon-padding-x) has-data-[icon=inline-start]:ps-(--_toggle-lg-with-icon-padding-x)",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
