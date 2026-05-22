import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconCalendar, IconMoodSmile, IconCalculator, IconUser, IconCreditCard, IconSettings } from '@tabler/icons-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '../../components/ui/command'

const meta: Meta<typeof Command> = {
  title: 'shadcn/Command',
  component: Command,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Command>

export const Default: Story = {
  render: () => (
    <Command className="w-96 rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem><IconCalendar /><span>Calendar</span></CommandItem>
          <CommandItem><IconMoodSmile /><span>Search emoji</span></CommandItem>
          <CommandItem><IconCalculator /><span>Calculator</span></CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem><IconUser /><span>Profile</span><CommandShortcut>⌘P</CommandShortcut></CommandItem>
          <CommandItem><IconCreditCard /><span>Billing</span><CommandShortcut>⌘B</CommandShortcut></CommandItem>
          <CommandItem><IconSettings /><span>Settings</span><CommandShortcut>⌘S</CommandShortcut></CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}
