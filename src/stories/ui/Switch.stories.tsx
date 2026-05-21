import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from '../../components/ui/switch'
import { Label } from '../../components/ui/label'

const meta: Meta<typeof Switch> = {
  title: 'shadcn/Switch',
  component: Switch,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane mode</Label>
    </div>
  ),
}

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="checked" defaultChecked />
      <Label htmlFor="checked">Notifications</Label>
    </div>
  ),
}
