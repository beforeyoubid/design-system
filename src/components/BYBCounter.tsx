import React, { useEffect, useRef, useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

// ── Value parsing ─────────────────────────────────────────────────────────────

interface ParsedValue {
  prefix: string
  number: number
  suffix: string
  useCommas: boolean
  decimals: number
}

function parseValue(raw: string): ParsedValue {
  const match = raw.match(/^([^0-9]*)([0-9,]*\.?[0-9]+)(.*)$/)
  if (!match) return { prefix: '', number: 0, suffix: raw, useCommas: false, decimals: 0 }
  const [, prefix, numStr, suffix] = match
  const useCommas = numStr.includes(',')
  const cleaned = numStr.replace(/,/g, '')
  const decimals = cleaned.includes('.') ? cleaned.split('.')[1].length : 0
  return { prefix, number: parseFloat(cleaned), suffix, useCommas, decimals }
}

function formatNumber(n: number, useCommas: boolean, decimals: number): string {
  const fixed = n.toFixed(decimals)
  if (!useCommas) return fixed
  const [int, dec] = fixed.split('.')
  const formatted = parseInt(int).toLocaleString()
  return dec !== undefined ? `${formatted}.${dec}` : formatted
}

// ── Count-up hook (triggers when `start` flips true) ─────────────────────────

function useCountUp(target: number, duration = 2000, start = false): number {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!start) return
    const startTime = performance.now()
    let rafId: number

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCurrent(progress < 1 ? target * eased : target)
      if (progress < 1) rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [target, duration, start])

  return current
}

// ── cva ───────────────────────────────────────────────────────────────────────

const counterValueVariants = cva(
  'text-display-sm font-semibold leading-none',
  {
    variants: {
      variant: {
        navy:  'text-navy',
        lime:  'text-lime',
        white: 'text-white',
      },
    },
    defaultVariants: { variant: 'navy' },
  }
)

const counterLabelVariants = cva(
  'text-body-md text-center',
  {
    variants: {
      variant: {
        navy:  'text-dark-75',
        lime:  'text-dark-75',
        white: 'text-white',
      },
    },
    defaultVariants: { variant: 'navy' },
  }
)

// ── Component ─────────────────────────────────────────────────────────────────

export interface BYBCounterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof counterValueVariants> {
  value: string
  label: string
  icon?: React.ElementType
  iconSize?: number
  animationDuration?: number
}

export function BYBCounter({
  variant,
  value,
  label,
  icon: Icon,
  iconSize = 32,
  animationDuration = 2000,
  className,
  ...props
}: BYBCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const parsed = parseValue(value)
  const animated = useCountUp(parsed.number, animationDuration, hasStarted)
  const displayed = `${parsed.prefix}${formatNumber(animated, parsed.useCommas, parsed.decimals)}${parsed.suffix}`

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHasStarted(true); observer.disconnect() } },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn('flex flex-col items-center gap-2 py-6 px-8', className)}
      {...props}
    >
      {Icon && (
        <Icon
          size={iconSize}
          aria-hidden="true"
          className={cn(counterValueVariants({ variant }))}
        />
      )}
      <span className={cn(counterValueVariants({ variant }))}>{displayed}</span>
      <span className={cn(counterLabelVariants({ variant }))}>{label}</span>
    </div>
  )
}
