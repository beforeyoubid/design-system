import type { Meta, StoryObj } from '@storybook/react-vite'
import { Modal } from '../components/Modal'
import { Button } from '../components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog'

const meta: Meta<typeof Modal> = {
  title: 'BYB Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    trigger: 'Show dialog',
    description:
      'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
  },
}

export default meta
type Story = StoryObj<typeof Modal>

export const Default: Story = {}
export const Destructive: Story = {
  args: { destructive: true, title: 'Delete this report?', actionLabel: 'Delete', trigger: 'Delete report' },
}
export const CustomTrigger: Story = {
  args: { trigger: <Button variant="destructive">Cancel order</Button>, destructive: true },
}
export const OpenByDefault: Story = { args: { defaultOpen: true } }

/** Custom layouts: compose the AlertDialog primitives that Modal is built on. */
export const ComposedFromPrimitives: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive">Delete account</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}
