import type { Meta, StoryObj } from '@storybook/react-vite'
import { CalendarCheck, CircleCheck, Info, Trash2, TriangleAlert } from 'lucide-react'
import { Button } from '../../components/ui/button'
import {
  ConfirmDialog,
  Dialog,
  DialogBody,
  DialogClose,
  DialogCollapsible,
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
        <DialogHeader icon={<Trash2 />} iconTone="error">
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

/** Every dialog uses the divided layout. Without an icon it's left-aligned; with one it's centred. Long content scrolls inside `DialogBody`. */
export const Layout: Story = {
  render: () => (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger render={<Button variant="tertiary">No icon</Button>} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inspection rescheduled</DialogTitle>
            <DialogDescription>Your building &amp; pest inspection has moved to 18/10/2026 at 10:30.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="tertiary">Close</Button>} />
            <Button>View booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger render={<Button variant="tertiary">With icon</Button>} />
        <DialogContent size="sm">
          <DialogHeader icon={<CircleCheck />} iconTone="mint">
            <DialogTitle>Report ordered</DialogTitle>
            <DialogDescription>We&apos;ll email you as soon as your report is ready to download.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button>Done</Button>} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger render={<Button variant="tertiary">Long content</Button>} />
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Terms of service</DialogTitle>
            <DialogDescription>Updated 16/10/2026</DialogDescription>
          </DialogHeader>
          <DialogBody className="flex flex-col gap-3 text-body-5 text-dark-90">
            {Array.from({ length: 12 }, (_, i) => (
              <p key={i} className="m-0">
                {i + 1}. Reports are prepared for the named purchaser and are valid for the property and date stated.
                Inspectors assess visible and accessible areas only; concealed defects may not be identified.
              </p>
            ))}
          </DialogBody>
          <DialogFooter>
            <DialogClose render={<Button variant="tertiary">Decline</Button>} />
            <DialogClose render={<Button>Accept</Button>} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2">
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Dialog key={size}>
          <DialogTrigger render={<Button variant="tertiary">{size}</Button>} />
          <DialogContent size={size}>
            <DialogHeader>
              <DialogTitle>Size {size}</DialogTitle>
              <DialogDescription>sm 384px · md 440px (default) · lg 480px · xl 640px.</DialogDescription>
            </DialogHeader>
            <DialogFooter showCloseButton />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
}

/** A header icon (IconTile) centres the header and the actions. */
export const WithIcon: Story = {
  name: 'With icon',
  render: () => (
    <div className="flex gap-2">
      {([
        ['mint', <CalendarCheck key="i" />, 'Inspection booked'],
        ['navy', <Info key="i" />, 'How reports work'],
        ['warning', <TriangleAlert key="i" />, 'Report is incomplete'],
        ['error', <Trash2 key="i" />, 'Delete this report?'],
      ] as const).map(([tone, icon, title]) => (
        <Dialog key={tone}>
          <DialogTrigger render={<Button variant="tertiary">{tone}</Button>} />
          <DialogContent>
            <DialogHeader icon={icon} iconTone={tone}>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>Icons come from Lucide and sit on an IconTile in the chosen tone.</DialogDescription>
            </DialogHeader>
            <DialogFooter showCloseButton />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
}

/** Ready-made confirm: same props the old `Modal` had, plus `icon`. */
export const Confirmation: Story = {
  name: 'ConfirmDialog',
  render: () => (
    <div className="flex gap-2">
      <ConfirmDialog
        trigger="Show dialog"
        description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
      />
      <ConfirmDialog
        trigger={<Button variant="destructive">Delete report</Button>}
        destructive
        icon={<Trash2 />}
        title="Delete this report?"
        description="This permanently removes the building & pest report for 12 Smith St."
        actionLabel="Delete"
      />
    </div>
  ),
}

export const Collapsible: Story = {
  name: 'Collapsible (view more / dropdown)',
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="tertiary">Order summary</Button>} />
      <DialogContent size="lg">
        <DialogHeader icon={<CalendarCheck />}>
          <DialogTitle>Order confirmed</DialogTitle>
          <DialogDescription>Building &amp; Pest Inspection for 12 Smith St, Richmond.</DialogDescription>
        </DialogHeader>
        <DialogCollapsible
          preview="Your inspector will arrive between 9:00 and 10:00 am on Thursday 16/10/2026."
          label="View more"
        >
          <p className="mt-2">
            Please make sure the roof space, subfloor and all rooms are accessible. The report is usually ready within
            24 hours and will be emailed to you and your conveyancer.
          </p>
        </DialogCollapsible>
        <DialogCollapsible variant="dropdown" label="What's included">
          <ul className="list-disc ps-5">
            <li>Structural defects</li>
            <li>Timber pest activity</li>
            <li>Moisture readings</li>
          </ul>
        </DialogCollapsible>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  ),
}
