import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'

const meta: Meta<typeof Tabs> = {
  title: 'shadcn/Tabs',
  component: Tabs,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-96">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="text-body-sm text-muted-foreground py-4">
        Update your account details.
      </TabsContent>
      <TabsContent value="password" className="text-body-sm text-muted-foreground py-4">
        Change your password.
      </TabsContent>
      <TabsContent value="notifications" className="text-body-sm text-muted-foreground py-4">
        Manage your notification preferences.
      </TabsContent>
    </Tabs>
  ),
}
