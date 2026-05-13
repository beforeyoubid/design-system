import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const cardVariants = cva(
  'rounded-xl bg-white border border-dark-15 overflow-hidden',
  {
    variants: {
      hoverable: {
        true: 'transition-shadow hover:shadow-md cursor-pointer',
      },
    },
  }
)

export interface BYBCardProps extends VariantProps<typeof cardVariants> {
  children: React.ReactNode
  imageSlot?: React.ReactNode
  className?: string
}

export function BYBCard({ children, hoverable, imageSlot, className }: BYBCardProps) {
  return (
    <div className={cn(cardVariants({ hoverable, className }))}>
      {imageSlot && <div className="w-full">{imageSlot}</div>}
      <div className="p-6">{children}</div>
    </div>
  )
}
