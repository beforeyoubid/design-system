import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'

const meta: Meta<typeof Select> = {
  title: 'shadcn/Select',
  component: Select,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-60">
        <SelectValue placeholder="Select a state" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Australia</SelectLabel>
          <SelectItem value="nsw">New South Wales</SelectItem>
          <SelectItem value="vic">Victoria</SelectItem>
          <SelectItem value="qld">Queensland</SelectItem>
          <SelectItem value="wa">Western Australia</SelectItem>
          <SelectItem value="sa">South Australia</SelectItem>
          <SelectItem value="tas">Tasmania</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}
