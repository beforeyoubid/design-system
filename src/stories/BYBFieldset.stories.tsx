import type { Meta, StoryObj } from '@storybook/react-vite'
import { BYBFieldset } from '../components/BYBFieldset'
import { InputField } from '../components/InputField'

const meta: Meta<typeof BYBFieldset> = {
  title: 'BYB Components/BYBFieldset',
  component: BYBFieldset,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BYBFieldset>

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <BYBFieldset legend="Contact details" description="How we reach you about this property.">
        <InputField label="Full name" required />
        <InputField label="Phone" hint="We'll only call about your inspection." />
      </BYBFieldset>
    </div>
  ),
}

export const Divided: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-5">
      <BYBFieldset legend="Contact details">
        <InputField label="Full name" required />
      </BYBFieldset>
      <BYBFieldset legend="Property" divided>
        <InputField label="Address" />
      </BYBFieldset>
    </div>
  ),
}
