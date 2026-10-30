import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconAlertCircle, IconCircleCheck, IconDownload, IconFileText, IconTrash, IconX } from '@tabler/icons-react'
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentError,
  AttachmentProgress,
  AttachmentStatus,
  AttachmentTitle,
} from '../../components/attachment'
import { Spinner } from '../../components/spinner'

type State = 'idle' | 'uploading' | 'processing' | 'error' | 'done'

const DESCRIPTION: Record<State, string> = {
  idle: 'Ready to upload',
  uploading: 'Uploading… 42%',
  processing: 'Processing…',
  error: 'Upload failed. Try again.',
  done: '4 MB · Uploaded 12 Oct 2026',
}

function File({
  state = 'done',
  size,
  orientation,
}: {
  state?: State
  size?: 'default' | 'sm' | 'xs'
  orientation?: 'horizontal' | 'vertical'
}) {
  const busy = state === 'uploading' || state === 'processing'
  return (
    <Attachment state={state} size={size} orientation={orientation}>
      <AttachmentMedia>{busy ? <Spinner /> : <IconFileText />}</AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Contract of sale.pdf</AttachmentTitle>
        <AttachmentDescription>{DESCRIPTION[state]}</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        {state === 'done' && (
          <AttachmentAction aria-label="Download">
            <IconDownload />
          </AttachmentAction>
        )}
        <AttachmentAction aria-label={busy ? 'Cancel' : 'Delete'}>
          {busy ? <IconX /> : <IconTrash />}
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  )
}

const meta: Meta<typeof Attachment> = {
  title: 'BYB Components/Attachment',
  component: Attachment,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'One file in an upload list: name, size, status (uploading, completed, error, uploaded) and actions.' } } },
}

export default meta
type Story = StoryObj<typeof Attachment>

/** Every `state`: idle, uploading, processing, error, done. */
export const States: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-3">
      {(['idle', 'uploading', 'processing', 'error', 'done'] as const).map((state) => (
        <File key={state} state={state} />
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-3">
      <File size="default" />
      <File size="sm" />
      <File size="xs" />
    </div>
  ),
}

/** Vertical cards in a scrolling `AttachmentGroup`. */
export const VerticalGroup: Story = {
  render: () => (
    <div className="w-96">
      <AttachmentGroup>
        <File orientation="vertical" />
        <File orientation="vertical" state="uploading" />
        <File orientation="vertical" state="error" />
        <File orientation="vertical" />
      </AttachmentGroup>
    </div>
  ),
}

/**
 * Our Attachment adds `status` (uploading, completed, error, uploaded) and three
 * parts: AttachmentStatus, AttachmentProgress and AttachmentError. FileUpload
 * draws its cards like this.
 */
export const UploadStatuses: Story = {
  render: () => (
    <div className="flex w-112 flex-col gap-2">
      <Attachment status="uploading" className="w-full">
        <AttachmentMedia><IconFileText /></AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Building report.pdf</AttachmentTitle>
          <AttachmentDescription>
            2 MB / 4 MB · <AttachmentStatus><Spinner variant="dots" aria-hidden />Uploading</AttachmentStatus>
          </AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Cancel upload"><IconX /></AttachmentAction>
        </AttachmentActions>
        <AttachmentProgress value={45} aria-label="Uploading Building report.pdf" />
      </Attachment>
      <Attachment status="completed" className="w-full">
        <AttachmentMedia><IconFileText /></AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Pest report.pdf</AttachmentTitle>
          <AttachmentDescription>
            2 MB · <AttachmentStatus><IconCircleCheck />Completed</AttachmentStatus>
          </AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Download"><IconDownload /></AttachmentAction>
          <AttachmentAction aria-label="Delete"><IconTrash /></AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment status="error" className="w-full">
        <AttachmentMedia><IconFileText /></AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Strata report.pdf</AttachmentTitle>
          <AttachmentDescription>
            3 MB · <AttachmentStatus><IconAlertCircle />Failed</AttachmentStatus>
          </AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Delete"><IconTrash /></AttachmentAction>
        </AttachmentActions>
        <AttachmentError onRetry={() => {}}>Upload failed. Please try again.</AttachmentError>
      </Attachment>
      <Attachment status="uploaded" className="w-full">
        <AttachmentMedia><IconFileText /></AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Contract of sale.pdf</AttachmentTitle>
          <AttachmentDescription>4 MB · Uploaded 12 Oct 2026</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Download"><IconDownload /></AttachmentAction>
          <AttachmentAction aria-label="Delete"><IconTrash /></AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  ),
}
