import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from '../../components/ui/avatar'

const meta: Meta<typeof Avatar> = {
  title: 'BYB Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'A person\'s photo or initials, with an optional status badge, in groups with a +N count.' } } },
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

/** A status dot in the corner, at each avatar size. */
export const WithStatus: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarFallback>BY</AvatarFallback>
          <AvatarBadge />
        </Avatar>
      ))}
    </div>
  ),
}

/** Stacked avatars with a "+N" count, at each size. */
export const GroupWithCount: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <AvatarGroup key={size}>
          {['AB', 'CD', 'EF'].map((initials) => (
            <Avatar key={initials} size={size}>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount>+4</AvatarGroupCount>
        </AvatarGroup>
      ))}
    </div>
  ),
}
