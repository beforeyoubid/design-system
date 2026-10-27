import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Spinner } from '../../components/ui/spinner'

const meta: Meta<typeof Spinner> = {
  title: 'BYB Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Spinner>

export const Default: Story = {}

/** Size and colour come from `className`; the spinner inherits the text colour. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner className="size-3" />
      <Spinner />
      <Spinner className="size-5" />
      <Spinner className="size-6 text-primary" />
    </div>
  ),
}

/** In a Button or Badge, place it with `data-icon` and disable the control. */
export const InControls: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button disabled>
        <Spinner data-icon="inline-start" />
        Saving
      </Button>
      <Badge>
        <Spinner data-icon="inline-start" />
        Syncing
      </Badge>
    </div>
  ),
}
