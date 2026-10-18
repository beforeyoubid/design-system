import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown } from "lucide-react"

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
const tableVariants = cva("group/table w-full caption-bottom text-body-5", {
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
        "border-t border-border bg-light-l1 text-body-5 font-medium text-navy [&>tr]:last:border-b-0",
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

type SortDirection = "asc" | "desc" | false

interface TableHeadProps extends React.ComponentProps<"th"> {
  /** Render the header as a sort button with an ascending / descending / unsorted icon. */
  sortable?: boolean
  /** Current sort for this column. `false` (default) shows the neutral icon. */
  sortDirection?: SortDirection
  /** Called when the header button is clicked. Cycle the direction in your state. */
  onSort?: () => void
}

const sortIcons = { asc: ArrowUp, desc: ArrowDown } as const

function TableHead({
  className,
  sortable = false,
  sortDirection = false,
  onSort,
  children,
  ...props
}: TableHeadProps) {
  const SortIcon = sortDirection ? sortIcons[sortDirection] : ArrowUpDown
  return (
    <th
      data-slot="table-head"
      aria-sort={
        sortable
          ? sortDirection === "asc"
            ? "ascending"
            : sortDirection === "desc"
              ? "descending"
              : "none"
          : undefined
      }
      className={cn(
        cellBase,
        "text-overline h-11 text-start text-dark-100",
        "group-data-[size=sm]/table:h-9 group-data-[size=lg]/table:h-12",
        className
      )}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          data-slot="table-sort-button"
          className="-mx-1 inline-flex cursor-pointer items-center gap-1 rounded-sm px-1 text-overline text-dark-100 uppercase outline-none hover:text-navy focus-visible:ring-2 focus-visible:ring-mint-45"
        >
          {children}
          <SortIcon
            aria-hidden
            className={cn("size-3.5 shrink-0 text-dark-60", !sortDirection && "opacity-70")}
          />
        </button>
      ) : (
        children
      )}
    </th>
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

interface TableExpandableRowProps extends React.ComponentProps<"tr"> {
  /** Content revealed in a full-width row underneath. */
  detail: React.ReactNode
  /** Number of columns in the table, including the Controls column. */
  colSpan: number
  /** Row actions shown in the Controls cell beside the chevron, e.g. a ⋮ menu. */
  controls?: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Accessible label for the toggle. Default "Show details". */
  toggleLabel?: string
}

/** Clicks on these inside a row do their own thing and don't expand the row. */
const INTERACTIVE =
  "button, a, input, select, textarea, label, [role=menuitem], [role=menuitemradio], [role=menuitemcheckbox], [data-row-toggle-ignore]"

/**
 * Row that drops down a detail row. The whole row is clickable; the expand
 * chevron (keyboard / screen-reader control) and any `controls` sit in a
 * trailing Controls cell, so add `<TableControlsHead />` as the last header.
 * Clicks on buttons, links, inputs or menu items inside the row don't toggle it.
 */
function TableExpandableRow({
  detail,
  colSpan,
  controls,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  toggleLabel = "Show details",
  className,
  children,
  onClick,
  ...props
}: TableExpandableRowProps) {
  const [openState, setOpenState] = React.useState(defaultOpen)
  const open = openProp ?? openState
  const detailId = React.useId()
  const toggle = () => {
    if (openProp === undefined) setOpenState(!open)
    onOpenChange?.(!open)
  }

  const chevron = (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={detailId}
      aria-label={toggleLabel}
      onClick={toggle}
      className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-dark-60 transition-colors outline-none hover:text-navy focus-visible:ring-2 focus-visible:ring-mint-45"
    >
      <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
    </button>
  )

  return (
    <>
      <TableRow
        data-slot="table-expandable-row"
        data-state={open ? "open" : "closed"}
        className={cn("cursor-pointer", open && "border-b-0 bg-mint-l4", className)}
        onClick={(event) => {
          onClick?.(event)
          const target = event.target as HTMLElement
          if (!event.defaultPrevented && !target.closest(INTERACTIVE)) toggle()
        }}
        {...props}
      >
        {children}
        <TableCell data-slot="table-controls-cell" className="w-px text-end whitespace-nowrap">
          <div className="flex items-center justify-end gap-1">
            {chevron}
            {controls}
          </div>
        </TableCell>
      </TableRow>
      {open && (
        <tr
          id={detailId}
          data-slot="table-detail-row"
          className="border-b border-border bg-mint-l4"
        >
          <td
            colSpan={colSpan}
            className="px-3 pt-1 pb-4 text-body-5 whitespace-normal text-dark-90"
          >
            {detail}
          </td>
        </tr>
      )}
    </>
  )
}

/** "Controls" header cell for the column holding `TableExpandableRow`'s chevron and actions. */
function TableControlsHead({ className, children = "Controls", ...props }: TableHeadProps) {
  return (
    <TableHead className={cn("w-px text-end", className)} {...props}>
      {children}
    </TableHead>
  )
}

interface TableViewMoreProps extends Omit<React.ComponentProps<"tr">, "onToggle"> {
  /** Number of columns the control spans. */
  colSpan: number
  /** Whether the extra rows are shown. */
  expanded: boolean
  onExpandedChange: (expanded: boolean) => void
  /** How many rows are hidden; shown as "View more (n)". */
  hiddenCount?: number
  moreLabel?: React.ReactNode
  lessLabel?: React.ReactNode
}

/**
 * "View more / View less" row placed after the visible rows. Slice your rows
 * by `expanded` yourself, e.g. `rows.slice(0, expanded ? undefined : 5)`.
 */
function TableViewMore({
  colSpan,
  expanded,
  onExpandedChange,
  hiddenCount,
  moreLabel = "View more",
  lessLabel = "View less",
  className,
  ...props
}: TableViewMoreProps) {
  return (
    <tr
      data-slot="table-view-more"
      className={cn("border-t border-border", className)}
      {...props}
    >
      <td colSpan={colSpan} className="px-3 py-2 text-center">
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => onExpandedChange(!expanded)}
          className="inline-flex cursor-pointer items-center gap-1 rounded-sm text-body-5 font-semibold text-mint-75 outline-none hover:text-mint-45 focus-visible:ring-2 focus-visible:ring-mint-45"
        >
          {expanded ? lessLabel : moreLabel}
          {!expanded && hiddenCount ? ` (${hiddenCount})` : null}
          <ChevronDown
            className={cn("size-4 transition-transform", expanded && "rotate-180")}
          />
        </button>
      </td>
    </tr>
  )
}

const captionClasses = "mt-3 text-center text-body-5 text-muted-foreground"

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
  TableExpandableRow,
  TableControlsHead,
  TableViewMore,
  tableVariants,
  tableContainerVariants,
}
export type { TableHeadProps, TableExpandableRowProps, TableViewMoreProps, SortDirection }
