import * as React from "react"

import { cn } from "../lib/utils"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export interface InputFieldProps extends React.ComponentProps<"input"> {
  label?: React.ReactNode
  hint?: React.ReactNode
  error?: React.ReactNode
  /** Optional className for the wrapping element. */
  wrapperClassName?: string
}

/**
 * Thin composite around `ui/input` that adds `label`, `hint`, and `error`
 * slots. Use this for forms where you want a single field component instead
 * of composing `<Label>` + `<Input>` + helper text yourself.
 *
 * Replaces the legacy `BYBInput`. For bespoke layouts, use `ui/input` directly.
 */
export function InputField({
  label,
  hint,
  error,
  className,
  wrapperClassName,
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

  return (
    <div className={cn("flex w-full flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <Label htmlFor={fieldId}>{label}</Label>
      )}
      <Input
        id={fieldId}
        className={className}
        aria-describedby={describedById}
        aria-invalid={hasError || undefined}
        {...props}
      />
      {hint && !error && (
        <p id={`${fieldId}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${fieldId}-error`} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
