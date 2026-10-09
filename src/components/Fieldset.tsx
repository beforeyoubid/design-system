import * as React from "react"

import { cn } from "../lib/utils"

export interface FieldsetProps extends React.ComponentProps<"div"> {
  /** Section heading, 16px semibold navy. */
  legend?: React.ReactNode
  description?: React.ReactNode
  /** Adds a top hairline + padding to separate from the previous section. */
  divided?: boolean
}

/** Section legend + description wrapping a stack of Fields. */
function Fieldset({
  legend,
  description,
  divided = false,
  className,
  children,
  ...props
}: FieldsetProps) {
  const legendId = React.useId()
  return (
    <div
      role="group"
      aria-labelledby={legend ? legendId : undefined}
      data-slot="fieldset"
      className={cn(
        "flex w-full flex-col gap-5",
        divided && "border-t border-light-l3 pt-5",
        className
      )}
      {...props}
    >
      {(legend || description) && (
        <div className="flex flex-col gap-1">
          {legend && (
            <span
              id={legendId}
              className="text-body-md leading-tight font-semibold text-navy"
            >
              {legend}
            </span>
          )}
          {description && (
            <span className="text-body-sm text-dark-60">{description}</span>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

export { Fieldset }
