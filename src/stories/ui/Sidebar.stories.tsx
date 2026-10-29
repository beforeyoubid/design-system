import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconHome, IconInbox, IconCalendar, IconSearch, IconSettings } from '@tabler/icons-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '../../components/ui/sidebar'

const meta: Meta<typeof Sidebar> = {
  title: 'BYB Components/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Sidebar>

const items = [
  { title: 'Home', icon: IconHome },
  { title: 'Inbox', icon: IconInbox },
  { title: 'Calendar', icon: IconCalendar },
  { title: 'Search', icon: IconSearch },
  { title: 'Settings', icon: IconSettings },
]

function Menu() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton>
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <Menu />
      </Sidebar>
      <main className="flex-1 p-6 text-body-5 text-muted-foreground">Sidebar layout: main content goes here.</main>
    </SidebarProvider>
  ),
}

/** The inset variant: from md up, the content sits in a raised panel inset from the screen edges. */
export const Inset: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <SidebarProvider>
      <Sidebar variant="inset">
        <Menu />
      </Sidebar>
      <SidebarInset>
        <div className="p-6 text-body-5 text-muted-foreground">Main content sits in the inset panel.</div>
      </SidebarInset>
    </SidebarProvider>
  ),
}
