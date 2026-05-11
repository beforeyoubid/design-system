import type { Meta, StoryObj } from '@storybook/react-vite'
import { BYBInput } from '../components/BYBInput'

const meta: Meta<typeof BYBInput> = {
  title: 'Components/BYBInput',
  component: BYBInput,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof BYBInput>

export const Default: Story = {
  args: { label: 'Property address', placeholder: 'Start typing an address…' },
}

export const WithHint: Story = {
  args: { label: 'Email', placeholder: 'jane@example.com', hint: "We'll send your report here." },
}

export const WithError: Story = {
  args: { label: 'Email', placeholder: 'jane@example.com', error: 'Please enter a valid email address.' },
}

export const Disabled: Story = {
  args: { label: 'Property address', placeholder: 'Start typing an address…', disabled: true },
}

export const NoLabel: Story = {
  args: { placeholder: 'Search properties…' },
}
