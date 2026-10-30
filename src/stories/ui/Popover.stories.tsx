import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../components/button'
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '../../components/popover'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'

const meta: Meta<typeof Popover> = {
  title: 'BYB Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Floating content anchored to a trigger, for small forms and extra detail.' } } },
}

export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="tertiary">Dimensions</Button>} />
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

/** At its own width, with a title and description. */
export const WithHeader: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="tertiary">What’s included?</Button>} />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Building &amp; pest report</PopoverTitle>
          <PopoverDescription>A licensed inspector checks the structure, roof, wet areas and signs of termites.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
}
