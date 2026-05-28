import type { Meta, StoryObj } from '@storybook/react-vite'
import { Separator } from '../../components/ui/separator'

const meta: Meta<typeof Separator> = {
  title: 'shadcn/Separator',
  component: Separator,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Separator>

export const Horizontal: Story = {
  render: () => (
    <div className="w-64">
      <div className="text-body-md">Section A</div>
      <Separator className="my-3" />
      <div className="text-body-md">Section B</div>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-12 items-center gap-3 text-body-sm">
      <span>Home</span>
      <Separator orientation="vertical" />
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>API</span>
    </div>
  ),
}
