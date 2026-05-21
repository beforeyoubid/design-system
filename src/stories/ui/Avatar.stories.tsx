import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar'

const meta: Meta<typeof Avatar> = {
  title: 'shadcn/Avatar',
  component: Avatar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/64?img=1" alt="@user" />
      <AvatarFallback>BY</AvatarFallback>
    </Avatar>
  ),
}

export const FallbackOnly: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>BY</AvatarFallback>
    </Avatar>
  ),
}

export const Group: Story = {
  render: () => (
    <div className="flex -space-x-2">
      {[1, 2, 3].map((i) => (
        <Avatar key={i} className="ring-background ring-2">
          <AvatarImage src={`https://i.pravatar.cc/64?img=${i}`} alt={`@user-${i}`} />
          <AvatarFallback>U{i}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}
