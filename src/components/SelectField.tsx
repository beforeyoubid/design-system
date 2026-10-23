import * as React from "react"
import { IconX } from "@tabler/icons-react"

import { cn } from "../lib/utils"
import { productBadges, type ProductBadgeKey } from "../lib/product-badges"
import { ColorDot } from "./ui/color-dot"
import { Label } from "./ui/label"
import {
  Select,
  SelectContent,
  SelectFooter,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

/**
 * One option. `start`, `meta` and `chip` take any node, so new kinds of
 * content (product dots, icons, avatars, flags…) need no new props.
 */
export interface SelectFieldOption {
  label: React.ReactNode
  value: string
  disabled?: boolean
  /** Leading content in the list row, before the label (e.g. an icon). */
  start?: React.ReactNode
  /** Right-aligned content in the list row: a count, hint or `<ColorDot />`. */
  meta?: React.ReactNode
  /**
   * Content shown before the label once selected: inside the chip (multiple)
   * or the field value (single), e.g. the same `<ColorDot />`.
   */
  chip?: React.ReactNode
}

/**
 * Product options from the badge catalogue: label, value = product key, the
 * product colour dot on the right of the row and inside the selected chip.
 * `productSelectOptions()` for all products, or pass keys to pick / order them.
 */
export function productSelectOptions(
  keys?: readonly ProductBadgeKey[],
  overrides: Partial<Record<ProductBadgeKey, Partial<SelectFieldOption>>> = {}
): SelectFieldOption[] {
  const list = keys
    ? keys.map((k) => productBadges.find((p) => p.key === k)!).filter(Boolean)
    : productBadges
  return list.map((p) => ({
    value: p.key,
    label: p.label,
    meta: <ColorDot className={p.bg} />,
    chip: <ColorDot className={p.bg} />,
    ...overrides[p.key],
  }))
}

/** A category heading with its options. Mix groups and plain options freely. */
export interface SelectFieldOptionGroup {
  label: React.ReactNode
  options: SelectFieldOption[]
}

const isGroup = (
  o: SelectFieldOption | SelectFieldOptionGroup
): o is SelectFieldOptionGroup => "options" in o

interface SelectFieldBaseProps {
  label?: React.ReactNode
  hint?: React.ReactNode
  error?: React.ReactNode
  required?: boolean
  /**
   * Options to render. Pass `{ label, options: [...] }` entries to group them
   * under category headings. For fully custom content, use `ui/select` directly.
   */
  options: (SelectFieldOption | SelectFieldOptionGroup)[]
  placeholder?: string
  disabled?: boolean
  id?: string
  name?: string
  /** Optional className for the trigger. */
  className?: string
  /** Optional className for the wrapping element. */
  wrapperClassName?: string
  /** Show an × beside the chevron that clears the selection. Default true. */
  clearable?: boolean
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
  /** Show the "N selected · CLEAR" footer in the list. Default true. */
  showFooter?: boolean
}

export type SelectFieldProps = SelectFieldSingleProps | SelectFieldMultipleProps

/**
 * Thin composite around `ui/select` that adds `label`, `hint`, `error`, and
 * a simple `options={[]}` API for the common case.
 *
 * Supports category groups (`{ label, options }`) and per-option `start`,
 * `meta` (right side) and `chip` content. `productSelectOptions()` builds
 * product options with colour dots.
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
  clearable = true,
  } = props
  const maxDisplayed = props.multiple ? (props.maxDisplayed ?? 2) : 0
  const flatOptions = options.flatMap((o) => (isGroup(o) ? o.options : [o]))
  const optionFor = (v: string) => flatOptions.find((o) => o.value === v)
  const labelFor = (v: string) => optionFor(v)?.label ?? v

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
  // Single-select also keeps its own state so the × can clear it uncontrolled.
  const [innerSingle, setInnerSingle] = React.useState<string | null>(
    !props.multiple ? (props.defaultValue ?? null) : null
  )
  const singleValue = !props.multiple
    ? props.value !== undefined
      ? props.value
      : innerSingle
    : null
  const setSingle = (next: string | null) => {
    if (props.multiple) return
    if (props.value === undefined) setInnerSingle(next)
    props.onValueChange?.(next)
  }
  const hasSelection = props.multiple
    ? selectedValues.length > 0
    : singleValue != null && singleValue !== ""
  const showClear = clearable && hasSelection && !disabled
  const clear = () => (props.multiple ? setValues([]) : setSingle(null))
  const showFooter = props.multiple ? (props.showFooter ?? true) : false

  const renderMultiple = (selected: string[] | null) => {
    if (!selected || selected.length === 0) {
      return <span className="truncate text-dark-90">{placeholder}</span>
    }
    const shown = selected.slice(0, maxDisplayed)
    const rest = selected.length - shown.length
    return (
      <span className="flex min-w-0 items-center gap-1 overflow-hidden">
        {shown.map((v) => (
          <span
            key={v}
            className="inline-flex h-6 min-w-0 shrink items-center gap-1.5 rounded-full bg-mint-l2 px-2 text-caption-1 font-medium text-mint-90"
          >
            {optionFor(v)?.chip}
            <span className="truncate">{labelFor(v)}</span>
          </span>
        ))}
        {rest > 0 && (
          <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-light-l2 px-2 text-caption-1 font-medium text-dark-75">
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
          value: singleValue,
          onValueChange: (next: string | null) => setSingle(next),
        }
  ) as unknown as Partial<React.ComponentProps<typeof Select>>
  const renderSingle = (selected: string | null) => {
    if (selected == null || selected === "") {
      return <span className="truncate">{placeholder}</span>
    }
    const opt = optionFor(selected)
    return (
      <span className="flex min-w-0 items-center gap-2">
        {opt?.chip}
        <span className="truncate">{opt?.label ?? selected}</span>
      </span>
    )
  }

  const renderItem = (opt: SelectFieldOption) => (
    <SelectItem
      key={opt.value}
      value={opt.value}
      disabled={opt.disabled}
      indicator={multiple ? "checkbox" : "check"}
      start={opt.start}
      meta={opt.meta}
    >
      {opt.label}
    </SelectItem>
  )
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
            "text-body-5 leading-tight font-semibold text-navy",
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
        <div className="relative w-full">
          <SelectTrigger
            id={fieldId}
            aria-describedby={describedById}
            aria-invalid={hasError || undefined}
            aria-required={required || undefined}
            className={cn("w-full", showClear && "*:data-[slot=select-value]:me-7", className)}
          >
            {multiple ? (
              <SelectValue>{renderMultiple}</SelectValue>
            ) : (
              <SelectValue placeholder={placeholder}>{renderSingle}</SelectValue>
            )}
          </SelectTrigger>
          {showClear && (
            <button
              type="button"
              onClick={clear}
              aria-label="Clear selection"
              title="Clear selection"
              className="absolute end-8 top-1/2 flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-sm text-dark-75 transition-colors outline-none hover:text-dark-100 focus-visible:ring-2 focus-visible:ring-mint-45/30"
            >
              <IconX className="size-3.5" />
            </button>
          )}
        </div>
        <SelectContent>
          {options.map((entry, i) =>
            isGroup(entry) ? (
              <React.Fragment key={`group-${i}`}>
                {i > 0 && <SelectSeparator />}
                <SelectGroup>
                  <SelectLabel>{entry.label}</SelectLabel>
                  {entry.options.map(renderItem)}
                </SelectGroup>
              </React.Fragment>
            ) : (
              renderItem(entry)
            )
          )}
          {showFooter && (
            <SelectFooter>
              <span>
                {selectedValues.length
                  ? `${selectedValues.length} selected`
                  : "None selected"}
              </span>
              <button
                type="button"
                onClick={clear}
                disabled={selectedValues.length === 0}
                className="cursor-pointer rounded-sm text-overline text-mint-75 transition-colors outline-none hover:text-mint-90 focus-visible:ring-2 focus-visible:ring-mint-45/30 disabled:cursor-not-allowed disabled:text-dark-45"
              >
                Clear
              </button>
            </SelectFooter>
          )}
        </SelectContent>
      </Select>
      {hint && !error && (
        <p id={`${fieldId}-hint`} className="text-body-5 text-dark-75">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${fieldId}-error`} className="text-body-5 text-error-75" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
