import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/button"
import { ColorDot } from "@/components/color-dot"

/**
 * A half-dial score out of 100, drawn as ticks. Ticks up to the score take the
 * colour of their band: Improve under 70, Rising 70–89, Top 90 and over. A
 * marker points at the score; ticks past it are dimmed.
 */

type ScoreBand = "improve" | "rising" | "top"

const BANDS: { band: ScoreBand; from: number; label: string; status: string }[] = [
  { band: "improve", from: 0, label: "Improve", status: "Needs improvement" },
  { band: "rising", from: 70, label: "Rising", status: "Rising performer" },
  { band: "top", from: 90, label: "Top", status: "Top performer" },
]

const bandOf = (score: number) =>
  [...BANDS].reverse().find((b) => score >= b.from) ?? BANDS[0]

// Dial geometry, in viewBox units. The arc's centre sits on its flat base.
const CX = 130
const CY = 122
const R_OUT = 100
const R_IN = 80
const TICKS = 51 // one every 2 points
const SCALE = [0, 70, 90, 100]

const polar = (r: number, score: number) => {
  const a = Math.PI * (1 - score / 100)
  return { x: CX + r * Math.cos(a), y: CY - r * Math.sin(a) }
}

const scoreGaugeVariants = cva(
  "flex flex-col items-center gap-(--_score-gauge-gap) rounded-(--_score-gauge-radius) p-(--_score-gauge-padding)",
  {
    variants: {
      variant: {
        navy: "bg-(--_score-gauge) text-(--_score-gauge-foreground)",
        white: "bg-(--_score-gauge-white) text-(--_score-gauge-white-foreground)",
      },
    },
    defaultVariants: { variant: "navy" },
  }
)

/**
 * Width of the dial. Mobile first: on a phone every size draws the sm dial,
 * md takes over from `sm:` (640px) and lg from `md:` (768px). The type in
 * every size-dependent part below steps up at the same breakpoints.
 */
const scoreGaugeDialVariants = cva("relative max-w-full", {
  variants: {
    size: {
      sm: "w-(--_score-gauge-dial-sm-width)",
      md: "w-(--_score-gauge-dial-sm-width) sm:w-(--_score-gauge-dial-md-width)",
      lg: "w-(--_score-gauge-dial-sm-width) sm:w-(--_score-gauge-dial-md-width) md:w-(--_score-gauge-dial-lg-width)",
    },
  },
  defaultVariants: { size: "md" },
})

const scoreGaugeTickVariants = cva("", {
  variants: {
    variant: { navy: "", white: "" },
    band: { improve: "", rising: "", top: "", empty: "" },
  },
  compoundVariants: [
    { variant: "navy", band: "improve", className: "stroke-(--_score-gauge-tick-improve)" },
    { variant: "navy", band: "rising", className: "stroke-(--_score-gauge-tick-rising)" },
    { variant: "navy", band: "top", className: "stroke-(--_score-gauge-tick-top)" },
    { variant: "navy", band: "empty", className: "stroke-(--_score-gauge-tick-empty)" },
    { variant: "white", band: "improve", className: "stroke-(--_score-gauge-tick-white-improve)" },
    { variant: "white", band: "rising", className: "stroke-(--_score-gauge-tick-white-rising)" },
    { variant: "white", band: "top", className: "stroke-(--_score-gauge-tick-white-top)" },
    { variant: "white", band: "empty", className: "stroke-(--_score-gauge-tick-white-empty)" },
  ],
})

/** Legend dots use the same band colours as the ticks. */
const scoreGaugeDotVariants = cva("", {
  variants: {
    variant: { navy: "", white: "" },
    band: { improve: "", rising: "", top: "" },
  },
  compoundVariants: [
    { variant: "navy", band: "improve", className: "bg-(--_score-gauge-tick-improve)" },
    { variant: "navy", band: "rising", className: "bg-(--_score-gauge-tick-rising)" },
    { variant: "navy", band: "top", className: "bg-(--_score-gauge-tick-top)" },
    { variant: "white", band: "improve", className: "bg-(--_score-gauge-tick-white-improve)" },
    { variant: "white", band: "rising", className: "bg-(--_score-gauge-tick-white-rising)" },
    { variant: "white", band: "top", className: "bg-(--_score-gauge-tick-white-top)" },
  ],
})

/** Status label colour: the score's band, darkened on the white surface for contrast. */
const scoreGaugeStatusVariants = cva(
  "font-(--_score-gauge-status-font-weight) uppercase tracking-button",
  {
    variants: {
      variant: { navy: "", white: "" },
      band: { improve: "", rising: "", top: "" },
      size: {
        sm: "text-overline",
        md: "text-overline sm:text-button-sm",
        lg: "text-overline sm:text-button-sm md:text-button-md",
      },
    },
    compoundVariants: [
      { variant: "navy", band: "improve", className: "text-(--_score-gauge-status-improve-foreground)" },
      { variant: "navy", band: "rising", className: "text-(--_score-gauge-status-rising-foreground)" },
      { variant: "navy", band: "top", className: "text-(--_score-gauge-status-top-foreground)" },
      { variant: "white", band: "improve", className: "text-(--_score-gauge-status-white-improve-foreground)" },
      { variant: "white", band: "rising", className: "text-(--_score-gauge-status-white-rising-foreground)" },
      { variant: "white", band: "top", className: "text-(--_score-gauge-status-white-top-foreground)" },
    ],
  }
)

const scoreGaugeTextVariants = cva("", {
  variants: {
    part: {
      value: "leading-none font-(--_score-gauge-value-font-weight)",
      max: "font-(--_score-gauge-max-font-weight)",
      description: "text-center text-balance",
      legend: "",
    },
    size: { sm: "", md: "", lg: "" },
  },
  compoundVariants: [
    { part: "value", size: "sm", className: "text-h1" },
    { part: "value", size: "md", className: "text-h1 sm:text-display-2" },
    { part: "value", size: "lg", className: "text-h1 sm:text-display-2 md:text-display-1" },
    { part: "max", size: "sm", className: "text-body-5" },
    { part: "max", size: "md", className: "text-body-5 sm:text-body-3" },
    { part: "max", size: "lg", className: "text-body-5 sm:text-body-3 md:text-body-2" },
    { part: "description", size: "sm", className: "text-caption-1" },
    { part: "description", size: "md", className: "text-caption-1 sm:text-body-5" },
    { part: "description", size: "lg", className: "text-caption-1 sm:text-body-5 md:text-body-4" },
    { part: "legend", size: "sm", className: "text-caption-1" },
    { part: "legend", size: "md", className: "text-caption-1 sm:text-body-5" },
    { part: "legend", size: "lg", className: "text-caption-1 sm:text-body-5 md:text-body-4" },
  ],
})

/** Lifts the score block so it sits inside the arc, clear of the 0 / 100 labels. */
const scoreGaugeCenterVariants = cva(
  "absolute inset-x-0 bottom-0 flex flex-col items-center",
  {
    variants: {
      size: {
        sm: "gap-(--_score-gauge-center-sm-gap) px-(--_score-gauge-center-sm-padding-x) pb-(--_score-gauge-center-sm-padding-bottom)",
        md: "gap-(--_score-gauge-center-sm-gap) px-(--_score-gauge-center-sm-padding-x) pb-(--_score-gauge-center-sm-padding-bottom) sm:gap-(--_score-gauge-center-md-gap) sm:px-(--_score-gauge-center-md-padding-x) sm:pb-(--_score-gauge-center-md-padding-bottom)",
        lg: "gap-(--_score-gauge-center-sm-gap) px-(--_score-gauge-center-sm-padding-x) pb-(--_score-gauge-center-sm-padding-bottom) sm:gap-(--_score-gauge-center-md-gap) sm:px-(--_score-gauge-center-md-padding-x) sm:pb-(--_score-gauge-center-md-padding-bottom) md:gap-(--_score-gauge-center-lg-gap) md:px-(--_score-gauge-center-lg-padding-x) md:pb-(--_score-gauge-center-lg-padding-bottom)",
      },
      compact: {
        true: "pb-(--_score-gauge-center-compact-padding-bottom) sm:pb-(--_score-gauge-center-compact-padding-bottom) md:pb-(--_score-gauge-center-compact-padding-bottom)",
        false: "",
      },
    },
    defaultVariants: { size: "md", compact: false },
  }
)

type ScoreGaugeVariant = NonNullable<VariantProps<typeof scoreGaugeVariants>["variant"]>
type ScoreGaugeSize = NonNullable<VariantProps<typeof scoreGaugeDialVariants>["size"]>

interface ScoreGaugeProps
  extends Omit<React.ComponentProps<"div">, "children">,
    VariantProps<typeof scoreGaugeVariants>,
    VariantProps<typeof scoreGaugeDialVariants> {
  /** The score, 0–100. */
  value: number
  /** Drops the 0 / 70 / 90 / 100 labels, the description and the legend. */
  compact?: boolean
  /** Text under the score. Defaults to the band's status, e.g. "Rising performer". `null` hides it. */
  statusLabel?: React.ReactNode
  /** Line under the dial. Defaults to the points needed for the next band. `null` hides it. */
  description?: React.ReactNode
  /** Band names in the legend and the default description. Default Improve / Rising / Top. */
  labels?: Partial<Record<ScoreBand, string>>
  /** `bands` (default) shows the legend under the dial; `none` hides it. */
  legend?: "bands" | "none"
  /** `labels` (default) shows 0 / 70 / 90 / 100 around the dial; `none` hides them. */
  scale?: "labels" | "none"
  /** Text of the button under the legend, e.g. "See score details". No button without it. */
  actionLabel?: React.ReactNode
  /** Makes the button a link to this address. */
  actionHref?: string
  /** Runs when the button is clicked. */
  onAction?: React.MouseEventHandler<HTMLElement>
  /** Anything else to show at the bottom. */
  children?: React.ReactNode
}

function defaultDescription(score: number, labels: Record<ScoreBand, string>) {
  const band = bandOf(score)
  const next = BANDS[BANDS.indexOf(band) + 1]
  if (!next) return `You're a ${labels.top} Performer`
  const points = Math.ceil(next.from - score)
  return `${points} ${points === 1 ? "point" : "points"} to become a ${labels[next.band]} Performer`
}

function ScoreGauge({
  value,
  variant,
  size,
  compact = false,
  statusLabel,
  description,
  labels: labelsProp,
  legend = "bands",
  scale = "labels",
  actionLabel,
  actionHref,
  onAction,
  children,
  className,
  ...props
}: ScoreGaugeProps) {
  const labels: Record<ScoreBand, string> = {
    improve: labelsProp?.improve ?? "Improve",
    rising: labelsProp?.rising ?? "Rising",
    top: labelsProp?.top ?? "Top",
  }
  const v: ScoreGaugeVariant = variant ?? "navy"
  const s: ScoreGaugeSize = size ?? "md"
  const score = Math.min(100, Math.max(0, value))
  const band = bandOf(score)
  const status = statusLabel === undefined ? band.status : statusLabel
  const descriptionText =
    description === undefined ? defaultDescription(score, labels) : description
  const showScale = !compact && scale === "labels"
  const showDescription = !compact && descriptionText != null && descriptionText !== false
  const showLegend = !compact && legend === "bands"
  const marker = { from: polar(R_IN - 2, score), to: polar(R_OUT + 6, score) }
  // Pointer triangle inside the arc, aimed at the marker with a clear gap
  // between its tip and the marker's end.
  const a = Math.PI * (1 - score / 100)
  const tip = polar(R_IN - 10, score)
  const base = polar(R_IN - 19, score)
  const nx = Math.sin(a) * 5
  const ny = Math.cos(a) * 5
  const pointer = `${tip.x},${tip.y} ${base.x + nx},${base.y + ny} ${base.x - nx},${base.y - ny}`

  return (
    <div
      data-slot="score-gauge"
      data-variant={v}
      data-size={s}
      data-band={band.band}
      className={cn(scoreGaugeVariants({ variant: v }), className)}
      {...props}
    >
      <div
        data-slot="score-gauge-dial"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
        aria-valuetext={`${score} out of 100, ${typeof status === "string" ? status : band.status}`}
        className={scoreGaugeDialVariants({ size: s })}
      >
        <svg
          viewBox={compact ? "26 18 208 110" : "8 4 244 136"}
          className="block h-auto w-full overflow-visible"
          aria-hidden
        >
          {Array.from({ length: TICKS }, (_, i) => {
            const t = (i / (TICKS - 1)) * 100
            const from = polar(R_IN, t)
            const to = polar(R_OUT, t)
            const tickBand = t <= score ? bandOf(t).band : "empty"
            return (
              <line
                key={i}
                data-slot="score-gauge-tick"
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                strokeWidth={3}
                strokeLinecap="round"
                className={scoreGaugeTickVariants({ variant: v, band: tickBand })}
              />
            )
          })}
          <line
            data-slot="score-gauge-marker"
            x1={marker.from.x}
            y1={marker.from.y}
            x2={marker.to.x}
            y2={marker.to.y}
            strokeWidth={5}
            strokeLinecap="round"
            className={v === "white" ? "stroke-(--_score-gauge-marker-white)" : "stroke-(--_score-gauge-marker)"}
          />
          <polygon
            points={pointer}
            strokeLinejoin="round"
            strokeWidth={1.5}
            className={
              v === "white"
                ? "fill-(--_score-gauge-marker-white) stroke-(--_score-gauge-marker-white)"
                : "fill-(--_score-gauge-marker) stroke-(--_score-gauge-marker)"
            }
          />
          {showScale &&
            SCALE.map((n) => {
              const edge = n === 0 || n === 100
              const p = edge
                ? { x: polar((R_IN + R_OUT) / 2, n).x, y: CY + 14 }
                : polar(R_OUT + 16, n)
              return (
                <text
                  key={n}
                  data-slot="score-gauge-scale"
                  x={p.x}
                  y={p.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={9}
                  className={cn(
                    "font-(--_score-gauge-scale-font-weight)",
                    v === "white"
                      ? "fill-(--_score-gauge-scale-white-foreground)"
                      : "fill-(--_score-gauge-scale-foreground)"
                  )}
                >
                  {n}
                </text>
              )
            })}
        </svg>
        <div
          data-slot="score-gauge-center"
          className={cn(scoreGaugeCenterVariants({ size: s, compact }))}
        >
          <div className="flex items-baseline gap-(--_score-gauge-value-gap)">
            <span
              data-slot="score-gauge-value"
              className={cn(
                scoreGaugeTextVariants({ part: "value", size: s }),
                v === "white"
                  ? "text-(--_score-gauge-value-white-foreground)"
                  : "text-(--_score-gauge-value-foreground)"
              )}
            >
              {score}
            </span>
            <span
              data-slot="score-gauge-max"
              className={cn(
                scoreGaugeTextVariants({ part: "max", size: s }),
                v === "white"
                  ? "text-(--_score-gauge-max-white-foreground)"
                  : "text-(--_score-gauge-max-foreground)"
              )}
            >
              /100
            </span>
          </div>
          {status != null && status !== false && (
            <span
              data-slot="score-gauge-status"
              className={scoreGaugeStatusVariants({ variant: v, band: band.band, size: s })}
            >
              {status}
            </span>
          )}
        </div>
      </div>
      {/* Under the dial, not inside it, so the score block sits low in the arc and
          never runs into the pointer when the score is near the top. */}
      {showDescription && (
        <p
          data-slot="score-gauge-description"
          className={cn(
            "-mt-(--_score-gauge-description-offset)",
            scoreGaugeTextVariants({ part: "description", size: s }),
            v === "white"
              ? "text-(--_score-gauge-description-white-foreground)"
              : "text-(--_score-gauge-description-foreground)"
          )}
        >
          {descriptionText}
        </p>
      )}
      {showLegend && (
        <ul
          data-slot="score-gauge-legend"
          className={cn(
            "flex flex-wrap items-center justify-center gap-x-(--_score-gauge-legend-gap) gap-y-1",
            scoreGaugeTextVariants({ part: "legend", size: s }),
            v === "white"
              ? "text-(--_score-gauge-legend-white-foreground)"
              : "text-(--_score-gauge-legend-foreground)"
          )}
        >
          {BANDS.map((b) => (
            <li key={b.band} className="flex items-center gap-2">
              <ColorDot
                size="lg"
                className={cn(scoreGaugeDotVariants({ variant: v, band: b.band }), s === "lg" && "md:size-3")}
              />
              {labels[b.band]}
            </li>
          ))}
        </ul>
      )}
      {actionLabel != null && (
        <Button
          data-slot="score-gauge-action"
          variant={v === "white" ? "primary" : "lime"}
          size={s === "sm" ? "md" : "lg"}
          onClick={onAction}
          {...(actionHref
            ? { nativeButton: false, render: <a href={actionHref} /> }
            : {})}
        >
          {actionLabel}
        </Button>
      )}
      {children}
    </div>
  )
}

export {
  ScoreGauge,
  scoreGaugeVariants,
  scoreGaugeDialVariants,
  scoreGaugeStatusVariants,
}
export type { ScoreGaugeProps, ScoreBand }
