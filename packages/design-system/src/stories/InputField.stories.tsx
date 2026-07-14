import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { InputField } from '../components/InputField'

const meta: Meta<typeof InputField> = {
  title: 'BYB/InputField',
  component: InputField,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof InputField>

export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
  },
  render: (args) => (
    <div className="w-80">
      <InputField {...args} />
    </div>
  ),
}

export const WithHint: Story = {
  args: {
    label: 'Phone',
    placeholder: '0400 000 000',
    hint: "We'll only call about your inspection.",
  },
  render: (args) => (
    <div className="w-80">
      <InputField {...args} />
    </div>
  ),
}

export const WithError: Story = {
  args: {
    label: 'Email',
    defaultValue: 'not-an-email',
    error: 'Enter a valid email address.',
  },
  render: (args) => (
    <div className="w-80">
      <InputField {...args} />
    </div>
  ),
}

export const Required: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    required: true,
  },
  render: (args) => (
    <div className="w-80">
      <InputField {...args} />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    disabled: true,
  },
  render: (args) => (
    <div className="w-80">
      <InputField {...args} />
    </div>
  ),
}
