import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconFolderOpen } from '@tabler/icons-react'
import { EmptyState } from '../components/EmptyState'
import { Button } from '../components/ui/button'

const meta: Meta<typeof EmptyState> = {
  title: 'BYB Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: { variant: { control: 'select', options: ['plain', 'dashed', 'muted'] } },
  args: {
    icon: <IconFolderOpen />,
    title: 'No reports yet',
    description: 'Order a property report and it will show up here.',
    actions: (
      <>
        <Button>Order a report</Button>
        <Button variant="tertiary">Learn more</Button>
      </>
    ),
    footer: 'Need help? Contact support',
  },
  render: (args) => (
    <div className="w-128">
      <EmptyState {...args} />
    </div>
  ),
}

export default meta
type Story = StoryObj<typeof EmptyState>

export const Plain: Story = {}
export const Dashed: Story = { args: { variant: 'dashed' } }
export const Muted: Story = { args: { variant: 'muted' } }
export const Minimal: Story = { args: { actions: undefined, footer: undefined } }
