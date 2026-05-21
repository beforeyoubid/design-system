import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'

const meta: Meta<typeof Popover> = {
  title: 'shadcn/Popover',
  component: Popover,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild><Button variant="outline">Dimensions</Button></PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="grid gap-3">
          <div className="grid grid-cols-3 items-center gap-3">
            <Label>Width</Label>
            <Input defaultValue="100%" className="col-span-2 h-8" />
          </div>
          <div className="grid grid-cols-3 items-center gap-3">
            <Label>Height</Label>
            <Input defaultValue="25px" className="col-span-2 h-8" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}
