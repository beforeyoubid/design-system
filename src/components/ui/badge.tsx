import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-(--_badge-height) w-fit shrink-0 items-center justify-center gap-(--_badge-gap) overflow-hidden rounded-(--_badge-radius) border border-transparent px-(--_badge-padding-x) py-(--_badge-padding-y) text-caption-2 font-(--_badge-font-weight) whitespace-nowrap transition-all focus-visible:border-(--_badge-focus-border) focus-visible:ring-3 focus-visible:ring-(--_badge-focus-ring) has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 aria-invalid:border-(--_badge-invalid-border) aria-invalid:ring-(--_badge-invalid-ring) dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-(--_badge-default) text-(--_badge-default-foreground) [a]:hover:bg-mint-l1 border-(--_badge-default-border) font-(--_badge-default-font-weight)",
        secondary:
          "bg-(--_badge-secondary) text-(--_badge-secondary-foreground) border-(--_badge-secondary-border) font-(--_badge-secondary-font-weight)",
        destructive:
          "bg-(--_badge-destructive) text-(--_badge-destructive-foreground) dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 border-(--_badge-destructive-border) font-(--_badge-destructive-font-weight)",
        outline:
          "border-(--_badge-outline-border) bg-(--_badge-outline) text-(--_badge-outline-foreground) [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-(--_badge-ghost-hover) hover:text-(--_badge-ghost-hover-foreground) dark:hover:bg-muted/50",
        link: "text-(--_badge-link-foreground) underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
