import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../components/ui/button'
import { Toast, Toaster, sonner } from '../../components/ui/sonner'

const meta: Meta<typeof Toast> = {
  title: 'BYB Components/Sonner',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: ['success', 'warning', 'error', 'info', 'default'] },
  },
  args: {
    title: 'Inspection booked',
    description: "We've emailed the confirmation to you.",
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

/** `sonner.success`: mint. Auto-dismisses after 5s. */
export const Success: Story = {
  args: { tone: 'success', actionLabel: 'Undo' },
}

/** `sonner.warning`: amber. Auto-dismisses after 8s. */
export const Warning: Story = {
  args: { tone: 'warning', title: 'Please check your conditions', description: 'This is a warning toast' },
}

/** `sonner.error`: red. Stays until the user closes it. */
export const Error: Story = {
  args: { tone: 'error', title: 'You are not verified', description: 'Please verify your last name' },
}

/** `sonner.info`: light mint for neutral updates. Auto-dismisses after 5s. */
export const Info: Story = {
  args: { tone: 'info', title: 'Report in progress', description: "We'll let you know when it's ready." },
}

/** Plain `sonner()`: neutral light-l2 fill with a bell icon. Auto-dismisses after 5s. */
export const Default: Story = {
  args: { tone: 'default', title: 'Settings saved', description: 'Your preferences were updated.' },
}

/** Action without a description. */
export const WithAction: Story = {
  args: { tone: 'success', title: 'Report archived', description: undefined, actionLabel: 'Undo' },
}

/** Placement + dismissal rule shown beside the toasts. */
function SonnerRule() {
  return (
    <div className="flex w-60 shrink-0 flex-col gap-3">
      <span className="text-overline text-dark-90">Desktop · bottom right</span>
      <div className="relative h-28 rounded-2xl border border-dark-15 bg-light-l1">
        <div className="absolute end-2 bottom-2 h-5 w-24 rounded-md bg-mint-l3" />
      </div>
      <span className="mt-2 text-overline text-dark-90">Mobile · full width</span>
      <div className="relative h-36 w-20 rounded-2xl border border-dark-15 bg-light-l1">
        <div className="absolute inset-x-1 bottom-1 h-5 rounded-md bg-mint-l3" />
      </div>
      <p className="m-0 mt-2 text-body-5 text-dark-75">
        Success 5s · Warning 8s · Error stays until closed · Info and default 5s
      </p>
    </div>
  )
}

/**
 * Every variant, with the placement and dismissal rule:
 * desktop bottom-right (440px), mobile full-width bottom; success 5s,
 * warning 8s, error stays until closed, info / default 5s.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-10">
      <div className="flex w-110 max-w-full flex-col gap-3">
        <Toast tone="success" title="Inspection booked" description="We've emailed the confirmation to you." actionLabel="Undo" onClose={() => {}} />
        <Toast tone="warning" title="Please check your conditions" description="This is a warning toast" onClose={() => {}} />
        <Toast tone="error" title="You are not verified" description="Please verify your last name" onClose={() => {}} />
        <Toast tone="info" title="Report in progress" description="We'll let you know when it's ready." onClose={() => {}} />
        <Toast tone="default" title="Settings saved" description="Your preferences were updated." onClose={() => {}} />
      </div>
      <SonnerRule />
    </div>
  ),
}

/**
 * Real toasts. Desktop: bottom-right, 440px. Mobile: full-width bottom.
 * Success 5s · warning 8s · error stays until closed · info / default 5s.
 */
export const Live: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Toaster />
      <Button
        onClick={() =>
          sonner.success('Inspection booked', {
            description: "We've emailed the confirmation to you.",
            action: { label: 'Undo', onClick: () => {} },
          })
        }
      >
        Success (5s)
      </Button>
      <Button
        variant="tertiary"
        onClick={() => sonner.warning('Please check your conditions', { description: 'This is a warning toast' })}
      >
        Warning (8s)
      </Button>
      <Button
        variant="destructive"
        onClick={() => sonner.error('You are not verified', { description: 'Please verify your last name' })}
      >
        Error (stays)
      </Button>
      <Button variant="ghost" onClick={() => sonner.info('Report in progress')}>
        Info
      </Button>
      <Button variant="ghost" onClick={() => sonner('Settings saved')}>
        Default
      </Button>
      <Button variant="ghost" onClick={() => sonner.loading('Uploading report…')}>
        Loading
      </Button>
    </div>
  ),
}

const wait = (ms: number, fail = false) =>
  new Promise<void>((resolve, reject) => setTimeout(() => (fail ? reject(new globalThis.Error('Network error')) : resolve()), ms))

/**
 * `sonner.promise`: one toast that follows the action. While pending it shows a
 * spinner in the action's tone (`tone="error"` red for deleting, `"warning"`
 * amber for risky changes, `"info"` light mint by default), then turns green on
 * success or red if it fails.
 */
export const PromiseStates: Story = {
  name: 'Promise states',
  render: () => (
    <div className="flex flex-wrap items-start gap-10">
      <div className="flex w-110 max-w-full flex-col gap-3">
        <Toast loading tone="error" title="Deleting report…" description="12 Smith St, Newtown" onClose={() => {}} />
        <Toast loading tone="warning" title="Updating conditions…" onClose={() => {}} />
        <Toast loading tone="info" title="Saving changes…" onClose={() => {}} />
        <Toast tone="success" title="Report deleted" description="12 Smith St, Newtown" onClose={() => {}} />
        <Toast tone="error" title="Couldn't delete the report" description="Network error" onClose={() => {}} />
      </div>
      <div className="flex flex-col gap-3">
        <Toaster />
        <Button
          variant="destructive"
          onClick={() =>
            sonner.promise(wait(2000), {
              tone: 'error',
              loading: 'Deleting report…',
              description: '12 Smith St, Newtown',
              success: 'Report deleted',
              successDescription: '12 Smith St, Newtown',
              error: "Couldn't delete the report",
            })
          }
        >
          Delete (red → green)
        </Button>
        <Button
          variant="tertiary"
          onClick={() =>
            sonner.promise(wait(2000), {
              tone: 'warning',
              loading: 'Updating conditions…',
              success: 'Conditions updated',
              error: "Couldn't update conditions",
            })
          }
        >
          Warning (amber → green)
        </Button>
        <Button
          onClick={() =>
            sonner.promise(wait(2000), {
              loading: 'Saving changes…',
              success: 'Changes saved',
              error: "Couldn't save changes",
            })
          }
        >
          Save (mint → green)
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            sonner.promise(wait(2000, true), {
              tone: 'error',
              loading: 'Deleting report…',
              success: 'Report deleted',
              error: "Couldn't delete the report",
              errorDescription: (e) => (e instanceof globalThis.Error ? e.message : 'Something went wrong'),
            })
          }
        >
          Delete that fails (red → red)
        </Button>
      </div>
    </div>
  ),
}

/** All tones fired at once and kept open (stacked like in an app). */
export const LiveStack: Story = {
  render: function Render() {
    React.useEffect(() => {
      const keep = { duration: Infinity }
      sonner.success('Inspection booked', {
        ...keep,
        description: "We've emailed the confirmation to you.",
        action: { label: 'Undo', onClick: () => {} },
      })
      sonner.warning('Please check your conditions', { ...keep, description: 'This is a warning toast' })
      sonner.error('You are not verified', { ...keep, description: 'Please verify your last name' })
      return () => {
        sonner.dismiss()
      }
    }, [])
    return (
      <div className="h-120">
        <Toaster expand />
      </div>
    )
  },
}
