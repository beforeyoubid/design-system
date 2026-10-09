import type { Meta, StoryObj } from '@storybook/react-vite'
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group'

const meta: Meta<typeof RadioGroup> = {
  title: 'BYB Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'card'] },
  },
}

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="standard" className="max-w-sm">
      <RadioGroupItem value="basic" label="Basic" />
      <RadioGroupItem value="standard" label="Standard" />
      <RadioGroupItem value="premium" label="Premium" />
    </RadioGroup>
  ),
}

export const WithDescription: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="standard" className="max-w-sm">
      <RadioGroupItem value="basic" label="Basic" description="Building inspection only." />
      <RadioGroupItem
        value="standard"
        label="Standard"
        description="Building and pest inspection."
      />
      <RadioGroupItem
        value="premium"
        label="Premium"
        description="Building, pest and strata reports."
      />
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="basic" className="max-w-sm">
      <RadioGroupItem value="basic" label="Available" />
      <RadioGroupItem value="unavailable" label="Unavailable" disabled />
      <RadioGroupItem value="unavailable-2" label="Whole group can be disabled too" disabled />
    </RadioGroup>
  ),
}

export const Bare: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="a" className="flex w-auto gap-4" aria-label="Bare radios">
      <RadioGroupItem value="a" aria-label="Option A" />
      <RadioGroupItem value="b" aria-label="Option B" />
      <RadioGroupItem value="c" aria-label="Option C" disabled />
    </RadioGroup>
  ),
}

export const Card: Story = {
  render: () => (
    <RadioGroup variant="card" defaultValue="standard" className="max-w-sm">
      <RadioGroupItem
        value="basic"
        label="Basic"
        description="Building inspection only."
      />
      <RadioGroupItem
        value="standard"
        label="Standard"
        description="Building and pest inspection."
      />
      <RadioGroupItem
        value="premium"
        label="Premium"
        description="Not available in your area."
        disabled
      />
    </RadioGroup>
  ),
}
