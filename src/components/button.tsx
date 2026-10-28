import * as React from "react"
import type { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  Button as StockButton,
  buttonVariants as stockButtonVariants,
} from "@/components/ui/button"
import { BYBSpinner } from "@/components/BYBSpinner"

export * from "@/components/ui/button"

type ClassValue = Parameters<typeof cn>[number]

type StockVariant = NonNullable<
  VariantProps<typeof stockButtonVariants>["variant"]
>
type StockSize = NonNullable<VariantProps<typeof stockButtonVariants>["size"]>

/**
 * BYB variants with no stock key. They render with no stock variant classes
 * (variant `null`) and add their own colours here.
 *
 * `outline` is the 1.x neutral outline. The stock `outline` key carries the
 * tertiary look, so our `tertiary` maps to it and our `outline` lives here.
 */
const bybButtonVariants = cva("", {
  variants: {
    variant: {
      outline:
        "border border-border bg-border/30 hover:bg-border/50 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground disabled:bg-light-l2 disabled:text-dark-45",
      lime: "bg-lime text-navy hover:opacity-90 disabled:bg-light-l2 disabled:text-dark-45",
      navy: "bg-navy text-white hover:opacity-90 disabled:bg-light-l2 disabled:text-dark-45",
    },
  },
})

type BybOnlyVariant = NonNullable<
  VariantProps<typeof bybButtonVariants>["variant"]
>

type ButtonVariant =
  | Exclude<StockVariant, "outline">
  | BybOnlyVariant
  | "primary"
  | "tertiary"
  | "outline-navy"

/** sm 36px · md 40px · lg 44px. `md` is the stock `default` size. */
type ButtonSize = StockSize | "md"

/** Our variant names that are aliases of a stock key. */
const STOCK_VARIANT: Partial<Record<ButtonVariant, StockVariant>> = {
  primary: "default",
  default: "default",
  tertiary: "outline",
  "outline-navy": "secondary",
  secondary: "secondary",
  ghost: "ghost",
  destructive: "destructive",
  link: "link",
}

function isBybOnlyVariant(variant: ButtonVariant): variant is BybOnlyVariant {
  return variant === "outline" || variant === "lime" || variant === "navy"
}

/** Resolve a BYB variant/size to the stock key plus any classes we add on top. */
function resolveButtonVariant(
  variant: ButtonVariant | null | undefined,
  size: ButtonSize | null | undefined
): {
  variant: StockVariant | null | undefined
  size: StockSize | null | undefined
  className: string | undefined
} {
  const stockSize = size === "md" ? "default" : size
  if (variant == null) return { variant, size: stockSize, className: undefined }
  if (isBybOnlyVariant(variant)) {
    return {
      variant: null,
      size: stockSize,
      className: bybButtonVariants({ variant }),
    }
  }
  return { variant: STOCK_VARIANT[variant], size: stockSize, className: undefined }
}

type ButtonVariantsProps = {
  variant?: ButtonVariant | null
  size?: ButtonSize | null
  className?: ClassValue
  class?: ClassValue
}

/** Button classes for any BYB variant / size, e.g. to style a `<Link>` as a button. */
function buttonVariants({
  variant = "primary",
  size = "md",
  className,
  class: classProp,
}: ButtonVariantsProps = {}) {
  const resolved = resolveButtonVariant(variant, size)
  return cn(
    stockButtonVariants({ variant: resolved.variant, size: resolved.size }),
    resolved.className,
    className,
    classProp
  )
}

export interface ButtonProps extends ButtonPrimitive.Props {
  variant?: ButtonVariant | null
  size?: ButtonSize | null
  /** Shows a BYBSpinner before the label, dims to 70% and blocks clicks (aria-busy). */
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
  const resolved = resolveButtonVariant(variant, size)
  const iconNode = icon && !loading && (
    <span
      data-icon={iconPosition === "left" ? "inline-start" : "inline-end"}
      className="inline-flex shrink-0"
    >
      {icon}
    </span>
  )
  return (
    <StockButton
      variant={resolved.variant}
      size={resolved.size}
      aria-busy={loading || undefined}
      onClick={loading ? undefined : onClick}
      className={cn(resolved.className, className)}
      {...props}
    >
      {loading && (
        <BYBSpinner
          color="current"
          size={size === "sm" || size === "xs" ? "md" : "lg"}
          label="Loading"
        />
      )}
      {iconPosition === "left" && iconNode}
      {children}
      {iconPosition === "right" && iconNode}
    </StockButton>
  )
}

export { Button, buttonVariants }
