import type { Meta, StoryObj } from '@storybook/react-vite'
import { BYBButton } from '../components/BYBButton'
import React from 'react'

const meta: Meta<typeof BYBButton> = {
  title: 'Components/BYBButton',
  component: BYBButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['lime', 'navy', 'outline-navy'] },
    size:    { control: 'select', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    disabled:{ control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof BYBButton>

export const Lime: Story = {
  args: { variant: 'lime', size: 'md', children: 'Get started' },
}

export const Navy: Story = {
  args: { variant: 'navy', size: 'md', children: 'Learn more' },
}

export const OutlineNavy: Story = {
  args: { variant: 'outline-navy', size: 'md', children: 'Learn more' },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <BYBButton variant="lime" size="sm">Small</BYBButton>
      <BYBButton variant="lime" size="md">Medium</BYBButton>
      <BYBButton variant="lime" size="lg">Large</BYBButton>
    </div>
  ),
}

export const Loading: Story = {
  args: { variant: 'lime', size: 'md', loading: true, children: 'Get started' },
}

export const Disabled: Story = {
  args: { variant: 'lime', size: 'md', disabled: true, children: 'Get started' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center p-6 bg-light-l2 rounded-lg">
      <BYBButton variant="lime">Lime</BYBButton>
      <BYBButton variant="navy">Navy</BYBButton>
      <BYBButton variant="outline-navy">Outline Navy</BYBButton>
    </div>
  ),
}
