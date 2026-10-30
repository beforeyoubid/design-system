import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '../../components/ui/input'
import { Field, FieldDescription, FieldError, FieldLabel } from '../../components/field'
import { Textarea } from '../../components/ui/textarea'

const meta: Meta<typeof Input> = {
  title: 'BYB Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'A single-line text field. Wrap it in InputGroup to add icons, buttons or text inside the edge.' } } },
}

export default meta
type Story = StoryObj<typeof Input>

// ── Bare control ────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { placeholder: 'Enter your email' },
  render: (args) => <Input className="w-72" {...args} />,
}

export const Filled: Story = {
  render: () => <Input className="w-72" defaultValue="hello@beforeyoubuy.com.au" />,
}

export const Invalid: Story = {
  render: () => <Input className="w-72" aria-invalid defaultValue="not-an-email" />,
}

export const DisabledControl: Story = {
  name: 'Disabled (control)',
  render: () => <Input className="w-72" disabled placeholder="Disabled" />,
}

// ── In a Field (label + control + hint / error) ────────────────────────────
// Forms in apps use @beforeyoubid/form's InputField, which builds this.

export const WithLabel: Story = {
  render: () => (
    <Field className="w-80">
      <FieldLabel htmlFor="input-email">Email</FieldLabel>
      <Input id="input-email" type="email" placeholder="you@example.com" />
    </Field>
  ),
}

export const WithHint: Story = {
  render: () => (
    <Field className="w-80">
      <FieldLabel htmlFor="input-phone">Phone</FieldLabel>
      <Input id="input-phone" placeholder="0400 000 000" aria-describedby="input-phone-hint" />
      <FieldDescription id="input-phone-hint">We&apos;ll only call about your inspection.</FieldDescription>
    </Field>
  ),
}

export const WithError: Story = {
  render: () => (
    <Field data-invalid className="w-80">
      <FieldLabel htmlFor="input-bad-email">Email</FieldLabel>
      <Input id="input-bad-email" defaultValue="not-an-email" aria-invalid aria-describedby="input-bad-email-error" />
      <FieldError id="input-bad-email-error">Enter a valid email address.</FieldError>
    </Field>
  ),
}

export const Required: Story = {
  render: () => (
    <Field className="w-80">
      <FieldLabel htmlFor="input-required" required>
        Email
      </FieldLabel>
      <Input id="input-required" placeholder="you@example.com" required />
    </Field>
  ),
}

export const Multiline: Story = {
  render: () => (
    <Field className="w-80">
      <FieldLabel htmlFor="input-notes">Notes for the inspector</FieldLabel>
      <Textarea id="input-notes" placeholder="Anything we should know?" aria-describedby="input-notes-hint" />
      <FieldDescription id="input-notes-hint">Optional, max 500 characters.</FieldDescription>
    </Field>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Field data-disabled className="w-80">
      <FieldLabel htmlFor="input-disabled">Email</FieldLabel>
      <Input id="input-disabled" defaultValue="hello@beforeyoubuy.com.au" disabled aria-describedby="input-disabled-hint" />
      <FieldDescription id="input-disabled-hint">Contact support to change your email.</FieldDescription>
    </Field>
  ),
}
