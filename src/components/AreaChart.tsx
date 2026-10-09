"use client"

import * as React from "react"
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import {
  CHART_GRID_STROKE,
  CHART_PALETTE,
  CHART_TICK,
  CHART_TOOLTIP_CLASS,
  ChartFrame,
  ChartLegendList,
  formatChartCategory,
  formatChartDate,
  type ChartXValue,
} from "./ChartFrame"

export interface AreaChartSeries {
  /** Data key for this series' numeric values. */
  key: string
  label: React.ReactNode
  /** CSS colour. Prefer a token var, e.g. `var(--mint-60)`. Defaults to the mint palette. */
  color?: string
  /** Tabler icon component, shown when `legendIcons` is on. */
  icon?: React.ComponentType<{ className?: string }>
}

export interface AreaChartRange {
  value: string
  label: React.ReactNode
  /** Days to show; defaults to the leading number in `value` (e.g. "30d" → 30). */
  days?: number
}

export type AreaChartDatum = Record<string, ChartXValue | null | undefined>

export interface AreaChartProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  title?: React.ReactNode
  description?: React.ReactNode
  data: AreaChartDatum[]
  /** Row key holding the x value. Defaults to `"month"` (`"date"` when interactive). */
  xKey?: string
  /** Series in stacking order; the first renders at the bottom. */
  series: AreaChartSeries[]
  /** `natural` = smooth monotone curve (default), `linear`, or `step`. */
  curve?: "natural" | "linear" | "step"
  /** Stack series on top of each other. Default `true`. */
  stacked?: boolean
  /** Normalise the stack to 100%. */
  expand?: boolean
  /** Show a legend under the chart. */
  legend?: boolean
  /** Use each series' `icon` in the legend instead of a swatch. */
  legendIcons?: boolean
  /** Fill each area with a vertical gradient (80% → 10%). */
  gradient?: boolean
  /** Show 0 / mid / max labels on a left y-axis. */
  yAxis?: boolean
  /** Chart height in px. Default 200 (220 when interactive). */
  height?: number
  /** Footer trend line. */
  trend?: React.ReactNode
  /** Footer caption, e.g. "January – June 2024". */
  caption?: React.ReactNode
  /** Daily data with a date-range Select in the header (also turns the legend on). */
  interactive?: boolean
  ranges?: AreaChartRange[]
  defaultRange?: string
}

const CURVE_TYPE = {
  natural: "monotone",
  linear: "linear",
  step: "step",
} as const

const DEFAULT_RANGES: AreaChartRange[] = [
  { value: "90d", label: "Last 3 months" },
  { value: "30d", label: "Last 30 days" },
  { value: "7d", label: "Last 7 days" },
]

const DAY_MS = 24 * 60 * 60 * 1000

function rangeDays(range: AreaChartRange | undefined) {
  if (!range) return undefined
  if (range.days != null) return range.days
  const parsed = parseInt(range.value, 10)
  return Number.isNaN(parsed) ? undefined : parsed
}

function toTime(value: unknown) {
  return new Date(value as string | number | Date).getTime()
}

/** Round up to a "nice" axis maximum (1, 1.5, 2, 2.5 … × 10ⁿ). */
function niceMax(value: number) {
  if (value <= 0) return 1
  const step = Math.pow(10, Math.floor(Math.log10(value))) / 2
  return Math.ceil(value / step) * step
}

function AreaChart({
  title,
  description,
  data,
  xKey: xKeyProp,
  series,
  curve = "natural",
  stacked = true,
  expand = false,
  legend = false,
  legendIcons = false,
  gradient = false,
  yAxis = false,
  height: heightProp,
  trend,
  caption,
  interactive = false,
  ranges = DEFAULT_RANGES,
  defaultRange,
  className,
  ...props
}: AreaChartProps) {
  const xKey = xKeyProp ?? (interactive ? "date" : "month")
  const height = heightProp ?? (interactive ? 220 : 200)
  const gradientId = React.useId().replace(/:/g, "")
  const [range, setRange] = React.useState(
    defaultRange ?? ranges[0]?.value ?? ""
  )

  const resolvedSeries = React.useMemo(
    () =>
      series.map((s, i) => ({
        ...s,
        color: s.color ?? CHART_PALETTE[i % CHART_PALETTE.length],
      })),
    [series]
  )

  const config = React.useMemo(
    () =>
      Object.fromEntries(
        resolvedSeries.map((s) => [
          s.key,
          {
            label: s.label,
            color: s.color,
            ...(legendIcons && s.icon ? { icon: s.icon } : {}),
          },
        ])
      ) satisfies ChartConfig,
    [resolvedSeries, legendIcons]
  )

  // Interactive: normalise x to timestamps and filter to the selected range.
  const chartData = React.useMemo(() => {
    if (!interactive) return data
    const rows = data.map((row) => ({ ...row, [xKey]: toTime(row[xKey]) }))
    const days = rangeDays(ranges.find((r) => r.value === range))
    if (!days || !rows.length) return rows
    const end = Math.max(...rows.map((row) => row[xKey] as number))
    const start = end - (days - 1) * DAY_MS
    return rows.filter((row) => (row[xKey] as number) >= start)
  }, [data, interactive, xKey, range, ranges])

  const isStacked = stacked || expand

  const yTicks = React.useMemo(() => {
    if (!yAxis) return undefined
    if (expand) return [0, 0.5, 1]
    const totals = chartData.map((row) => {
      const values = resolvedSeries.map((s) => Number(row[s.key] ?? 0))
      return isStacked
        ? values.reduce((sum, v) => sum + v, 0)
        : Math.max(0, ...values)
    })
    const max = niceMax(Math.max(0, ...totals))
    return [0, max / 2, max]
  }, [yAxis, expand, chartData, resolvedSeries, isStacked])

  const xFormatter = interactive ? formatChartDate : formatChartCategory
  const showLegend = legend || legendIcons || interactive

  const rangeSelect = interactive ? (
    <Select
      value={range}
      onValueChange={(value) => value && setRange(value)}
      items={ranges.map((r) => ({ value: r.value, label: r.label }))}
    >
      <SelectTrigger size="sm" aria-label="Select a range">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ranges.map((r) => (
          <SelectItem key={r.value} value={r.value}>
            {r.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ) : undefined

  return (
    <ChartFrame
      data-slot="area-chart"
      title={title}
      description={description}
      action={rangeSelect}
      trend={trend}
      caption={caption}
      className={className}
      {...props}
    >
      <ChartContainer
        config={config}
        className="aspect-auto w-full"
        // Recharts needs a concrete pixel height for its responsive container.
        style={{ height }}
      >
        <RechartsAreaChart
          accessibilityLayer
          data={chartData}
          stackOffset={expand ? "expand" : undefined}
          margin={{ left: yAxis ? 0 : 12, right: 12, top: 4 }}
        >
          {gradient && (
            <defs>
              {resolvedSeries.map((s) => (
                <linearGradient
                  key={s.key}
                  id={`${gradientId}-${s.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={`var(--color-${s.key})`}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-${s.key})`}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
          )}
          <CartesianGrid vertical={false} stroke={CHART_GRID_STROKE} />
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={interactive ? 32 : undefined}
            tick={CHART_TICK}
            tickFormatter={xFormatter}
          />
          {yAxis && (
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={40}
              tick={CHART_TICK}
              ticks={yTicks}
              domain={yTicks ? [0, yTicks[yTicks.length - 1]] : undefined}
              tickFormatter={(value: number) =>
                expand
                  ? `${Math.round(value * 100)}%`
                  : value.toLocaleString()
              }
            />
          )}
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                className={CHART_TOOLTIP_CLASS}
                indicator="dot"
                labelFormatter={(_, payload) =>
                  xFormatter(payload?.[0]?.payload?.[xKey])
                }
              />
            }
          />
          {resolvedSeries.map((s) => (
            <Area
              key={s.key}
              dataKey={s.key}
              name={s.key}
              type={CURVE_TYPE[curve]}
              stackId={isStacked ? "a" : undefined}
              stroke={`var(--color-${s.key})`}
              strokeWidth={1.5}
              fill={
                gradient
                  ? `url(#${gradientId}-${s.key})`
                  : `var(--color-${s.key})`
              }
              fillOpacity={gradient ? 1 : 0.4}
            />
          ))}
        </RechartsAreaChart>
      </ChartContainer>
      {showLegend && (
        <ChartLegendList
          items={resolvedSeries}
          useIcons={legendIcons}
        />
      )}
    </ChartFrame>
  )
}

export { AreaChart }
