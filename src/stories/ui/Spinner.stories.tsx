import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../../components/badge'
import { Button } from '../../components/button'
import { Spinner } from '../../components/spinner'

const meta: Meta<typeof Spinner> = {
  title: 'BYB Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Shows a short wait. For content loading in place use Skeleton.' } } },
}

export default meta
type Story = StoryObj<typeof Spinner>

export const Default: Story = {}

/** Primary (mint) by default; size and colour come from `className`. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner className="size-3" />
      <Spinner />
      <Spinner className="size-5" />
      <Spinner className="size-6" />
    </div>
  ),
}

/** `ring` (default) is the BYB loader arc; `dots` is the loader rays. */
export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner />
      <Spinner variant="dots" />
    </div>
  ),
}

/** In a Button or Badge, place it with `data-icon` (it takes the control's text colour) and disable the control. */
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
