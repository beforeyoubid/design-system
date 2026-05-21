import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../components/ui/sheet'

const meta: Meta<typeof Sheet> = {
  title: 'shadcn/Sheet',
  component: Sheet,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Sheet>

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild><Button variant="outline">Open</Button></SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Update your details and save when you&apos;re done.</SheetDescription>
        </SheetHeader>
        <div className="py-4 text-body-sm text-muted-foreground">Sheet body content.</div>
        <SheetFooter><Button>Save changes</Button></SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild><Button variant="outline">Open left</Button></SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
}
