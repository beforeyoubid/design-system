import { clsx } from 'clsx'

export interface BYBCardProps {
  children: React.ReactNode
  hoverable?: boolean
  imageSlot?: React.ReactNode
  className?: string
}

export function BYBCard({ children, hoverable, imageSlot, className }: BYBCardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl bg-white border border-dark-15 overflow-hidden',
        hoverable && 'transition-shadow hover:shadow-md cursor-pointer',
        className,
      )}
    >
      {imageSlot && <div className="w-full">{imageSlot}</div>}
      <div className="p-6">{children}</div>
    </div>
  )
}
