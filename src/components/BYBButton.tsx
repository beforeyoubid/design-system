import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-semibold rounded-full uppercase tracking-btn transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        lime:          'bg-lime text-navy hover:opacity-90',
        navy:          'bg-navy text-white hover:opacity-90',
        'ghost-white': 'bg-transparent text-white border border-white hover:bg-white/10',
        'outline-navy':'bg-transparent text-navy border border-navy hover:bg-navy/5',
      },
      size: {
        sm: 'px-4 py-2 text-btn-sm',
        md: 'px-6 py-3 text-btn-md',
        lg: 'px-8 py-4 text-btn-lg',
      },
    },
    defaultVariants: {
      variant: 'lime',
      size: 'md',
    },
  }
)

export interface BYBButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

export function BYBButton({
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  className,
  children,
  ...props
}: BYBButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="opacity-70">Loading…</span> : children}
    </Comp>
  )
}

export { buttonVariants }
