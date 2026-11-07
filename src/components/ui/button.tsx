import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-(--_button-radius) border-(length:--_button-border-width) font-(--_button-font-weight) whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-(--_button-focus-ring) active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none aria-invalid:ring-3 aria-invalid:ring-(--_button-invalid-ring) dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer uppercase tracking-button focus-visible:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed aria-busy:pointer-events-none aria-busy:cursor-progress aria-busy:opacity-70 disabled:opacity-(--_button-disabled-opacity) border-transparent bg-clip-padding",
  {
    variants: {
      variant: {
        default: "bg-(--_button-default) text-(--_button-default-foreground) hover:bg-(--_button-default-hover) shadow-(--_button-default-shadow) aria-expanded:bg-(--_button-default-open) disabled:bg-(--_button-default-disabled) disabled:text-(--_button-default-disabled-foreground) disabled:shadow-(--_button-default-disabled-shadow)",
        outline:
          "border-(--_button-outline-border) bg-(--_button-outline) hover:bg-(--_button-outline-hover) hover:text-(--_button-outline-hover-foreground) aria-expanded:bg-(--_button-outline-open) aria-expanded:text-(--_button-outline-open-foreground) text-(--_button-outline-foreground) hover:border-(--_button-outline-hover-border) aria-expanded:border-(--_button-outline-open-border) aria-expanded:ring-(--_button-outline-open-ring) disabled:border-(--_button-outline-disabled-border) disabled:bg-(--_button-outline-disabled) disabled:text-(--_button-outline-disabled-foreground) border aria-expanded:ring-3",
        secondary:
          "bg-(--_button-secondary) text-(--_button-secondary-foreground) hover:bg-(--_button-secondary-hover) aria-expanded:bg-(--_button-secondary-open) aria-expanded:text-(--_button-secondary-open-foreground) border-(--_button-secondary-border) hover:text-(--_button-secondary-hover-foreground) disabled:border-(--_button-secondary-disabled-border) disabled:bg-(--_button-secondary-disabled) disabled:text-(--_button-secondary-disabled-foreground) border",
        ghost:
          "hover:text-(--_button-ghost-hover-foreground) aria-expanded:text-(--_button-ghost-open-foreground) dark:hover:bg-muted/50 text-(--_button-ghost-foreground) disabled:text-(--_button-ghost-disabled-foreground)",
        destructive:
          "bg-(--_button-destructive) text-(--_button-destructive-foreground) hover:bg-(--_button-destructive-hover) focus-visible:ring-(--_button-destructive-focus-ring) dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40 shadow-(--_button-destructive-shadow) disabled:bg-(--_button-destructive-disabled) disabled:text-(--_button-destructive-disabled-foreground) disabled:shadow-(--_button-destructive-disabled-shadow)",
        link: "text-(--_button-link-foreground) underline-offset-4 hover:underline hover:text-(--_button-link-hover-foreground) disabled:text-(--_button-link-disabled-foreground)",
      },
      size: {
        default:
          "h-(--_button-md-height) gap-(--_button-md-gap) px-(--_button-md-padding-x) has-data-[icon=inline-end]:pe-(--_button-md-with-icon-padding-x) has-data-[icon=inline-start]:ps-(--_button-md-with-icon-padding-x) text-(length:--_button-md-font-size) leading-(--_button-md-leading)",
        xs: "h-(--_button-xs-height) gap-(--_button-xs-gap) px-(--_button-xs-padding-x) text-(length:--_button-xs-font-size) has-data-[icon=inline-end]:pe-(--_button-xs-with-icon-padding-x) has-data-[icon=inline-start]:ps-(--_button-xs-with-icon-padding-x) [&_svg:not([class*='size-'])]:size-3 rounded-(--_button-xs-radius) py-(--_button-xs-padding-y) leading-(--_button-xs-leading)",
        sm: "h-(--_button-sm-height) gap-(--_button-sm-gap) px-(--_button-sm-padding-x) has-data-[icon=inline-end]:pe-(--_button-sm-with-icon-padding-x) has-data-[icon=inline-start]:ps-(--_button-sm-with-icon-padding-x) rounded-(--_button-sm-radius) text-(length:--_button-sm-font-size) leading-(--_button-sm-leading)",
        lg: "h-(--_button-lg-height) gap-(--_button-lg-gap) px-(--_button-lg-padding-x) has-data-[icon=inline-end]:pe-(--_button-lg-with-icon-padding-x) has-data-[icon=inline-start]:ps-(--_button-lg-with-icon-padding-x) text-(length:--_button-lg-font-size) [&_svg:not([class*='size-'])]:size-4.5 leading-(--_button-lg-leading)",
        icon: "size-(--_button-icon-size) rounded-(--_button-icon-radius)",
        "icon-xs": "size-(--_button-icon-xs-size) [&_svg:not([class*='size-'])]:size-3 rounded-(--_button-icon-xs-radius)",
        "icon-sm": "size-(--_button-icon-sm-size) rounded-(--_button-icon-sm-radius)",
        "icon-lg": "size-(--_button-icon-lg-size) rounded-(--_button-icon-lg-radius) [&_svg:not([class*='size-'])]:size-4.5",
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
