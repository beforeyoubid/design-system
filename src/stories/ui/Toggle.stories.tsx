import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconBold, IconItalic, IconUnderline } from '@tabler/icons-react'
import { Toggle } from '../../components/ui/toggle'

const meta: Meta<typeof Toggle> = {
  title: 'shadcn/Toggle',
  component: Toggle,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {
  render: () => <Toggle aria-label="Toggle bold"><IconBold className="h-4 w-4" /></Toggle>,
}

export const Outline: Story = {
  render: () => <Toggle variant="outline" aria-label="Toggle italic"><IconItalic className="h-4 w-4" /></Toggle>,
}

export const All: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toggle aria-label="Bold"><IconBold className="h-4 w-4" /></Toggle>
      <Toggle aria-label="Italic"><IconItalic className="h-4 w-4" /></Toggle>
      <Toggle aria-label="Underline"><IconUnderline className="h-4 w-4" /></Toggle>
    </div>
  ),
}
