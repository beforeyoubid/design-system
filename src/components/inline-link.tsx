import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * A text link styled like the text (link) button: semibold, UPPERCASE with
 * button tracking, underlined on hover. Sits inside or after a sentence.
 */
const inlineLinkVariants = cva(
  "inline-flex cursor-pointer items-center gap-(--_inline-link-gap) rounded-(--_inline-link-radius) font-(--_inline-link-font-weight) underline-offset-4 transition-colors outline-none hover:underline focus-visible:ring-2 focus-visible:ring-(--_inline-link-focus-ring) aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:text-(--_inline-link-disabled-foreground) [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "text-(--_inline-link-foreground) hover:text-(--_inline-link-hover-foreground)",
        navy: "text-(--_inline-link-navy-foreground) hover:text-(--_inline-link-navy-hover-foreground)",
        destructive:
          "text-(--_inline-link-destructive-foreground) hover:text-(--_inline-link-destructive-hover-foreground)",
        white:
          "text-(--_inline-link-white-foreground) hover:text-(--_inline-link-white-hover-foreground)",
      },
      size: {
        // Text sizes follow the Button: md matches a md button, lg a lg button.
        sm: "text-overline [&_svg:not([class*='size-'])]:size-3.5",
        md: "text-button-sm [&_svg:not([class*='size-'])]:size-4",
        lg: "text-button-md [&_svg:not([class*='size-'])]:size-4.5",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  }
)

type InlineLinkProps = useRender.ComponentProps<"a"> &
  VariantProps<typeof inlineLinkVariants> & {
    /** Greys the link out and stops clicks (sets `aria-disabled`). */
    disabled?: boolean
  }

/**
 * Renders an `<a>`. Pass `render={<Link href="…" />}` to use a router link.
 * Icons go in as children, before or after the text.
 */
function InlineLink({
  className,
  variant = "default",
  size = "md",
  disabled = false,
  render,
  ...props
}: InlineLinkProps) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(inlineLinkVariants({ variant, size }), className),
        "aria-disabled": disabled || undefined,
        tabIndex: disabled ? -1 : undefined,
      },
      props
    ),
    render,
    state: { slot: "inline-link", variant, size },
  })
}

export { InlineLink, inlineLinkVariants }
export type { InlineLinkProps }
