import type { Meta, StoryObj } from '@storybook/react-vite'
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group'
import { Label } from '../../components/ui/label'

const meta: Meta<typeof RadioGroup> = {
  title: 'shadcn/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="standard" className="space-y-2">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="basic" id="basic" />
        <Label htmlFor="basic">Basic</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="standard" id="standard" />
        <Label htmlFor="standard">Standard</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="premium" id="premium" />
        <Label htmlFor="premium">Premium</Label>
      </div>
    </RadioGroup>
  ),
}
