import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '../../components/ui/input'
import { InputField } from '../../components/InputField'

const meta: Meta<typeof Input> = {
  title: 'BYB Components/Input',
  component: Input,
  tags: ['autodocs'],
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

// ── InputField (label + control + hint / error) ────────────────────────────

export const WithLabel: Story = {
  render: () => (
    <div className="w-80">
      <InputField label="Email" type="email" placeholder="you@example.com" />
    </div>
  ),
}

export const WithHint: Story = {
  render: () => (
    <div className="w-80">
      <InputField
        label="Phone"
        placeholder="0400 000 000"
        hint="We'll only call about your inspection."
      />
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="w-80">
      <InputField
        label="Email"
        defaultValue="not-an-email"
        hint="Hidden while there's an error."
        error="Enter a valid email address."
      />
    </div>
  ),
}

export const Required: Story = {
  render: () => (
    <div className="w-80">
      <InputField label="Email" placeholder="you@example.com" required />
    </div>
  ),
}

export const Multiline: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-6">
      <InputField
        multiline
        label="Notes for the inspector"
        placeholder="Anything we should know?"
        hint="Optional, max 500 characters."
      />
      <InputField
        multiline
        rows={5}
        required
        label="Message"
        defaultValue="Too short"
        error="Please write at least 20 characters."
      />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-6">
      <InputField label="Email" placeholder="you@example.com" disabled />
      <InputField
        label="Email"
        defaultValue="hello@beforeyoubuy.com.au"
        hint="Contact support to change your email."
        disabled
      />
    </div>
  ),
}
