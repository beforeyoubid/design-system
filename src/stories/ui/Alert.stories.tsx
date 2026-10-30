import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconInfoCircle, IconAlertTriangle } from '@tabler/icons-react'
import { Button } from '../../components/button'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '../../components/ui/alert'

const meta: Meta<typeof Alert> = {
  title: 'BYB Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'A message that stays on the page: info, success, warning or destructive. For passing news use a toast instead.' } } },
}

export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  render: () => (
    <Alert className="w-full max-w-96">
      <IconInfoCircle className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app using the cli.</AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-full max-w-96">
      <IconAlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
    </Alert>
  ),
}

/** With a button on the right, which keeps the text clear of it. */
export const WithAction: Story = {
  render: () => (
    <Alert className="w-110">
      <IconInfoCircle />
      <AlertTitle>Your report is ready</AlertTitle>
      <AlertDescription>The building &amp; pest report for 12 Smith St, Newtown has arrived.</AlertDescription>
      <AlertAction>
        <Button size="sm">View</Button>
      </AlertAction>
    </Alert>
  ),
}
