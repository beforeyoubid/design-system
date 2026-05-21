import type { Meta, StoryObj } from '@storybook/react-vite'
import { Home, Inbox, Calendar as CalendarIcon, Search, Settings } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '../../components/ui/sidebar'

const meta: Meta<typeof Sidebar> = {
  title: 'shadcn/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Sidebar>

const items = [
  { title: 'Home', icon: Home },
  { title: 'Inbox', icon: Inbox },
  { title: 'Calendar', icon: CalendarIcon },
  { title: 'Search', icon: Search },
  { title: 'Settings', icon: Settings },
]

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
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
      </Sidebar>
      <main className="flex-1 p-6 text-body-sm text-muted-foreground">Sidebar layout — main content goes here.</main>
    </SidebarProvider>
  ),
}
