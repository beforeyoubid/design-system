import type { Meta, StoryObj } from '@storybook/react-vite'
import { Fieldset } from '../components/Fieldset'
import { InputField } from '../components/InputField'

const meta: Meta<typeof Fieldset> = {
  title: 'BYB Components/Fieldset',
  component: Fieldset,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Fieldset>

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <Fieldset legend="Contact details" description="How we reach you about this property.">
        <InputField label="Full name" required />
        <InputField label="Phone" hint="We'll only call about your inspection." />
      </Fieldset>
    </div>
  ),
}

export const Divided: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-5">
      <Fieldset legend="Contact details">
        <InputField label="Full name" required />
      </Fieldset>
      <Fieldset legend="Property" divided>
        <InputField label="Address" />
      </Fieldset>
    </div>
  ),
}
