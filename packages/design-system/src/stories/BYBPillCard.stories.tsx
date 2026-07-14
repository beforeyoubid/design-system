import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  IconHomeSearch,
  IconArrowsRightLeft,
  IconShoppingCart,
  IconFileDescription,
  IconStarFilled,
} from '@tabler/icons-react'
import { BYBPillCard } from '../components/BYBPillCard'

const meta: Meta<typeof BYBPillCard> = {
  title: 'Components/BYBPillCard',
  component: BYBPillCard,
  tags: ['autodocs'],
  argTypes: {
    variant:    { control: 'select', options: ['cobalt', 'teal', 'lime'] },
    heading:    { control: 'text' },
    subheading: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof BYBPillCard>

// ── Variants ──────────────────────────────────────────────────────────────────

export const Cobalt: Story = {
  args: {
    variant:    'cobalt',
    heading:    'Search',
    subheading: 'Find your property and see available reports. No report? No problem. You can order a new one instantly.',
  },
  render: (args) => <BYBPillCard {...args} icon={IconHomeSearch} />,
}

export const Teal: Story = {
  args: {
    variant:    'teal',
    heading:    'Compare',
    subheading: 'Review inspector profiles, check their qualifications, and compare pricing to find the best fit for your needs.',
  },
  render: (args) => <BYBPillCard {...args} icon={IconArrowsRightLeft} />,
}

export const Lime: Story = {
  args: {
    variant:    'lime',
    heading:    'Order',
    subheading: 'Review inspector profiles, check their qualifications, and compare pricing to find the best fit for your needs.',
  },
  render: (args) => <BYBPillCard {...args} icon={IconShoppingCart} />,
}

// ── How it works row (matches the website section) ────────────────────────────

export const HowItWorks: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-8 bg-light-sandy rounded-xl max-w-site sm:flex-row">
      <BYBPillCard
        variant="cobalt"
        icon={IconHomeSearch}
        heading="Search"
        subheading="Find your property and see available reports. No report? No problem. You can order a new one instantly."
      />
      <BYBPillCard
        variant="teal"
        icon={IconArrowsRightLeft}
        heading="Compare"
        subheading="Review inspector profiles, check their qualifications, and compare pricing to find the best fit for your needs."
      />
      <BYBPillCard
        variant="lime"
        icon={IconShoppingCart}
        heading="Order"
        subheading="Review inspector profiles, check their qualifications, and compare pricing to find the best fit for your needs."
      />
    </div>
  ),
}

// ── Additional icon examples ──────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-xl">
      <BYBPillCard variant="cobalt" icon={IconHomeSearch}      heading="Search"  subheading="Find your property and see available reports." />
      <BYBPillCard variant="teal"   icon={IconFileDescription} heading="Review"  subheading="Check inspector qualifications and pricing." />
      <BYBPillCard variant="lime"   icon={IconStarFilled}      heading="Rate"    subheading="Share your experience and help others decide." />
    </div>
  ),
}
