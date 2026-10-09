import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from '../../components/ui/textarea'
import { InputField } from '../../components/InputField'

const meta: Meta<typeof Textarea> = {
  title: 'BYB Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  render: () => <Textarea className="w-72" rows={3} placeholder="Type your message…" />,
}

export const WithLabel: Story = {
  render: () => (
    <div className="w-72">
      <InputField multiline rows={4} label="Message" hint="We usually reply within a day." placeholder="Tell us what's on your mind" />
    </div>
  ),
}

export const Invalid: Story = {
  render: () => (
    <div className="w-72">
      <InputField multiline label="Message" required error="Message is required." />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Textarea className="w-72" rows={3} disabled defaultValue="Read-only notes" />
  ),
}
