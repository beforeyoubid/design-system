import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  IconChevronDown,
  IconCreditCard,
  IconDownload,
  IconLogout,
  IconSettings,
  IconShare,
  IconTrash,
  IconUser,
} from '@tabler/icons-react'
import { Button } from '../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'

const meta: Meta<typeof DropdownMenu> = {
  title: 'BYB Components/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DropdownMenu>

/** Open-state look for the tertiary trigger (applied while the menu is expanded). */
const openTrigger =
  'aria-expanded:bg-mint-l4 aria-expanded:text-mint-75 aria-expanded:ring-3 aria-expanded:ring-mint-45/30'

function Trigger({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenuTrigger
      render={
        <Button variant="tertiary" className={openTrigger}>
          {children}
          <IconChevronDown data-icon="inline-end" />
        </Button>
      }
    />
  )
}

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <Trigger>My account</Trigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <IconUser />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconCreditCard />
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconSettings />
            Settings
            <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <IconShare />
            Share report
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Email</DropdownMenuItem>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
            <DropdownMenuItem>SMS</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem disabled>
          <IconDownload />
          Download PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <IconLogout />
          Sign out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const DefaultOpen: Story = {
  name: 'Open (trigger active state)',
  render: () => (
    <DropdownMenu defaultOpen>
      <Trigger>Actions</Trigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <IconShare />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconDownload />
          Download
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <IconTrash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

function CheckboxesDemo() {
  const [building, setBuilding] = React.useState(true)
  const [pest, setPest] = React.useState(true)
  const [strata, setStrata] = React.useState(false)
  return (
    <DropdownMenu>
      <Trigger>Report types</Trigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Show reports</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuCheckboxItem checked={building} onCheckedChange={setBuilding}>
            Building
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={pest} onCheckedChange={setPest}>
            Pest
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={strata} onCheckedChange={setStrata}>
            Strata
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem disabled checked={false}>
            Pool (coming soon)
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const Checkboxes: Story = {
  render: () => <CheckboxesDemo />,
}

function RadioDemo() {
  const [sort, setSort] = React.useState('newest')
  return (
    <DropdownMenu>
      <Trigger>Sort by</Trigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
          <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="price">Price</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="distance" disabled>
            Distance
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const RadioItems: Story = {
  name: 'Radio items',
  render: () => <RadioDemo />,
}
