import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const pillCardVariants = cva(
  'flex flex-row items-center gap-5 px-6 py-5 rounded-full',
  {
    variants: {
      variant: {
        cobalt: 'bg-cobalt-l1',
        teal:   'bg-teal-l1',
        lime:   'bg-lime-l1',
      },
    },
    defaultVariants: { variant: 'cobalt' },
  }
)

const iconCircleVariants = cva(
  'shrink-0 w-24 h-24 rounded-full bg-white flex items-center justify-center border-2',
  {
    variants: {
      variant: {
        cobalt: 'border-cobalt text-cobalt',
        teal:   'border-teal text-teal',
        lime:   'border-lime text-lime',
      },
    },
    defaultVariants: { variant: 'cobalt' },
  }
)

export interface BYBPillCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pillCardVariants> {
  heading: string
  subheading: string
  icon?: React.ElementType
  iconSize?: number
}

export function BYBPillCard({
  variant,
  heading,
  subheading,
  icon: Icon,
  iconSize = 40,
  className,
  ...props
}: BYBPillCardProps) {
  return (
    <div className={cn(pillCardVariants({ variant, className }))} {...props}>
      <div className={cn(iconCircleVariants({ variant }))}>
        {Icon && <Icon size={iconSize} strokeWidth={1.5} aria-hidden="true" />}
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-heading-base font-semibold text-navy">{heading}</h3>
        <p className="text-body-sm text-dark-75">{subheading}</p>
      </div>
    </div>
  )
}
