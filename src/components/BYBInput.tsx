import { cva } from 'class-variance-authority'
import { cn } from '../lib/utils'

const inputVariants = cva(
  'w-full px-4 py-3 rounded-md border bg-light-l1 text-body-md text-dark-100 placeholder:text-dark-45 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy disabled:opacity-50 disabled:cursor-not-allowed',
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

export interface BYBInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export function BYBInput({ label, hint, error, className, id, ...props }: BYBInputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  const hasError = !!error

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={inputId} className="text-body-sm font-medium text-dark-100">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(inputVariants({ hasError, className }))}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        aria-invalid={hasError}
        {...props}
      />
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-caption text-dark-60">{hint}</p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="text-caption text-red-500" role="alert">{error}</p>
      )}
    </div>
  )
}
