"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "../lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./ui/chart"
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

export interface BarChartSeries {
  /** Data key for this series' numeric values. */
  key: string
  label: React.ReactNode
  /** CSS colour. Prefer a token var, e.g. `var(--mint-60)`. Defaults to the mint palette. */
  color?: string
  /** Colour for values ≥ 0 (defaults to `color`). */
  positiveColor?: string
  /** Colour for values < 0. Defaults to mint-15 / mint-45 by series index. */
  negativeColor?: string
}

export type BarChartDatum = Record<string, ChartXValue | null | undefined>

export interface BarChartProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  title?: React.ReactNode
  description?: React.ReactNode
  data: BarChartDatum[]
  /** Row key holding the category. Defaults to `"month"` (`"date"` when interactive). */
  xKey?: string
  series: BarChartSeries[]
  /** `vertical` = upright columns (default); `horizontal` = bars running left → right. */
  layout?: "vertical" | "horizontal"
  /** Stack series on top of each other. */
  stacked?: boolean
  /** Show a legend under the chart. */
  legend?: boolean
  /** `value` = value above each bar; `category` = category name above each bar; `inside` = category inside the bar + value at its end. */
  labels?: "none" | "value" | "category" | "inside"
  /** Colour bars per series (default) or per category (uses `colors`). */
  colorBy?: "series" | "category"
  /** Palette used when `colorBy="category"`. */
  colors?: string[]
  /** Controlled active bar (data index); highlighted with a dashed outline. */
  activeIndex?: number | null
  defaultActiveIndex?: number | null
  onActiveChange?: (index: number | null) => void
  /** Click a bar to make it active. */
  selectable?: boolean
  /** Chart height in px. Default 200 (240 when interactive). */
  height?: number
  /** Footer trend line. */
  trend?: React.ReactNode
  /** Footer caption, e.g. "January – June 2024". */
  caption?: React.ReactNode
  /** Daily bars with header stat toggles, one per series, showing its total. */
  interactive?: boolean
}

const NEGATIVE_PALETTE = ["var(--mint-15)", "var(--mint-45)"] as const

const statToggleVariants = cva(
  "flex min-w-28 flex-col items-start gap-1 rounded-md px-4 py-2 text-start transition-colors outline-none hover:bg-light-l2 focus-visible:ring-3 focus-visible:ring-ring/50",
  {
    variants: {
      active: {
        true: "bg-light-l1",
        false: "",
      },
    },
    defaultVariants: { active: false },
  }
)

type Radius = [number, number, number, number]

function barRadius(
  index: number,
  count: number,
  stacked: boolean,
  horizontal: boolean
): number | Radius {
  if (!stacked || count === 1) return 4
  const isFirst = index === 0
  const isLast = index === count - 1
  if (horizontal) {
    if (isFirst) return [4, 0, 0, 4]
    if (isLast) return [0, 4, 4, 0]
    return 0
  }
  if (isFirst) return [0, 0, 4, 4]
  if (isLast) return [4, 4, 0, 0]
  return 0
}

function BarChart({
  title,
  description,
  data,
  xKey: xKeyProp,
  series,
  layout = "vertical",
  stacked = false,
  legend = false,
  labels = "none",
  colorBy = "series",
  colors = [...CHART_PALETTE],
  activeIndex: activeIndexProp,
  defaultActiveIndex = null,
  onActiveChange,
  selectable = false,
  height: heightProp,
  trend,
  caption,
  interactive = false,
  className,
  ...props
}: BarChartProps) {
  const xKey = xKeyProp ?? (interactive ? "date" : "month")
  const height = heightProp ?? (interactive ? 240 : 200)
  const horizontal = layout === "horizontal"

  const [uncontrolledActive, setUncontrolledActive] = React.useState<
    number | null
  >(defaultActiveIndex)
  const activeIndex =
    activeIndexProp !== undefined ? activeIndexProp : uncontrolledActive
  const setActive = (index: number | null) => {
    if (activeIndexProp === undefined) setUncontrolledActive(index)
    onActiveChange?.(index)
  }

  const [activeSeries, setActiveSeries] = React.useState(series[0]?.key)

  const resolvedSeries = React.useMemo(
    () =>
      series.map((s, i) => ({
        ...s,
        color: s.color ?? CHART_PALETTE[i % CHART_PALETTE.length],
        negativeColor:
          s.negativeColor ?? NEGATIVE_PALETTE[i % NEGATIVE_PALETTE.length],
      })),
    [series]
  )

  const visibleSeries = interactive
    ? resolvedSeries.filter((s) => s.key === activeSeries)
    : resolvedSeries

  const config = React.useMemo(
    () =>
      Object.fromEntries(
        resolvedSeries.map((s) => [s.key, { label: s.label, color: s.color }])
      ) satisfies ChartConfig,
    [resolvedSeries]
  )

  const totals = React.useMemo(
    () =>
      Object.fromEntries(
        resolvedSeries.map((s) => [
          s.key,
          data.reduce((sum, row) => sum + Number(row[s.key] ?? 0), 0),
        ])
      ),
    [data, resolvedSeries]
  )

  // Interactive: normalise date x values to timestamps for stable category keys.
  const chartData = React.useMemo(
    () =>
      interactive
        ? data.map((row) => ({
            ...row,
            [xKey]: new Date(row[xKey] as string | number | Date).getTime(),
          }))
        : data,
    [data, interactive, xKey]
  )

  const xFormatter = interactive ? formatChartDate : formatChartCategory
  const isStacked = stacked && !interactive

  const legendItems =
    colorBy === "category"
      ? data.map((row, i) => ({
          key: String(row[xKey]),
          label: String(row[xKey]),
          color: colors[i % colors.length],
        }))
      : visibleSeries

  const statToggles = interactive ? (
    <div className="flex flex-wrap gap-1" role="group" aria-label="Series">
      {resolvedSeries.map((s) => {
        const active = s.key === activeSeries
        return (
          <button
            key={s.key}
            type="button"
            aria-pressed={active}
            className={cn(statToggleVariants({ active }))}
            onClick={() => setActiveSeries(s.key)}
          >
            <span className="text-caption text-dark-60">{s.label}</span>
            <span className="text-heading-xs text-navy">
              {(totals[s.key] ?? 0).toLocaleString()}
            </span>
          </button>
        )
      })}
    </div>
  ) : undefined

  const categoryAxisProps = {
    dataKey: xKey,
    tickLine: false,
    axisLine: false,
    tickMargin: 8,
    tick: CHART_TICK,
    tickFormatter: xFormatter,
  } as const

  return (
    <ChartFrame
      data-slot="bar-chart"
      title={title}
      description={description}
      action={statToggles}
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
        <RechartsBarChart
          accessibilityLayer
          data={chartData}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={{
            top: labels === "none" || horizontal ? 4 : 20,
            right: horizontal && labels !== "none" ? 40 : 12,
            left: 12,
          }}
        >
          <CartesianGrid
            vertical={horizontal}
            horizontal={!horizontal}
            stroke={CHART_GRID_STROKE}
          />
          {horizontal ? (
            <>
              <XAxis type="number" dataKey={visibleSeries[0]?.key} hide />
              <YAxis
                type="category"
                {...categoryAxisProps}
                hide={labels === "inside"}
                width={48}
              />
            </>
          ) : (
            <XAxis
              {...categoryAxisProps}
              hide={labels === "category"}
              minTickGap={interactive ? 32 : undefined}
            />
          )}
          <ChartTooltip
            cursor={{ fill: "var(--light-l1)" }}
            content={
              <ChartTooltipContent
                className={CHART_TOOLTIP_CLASS}
                indicator="dot"
                hideIndicator={colorBy === "category"}
                labelFormatter={(_, payload) =>
                  interactive
                    ? formatChartDate(payload?.[0]?.payload?.[xKey])
                    : String(payload?.[0]?.payload?.[xKey] ?? "")
                }
              />
            }
          />
          {visibleSeries.map((s, seriesIndex) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.key}
              fill={`var(--color-${s.key})`}
              stackId={isStacked ? "a" : undefined}
              radius={barRadius(
                seriesIndex,
                visibleSeries.length,
                isStacked,
                horizontal
              )}
              className={cn(selectable && "cursor-pointer")}
              onClick={
                selectable
                  ? (_, index) => setActive(index === activeIndex ? null : index)
                  : undefined
              }
            >
              {chartData.map((row, i) => {
                const value = Number(row[s.key] ?? 0)
                const fill =
                  colorBy === "category"
                    ? colors[i % colors.length]
                    : value < 0
                      ? s.negativeColor
                      : (s.positiveColor ?? `var(--color-${s.key})`)
                const isActive = activeIndex === i
                return (
                  <Cell
                    key={i}
                    fill={fill}
                    stroke={isActive ? "var(--mint-75)" : undefined}
                    strokeWidth={isActive ? 2 : 0}
                    strokeDasharray={isActive ? "4 3" : undefined}
                  />
                )
              })}
              {labels === "value" && (
                <LabelList
                  dataKey={s.key}
                  position={horizontal ? "right" : "top"}
                  offset={8}
                  fill="var(--navy)"
                  fontSize={12}
                />
              )}
              {labels === "category" && (
                <LabelList
                  dataKey={xKey}
                  position={horizontal ? "right" : "top"}
                  offset={8}
                  fill="var(--dark-75)"
                  fontSize={12}
                  formatter={(value) => formatChartCategory(value)}
                />
              )}
              {labels === "inside" && (
                <>
                  <LabelList
                    dataKey={xKey}
                    position={horizontal ? "insideLeft" : "insideTop"}
                    offset={8}
                    fill="var(--white)"
                    fontSize={12}
                  />
                  <LabelList
                    dataKey={s.key}
                    position={horizontal ? "right" : "top"}
                    offset={8}
                    fill="var(--navy)"
                    fontSize={12}
                  />
                </>
              )}
            </Bar>
          ))}
        </RechartsBarChart>
      </ChartContainer>
      {legend && (
        <ChartLegendList items={legendItems} />
      )}
    </ChartFrame>
  )
}

export { BarChart, statToggleVariants }
