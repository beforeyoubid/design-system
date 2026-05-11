import type { Meta, StoryObj } from '@storybook/react-vite'
import { BYBSelect } from '../components/BYBSelect'

const options = [
  { label: 'Building inspection', value: 'building' },
  { label: 'Pest inspection',     value: 'pest' },
  { label: 'Building + pest',     value: 'combined' },
  { label: 'Strata report',       value: 'strata' },
]

const meta: Meta<typeof BYBSelect> = {
  title: 'Components/BYBSelect',
  component: BYBSelect,
  tags: ['autodocs'],
  args: { options },
  argTypes: {
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof BYBSelect>

export const Default: Story = {
  args: { label: 'Inspection type', placeholder: 'Select a service' },
}

export const WithError: Story = {
  args: { label: 'Inspection type', error: 'Please select a service.' },
}

export const Disabled: Story = {
  args: { label: 'Inspection type', disabled: true },
}

export const NoLabel: Story = {
  args: { placeholder: 'Select a service' },
}
