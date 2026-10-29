import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from '../../components/ui/textarea'
import { Field, FieldDescription, FieldError, FieldLabel } from '../../components/field'

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
    <Field className="w-72">
      <FieldLabel htmlFor="textarea-message">Message</FieldLabel>
      <Textarea id="textarea-message" rows={4} placeholder="Tell us what's on your mind" aria-describedby="textarea-message-hint" />
      <FieldDescription id="textarea-message-hint">We usually reply within a day.</FieldDescription>
    </Field>
  ),
}

export const Invalid: Story = {
  render: () => (
    <Field data-invalid className="w-72">
      <FieldLabel htmlFor="textarea-required" required>
        Message
      </FieldLabel>
      <Textarea id="textarea-required" required aria-invalid aria-describedby="textarea-required-error" />
      <FieldError id="textarea-required-error">Message is required.</FieldError>
    </Field>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Textarea className="w-72" rows={3} disabled defaultValue="Read-only notes" />
  ),
}
