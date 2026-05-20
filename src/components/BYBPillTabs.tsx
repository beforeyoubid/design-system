import React, { useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PillTab {
  id: string
  label: string
  content: React.ReactNode
  icon?: React.ElementType
}

// ── Tab button styles ─────────────────────────────────────────────────────────

const tabButtonVariants = cva(
  'relative px-5 py-2.5 rounded-full text-btn-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        navy: 'focus-visible:ring-navy',
        mint: 'focus-visible:ring-mint-75',
        lime: 'focus-visible:ring-lime',
      },
      active: {
        true:  '',
        false: 'text-dark-60 hover:text-dark-100',
      },
    },
    compoundVariants: [
      { variant: 'navy', active: true,  class: 'bg-navy text-white shadow-sm' },
      { variant: 'mint', active: true,  class: 'bg-mint-75 text-white shadow-sm' },
      { variant: 'lime', active: true,  class: 'bg-lime text-navy shadow-sm' },
    ],
    defaultVariants: { variant: 'navy', active: false },
  }
)

// ── Component ─────────────────────────────────────────────────────────────────

export interface BYBPillTabsProps
  extends VariantProps<typeof tabButtonVariants> {
  tabs: PillTab[]
  defaultTab?: string
  onChange?: (id: string) => void
  /** Track background — defaults to light-l3 */
  trackClassName?: string
  className?: string
}

export function BYBPillTabs({
  tabs,
  defaultTab,
  variant = 'navy',
  onChange,
  trackClassName,
  className,
}: BYBPillTabsProps) {
  const [activeId, setActiveId] = useState(defaultTab ?? tabs[0]?.id ?? '')

  function handleSelect(id: string) {
    setActiveId(id)
    onChange?.(id)
  }

  const activeTab = tabs.find(t => t.id === activeId)

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Pill selector track */}
      <div
        className={cn(
          'inline-flex flex-wrap gap-1 rounded-full p-1 self-start',
          trackClassName ?? 'bg-light-l3'
        )}
        role="tablist"
      >
        {tabs.map(tab => {
          const isActive = tab.id === activeId
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => handleSelect(tab.id)}
              className={cn(
                tabButtonVariants({ variant, active: isActive }),
                'inline-flex items-center gap-1.5'
              )}
            >
              {Icon && <Icon size={14} aria-hidden="true" />}
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content panel */}
      {activeTab && (
        <div
          key={activeId}
          id={`tabpanel-${activeId}`}
          role="tabpanel"
          className="animate-fade-in"
        >
          {activeTab.content}
        </div>
      )}
    </div>
  )
}
