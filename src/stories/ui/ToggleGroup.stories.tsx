import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconAlignLeft, IconAlignCenter, IconAlignRight } from '@tabler/icons-react'
import { ToggleGroup, ToggleGroupItem } from '../../components/ui/toggle-group'

const meta: Meta<typeof ToggleGroup> = {
  title: 'shadcn/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ToggleGroup>

export const Single: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="left">
      <ToggleGroupItem value="left" aria-label="Align left"><IconAlignLeft className="h-4 w-4" /></ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center"><IconAlignCenter className="h-4 w-4" /></ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right"><IconAlignRight className="h-4 w-4" /></ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Multiple: Story = {
  render: () => (
    <ToggleGroup type="multiple" defaultValue={['left']}>
      <ToggleGroupItem value="left" aria-label="Align left"><IconAlignLeft className="h-4 w-4" /></ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center"><IconAlignCenter className="h-4 w-4" /></ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right"><IconAlignRight className="h-4 w-4" /></ToggleGroupItem>
    </ToggleGroup>
  ),
}
