import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

import { Spinner } from "@/components/ui/spinner"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-2xl border-0 font-semibold whitespace-nowrap uppercase tracking-button transition-all outline-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed aria-busy:pointer-events-none aria-busy:cursor-progress aria-busy:opacity-70 aria-invalid:ring-3 aria-invalid:ring-error-75/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // BYB design-system variants (Claude Design "Button")
        primary:
          "bg-lime text-navy shadow-xs hover:brightness-95 disabled:bg-light-l2 disabled:text-dark-45 disabled:shadow-none",
        secondary:
          "bg-mint-75 text-white shadow-xs hover:bg-mint-30 aria-expanded:bg-mint-30 disabled:bg-light-l2 disabled:text-dark-45 disabled:shadow-none",
        tertiary:
          "border border-dark-15 bg-white text-dark-90 hover:border-dark-45 hover:bg-dark-45 hover:text-white aria-expanded:border-mint-45 aria-expanded:bg-mint-l4 aria-expanded:text-mint-75 aria-expanded:ring-3 aria-expanded:ring-mint-45/30 disabled:border-light-l2 disabled:bg-light-l2 disabled:text-dark-45",
        ghost:
          "text-mint-75 hover:text-mint-45 aria-expanded:text-mint-45 disabled:text-dark-45",
        destructive:
          "bg-error-75 text-white shadow-xs hover:bg-error-45 focus-visible:ring-error-75 disabled:bg-light-l2 disabled:text-dark-45 disabled:shadow-none",
        link: "text-mint-75 underline-offset-4 hover:text-mint-45 hover:underline disabled:text-dark-45",
      },
      size: {
        // sm 36px · md 40px · lg 44px. Radius: sm 12px, md/lg 16px.
        sm: "h-9 gap-2 rounded-lg px-3.5 text-button-sm has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3",
        md: "h-10 gap-3 px-4 text-button-sm has-data-[icon=inline-end]:pe-3.5 has-data-[icon=inline-start]:ps-3.5",
        lg: "h-11 gap-3 px-4.5 text-button-md has-data-[icon=inline-end]:pe-4 has-data-[icon=inline-start]:ps-4 [&_svg:not([class*='size-'])]:size-4.5",
        xs: "h-7 gap-1 rounded-md px-3 py-1 text-caption-sm has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2 [&_svg:not([class*='size-'])]:size-3",
        icon: "size-10 rounded-full",
        "icon-xs": "size-7 rounded-full [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-full",
        "icon-lg": "size-11 rounded-full [&_svg:not([class*='size-'])]:size-4.5",
      },
    },
    compoundVariants: [
      // Links sit inline with text — no button padding.
      { variant: "link", className: "px-1" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  /** Shows a Spinner before the label, dims to 70% and blocks clicks (aria-busy). */
  loading?: boolean
  /** Icon element, e.g. `<IconArrowUpRight />`. Hidden while `loading`. */
  icon?: React.ReactNode
  /** Which side of the label the `icon` sits on. Default `right`. */
  iconPosition?: "left" | "right"
}

function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "right",
  onClick,
  children,
  ...props
}: ButtonProps) {
  const iconNode = icon && !loading && (
    <span
      data-icon={iconPosition === "left" ? "inline-start" : "inline-end"}
      className="inline-flex shrink-0"
    >
      {icon}
    </span>
  )
  return (
    <ButtonPrimitive
      data-slot="button"
      aria-busy={loading || undefined}
      onClick={loading ? undefined : onClick}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {loading && (
        <Spinner
          color="current"
          size={size === "sm" || size === "xs" ? "md" : "lg"}
          label="Loading"
        />
      )}
      {iconPosition === "left" && iconNode}
      {children}
      {iconPosition === "right" && iconNode}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
