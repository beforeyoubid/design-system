import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconCalendar, IconDots, IconFileText, IconHome, IconInbox, IconPlus, IconSearch, IconSettings } from '@tabler/icons-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
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

/** Every part: header search, a group action, menu actions and badges, a sub-menu, the three button sizes, the outline button, a loading row, a separator, the footer and the rail. */
export const AllParts: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarInput placeholder="Search reports" aria-label="Search reports" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Reports</SidebarGroupLabel>
            <SidebarGroupAction aria-label="New report">
              <IconPlus />
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <IconHome />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <IconInbox />
                    <span>Inbox</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>12</SidebarMenuBadge>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <IconFileText />
                    <span>My reports</span>
                  </SidebarMenuButton>
                  <SidebarMenuAction aria-label="More">
                    <IconDots />
                  </SidebarMenuAction>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton isActive>Building &amp; pest</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>Strata</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton size="sm" aria-disabled>
                        Archived
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton size="sm">
                    <IconCalendar />
                    <span>Calendar (sm)</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg">
                    <IconSearch />
                    <span>Search (lg)</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton variant="outline">
                    <IconSettings />
                    <span>Settings (outline)</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <IconSettings />
                <span>Account</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <div className="p-6 text-body-5 text-muted-foreground">Main content.</div>
      </SidebarInset>
    </SidebarProvider>
  ),
}

/** A sidebar that can't collapse, drawn in place in the layout with its own fill. */
export const NotCollapsible: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar collapsible="none">
        <Menu />
      </Sidebar>
      <main className="flex-1 p-6 text-body-5 text-muted-foreground">Main content.</main>
    </SidebarProvider>
  ),
}
