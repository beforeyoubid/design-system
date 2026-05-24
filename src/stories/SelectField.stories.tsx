import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectField } from '../components/SelectField'

const meta: Meta<typeof SelectField> = {
  title: 'BYB/SelectField',
  component: SelectField,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SelectField>

const STATES = [
  { label: 'New South Wales', value: 'nsw' },
  { label: 'Victoria', value: 'vic' },
  { label: 'Queensland', value: 'qld' },
  { label: 'Western Australia', value: 'wa' },
  { label: 'South Australia', value: 'sa' },
  { label: 'Tasmania', value: 'tas' },
]

export const Default: Story = {
  args: {
    label: 'State',
    options: STATES,
  },
  render: (args) => (
    <div className="w-80">
      <SelectField {...args} />
    </div>
  ),
}

export const WithHint: Story = {
  args: {
    label: 'State',
    options: STATES,
    hint: 'Where is the property located?',
  },
  render: (args) => (
    <div className="w-80">
      <SelectField {...args} />
    </div>
  ),
}

export const WithError: Story = {
  args: {
    label: 'State',
    options: STATES,
    error: 'Please choose a state.',
  },
  render: (args) => (
    <div className="w-80">
      <SelectField {...args} />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    label: 'State',
    options: STATES,
    disabled: true,
  },
  render: (args) => (
    <div className="w-80">
      <SelectField {...args} />
    </div>
  ),
}
