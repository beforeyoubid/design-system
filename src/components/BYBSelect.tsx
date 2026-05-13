import { cva } from 'class-variance-authority'
import { cn } from '../lib/utils'

export interface BYBSelectOption {
  label: string
  value: string
}

const selectVariants = cva(
  'w-full px-4 py-3 rounded-md border bg-light-l1 text-body-md text-dark-100 appearance-none cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      hasError: {
        true:  'border-red-500 focus-visible:ring-red-500',
        false: 'border-dark-15 hover:border-dark-30',
      },
    },
    defaultVariants: {
      hasError: false,
    },
  }
)

export interface BYBSelectProps {
  label?: string
  options: BYBSelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  className?: string
  id?: string
}

export function BYBSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select…',
  error,
  hint,
  disabled,
  className,
  id,
}: BYBSelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  const hasError = !!error

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={selectId} className="text-body-sm font-medium text-dark-100">
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        disabled={disabled}
        onChange={e => onChange?.(e.target.value)}
        aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
        aria-invalid={hasError}
        className={cn(selectVariants({ hasError, className }))}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {hint && !error && (
        <p id={`${selectId}-hint`} className="text-caption text-dark-60">{hint}</p>
      )}
      {error && (
        <p id={`${selectId}-error`} className="text-caption text-red-500" role="alert">{error}</p>
      )}
    </div>
  )
}
