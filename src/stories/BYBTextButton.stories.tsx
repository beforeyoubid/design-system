import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconArrowRight } from '@tabler/icons-react'
import { BYBTextButton } from '../components/BYBTextButton'

const meta: Meta<typeof BYBTextButton> = {
  title: 'Components/BYBTextButton',
  component: BYBTextButton,
  tags: ['autodocs'],
  argTypes: {
    variant:  { control: 'select', options: ['mint', 'navy', 'white'] },
    size:     { control: 'select', options: ['sm', 'md', 'xl'] },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof BYBTextButton>

// ── Variants ──────────────────────────────────────────────────────────────────

export const Mint: Story = {
  args: { variant: 'mint', size: 'md', children: 'See all results' },
}

export const Navy: Story = {
  args: { variant: 'navy', size: 'md', children: 'See all results' },
}

export const White: Story = {
  args: { variant: 'white', size: 'md', children: 'See all results' },
  parameters: { backgrounds: { default: 'navy' } },
}

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <BYBTextButton variant="mint" size="sm">Small — btn-sm / 13px</BYBTextButton>
      <BYBTextButton variant="mint" size="md">Medium — btn-md / 16px</BYBTextButton>
      <BYBTextButton variant="mint" size="xl">Extra Large — btn-lg / 18px</BYBTextButton>
    </div>
  ),
}

// ── With icon (render-based so Storybook doesn't serialise the component) ─────

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <BYBTextButton variant="mint" size="sm" icon={IconArrowRight}>See all results</BYBTextButton>
      <BYBTextButton variant="mint" size="md" icon={IconArrowRight}>See all results</BYBTextButton>
      <BYBTextButton variant="mint" size="xl" icon={IconArrowRight}>See all results</BYBTextButton>
    </div>
  ),
}

// ── All variants ──────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center gap-6">
        <BYBTextButton variant="mint" size="sm" icon={IconArrowRight}>Mint / sm</BYBTextButton>
        <BYBTextButton variant="mint" size="md" icon={IconArrowRight}>Mint / md</BYBTextButton>
        <BYBTextButton variant="mint" size="xl" icon={IconArrowRight}>Mint / xl</BYBTextButton>
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <BYBTextButton variant="navy" size="sm" icon={IconArrowRight}>Navy / sm</BYBTextButton>
        <BYBTextButton variant="navy" size="md" icon={IconArrowRight}>Navy / md</BYBTextButton>
        <BYBTextButton variant="navy" size="xl" icon={IconArrowRight}>Navy / xl</BYBTextButton>
      </div>
      <div className="flex flex-wrap items-center gap-6 rounded-lg bg-navy p-4">
        <BYBTextButton variant="white" size="sm" icon={IconArrowRight}>White / sm</BYBTextButton>
        <BYBTextButton variant="white" size="md" icon={IconArrowRight}>White / md</BYBTextButton>
        <BYBTextButton variant="white" size="xl" icon={IconArrowRight}>White / xl</BYBTextButton>
      </div>
    </div>
  ),
}
