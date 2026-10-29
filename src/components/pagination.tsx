import * as React from "react"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/button"

export * from "@/components/ui/pagination"

// The BYB look: a lime fill on the current page, plain text on the rest. Stock
// switches between Button variants inside PaginationLink, so the link and the
// two arrows that render it are ours. Levers: src/tokens/components/pagination.css.

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      variant={isActive ? "primary" : "ghost"}
      size={size}
      className={cn(
        "text-body-5 font-medium tracking-normal normal-case",
        isActive
          ? "bg-(--_pagination-link-active) text-(--_pagination-link-active-foreground) shadow-none hover:brightness-95"
          : "text-(--_pagination-link-foreground) hover:text-(--_pagination-link-hover-foreground)",
        className
      )}
      nativeButton={false}
      render={
        <a
          aria-current={isActive ? "page" : undefined}
          data-slot="pagination-link"
          data-active={isActive}
          {...props}
        />
      }
    />
  )
}

function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="md"
      className={cn("ps-2!", className)}
      {...props}
    >
      <IconChevronLeft data-icon="inline-start" className="rtl:rotate-180" />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  text = "Next",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="md"
      className={cn("pe-2!", className)}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <IconChevronRight data-icon="inline-end" className="rtl:rotate-180" />
    </PaginationLink>
  )
}

export { PaginationLink, PaginationNext, PaginationPrevious }
