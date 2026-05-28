import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-btn border border-transparent bg-clip-padding whitespace-nowrap uppercase tracking-btn transition-all outline-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-input/30 hover:bg-input/50 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/40 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/60",
        link: "text-primary underline-offset-4 hover:underline normal-case tracking-normal",
        // BYB brand variants (carried over from the legacy BYBButton)
        lime: "bg-lime text-navy hover:opacity-90",
        navy: "bg-navy text-white hover:opacity-90",
        "outline-navy":
          "border-navy bg-white text-navy hover:bg-navy hover:text-white",
      },
      size: {
        // Default = md. Sizes mirror the retired BYBButton (px-N py-N text-btn-N)
        // with sensibly inferred xs and icon-* variants on top.
        default:
          "h-11 gap-2 px-6 py-3 text-btn-md has-data-[icon=inline-end]:pe-5 has-data-[icon=inline-start]:ps-5",
        xs: "h-7 gap-1 px-3 py-1 text-xs rounded-md has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 px-4 py-2 text-btn-sm rounded-lg has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3",
        lg: "h-14 gap-2 px-8 py-4 text-btn-lg has-data-[icon=inline-end]:pe-7 has-data-[icon=inline-start]:ps-7 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-11 rounded-full",
        "icon-xs": "size-7 rounded-full [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-full",
        "icon-lg": "size-14 rounded-full [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
