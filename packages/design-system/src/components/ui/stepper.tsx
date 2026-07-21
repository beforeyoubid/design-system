import * as React from "react"

import { IconCheck } from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const stepperDotVariants = cva(
  "flex size-7.5 shrink-0 items-center justify-center rounded-full",
  {
    variants: {
      state: {
        done: "bg-mint-45",
        active: "bg-cobalt ring-4 ring-cobalt/20",
        upcoming: "bg-light-l3",
      },
    },
    defaultVariants: {
      state: "upcoming",
    },
  }
)

const stepperLabelVariants = cva("max-w-19 text-center text-xs leading-snug", {
  variants: {
    state: {
      done: "font-medium text-mint-75",
      active: "font-bold text-cobalt",
      upcoming: "font-normal text-dark-45",
    },
  },
  defaultVariants: {
    state: "upcoming",
  },
})

const stepperConnectorVariants = cva(
  "mt-3.5 h-0.75 w-8 shrink-0 rounded-full",
  {
    variants: {
      done: {
        true: "bg-mint-45",
        false: "bg-light-l3",
      },
    },
    defaultVariants: {
      done: false,
    },
  }
)

type StepperStepState = NonNullable<
  VariantProps<typeof stepperDotVariants>["state"]
>

interface StepperProps extends React.OlHTMLAttributes<HTMLOListElement> {
  /** Ordered step labels. Domain stage names are data — pass them in, they never live in the primitive. */
  steps: string[]
  /**
   * Index of the current step: earlier steps render done, later ones
   * upcoming. Pass `steps.length` to render every step done.
   */
  activeStep?: number
}

function Stepper({ className, steps, activeStep = 0, ...props }: StepperProps) {
  return (
    <ol
      data-slot="stepper"
      className={cn("flex items-start overflow-x-auto py-2", className)}
      {...props}
    >
      {steps.map((label, index) => {
        const state: StepperStepState =
          index < activeStep
            ? "done"
            : index === activeStep
              ? "active"
              : "upcoming"
        return (
          <li
            key={`${index}-${label}`}
            data-slot="stepper-step"
            data-state={state}
            aria-current={state === "active" ? "step" : undefined}
            className="flex shrink-0 items-start"
          >
            <div className="flex min-w-19.5 flex-col items-center gap-2">
              <div
                data-slot="stepper-dot"
                className={cn(stepperDotVariants({ state }))}
              >
                {state === "done" && (
                  <IconCheck aria-hidden className="size-4 text-white" />
                )}
                {state === "active" && (
                  <div className="size-2 rounded-full bg-white" />
                )}
              </div>
              <div
                data-slot="stepper-label"
                className={cn(stepperLabelVariants({ state }))}
              >
                {label}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                aria-hidden
                data-slot="stepper-connector"
                className={cn(
                  stepperConnectorVariants({ done: index < activeStep })
                )}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

export {
  Stepper,
  stepperDotVariants,
  stepperLabelVariants,
  stepperConnectorVariants,
}
export type { StepperProps, StepperStepState }
