import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { EmptyState, type EmptyStateProps } from "@/components/EmptyState"

/** Wrapper around the scrollable table; owns the outer frame for `card` / `bordered`. */
const tableContainerVariants = cva("relative w-full overflow-x-auto", {
  variants: {
    variant: {
      default: "",
      striped: "",
      card: "rounded-lg border border-border bg-card shadow-xs",
      bordered: "rounded-lg border border-border",
    },
  },
  defaultVariants: { variant: "default" },
})

/**
 * Variant + size are written to data attributes on <table>; rows and cells
 * read them via `group-data-*\/table`, so sub-components need no props.
 */
const tableVariants = cva("group/table w-full caption-bottom text-body-sm", {
  variants: {
    variant: { default: "", striped: "", card: "", bordered: "" },
    size: { sm: "", md: "", lg: "" },
  },
  defaultVariants: { variant: "default", size: "md" },
})

type TableVariant = NonNullable<VariantProps<typeof tableVariants>["variant"]>
type TableSize = NonNullable<VariantProps<typeof tableVariants>["size"]>

export interface TableProps
  extends React.ComponentProps<"table">,
    VariantProps<typeof tableVariants> {
  /** className for the scroll container that wraps the table. */
  containerClassName?: string
}

function Table({
  className,
  containerClassName,
  variant,
  size,
  children,
  ...props
}: TableProps) {
  const v: TableVariant = variant ?? "default"
  const s: TableSize = size ?? "md"

  // A <caption> is part of the table box, so it would render inside the
  // card/bordered frame. Lift it out: keep a screen-reader-only <caption> in
  // the table and show the visible text underneath the frame.
  let caption: React.ReactElement<React.ComponentProps<"caption">> | null = null
  const rest = React.Children.toArray(children).filter((child) => {
    if (React.isValidElement(child) && child.type === TableCaption) {
      caption = child as React.ReactElement<React.ComponentProps<"caption">>
      return false
    }
    return true
  })
  const captionProps = (caption as React.ReactElement<React.ComponentProps<"caption">> | null)?.props

  return (
    <>
      <div
        data-slot="table-container"
        className={cn(tableContainerVariants({ variant: v }), containerClassName)}
      >
        <table
          data-slot="table"
          data-variant={v}
          data-size={s}
          className={cn(tableVariants({ variant: v, size: s }), className)}
          {...props}
        >
          {captionProps && <caption className="sr-only">{captionProps.children}</caption>}
          {rest}
        </table>
      </div>
      {captionProps && (
        <p
          data-slot="table-caption"
          aria-hidden
          className={cn(captionClasses, captionProps.className)}
        >
          {captionProps.children}
        </p>
      )}
    </>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "[&_tr]:border-b [&_tr]:border-border [&_tr]:hover:bg-transparent",
        "group-data-[variant=bordered]/table:bg-light-l1 group-data-[variant=card]/table:bg-light-l1",
        className
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-border bg-light-l1 text-body-sm font-medium text-navy [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border transition-colors hover:bg-mint-l4 has-aria-expanded:bg-mint-l4 data-[state=selected]:bg-mint-l3",
        // striped: zebra rows instead of dividers
        "group-data-[variant=striped]/table:border-0 group-data-[variant=striped]/table:even:bg-light-l1 group-data-[variant=striped]/table:hover:bg-mint-l4",
        className
      )}
      {...props}
    />
  )
}

/** Cell padding + vertical grid lines shared by head and body cells. */
const cellBase =
  "px-3 align-middle whitespace-nowrap border-border group-data-[variant=bordered]/table:border-e group-data-[variant=bordered]/table:last:border-e-0 [&:has([role=checkbox])]:w-10 [&:has([role=checkbox])]:pe-0"

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        cellBase,
        "text-overline h-11 text-start text-muted-foreground",
        "group-data-[size=sm]/table:h-9 group-data-[size=lg]/table:h-12",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        cellBase,
        "py-3 text-dark-90",
        "group-data-[size=sm]/table:py-2 group-data-[size=lg]/table:py-4",
        className
      )}
      {...props}
    />
  )
}

export interface TableEmptyProps extends EmptyStateProps {
  /** Number of columns the empty state spans. Match your header column count. */
  colSpan: number
}

/**
 * Empty / no-results row. Renders the BYB `EmptyState` (icon, title,
 * description, actions, footer) across the full table width.
 */
function TableEmpty({ colSpan, className, ...props }: TableEmptyProps) {
  return (
    <TableRow data-slot="table-empty" className="hover:bg-transparent group-data-[variant=striped]/table:hover:bg-transparent">
      <TableCell colSpan={colSpan} className="p-0 whitespace-normal group-data-[variant=bordered]/table:border-e-0">
        <EmptyState className={cn("py-12", className)} {...props} />
      </TableCell>
    </TableRow>
  )
}

const captionClasses = "mt-3 text-center text-body-sm text-muted-foreground"

/**
 * Table caption. Inside `<Table>` it is shown below the table (and below the
 * frame for `card` / `bordered`), while a hidden `<caption>` keeps it
 * announced to screen readers.
 */
function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("caption-bottom", captionClasses, className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableEmpty,
  tableVariants,
  tableContainerVariants,
}
