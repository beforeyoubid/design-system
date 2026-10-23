import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '../../components/ui/checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'BYB Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'card'] },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: { 'aria-label': 'Default checkbox' },
}

export const Checked: Story = {
  args: { defaultChecked: true, 'aria-label': 'Checked checkbox' },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Checkbox disabled aria-label="Disabled" />
      <Checkbox disabled defaultChecked aria-label="Disabled checked" />
    </div>
  ),
}

export const Invalid: Story = {
  args: { 'aria-invalid': true, 'aria-label': 'Invalid checkbox' },
}

export const WithLabel: Story = {
  args: { label: 'Accept terms and conditions' },
}

export const WithLabelAndDescription: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Checkbox
        label="Email me updates"
        description="We'll send new reports for properties you're watching."
        defaultChecked
      />
      <Checkbox
        label="SMS reminders"
        description="Get a text the day before your inspection."
      />
      <Checkbox
        label="Disabled option"
        description="This option isn't available on your plan."
        disabled
      />
    </div>
  ),
}

export const Card: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-2">
      <Checkbox
        variant="card"
        label="Building & pest inspection"
        description="Structural defects, timber pests and safety hazards."
        defaultChecked
      />
      <Checkbox
        variant="card"
        label="Strata report"
        description="Levies, by-laws, disputes and building works."
      />
      <Checkbox
        variant="card"
        label="Pool compliance"
        description="Not available for this property."
        disabled
      />
    </div>
  ),
}
