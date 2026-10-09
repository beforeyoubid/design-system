import * as React from "react"

import { cn } from "../lib/utils"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"

export interface InputFieldProps extends React.ComponentProps<"input"> {
  label?: React.ReactNode
  hint?: React.ReactNode
  error?: React.ReactNode
  /** Optional className for the wrapping element. */
  wrapperClassName?: string
  required?: boolean
  /** Render a resizable `Textarea` instead of a single-line `Input`. */
  multiline?: boolean
  /** Visible rows when `multiline` (default 3). */
  rows?: number
}

/**
 * BYB "Input" field: label (+ mint asterisk when required), control, and a
 * hint that's replaced by the error message when `error` is set.
 *
 * For bespoke layouts, use `ui/input` directly.
 */
export function InputField({
  label,
  hint,
  error,
  className,
  wrapperClassName,
  required,
  multiline = false,
  rows = 3,
  id,
  ...props
}: InputFieldProps) {
  const generatedId = React.useId()
  const fieldId = id ?? generatedId
  const hasError = !!error
  const describedById = error
    ? `${fieldId}-error`
    : hint
    ? `${fieldId}-hint`
    : undefined

  const controlProps = {
    id: fieldId,
    className,
    "aria-required": required || undefined,
    "aria-describedby": describedById,
    "aria-invalid": hasError || undefined,
  }

  return (
    <div
      data-slot="input-field"
      className={cn("flex w-full flex-col gap-1.5", wrapperClassName)}
    >
      {label && (
        <label
          htmlFor={fieldId}
          className="text-body-sm leading-tight font-semibold text-navy"
        >
          {label}
          {required && <span className="ms-0.5 text-mint-45">*</span>}
        </label>
      )}
      {multiline ? (
        <Textarea
          rows={rows}
          {...controlProps}
          {...(props as unknown as React.ComponentProps<"textarea">)}
        />
      ) : (
        <Input {...controlProps} {...props} />
      )}
      {hint && !error && (
        <p id={`${fieldId}-hint`} className="text-body-sm text-dark-60">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${fieldId}-error`}
          className="text-body-sm text-error-75"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}
