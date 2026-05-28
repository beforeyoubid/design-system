import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'

const meta: Meta<typeof Label> = {
  title: 'shadcn/Label',
  component: Label,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {
  args: { children: 'Email' },
}

export const WithInput: Story = {
  render: () => (
    <div className="grid w-72 gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input id="email" placeholder="you@example.com" />
    </div>
  ),
}
