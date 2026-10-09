import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  IconCalculator,
  IconCalendar,
  IconCreditCard,
  IconFileText,
  IconHome,
  IconSettings,
  IconUser,
} from '@tabler/icons-react'
import { Button } from '../../components/ui/button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '../../components/ui/command'

const meta: Meta<typeof Command> = {
  title: 'BYB Components/Command',
  component: Command,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Command>

function Items() {
  return (
    <>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem>
          <IconHome />
          <span>Find a property</span>
        </CommandItem>
        <CommandItem>
          <IconFileText />
          <span>My reports</span>
        </CommandItem>
        <CommandItem>
          <IconCalendar />
          <span>Book an inspection</span>
        </CommandItem>
        <CommandItem disabled>
          <IconCalculator />
          <span>Stamp duty calculator</span>
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem>
          <IconUser />
          <span>Profile</span>
          <CommandShortcut>⌘P</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <IconCreditCard />
          <span>Billing</span>
          <CommandShortcut>⌘B</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <IconSettings />
          <span>Settings</span>
          <CommandShortcut>⌘S</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </>
  )
}

export const Default: Story = {
  render: () => (
    <Command className="w-96">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <Items />
      </CommandList>
    </Command>
  ),
}

function EmptyDemo() {
  const [search, setSearch] = React.useState('pool inspection')
  return (
    <Command className="w-96">
      <CommandInput placeholder="Type a command or search…" value={search} onValueChange={setSearch} />
      <CommandList>
        <Items />
      </CommandList>
    </Command>
  )
}

export const Empty: Story = {
  render: () => <EmptyDemo />,
}

function DialogDemo() {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Button variant="tertiary" onClick={() => setOpen(true)}>
        Open command palette
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search…" />
          <CommandList>
            <Items />
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

export const InDialog: Story = {
  name: 'In dialog',
  render: () => <DialogDemo />,
}
