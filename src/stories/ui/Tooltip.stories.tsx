import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../components/button'
import { Kbd } from '../../components/ui/kbd'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../../components/ui/tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'BYB Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <div className="flex items-end gap-10 pt-16">
      <TooltipProvider>
        <div className="flex flex-col items-center gap-3">
          <Button variant="tertiary">Hover</Button>
          <span className="text-overline text-dark-90">Default</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Tooltip defaultOpen>
            <TooltipTrigger render={<Button variant="tertiary">Hover</Button>} />
            <TooltipContent>Add to library</TooltipContent>
          </Tooltip>
          <span className="text-overline text-dark-90">Hover · tooltip shown</span>
        </div>
      </TooltipProvider>
    </div>
  ),
}

export const OnHover: Story = {
  name: 'On hover',
  render: () => (
    <div className="pt-16">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<Button variant="tertiary">Hover me</Button>} />
          <TooltipContent>Add to library</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ),
}

export const Sides: Story = {
  render: () => (
    <div className="grid w-fit grid-cols-2 gap-x-48 gap-y-24 p-20">
      {/* One provider per tooltip: a shared provider opens one tooltip at a time. */}
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <TooltipProvider key={side}>
          <Tooltip defaultOpen>
            <TooltipTrigger render={<Button variant="tertiary">{side}</Button>} />
            <TooltipContent side={side}>Add to library</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  ),
}

/** With the keyboard shortcut at the end. */
export const WithShortcut: Story = {
  render: () => (
    <div className="pt-16">
      <Tooltip defaultOpen>
        <TooltipTrigger render={<Button variant="tertiary">Search</Button>} />
        <TooltipContent>
          Search reports <Kbd>⌘K</Kbd>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}
