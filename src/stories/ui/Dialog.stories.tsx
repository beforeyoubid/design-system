import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

const meta: Meta<typeof Dialog> = {
  title: 'BYB Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button>Edit profile</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here. Save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="Dean" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue="dean@beforeyoubuy.com.au" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="tertiary">Cancel</Button>} />
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const Confirm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive">Delete report</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this report?</DialogTitle>
          <DialogDescription>
            This permanently removes the building &amp; pest report for 12 Smith St. This can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="tertiary">Cancel</Button>} />
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const FooterCloseButton: Story = {
  name: 'Footer close button',
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="secondary">View details</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inspection booked</DialogTitle>
          <DialogDescription>Your inspector will arrive between 9:00 and 10:00 am on Thursday.</DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  ),
}

export const WithoutCloseIcon: Story = {
  name: 'Without × button',
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="tertiary">Open</Button>} />
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Terms updated</DialogTitle>
          <DialogDescription>Please review and accept the updated terms to continue.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button>Accept</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
