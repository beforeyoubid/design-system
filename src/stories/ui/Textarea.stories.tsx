import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'

const meta: Meta<typeof Textarea> = {
  title: 'shadcn/Textarea',
  component: Textarea,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  render: () => <Textarea className="w-72" placeholder="Type your message…" />,
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-72 gap-1.5">
      <Label htmlFor="msg">Message</Label>
      <Textarea id="msg" placeholder="Tell us what's on your mind" />
    </div>
  ),
}
