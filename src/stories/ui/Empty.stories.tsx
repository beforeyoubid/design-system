import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconFolderOpen } from '@tabler/icons-react'
import { Button } from '../../components/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../../components/empty'

const meta: Meta<typeof Empty> = {
  title: 'BYB Components/Empty',
  component: Empty,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'What to show when there\'s nothing yet: an icon, a title, a line of help and an action.' } } },
  argTypes: { variant: { control: 'select', options: ['default', 'outline', 'muted'] } },
  render: (args) => (
    <div className="w-128">
      <Empty {...args}>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconFolderOpen />
          </EmptyMedia>
          <EmptyTitle>No reports yet</EmptyTitle>
          <EmptyDescription>Order a property report and it will show up here.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-wrap justify-center gap-2">
            <Button>Order a report</Button>
            <Button variant="tertiary">Learn more</Button>
          </div>
          <EmptyDescription>
            Need help? <a href="#">Contact support</a>
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </div>
  ),
}

export default meta
type Story = StoryObj<typeof Empty>

export const Default: Story = {}
export const Outline: Story = { args: { variant: 'outline' } }
export const Muted: Story = { args: { variant: 'muted' } }

export const Minimal: Story = {
  render: (args) => (
    <div className="w-128">
      <Empty {...args}>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconFolderOpen />
          </EmptyMedia>
          <EmptyTitle>No reports yet</EmptyTitle>
          <EmptyDescription>Order a property report and it will show up here.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  ),
}
