import * as React from "react"
import { IconTrendingUp } from "@tabler/icons-react"

import { cn } from "../lib/utils"

/* -------------------------------------------------------------------------- */
/* Shared chart helpers                                                       */
/* -------------------------------------------------------------------------- */

/** Default series palette: mint scale, light → dark. */
export const CHART_PALETTE = [
  "var(--mint-30)",
  "var(--mint-60)",
  "var(--mint-90)",
  "var(--mint-15)",
  "var(--mint-75)",
  "var(--mint-45)",
] as const

/** Shared Recharts axis tick style: dark-60, 12px. */
export const CHART_TICK = { fill: "var(--dark-60)", fontSize: 12 } as const

/** Shared Recharts grid stroke: light-l3. */
export const CHART_GRID_STROKE = "var(--light-l3)"

/** Shared tooltip surface: white, light-l3 border, rounded-md, shadow-md, caption text. */
export const CHART_TOOLTIP_CLASS =
  "rounded-md border-light-l3 bg-white text-caption text-dark-90 shadow-md"

export type ChartXValue = string | number | Date

/** Format a date-ish x value as e.g. "Apr 5". */
export function formatChartDate(value: unknown) {
  const date = new Date(value as string | number | Date)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString("en-AU", { month: "short", day: "numeric" })
}

/** Abbreviate a category label (e.g. "January" → "Jan"). */
export function formatChartCategory(value: unknown) {
  return typeof value === "string" ? value.slice(0, 3) : String(value)
}

/* -------------------------------------------------------------------------- */
/* ChartLegendList                                                            */
/* -------------------------------------------------------------------------- */

export interface ChartLegendItem {
  key: string
  label: React.ReactNode
  color: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface ChartLegendListProps extends React.ComponentProps<"ul"> {
  items: ChartLegendItem[]
  /** Render each item's `icon` instead of the colour swatch. */
  useIcons?: boolean
}

function ChartLegendList({
  items,
  useIcons = false,
  className,
  ...props
}: ChartLegendListProps) {
  return (
    <ul
      data-slot="chart-legend"
      className={cn(
        "flex flex-wrap items-center justify-center gap-4 text-caption text-dark-75",
        className
      )}
      {...props}
    >
      {items.map(({ key, label, color, icon: ItemIcon }) => (
        <li key={key} className="flex items-center gap-1.5">
          {useIcons && ItemIcon ? (
            <ItemIcon className="size-3.5 text-dark-75" />
          ) : (
            <svg
              aria-hidden
              viewBox="0 0 10 10"
              className="size-2.5 shrink-0"
            >
              <rect width="10" height="10" rx="2" fill={color} />
            </svg>
          )}
          {label}
        </li>
      ))}
    </ul>
  )
}

/* -------------------------------------------------------------------------- */
/* ChartFrame                                                                 */
/* -------------------------------------------------------------------------- */

export interface ChartFrameProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  title?: React.ReactNode
  description?: React.ReactNode
  /** Header slot on the right, e.g. a range Select or stat toggles. */
  action?: React.ReactNode
  /** Footer trend line (rendered with a trending-up icon). */
  trend?: React.ReactNode
  /** Footer caption, e.g. "January – June 2024". */
  caption?: React.ReactNode
}

/**
 * Card shell shared by `AreaChart` and `BarChart`: title / description header,
 * optional header action, the chart body, and a trend + caption footer.
 */
function ChartFrame({
  title,
  description,
  action,
  trend,
  caption,
  className,
  children,
  ...props
}: ChartFrameProps) {
  const hasHeader = Boolean(title || description || action)
  const hasFooter = Boolean(trend || caption)

  return (
    <div
      data-slot="chart-frame"
      className={cn(
        "flex flex-col gap-4 rounded-lg border border-light-l3 bg-white p-5 shadow-xs",
        className
      )}
      {...props}
    >
      {hasHeader && (
        <div className="flex flex-wrap items-start justify-between gap-3">
          {(title || description) && (
            <div className="flex min-w-0 flex-col gap-1">
              {title && (
                <div className="text-body-md font-semibold text-navy">
                  {title}
                </div>
              )}
              {description && (
                <div className="text-body-sm text-dark-60">{description}</div>
              )}
            </div>
          )}
          {action}
        </div>
      )}
      {children}
      {hasFooter && (
        <div className="flex flex-col gap-1">
          {trend && (
            <div className="flex items-center gap-2 text-body-sm font-medium text-navy">
              {trend}
              <IconTrendingUp className="size-4" />
            </div>
          )}
          {caption && (
            <div className="text-body-sm text-dark-60">{caption}</div>
          )}
        </div>
      )}
    </div>
  )
}

export { ChartFrame, ChartLegendList }
