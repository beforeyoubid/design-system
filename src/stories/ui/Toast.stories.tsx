import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../components/button'
import {
  Toaster,
  createToastManager,
  toast,
  type ToastPendingType,
  type ToastType,
} from '../../components/toast'

const meta: Meta<typeof Toaster> = {
  title: 'BYB Components/Toast',
  component: Toaster,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    // Toasts are fixed to the viewport, so each story gets its own frame.
    docs: {
      description: { component: 'Brief news after an action, fired with toast.add({ type, title }) and shown by <Toaster /> mounted once at the app root.' },
      story: { inline: false, height: '280px' },
    },
  },
}

export default meta
type Story = StoryObj<typeof Toaster>

const COPY: Record<ToastType, { title: string; description: string }> = {
  success: { title: 'Inspection booked', description: "We've emailed the confirmation to you." },
  warning: { title: 'Please check your conditions', description: 'This is a warning toast' },
  error: { title: 'You are not verified', description: 'Please verify your last name' },
  info: { title: 'Report in progress', description: "We'll let you know when it's ready." },
  default: { title: 'Settings saved', description: 'Your preferences were updated.' },
}

/** One toast that stays open, on its own manager so stories don't share toasts. */
function Pinned({ type, withAction = false }: { type: ToastType; withAction?: boolean }) {
  const [manager] = React.useState(createToastManager)
  React.useEffect(() => {
    const id = manager.add({
      type,
      ...COPY[type],
      timeout: 0,
      actionProps: withAction ? { children: 'Undo', onClick: (e) => e.preventDefault() } : undefined,
    })
    return () => manager.close(id)
  }, [manager, type, withAction])
  return <Toaster toastManager={manager} />
}

/** `type: 'success'`: mint. Auto-dismisses after 5s. */
export const Success: Story = { render: () => <Pinned type="success" withAction /> }

/** `type: 'warning'`: amber. Auto-dismisses after 8s. */
export const Warning: Story = { render: () => <Pinned type="warning" /> }

/** `type: 'error'`: red. Stays until the user closes it. */
export const Error: Story = { render: () => <Pinned type="error" /> }

/** `type: 'info'`: light mint for neutral updates. Auto-dismisses after 5s. */
export const Info: Story = { render: () => <Pinned type="info" /> }

/** No type: neutral light-l2 fill with a bell icon. Auto-dismisses after 5s. */
export const Default: Story = { render: () => <Pinned type="default" /> }

/** In-flight `loading` toasts take their colour from `data.pendingType`. */
export const Loading: Story = {
  render: function Render() {
    const [manager] = React.useState(createToastManager)
    React.useEffect(() => {
      const titles: Record<ToastPendingType, string> = {
        error: 'Deleting report…',
        warning: 'Updating conditions…',
        info: 'Saving changes…',
      }
      const ids = (Object.keys(titles) as ToastPendingType[]).map((pendingType) =>
        manager.add({ type: 'loading', title: titles[pendingType], data: { pendingType } })
      )
      return () => ids.forEach((id) => manager.close(id))
    }, [manager])
    return <Toaster toastManager={manager} />
  },
}

/**
 * Real toasts on the app-wide `toast` manager.
 * Success 5s · warning 8s · error stays until closed · info / default 5s.
 */
export const Live: Story = {
  parameters: { docs: { story: { height: '420px' } } },
  render: () => (
    <div className="flex flex-wrap gap-3 p-6">
      <Toaster />
      <Button
        onClick={() =>
          toast.add({
            type: 'success',
            ...COPY.success,
            actionProps: { children: 'Undo', onClick: () => {} },
          })
        }
      >
        Success (5s)
      </Button>
      <Button variant="tertiary" onClick={() => toast.add({ type: 'warning', ...COPY.warning })}>
        Warning (8s)
      </Button>
      <Button variant="destructive" onClick={() => toast.add({ type: 'error', ...COPY.error })}>
        Error (stays)
      </Button>
      <Button variant="ghost" onClick={() => toast.add({ type: 'info', title: COPY.info.title })}>
        Info
      </Button>
      <Button variant="ghost" onClick={() => toast.add({ title: COPY.default.title })}>
        Default
      </Button>
      <Button variant="ghost" onClick={() => toast.close()}>
        Close all
      </Button>
    </div>
  ),
}

const wait = (ms: number, fail = false) =>
  new Promise<void>((resolve, reject) =>
    setTimeout(() => (fail ? reject(new globalThis.Error('Network error')) : resolve()), ms)
  )

/**
 * `toast.promise`: one toast that follows the action. While pending it shows a
 * spinner in `data.pendingType` (`error` red for deleting, `warning` amber for
 * risky changes, `info` light mint by default), then turns green on success or
 * red if it fails.
 */
export const PromiseStates: Story = {
  name: 'Promise states',
  parameters: { docs: { story: { height: '420px' } } },
  render: () => (
    <div className="flex flex-wrap gap-3 p-6">
      <Toaster />
      <Button
        variant="destructive"
        onClick={() =>
          toast.promise(wait(2000), {
            loading: { title: 'Deleting report…', description: '12 Smith St, Newtown', data: { pendingType: 'error' } },
            success: { title: 'Report deleted', description: '12 Smith St, Newtown' },
            error: "Couldn't delete the report",
          })
        }
      >
        Delete (red → green)
      </Button>
      <Button
        variant="tertiary"
        onClick={() =>
          toast.promise(wait(2000), {
            loading: { title: 'Updating conditions…', data: { pendingType: 'warning' } },
            success: 'Conditions updated',
            error: "Couldn't update conditions",
          })
        }
      >
        Warning (amber → green)
      </Button>
      <Button
        onClick={() =>
          toast.promise(wait(2000), {
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
          toast
            .promise(wait(2000, true), {
              loading: { title: 'Deleting report…', data: { pendingType: 'error' } },
              success: 'Report deleted',
              error: (e) => ({
                title: "Couldn't delete the report",
                description: e instanceof globalThis.Error ? e.message : 'Something went wrong',
              }),
            })
            .catch(() => {})
        }
      >
        Delete that fails (red → red)
      </Button>
    </div>
  ),
}
