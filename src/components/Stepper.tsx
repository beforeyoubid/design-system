import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { IconCheck, IconExclamationMark } from "@tabler/icons-react"

import { cn } from "../lib/utils"

const stepIndicatorVariants = cva(
  "flex shrink-0 items-center justify-center rounded-full leading-none font-semibold transition-all duration-250",
  {
    variants: {
      size: {
        sm: "size-6 text-caption [&_svg]:size-3.5",
        md: "size-8 text-body-sm [&_svg]:size-4",
        lg: "size-10 text-body-sm [&_svg]:size-5",
        dot: "size-3",
      },
      status: {
        active:
          "bg-mint-60 text-white ring-2 ring-mint-45 ring-offset-2 ring-offset-white",
        complete: "bg-mint-l2 text-mint-75",
        upcoming: "bg-light-l2 text-dark-75",
        error: "bg-error-75 text-white",
      },
    },
    compoundVariants: [
      { size: "dot", status: "complete", className: "bg-mint-60" },
      { size: "dot", status: "upcoming", className: "bg-dark-15" },
    ],
    defaultVariants: { size: "md", status: "upcoming" },
  }
)

/** Top padding that centres the title on the circle in vertical layout. */
const stepLabelOffset = cva("", {
  variants: {
    size: { sm: "pt-0.5", md: "pt-1.5", lg: "pt-2.5", dot: "" },
  },
})

type StepStatus = NonNullable<
  VariantProps<typeof stepIndicatorVariants>["status"]
>

export interface StepperStep {
  title?: React.ReactNode
  description?: React.ReactNode
  /** Icon element shown when `indicator="icon"`. */
  icon?: React.ReactNode
  /** Show the error indicator (error-75 circle, exclamation mark). */
  error?: boolean
  disabled?: boolean
}

export interface StepperProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  steps: StepperStep[]
  /** Controlled active step (0-based). Pass `steps.length` to show every step complete. */
  value?: number
  defaultValue?: number
  onChange?: (index: number) => void
  /** `responsive` (default) switches to vertical below `breakpoint` container width. */
  orientation?: "horizontal" | "vertical" | "responsive"
  /** number (default) · icon (step.icon) · dot (12px, no glyph) */
  indicator?: "number" | "icon" | "dot"
  /** Horizontal only: labels beside (`end`, default) or under (`bottom`) the circle. */
  labelPlacement?: "end" | "bottom"
  /** Which steps can be clicked: completed (default) · all · none */
  clickable?: "completed" | "all" | "none"
  /** Circle size: sm 24 · md 32 (default) · lg 40 */
  size?: "sm" | "md" | "lg"
  /** Container width (px) where `responsive` switches to vertical. Default 560. */
  breakpoint?: number
}

function StepperLine({
  on,
  vertical,
  className,
}: {
  on: boolean
  vertical?: boolean
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-sm bg-light-l3",
        vertical ? "my-1.5 min-h-4 w-0.5 flex-1" : "h-0.5",
        className
      )}
    >
      <span
        className={cn(
          "absolute inset-0 bg-mint-60 transition-transform duration-300 ease-out",
          vertical ? "origin-top" : "origin-left",
          !on && (vertical ? "scale-y-0" : "scale-x-0")
        )}
      />
    </span>
  )
}

function Stepper({
  steps,
  value,
  defaultValue = 0,
  onChange,
  orientation = "responsive",
  indicator = "number",
  labelPlacement = "end",
  clickable = "completed",
  size = "md",
  breakpoint = 560,
  className,
  ...props
}: StepperProps) {
  const [internal, setInternal] = React.useState(defaultValue)
  const current = value ?? internal
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [narrow, setNarrow] = React.useState(false)

  React.useLayoutEffect(() => {
    if (
      orientation !== "responsive" ||
      !rootRef.current ||
      typeof ResizeObserver === "undefined"
    )
      return
    const ro = new ResizeObserver(([entry]) =>
      setNarrow(entry.contentRect.width < breakpoint)
    )
    ro.observe(rootRef.current)
    return () => ro.disconnect()
  }, [orientation, breakpoint])

  const vertical =
    orientation === "vertical" || (orientation === "responsive" && narrow)
  const bottom = !vertical && labelPlacement === "bottom"
  const dot = indicator === "dot"
  const circleSize = dot ? "dot" : size

  const go = (i: number) => {
    if (value === undefined) setInternal(i)
    onChange?.(i)
  }
  const statusOf = (step: StepperStep, i: number): StepStatus =>
    step.error
      ? "error"
      : i < current
        ? "complete"
        : i === current
          ? "active"
          : "upcoming"
  const canClick = (step: StepperStep, i: number) =>
    !step.disabled &&
    i !== current &&
    (clickable === "all" || (clickable === "completed" && i < current))
  const glyph = (step: StepperStep, i: number, status: StepStatus) =>
    dot ? null : status === "complete" ? (
      <IconCheck />
    ) : status === "error" ? (
      <IconExclamationMark />
    ) : indicator === "icon" && step.icon ? (
      step.icon
    ) : (
      i + 1
    )

  return (
    <div
      ref={rootRef}
      data-slot="stepper"
      data-orientation={vertical ? "vertical" : "horizontal"}
      className={cn("w-full", className)}
      {...props}
    >
      <ol
        className={cn(
          "m-0 flex list-none p-0",
          vertical ? "flex-col" : "flex-row",
          vertical || bottom ? "items-stretch" : "items-center"
        )}
      >
        {steps.map((step, i) => {
          const status = statusOf(step, i)
          const last = i === steps.length - 1
          const click = canClick(step, i)
          const circle = (
            <span
              className={stepIndicatorVariants({ size: circleSize, status })}
            >
              {glyph(step, i, status)}
            </span>
          )
          const label = (step.title || step.description) && (
            <span
              className={cn(
                "flex min-w-0 flex-col gap-0.5",
                vertical && stepLabelOffset({ size: circleSize }),
                vertical && !last && "pb-5"
              )}
            >
              {step.title && (
                <span
                  className={cn(
                    "text-body-sm leading-tight font-semibold",
                    status === "error" ? "text-error-75" : "text-navy"
                  )}
                >
                  {step.title}
                </span>
              )}
              {step.description && (
                <span className="text-body-sm text-dark-60">
                  {step.description}
                </span>
              )}
            </span>
          )
          const buttonProps = {
            type: "button" as const,
            disabled: !click,
            onClick: () => go(i),
            "aria-current": status === "active" ? ("step" as const) : undefined,
            "aria-label": step.title ? undefined : `Step ${i + 1}`,
          }
          const buttonBase =
            "m-0 min-w-0 rounded-lg border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-mint-45 enabled:cursor-pointer disabled:cursor-default"

          if (vertical) {
            return (
              <li key={i} className="flex">
                <button
                  {...buttonProps}
                  className={cn(
                    buttonBase,
                    "flex w-full items-stretch gap-3 text-start"
                  )}
                >
                  <span
                    className={cn(
                      "flex shrink-0 flex-col items-center",
                      dot && "pt-1"
                    )}
                  >
                    {circle}
                    {!last && <StepperLine vertical on={i < current} />}
                  </span>
                  {label}
                </button>
              </li>
            )
          }

          if (bottom) {
            return (
              <li key={i} className="min-w-0 flex-1">
                <button
                  {...buttonProps}
                  className={cn(
                    buttonBase,
                    "flex w-full flex-col items-center gap-2 text-center"
                  )}
                >
                  <span className="flex w-full items-center">
                    <StepperLine
                      on={i <= current}
                      className={cn("flex-1", i === 0 && "invisible")}
                    />
                    <span className="mx-2 flex">{circle}</span>
                    <StepperLine
                      on={i < current}
                      className={cn("flex-1", last && "invisible")}
                    />
                  </span>
                  {label}
                </button>
              </li>
            )
          }

          return (
            <li
              key={i}
              className={cn(
                "flex min-w-0 items-center",
                last ? "flex-none" : "flex-1"
              )}
            >
              <button
                {...buttonProps}
                className={cn(
                  buttonBase,
                  "flex shrink-0 items-center gap-3 text-start whitespace-nowrap"
                )}
              >
                {circle}
                {label}
              </button>
              {!last && (
                <StepperLine
                  on={i < current}
                  className={cn("min-w-3 flex-1", dot ? "mx-2" : "mx-4")}
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export { Stepper, stepIndicatorVariants }
