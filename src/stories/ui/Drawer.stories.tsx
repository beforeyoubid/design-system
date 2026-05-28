import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../../components/ui/drawer'

const meta: Meta<typeof Drawer> = {
  title: 'shadcn/Drawer',
  component: Drawer,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Drawer>

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild><Button variant="outline">Open drawer</Button></DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Move goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 text-body-sm text-muted-foreground">Drawer body content.</div>
          <DrawerFooter>
            <Button>Save</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
}
