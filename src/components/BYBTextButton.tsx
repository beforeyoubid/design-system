import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const textButtonVariants = cva(
  'inline-flex items-center gap-1.5 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        mint:  'text-mint-75 hover:text-mint-60 hover:underline',
        navy:  'text-navy hover:text-mint-75 hover:underline',
        white: 'text-white hover:text-mint-l1 hover:underline',
      },
      size: {
        sm: 'text-btn-sm',
        md: 'text-btn-md',
        xl: 'text-btn-lg',
      },
    },
    defaultVariants: {
      variant: 'mint',
      size: 'md',
    },
  }
)

export interface BYBTextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof textButtonVariants> {
  asChild?: boolean
  icon?: React.ElementType
  iconSize?: number
}

const iconSizeMap: Record<string, number> = {
  sm: 14,
  md: 16,
  xl: 18,
}

export function BYBTextButton({
  variant,
  size,
  asChild = false,
  icon: Icon,
  iconSize,
  disabled,
  className,
  children,
  ...props
}: BYBTextButtonProps) {
  const Comp = asChild ? Slot : 'button'
  const resolvedIconSize = iconSize ?? iconSizeMap[size ?? 'md']

  return (
    <Comp
      className={cn(textButtonVariants({ variant, size, className }))}
      disabled={disabled}
      {...props}
    >
      {children}
      {Icon && <Icon size={resolvedIconSize} aria-hidden="true" />}
    </Comp>
  )
}

export { textButtonVariants }
