import * as React from "react"

import { cn } from "../lib/utils"
import { Label } from "./ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

export interface SelectFieldOption {
  label: React.ReactNode
  value: string
  disabled?: boolean
}

export interface SelectFieldProps {
  label?: React.ReactNode
  hint?: React.ReactNode
  error?: React.ReactNode
  /** Options to render. For more complex content (groups, separators), use `ui/select` directly with children. */
  options: SelectFieldOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  id?: string
  name?: string
  /** Optional className for the trigger. */
  className?: string
  /** Optional className for the wrapping element. */
  wrapperClassName?: string
}

/**
 * Thin composite around `ui/select` that adds `label`, `hint`, `error`, and
 * a simple `options={[]}` API for the common case.
 *
 * Replaces the legacy `BYBSelect`. For complex selects with groups, custom
 * item rendering, or scrollable content, use `ui/select` directly.
 */
export function SelectField({
  label,
  hint,
  error,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select…",
  disabled,
  id,
  name,
  className,
  wrapperClassName,
}: SelectFieldProps) {
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
      {label && <Label htmlFor={fieldId}>{label}</Label>}
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        name={name}
      >
        <SelectTrigger
          id={fieldId}
          aria-describedby={describedById}
          aria-invalid={hasError || undefined}
          className={cn("w-full", className)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
