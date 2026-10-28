import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const pillCardVariants = cva(
  'flex flex-row items-center gap-5 px-6 py-5 rounded-full',
  {
    variants: {
      variant: {
        'electric-blue': 'bg-(--_pill-card-electric-blue)',
        teal:   'bg-(--_pill-card-teal)',
        lime:   'bg-(--_pill-card-lime)',
      },
    },
    defaultVariants: { variant: 'electric-blue' },
  }
)

const iconCircleVariants = cva(
  'shrink-0 w-24 h-24 rounded-full bg-(--_pill-card-icon) flex items-center justify-center border-2',
  {
    variants: {
      variant: {
        'electric-blue': 'border-(--_pill-card-icon-electric-blue-foreground) text-(--_pill-card-icon-electric-blue-foreground)',
        teal:   'border-(--_pill-card-icon-teal-foreground) text-(--_pill-card-icon-teal-foreground)',
        lime:   'border-(--_pill-card-icon-lime-foreground) text-(--_pill-card-icon-lime-foreground)',
      },
    },
    defaultVariants: { variant: 'electric-blue' },
  }
)

export interface PillCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pillCardVariants> {
  heading: string
  subheading: string
  icon?: React.ElementType
  iconSize?: number
}

export function PillCard({
  variant,
  heading,
  subheading,
  icon: Icon,
  iconSize = 40,
  className,
  ...props
}: PillCardProps) {
  return (
    <div data-slot="pill-card" className={cn(pillCardVariants({ variant, className }))} {...props}>
      <div data-slot="pill-card-icon" className={cn(iconCircleVariants({ variant }))}>
        {Icon && <Icon size={iconSize} strokeWidth={1.5} aria-hidden="true" />}
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 data-slot="pill-card-heading" className="text-h4 font-semibold text-(--_pill-card-heading-foreground)">{heading}</h3>
        <p data-slot="pill-card-subheading" className="text-body-5 text-(--_pill-card-subheading-foreground)">{subheading}</p>
      </div>
    </div>
  )
}
