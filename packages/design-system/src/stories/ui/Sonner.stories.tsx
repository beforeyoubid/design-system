import type { Meta, StoryObj } from '@storybook/react-vite'
import { toast } from 'sonner'
import { Button } from '../../components/ui/button'
import { Toaster } from '../../components/ui/sonner'

const meta: Meta = {
  title: 'shadcn/Sonner',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex gap-2">
        <Button onClick={() => toast('Event has been created')}>Default</Button>
        <Button variant="outline" onClick={() => toast.success('Saved successfully')}>Success</Button>
        <Button variant="destructive" onClick={() => toast.error('Something went wrong')}>Error</Button>
      </div>
    </>
  ),
}
