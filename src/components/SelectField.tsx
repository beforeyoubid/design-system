import * as React from "react"

import { cn } from "../lib/utils"
import { Label } from "./ui/label"
import {
  Select,
  SelectContent,
  SelectFooter,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

export interface SelectFieldOption {
  label: React.ReactNode
  value: string
  disabled?: boolean
}

interface SelectFieldBaseProps {
  label?: React.ReactNode
  hint?: React.ReactNode
  error?: React.ReactNode
  required?: boolean
  /** Options to render. For more complex content (groups, separators), use `ui/select` directly with children. */
  options: SelectFieldOption[]
  placeholder?: string
  disabled?: boolean
  id?: string
  name?: string
  /** Optional className for the trigger. */
  className?: string
  /** Optional className for the wrapping element. */
  wrapperClassName?: string
}

interface SelectFieldSingleProps extends SelectFieldBaseProps {
  multiple?: false
  value?: string
  defaultValue?: string
  onValueChange?: (value: string | null) => void
}

interface SelectFieldMultipleProps extends SelectFieldBaseProps {
  /** Let the user pick several options. The popup stays open while picking. */
  multiple: true
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  /** How many chips to show in the field before collapsing to "+N". Default 2. */
  maxDisplayed?: number
  /** Show the "N selected · Clear" footer in the list. Default true. */
  showFooter?: boolean
}

export type SelectFieldProps = SelectFieldSingleProps | SelectFieldMultipleProps

/**
 * Thin composite around `ui/select` that adds `label`, `hint`, `error`, and
 * a simple `options={[]}` API for the common case.
 *
 * For complex selects with groups, custom
 * item rendering, or scrollable content, use `ui/select` directly.
 */
export function SelectField(props: SelectFieldProps) {
  const {
  label,
  hint,
  error,
  options,
  placeholder = "Select…",
  disabled,
  required,
  id,
  name,
  className,
  wrapperClassName,
  multiple,
  } = props
  const maxDisplayed = props.multiple ? (props.maxDisplayed ?? 2) : 0
  const labelFor = (v: string) =>
    options.find((o) => o.value === v)?.label ?? v

  // Multi-select keeps its own state (so Clear works uncontrolled too) and
  // mirrors a controlled `value` when one is passed.
  const [innerValues, setInnerValues] = React.useState<string[]>(
    props.multiple ? (props.defaultValue ?? []) : []
  )
  const selectedValues = props.multiple ? (props.value ?? innerValues) : []
  const setValues = (next: string[]) => {
    if (!props.multiple) return
    if (props.value === undefined) setInnerValues(next)
    props.onValueChange?.(next)
  }
  const showFooter = props.multiple ? (props.showFooter ?? true) : false

  const renderMultiple = (selected: string[] | null) => {
    if (!selected || selected.length === 0) {
      return <span className="truncate text-dark-60">{placeholder}</span>
    }
    const shown = selected.slice(0, maxDisplayed)
    const rest = selected.length - shown.length
    return (
      <span className="flex min-w-0 items-center gap-1 overflow-hidden">
        {shown.map((v) => (
          <span
            key={v}
            className="inline-flex h-6 min-w-0 shrink items-center rounded-full bg-mint-l2 px-2 text-caption font-medium text-mint-90"
          >
            <span className="truncate">{labelFor(v)}</span>
          </span>
        ))}
        {rest > 0 && (
          <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-light-l2 px-2 text-caption font-medium text-dark-75">
            +{rest}
          </span>
        )}
      </span>
    )
  }

  // Base UI's Select is generic over value type and `multiple`; the two prop
  // shapes above are validated by SelectFieldProps, so pass them straight through.
  const rootProps = (
    props.multiple
      ? {
          multiple: true,
          value: selectedValues,
          onValueChange: (next: string[]) => setValues(next),
        }
      : {
          value: props.value,
          defaultValue: props.defaultValue,
          onValueChange: props.onValueChange,
        }
  ) as unknown as Partial<React.ComponentProps<typeof Select>>
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
        <Label
          htmlFor={fieldId}
          className={cn(
            "text-body-sm leading-tight font-semibold text-navy",
            disabled && "opacity-50"
          )}
        >
          <span className="inline-flex items-start gap-0.5">
            {label}
            {required && (
              <span aria-hidden="true" className="text-mint-45">
                *
              </span>
            )}
          </span>
        </Label>
      )}
      <Select
        {...rootProps}
        disabled={disabled}
        name={name}
      >
        <SelectTrigger
          id={fieldId}
          aria-describedby={describedById}
          aria-invalid={hasError || undefined}
          aria-required={required || undefined}
          className={cn("w-full", className)}
        >
          {multiple ? (
            <SelectValue>{renderMultiple}</SelectValue>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              indicator={multiple ? "checkbox" : "check"}
            >
              {opt.label}
            </SelectItem>
          ))}
          {showFooter && (
            <SelectFooter>
              <span>
                {selectedValues.length
                  ? `${selectedValues.length} selected`
                  : "None selected"}
              </span>
              <button
                type="button"
                onClick={() => setValues([])}
                disabled={selectedValues.length === 0}
                className="cursor-pointer rounded-sm font-semibold text-mint-75 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-mint-45/30 disabled:cursor-not-allowed disabled:text-dark-45 disabled:no-underline"
              >
                Clear
              </button>
            </SelectFooter>
          )}
        </SelectContent>
      </Select>
      {hint && !error && (
        <p id={`${fieldId}-hint`} className="text-body-sm text-dark-60">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${fieldId}-error`} className="text-body-sm text-error-75" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
