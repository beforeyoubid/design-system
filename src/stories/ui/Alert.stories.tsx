import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconInfoCircle, IconAlertTriangle } from '@tabler/icons-react'
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert'

const meta: Meta<typeof Alert> = {
  title: 'shadcn/Alert',
  component: Alert,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  render: () => (
    <Alert className="w-96">
      <IconInfoCircle className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app using the cli.</AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-96">
      <IconAlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
    </Alert>
  ),
}
