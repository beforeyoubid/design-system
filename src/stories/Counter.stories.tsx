import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  IconFileDescription,
  IconStarFilled,
  IconUsers,
  IconClock,
} from '@tabler/icons-react'
import { Counter } from '../components/counter'

const meta: Meta<typeof Counter> = {
  title: 'BYB Components/Counter',
  component: Counter,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'A headline stat that counts up to its value ("1,200+") with a label under it. For marketing and dashboard figures.' } } },
  argTypes: {
    variant:           { control: 'select', options: ['navy', 'lime', 'white'] },
    value:             { control: 'text' },
    label:             { control: 'text' },
    iconSize:          { control: 'number' },
    animationDuration: { control: 'number' },
  },
}

export default meta
type Story = StoryObj<typeof Counter>

// ── Variants ──────────────────────────────────────────────────────────────────

export const Navy: Story = {
  args: { variant: 'navy', value: '10,000+', label: 'Reports ordered' },
}

// Lime and white are for dark sections, so their stories sit on navy (here and in the Design Console).
const onNavy = (Story: React.ComponentType) => (
  <div className="rounded-lg bg-navy p-6">
    <Story />
  </div>
)

export const Lime: Story = {
  args: { variant: 'lime', value: '10,000+', label: 'Reports ordered' },
  decorators: [onNavy],
}

export const White: Story = {
  args: { variant: 'white', value: '10,000+', label: 'Reports ordered' },
  decorators: [onNavy],
}

// ── With icon ─────────────────────────────────────────────────────────────────

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 p-6">
      <Counter variant="navy" value="10,000+" label="Reports ordered"         icon={IconFileDescription} />
      <Counter variant="navy" value="98%"     label="Customer satisfaction"   icon={IconStarFilled} />
      <Counter variant="navy" value="500+"    label="Certified inspectors"    icon={IconUsers} />
      <Counter variant="navy" value="15+"     label="Years of experience"     icon={IconClock} />
    </div>
  ),
}

export const WithIconLime: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 p-6">
      <Counter variant="lime" value="10,000+" label="Reports ordered"         icon={IconFileDescription} />
      <Counter variant="lime" value="98%"     label="Customer satisfaction"   icon={IconStarFilled} />
      <Counter variant="lime" value="500+"    label="Certified inspectors"    icon={IconUsers} />
      <Counter variant="lime" value="15+"     label="Years of experience"     icon={IconClock} />
    </div>
  ),
}

// ── All variants side by side ─────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 p-6">
      <Counter variant="navy"  value="10,000+" label="Reports ordered"       icon={IconFileDescription} />
      <div className="flex flex-wrap gap-8 rounded-lg bg-navy p-6">
        <Counter variant="lime"  value="98%"     label="Customer satisfaction" icon={IconStarFilled} />
        <Counter variant="white" value="500+"    label="Certified inspectors"  icon={IconUsers} />
      </div>
    </div>
  ),
}

// ── Stats row ─────────────────────────────────────────────────────────────────

export const StatsRow: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 p-6 sm:grid-cols-4">
      <Counter variant="navy" value="10,000+" label="Reports ordered"       icon={IconFileDescription} />
      <Counter variant="navy" value="98%"     label="Customer satisfaction" icon={IconStarFilled} />
      <Counter variant="navy" value="500+"    label="Certified inspectors"  icon={IconUsers} />
      <Counter variant="navy" value="15+"     label="Years of experience"   icon={IconClock} />
    </div>
  ),
}
