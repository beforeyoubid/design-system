import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../components/ui/button'
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="tertiary">Hover me</Button>} />
        <TooltipContent>Helpful context</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}
