import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconBuildingCommunity, IconUser } from '@tabler/icons-react'
import { Button } from '../../components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../components/ui/hover-card'

const meta: Meta<typeof HoverCard> = {
  title: 'BYB Components/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof HoverCard>

const triggerClass = 'hover:underline data-popup-open:underline'

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger render={<Button variant="link" className={triggerClass}>Jane Inspector</Button>} />
      <HoverCardContent>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-mint-45 text-white">
          <IconUser className="size-4.5" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-body-sm font-semibold text-navy">Jane Inspector</p>
          <p className="text-body-sm text-dark-90">Licensed building &amp; pest inspector covering Sydney&apos;s inner west.</p>
          <p className="text-caption text-dark-60">142 reports · Joined 2019</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}

export const Property: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger render={<Button variant="link" className={triggerClass}>12 Smith St</Button>} />
      <HoverCardContent side="top">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-mint-45 text-white">
          <IconBuildingCommunity className="size-4.5" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-body-sm font-semibold text-navy">12 Smith St, Newtown NSW</p>
          <p className="text-body-sm text-dark-90">3 bed · 2 bath terrace. Building &amp; pest and strata reports available.</p>
          <p className="text-caption text-dark-60">Updated 2 days ago</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}
