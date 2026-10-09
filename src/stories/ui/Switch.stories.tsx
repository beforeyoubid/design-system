import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from '../../components/ui/switch'

const meta: Meta<typeof Switch> = {
  title: 'BYB Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['default', 'sm'] },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Switch>

export const Off: Story = {
  args: { 'aria-label': 'Switch off' },
}

export const On: Story = {
  args: { defaultChecked: true, 'aria-label': 'Switch on' },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch disabled aria-label="Disabled off" />
      <Switch disabled defaultChecked aria-label="Disabled on" />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex items-center gap-4">
          <Switch size={size} aria-label={`${size} off`} />
          <Switch size={size} defaultChecked aria-label={`${size} on`} />
          <span className="text-body-sm text-dark-60">{size}</span>
        </div>
      ))}
    </div>
  ),
}

export const Small: Story = { args: { size: 'sm', defaultChecked: true, 'aria-label': 'Small switch' } }
export const Medium: Story = { args: { size: 'md', defaultChecked: true, 'aria-label': 'Medium switch' } }
export const Large: Story = { args: { size: 'lg', defaultChecked: true, 'aria-label': 'Large switch' } }

export const WithLabel: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-5">
      <Switch label="Email notifications" defaultChecked />
      <Switch
        label="Report alerts"
        description="Get notified when a new report is available for a saved property."
      />
      <Switch
        label="Marketing emails"
        description="Disabled while your account is being verified."
        disabled
      />
    </div>
  ),
}
