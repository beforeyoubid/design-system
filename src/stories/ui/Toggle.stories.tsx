import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bold, Italic, Underline } from 'lucide-react'
import { Toggle } from '../../components/ui/toggle'

const meta: Meta<typeof Toggle> = {
  title: 'shadcn/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'outline'] },
    size: { control: 'select', options: ['default', 'sm', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {
  render: (args) => <Toggle {...args} aria-label="Toggle bold"><Bold className="h-4 w-4" /></Toggle>,
}

export const Outline: Story = {
  render: () => <Toggle variant="outline" aria-label="Toggle italic"><Italic className="h-4 w-4" /></Toggle>,
}

export const All: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toggle aria-label="Bold"><Bold className="h-4 w-4" /></Toggle>
      <Toggle aria-label="Italic"><Italic className="h-4 w-4" /></Toggle>
      <Toggle aria-label="Underline"><Underline className="h-4 w-4" /></Toggle>
    </div>
  ),
}
