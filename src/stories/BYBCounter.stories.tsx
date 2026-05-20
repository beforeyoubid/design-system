import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  IconFileDescription,
  IconStarFilled,
  IconUsers,
  IconClock,
} from '@tabler/icons-react'
import { BYBCounter } from '../components/BYBCounter'

const meta: Meta<typeof BYBCounter> = {
  title: 'Components/BYBCounter',
  component: BYBCounter,
  tags: ['autodocs'],
  argTypes: {
    variant:           { control: 'select', options: ['navy', 'lime', 'white'] },
    value:             { control: 'text' },
    label:             { control: 'text' },
    iconSize:          { control: 'number' },
    animationDuration: { control: 'number' },
  },
}

export default meta
type Story = StoryObj<typeof BYBCounter>

// ── Variants ──────────────────────────────────────────────────────────────────

export const Navy: Story = {
  args: { variant: 'navy', value: '10,000+', label: 'Reports ordered' },
}

export const Lime: Story = {
  args: { variant: 'lime', value: '10,000+', label: 'Reports ordered' },
}

export const White: Story = {
  args: { variant: 'white', value: '10,000+', label: 'Reports ordered' },
  parameters: { backgrounds: { default: 'navy' } },
}

// ── With icon ─────────────────────────────────────────────────────────────────

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 p-6">
      <BYBCounter variant="navy" value="10,000+" label="Reports ordered"         icon={IconFileDescription} />
      <BYBCounter variant="navy" value="98%"     label="Customer satisfaction"   icon={IconStarFilled} />
      <BYBCounter variant="navy" value="500+"    label="Certified inspectors"    icon={IconUsers} />
      <BYBCounter variant="navy" value="15+"     label="Years of experience"     icon={IconClock} />
    </div>
  ),
}

export const WithIconLime: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 p-6">
      <BYBCounter variant="lime" value="10,000+" label="Reports ordered"         icon={IconFileDescription} />
      <BYBCounter variant="lime" value="98%"     label="Customer satisfaction"   icon={IconStarFilled} />
      <BYBCounter variant="lime" value="500+"    label="Certified inspectors"    icon={IconUsers} />
      <BYBCounter variant="lime" value="15+"     label="Years of experience"     icon={IconClock} />
    </div>
  ),
}

// ── All variants side by side ─────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 p-6">
      <BYBCounter variant="navy"  value="10,000+" label="Reports ordered"       icon={IconFileDescription} />
      <BYBCounter variant="lime"  value="98%"     label="Customer satisfaction" icon={IconStarFilled} />
      <BYBCounter variant="white" value="500+"    label="Certified inspectors"  icon={IconUsers} />
    </div>
  ),
}

// ── Stats row ─────────────────────────────────────────────────────────────────

export const StatsRow: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 p-6 sm:grid-cols-4">
      <BYBCounter variant="navy" value="10,000+" label="Reports ordered"       icon={IconFileDescription} />
      <BYBCounter variant="navy" value="98%"     label="Customer satisfaction" icon={IconStarFilled} />
      <BYBCounter variant="navy" value="500+"    label="Certified inspectors"  icon={IconUsers} />
      <BYBCounter variant="navy" value="15+"     label="Years of experience"   icon={IconClock} />
    </div>
  ),
}
