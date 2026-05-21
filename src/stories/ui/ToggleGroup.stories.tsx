import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
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
      <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Multiple: Story = {
  render: () => (
    <ToggleGroup type="multiple" defaultValue={['left']}>
      <ToggleGroupItem value="left" aria-label="Bold"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Italic"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Underline"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
    </ToggleGroup>
  ),
}
