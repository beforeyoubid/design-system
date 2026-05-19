import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta = {
  title: 'Foundation/Tokens',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

const colorSwatches = [
  { name: 'Navy',     class: 'bg-navy',     hex: '#090034' },
  { name: 'Lime',     class: 'bg-lime',     hex: '#D4F269' },
  { name: 'Mint/90',  class: 'bg-mint-90',  hex: '#005246' },
  { name: 'Mint/75',  class: 'bg-mint-75',  hex: '#007A69' },
  { name: 'Mint/60',  class: 'bg-mint-60',  hex: '#009E87' },
  { name: 'Mint/45',  class: 'bg-mint-45',  hex: '#00AE95' },
  { name: 'Mint/30',  class: 'bg-mint-30',  hex: '#4FC3AE' },
  { name: 'Mint/15',  class: 'bg-mint-15',  hex: '#6BCCBB' },
  { name: 'Mint/L1',  class: 'bg-mint-l1',  hex: '#ABE2D8' },
  { name: 'Mint/L2',  class: 'bg-mint-l2',  hex: '#D2EFEA' },
  { name: 'Dark/100', class: 'bg-dark-100', hex: '#16181D' },
  { name: 'Dark/90',  class: 'bg-dark-90',  hex: '#444A5A' },
  { name: 'Dark/75',  class: 'bg-dark-75',  hex: '#656E85' },
  { name: 'Dark/60',  class: 'bg-dark-60',  hex: '#858EA3' },
  { name: 'Dark/45',  class: 'bg-dark-45',  hex: '#A5ABBB' },
  { name: 'Dark/30',  class: 'bg-dark-30',  hex: '#C2C6D1' },
  { name: 'Dark/15',  class: 'bg-dark-15',  hex: '#DFE1E7' },
  { name: 'Light/L1', class: 'bg-light-l1', hex: '#F9FAFB' },
  { name: 'Light/L2', class: 'bg-light-l2', hex: '#F2F4F7' },
  { name: 'Light/L3', class: 'bg-light-l3', hex: '#EAECF0' },
]

export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      {colorSwatches.map(s => (
        <div key={s.name} className="flex flex-col items-center gap-2">
          <div className={`w-16 h-16 rounded-lg border border-dark-15 ${s.class}`} />
          <p className="text-caption text-dark-100 font-medium text-center">{s.name}</p>
          <p className="text-caption text-dark-60">{s.hex}</p>
        </div>
      ))}
    </div>
  ),
}

const headingScale = [
  { label: 'display-xl',  cls: 'text-display-xl tracking-heading',  size: '72px', weight: '600' },
  { label: 'display',     cls: 'text-display tracking-heading',      size: '56px', weight: '600' },
  { label: 'display-sm',  cls: 'text-display-sm tracking-heading',   size: '52px', weight: '600' },
  { label: 'heading-lg',  cls: 'text-heading-lg tracking-heading',   size: '40px', weight: '600' },
  { label: 'heading-3xl', cls: 'text-heading-3xl tracking-heading',  size: '36px', weight: '600' },
  { label: 'heading-md',  cls: 'text-heading-md tracking-heading',   size: '28px', weight: '600' },
  { label: 'heading-base',cls: 'text-heading-base tracking-heading', size: '24px', weight: '600' },
  { label: 'heading-sm',  cls: 'text-heading-sm',                    size: '20px', weight: '600' },
]

const bodyScale = [
  { label: 'body-lg',   cls: 'text-body-lg',   size: '18px', weight: '400' },
  { label: 'body-md',   cls: 'text-body-md',   size: '16px', weight: '400' },
  { label: 'body-sm',   cls: 'text-body-sm',   size: '13px', weight: '400' },
  { label: 'caption',   cls: 'text-caption',   size: '12px', weight: '400' },
  { label: 'text-xs',   cls: 'text-text-xs',   size: '10px', weight: '400' },
  { label: 'text-2xs',  cls: 'text-text-2xs',  size: '8px',  weight: '400' },
]

const buttonScale = [
  { label: 'btn-lg', cls: 'text-btn-lg tracking-btn uppercase', size: '18px', weight: '600' },
  { label: 'btn-md', cls: 'text-btn-md tracking-btn uppercase', size: '16px', weight: '600' },
  { label: 'btn-sm', cls: 'text-btn-sm tracking-btn uppercase', size: '13px', weight: '600' },
]

export const Typography: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-6 max-w-3xl">
      <section>
        <h3 className="text-body-sm font-semibold text-dark-45 uppercase tracking-btn mb-3">Headings — Semi Bold (600)</h3>
        <div className="flex flex-col gap-1">
          {headingScale.map(t => (
            <div key={t.label} className="flex items-baseline gap-4 border-b border-dark-15 py-2">
              <span className="text-caption text-dark-45 w-28 shrink-0 font-mono">{t.label}</span>
              <span className="text-caption text-dark-30 w-8 shrink-0">{t.size}</span>
              <span className={`text-dark-100 font-semibold ${t.cls}`}>Property decisions</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-body-sm font-semibold text-dark-45 uppercase tracking-btn mb-3">Body — Regular (400)</h3>
        <div className="flex flex-col gap-1">
          {bodyScale.map(t => (
            <div key={t.label} className="flex items-baseline gap-4 border-b border-dark-15 py-2">
              <span className="text-caption text-dark-45 w-28 shrink-0 font-mono">{t.label}</span>
              <span className="text-caption text-dark-30 w-8 shrink-0">{t.size}</span>
              <span className={`text-dark-100 ${t.cls}`}>Making confident property decisions</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-body-sm font-semibold text-dark-45 uppercase tracking-btn mb-3">Buttons — Semi Bold (600) / Uppercase</h3>
        <div className="flex flex-col gap-1">
          {buttonScale.map(t => (
            <div key={t.label} className="flex items-baseline gap-4 border-b border-dark-15 py-2">
              <span className="text-caption text-dark-45 w-28 shrink-0 font-mono">{t.label}</span>
              <span className="text-caption text-dark-30 w-8 shrink-0">{t.size}</span>
              <span className={`text-dark-100 font-semibold ${t.cls}`}>Get a quote</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
}
