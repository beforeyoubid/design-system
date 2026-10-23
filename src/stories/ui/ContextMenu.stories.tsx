import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconTrash } from '@tabler/icons-react'
import { ConfirmDialog } from '../../components/ui/dialog'
import { Toaster, sonner } from '../../components/ui/sonner'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../../components/ui/context-menu'

const meta: Meta<typeof ContextMenu> = {
  title: 'BYB Components/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ContextMenu>

/** Delete asks first (DESIGN.md rule 13): menu item → ConfirmDialog → toast with Undo. */
function ContextMenuDemo() {
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  return (
    <>
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-72 items-center justify-center rounded-md border border-dashed text-body-5 text-muted-foreground">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem>Open</ContextMenuItem>
        <ContextMenuItem>Rename</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" onClick={() => setConfirmOpen(true)}>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
    <ConfirmDialog
      open={confirmOpen}
      onOpenChange={setConfirmOpen}
      destructive
      size="md"
      icon={<IconTrash />}
      title="Delete this file?"
      description="Contract of sale.pdf will be permanently deleted."
      actionLabel="Delete"
      onAction={() =>
        sonner.success('File deleted', {
          description: 'Contract of sale.pdf was removed.',
          action: { label: 'Undo', onClick: () => {} },
        })
      }
    />
    <Toaster />
    </>
  )
}

export const Default: Story = {
  render: () => <ContextMenuDemo />,
}
