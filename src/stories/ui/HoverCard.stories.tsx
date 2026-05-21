import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../components/ui/hover-card'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'

const meta: Meta<typeof HoverCard> = {
  title: 'shadcn/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof HoverCard>

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild><Button variant="link">@beforeyoubid</Button></HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/64?img=8" />
            <AvatarFallback>BY</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-body-md font-medium">@beforeyoubid</h4>
            <p className="text-body-sm text-muted-foreground">Independent inspections, simplified.</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}
