import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconSelector } from '@tabler/icons-react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../../components/ui/collapsible'
import { Button } from '../../components/ui/button'

const meta: Meta<typeof Collapsible> = {
  title: 'shadcn/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Collapsible>

export const Default: Story = {
  render: () => (
    <Collapsible className="w-80 space-y-2">
      <div className="flex items-center justify-between rounded-md border p-3">
        <span className="text-body-sm">@beforeyoubid/design-system</span>
        <CollapsibleTrigger render={<Button variant="ghost" size="icon-sm" />}>
          <IconSelector className="h-4 w-4" />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border p-3 text-body-sm">@base-ui/react</div>
        <div className="rounded-md border p-3 text-body-sm">class-variance-authority</div>
        <div className="rounded-md border p-3 text-body-sm">tailwind-merge</div>
      </CollapsibleContent>
    </Collapsible>
  ),
}
