import type { Meta, StoryObj } from '@storybook/react-vite'
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group'

const meta: Meta<typeof RadioGroup> = {
  title: 'BYB Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'card'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
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

const SIZES = ['sm', 'md', 'lg'] as const

export const Sizes: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-col gap-3">
          <span className="text-overline text-dark-90">{size}</span>
          <RadioGroup size={size} defaultValue="standard">
            <RadioGroupItem value="basic" label="Basic" description="Building inspection only." />
            <RadioGroupItem value="standard" label="Standard" description="Building and pest." />
            <RadioGroupItem value="premium" label="Premium" disabled />
          </RadioGroup>
        </div>
      ))}
    </div>
  ),
}

export const CardSizes: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-6">
      {SIZES.map((size) => (
        <RadioGroup key={size} variant="card" size={size} defaultValue="standard">
          <RadioGroupItem value="basic" label="Basic" description="Building inspection only." />
          <RadioGroupItem value="standard" label="Standard" description="Building and pest." />
        </RadioGroup>
      ))}
    </div>
  ),
}

export const BareSizes: Story = {
  render: () => (
    <RadioGroup defaultValue="md" className="flex w-auto items-center gap-4" aria-label="Sizes">
      <RadioGroupItem value="sm" size="sm" aria-label="Small" />
      <RadioGroupItem value="md" size="md" aria-label="Medium" />
      <RadioGroupItem value="lg" size="lg" aria-label="Large" />
    </RadioGroup>
  ),
}
