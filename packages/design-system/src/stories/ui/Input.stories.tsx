import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

const meta: Meta<typeof Input> = {
  title: 'shadcn/Input',
  component: Input,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { placeholder: 'Enter your email' },
  render: (args) => <Input className="w-72" {...args} />,
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-72 gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => <Input className="w-72" disabled placeholder="Disabled" />,
}
