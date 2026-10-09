import type { Meta, StoryObj } from '@storybook/react-vite'
import { toast } from 'sonner'
import { Toast, showToast } from '../components/Toast'
import { Button } from '../components/ui/button'
import { Toaster } from '../components/ui/sonner'

const meta: Meta<typeof Toast> = {
  title: 'BYB Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: { tone: { control: 'select', options: ['success', 'warning', 'error'] } },
  args: {
    title: 'Report ordered',
    description: "We'll email you when it's ready.",
    onClose: () => {},
  },
  render: (args) => (
    <div className="w-110 max-w-full">
      <Toast {...args} />
    </div>
  ),
}

export default meta
type Story = StoryObj<typeof Toast>

export const Success: Story = {}
export const Warning: Story = {
  args: { tone: 'warning', title: 'Payment pending', description: 'Your card needs verification.' },
}
export const Error: Story = {
  args: { tone: 'error', title: 'Upload failed', description: 'Something went wrong.', actionLabel: 'Retry' },
}
export const WithAction: Story = { args: { title: 'Report archived', description: undefined, actionLabel: 'Undo' } }

export const Live: Story = {
  render: () => (
    <div className="flex gap-3">
      <Toaster />
      <Button onClick={() => showToast({ tone: 'success', title: 'Saved', description: 'Your changes were saved.' })}>
        Success (5s)
      </Button>
      <Button variant="tertiary" onClick={() => showToast({ tone: 'warning', title: 'Heads up', description: 'Report is delayed.' })}>
        Warning (8s)
      </Button>
      <Button variant="destructive" onClick={() => showToast({ tone: 'error', title: 'Upload failed', actionLabel: 'Retry' })}>
        Error (sticky)
      </Button>
    </div>
  ),
}

/** Plain sonner calls still work through the same `<Toaster />`. Prefer `showToast()` for BYB tones. */
export const SonnerDefaults: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex gap-2">
        <Button onClick={() => toast('Event has been created')}>Default</Button>
        <Button variant="tertiary" onClick={() => toast.success('Saved successfully')}>Success</Button>
        <Button variant="destructive" onClick={() => toast.error('Something went wrong')}>Error</Button>
      </div>
    </>
  ),
}
