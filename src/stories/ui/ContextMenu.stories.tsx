import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconTrash } from '@tabler/icons-react'
import { ConfirmDialog } from '../../components/confirm-dialog'
import { Toaster, toast } from '../../components/toast'
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '../../components/ui/context-menu'

const meta: Meta<typeof ContextMenu> = {
  title: 'BYB Components/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Actions on right-click (or long-press) for the thing under the pointer.' } } },
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
        toast.add({
            type: 'success',
            title: 'File deleted',
            description: 'Contract of sale.pdf was removed.',
            actionProps: { children: 'Undo', onClick: () => {} },
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

function AllItemsDemo() {
  const [showHidden, setShowHidden] = React.useState(true)
  const [sort, setSort] = React.useState('date')
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-72 items-center justify-center rounded-md border border-dashed text-body-5 text-muted-foreground">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuGroup>
          <ContextMenuLabel>Report</ContextMenuLabel>
          <ContextMenuItem>
            Open <ContextMenuShortcut>⌘O</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem inset>Rename</ContextMenuItem>
          <ContextMenuItem disabled>Share (no access)</ContextMenuItem>
          <ContextMenuSub defaultOpen>
            <ContextMenuSubTrigger>Move to</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Archive</ContextMenuItem>
              <ContextMenuItem>Shared folder</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuCheckboxItem checked={showHidden} onCheckedChange={setShowHidden}>
            Show archived
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={false} disabled>
            Show deleted
          </ContextMenuCheckboxItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value={sort} onValueChange={setSort}>
          <ContextMenuLabel>Sort by</ContextMenuLabel>
          <ContextMenuRadioItem value="date">Date</ContextMenuRadioItem>
          <ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
          <ContextMenuRadioItem value="size" disabled>
            Size
          </ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}

/** Every kind of row: label, shortcut, inset and disabled items, a sub-menu (opened), checkbox and radio items. */
export const AllItems: Story = {
  render: () => <AllItemsDemo />,
}
