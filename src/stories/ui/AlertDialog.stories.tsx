import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconTrash } from '@tabler/icons-react'
import { Button } from '../../components/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog'

const meta: Meta<typeof AlertDialog> = {
  title: 'BYB Components/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'A modal that interrupts for a decision the user must make. For a confirm-then-act step prefer ConfirmDialog.' } } },
}

export default meta
type Story = StoryObj<typeof AlertDialog>

/** The stock confirm dialog. For a delete flow use ConfirmDialog, which wraps this. */
export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="tertiary" />}>Cancel inspection</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this inspection?</AlertDialogTitle>
          <AlertDialogDescription>The inspector will be told, and you’ll get a full refund.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep it</AlertDialogCancel>
          <AlertDialogAction>Cancel inspection</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

/** With an icon beside the title. */
export const WithMedia: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="tertiary" />}>Delete report</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <IconTrash />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete this report?</AlertDialogTitle>
          <AlertDialogDescription>The building &amp; pest report for 12 Smith St, Newtown will be permanently deleted.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep it</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

/** The small size: centred, with the two buttons side by side. */
export const Small: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="tertiary" />}>Sign out</AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Sign out?</AlertDialogTitle>
          <AlertDialogDescription>You’ll need to sign in again to see your reports.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay</AlertDialogCancel>
          <AlertDialogAction>Sign out</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}
