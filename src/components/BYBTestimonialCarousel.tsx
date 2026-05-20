import React from 'react'
import { IconStarFilled, IconStar } from '@tabler/icons-react'
import { cn } from '../lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Testimonial {
  stars: number    // 1–5
  content: string
  name: string
  role?: string
  image?: string   // photo URL — falls back to initials avatar
}

// ── Triangle colour map ───────────────────────────────────────────────────────

const TRIANGLE_BG: Record<'cobalt' | 'lime', string> = {
  cobalt: 'bg-cobalt-l1',
  lime:   'bg-lime-l1',
}

// ── Individual card (exported so stories can control stars/content directly) ──

export interface BYBTestimonialCardProps extends Testimonial {
  /** Controls the coloured triangle at the bottom of the card */
  triangleVariant?: 'cobalt' | 'lime'
}

export function BYBTestimonialCard({
  stars,
  content,
  name,
  role,
  image,
  triangleVariant = 'cobalt',
}: BYBTestimonialCardProps) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="bg-white rounded-2xl w-72 shrink-0 flex flex-col overflow-hidden shadow-md select-none">
      {/* Quote + stars */}
      <div className="px-6 pt-6 pb-4 flex flex-col gap-6 flex-1">
        <p className="text-body-sm text-dark-75 leading-relaxed flex-1">{content}</p>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) =>
            i < stars ? (
              <IconStarFilled key={i} size={18} className="text-navy" />
            ) : (
              <IconStar key={i} size={18} className="text-dark-30" />
            )
          )}
        </div>
      </div>

      {/* Triangle + person */}
      <div className="relative h-44">
        {/* Coloured triangle — apex at top-centre, widens to full card width */}
        <div className={cn('absolute inset-0 clip-triangle', TRIANGLE_BG[triangleVariant])} />

        {/* Circular photo — sits at the triangle apex */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-white">
            {image ? (
              <img src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-dark-15 flex items-center justify-center text-body-sm font-semibold text-dark-75">
                {initials}
              </div>
            )}
          </div>
        </div>

        {/* Name + role */}
        <div className="absolute bottom-5 inset-x-0 text-center z-10">
          <p className="text-body-sm font-semibold text-navy">{name}</p>
          {role && <p className="text-caption text-dark-60">{role}</p>}
        </div>
      </div>
    </div>
  )
}

// ── Carousel ──────────────────────────────────────────────────────────────────

export interface BYBTestimonialCarouselProps {
  testimonials: Testimonial[]
  /** Starting colour for the alternating triangle pattern */
  variant?: 'cobalt' | 'lime'
  className?: string
}

export function BYBTestimonialCarousel({
  testimonials,
  variant = 'cobalt',
  className,
}: BYBTestimonialCarouselProps) {
  const doubled = [...testimonials, ...testimonials]

  return (
    <div className={cn('overflow-hidden w-full mask-fade-x group', className)}>
      <div className="flex gap-4 w-max py-4 animate-marquee group-hover:animate-marquee-paused">
        {doubled.map((t, i) => {
          const triangleVariant: 'cobalt' | 'lime' =
            i % 2 === 0
              ? variant
              : variant === 'cobalt' ? 'lime' : 'cobalt'
          return <BYBTestimonialCard key={i} {...t} triangleVariant={triangleVariant} />
        })}
      </div>
    </div>
  )
}
