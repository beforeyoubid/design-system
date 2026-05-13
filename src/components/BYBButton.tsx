import React from 'react'
import { clsx } from 'clsx'

export type BYBButtonVariant = 'lime' | 'navy' | 'ghost-white' | 'outline-navy'
export type BYBButtonSize = 'sm' | 'md' | 'lg'

export interface BYBButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BYBButtonVariant
  size?: BYBButtonSize
  loading?: boolean
  asChild?: boolean
}

const variantClasses: Record<BYBButtonVariant, string> = {
  'lime':         'bg-lime text-navy hover:opacity-90',
  'navy':         'bg-navy text-white hover:opacity-90',
  'ghost-white':  'bg-transparent text-white border border-white hover:bg-white/10',
  'outline-navy': 'bg-transparent text-navy border border-navy hover:bg-navy/5',
}

const sizeClasses: Record<BYBButtonSize, string> = {
  sm: 'px-4 py-2 text-btn-sm',
  md: 'px-6 py-3 text-btn-md',
  lg: 'px-8 py-4 text-btn-lg',
}

export function BYBButton({
  variant = 'lime',
  size = 'md',
  loading = false,
  asChild = false,
  disabled,
  className,
  children,
  ...props
}: BYBButtonProps) {
  const buttonClasses = clsx(
    'inline-flex items-center justify-center font-semibold rounded-full uppercase tracking-btn transition-all',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    className,
  )

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
      className: clsx(buttonClasses, (children as React.ReactElement<{ className?: string }>).props.className),
    })
  }

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="opacity-70">Loading…</span> : children}
    </button>
  )
}
