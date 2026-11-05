import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FileUpload, type FileUploadPresignFn } from '../components/file-upload'
import { Field, FieldDescription, FieldError, FieldLabel } from '../components/field'
import { Button } from '../components/button'
import { Toaster } from '../components/toast'

/**
 * A pretend S3 for the stories: PUTs to fake-s3.example take a couple of
 * seconds, report progress and succeed, unless the path contains "fail".
 * Every other request goes to the real XMLHttpRequest.
 */
const FAKE_S3 = 'https://fake-s3.example/'
if (typeof window !== 'undefined' && !(window.XMLHttpRequest as { fake?: boolean }).fake) {
  const Real = window.XMLHttpRequest
  class FakeS3Request {
    static fake = true
    private real: XMLHttpRequest | null = null
    private url = ''
    private timer: ReturnType<typeof setInterval> | undefined
    upload: { onprogress: ((e: ProgressEvent) => void) | null } = { onprogress: null }
    status = 0
    onload: (() => void) | null = null
    onerror: (() => void) | null = null
    onabort: (() => void) | null = null
    open(method: string, url: string) {
      this.url = url
      if (!url.startsWith(FAKE_S3)) {
        this.real = new Real()
        this.real.open(method, url)
      }
    }
    setRequestHeader(name: string, value: string) {
      this.real?.setRequestHeader(name, value)
    }
    send(body: File) {
      if (this.real) {
        Object.assign(this.real, { onload: this.onload, onerror: this.onerror, onabort: this.onabort })
        this.real.upload.onprogress = this.upload.onprogress
        this.real.send(body)
        return
      }
      let loaded = 0
      const total = body.size || 1
      this.timer = setInterval(() => {
        loaded = Math.min(total, loaded + total * (0.08 + Math.random() * 0.14))
        this.upload.onprogress?.({ lengthComputable: true, loaded, total } as ProgressEvent)
        if (loaded >= total) {
          clearInterval(this.timer)
          this.status = this.url.includes('fail') ? 500 : 200
          this.onload?.()
        }
      }, 250)
    }
    abort() {
      if (this.real) return this.real.abort()
      clearInterval(this.timer)
      this.onabort?.()
    }
  }
  window.XMLHttpRequest = FakeS3Request as unknown as typeof XMLHttpRequest
}

/** Stands in for an app's "prepare upload" mutation. */
const presign: FileUploadPresignFn = async (file) =>
  `${FAKE_S3}uploads/${encodeURIComponent(file.name)}?X-Amz-Signature=story`
const presignThatFails: FileUploadPresignFn = async (file) =>
  `${FAKE_S3}fail/${encodeURIComponent(file.name)}?X-Amz-Signature=story`

const meta: Meta<typeof FileUpload> = {
  title: 'BYB Components/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Upload files with a drop zone, a progress list, retry and delete (with confirmation). Uploads straight to S3 through a presigned URL from the app.' } } },
  decorators: [
    (Story) => (
      <div className="w-112">
        <Story />
        <Toaster />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof FileUpload>

/** No `uploadOptions`: behaves like a file input. The value is `File[]`. */
export const Default: Story = {
  render: () => <FileUpload multiple accept=".pdf,.docx" />,
}

/** One file: its card takes the drop zone's place, and deleting it brings the zone back. */
export const Single: Story = {
  render: () => <FileUpload accept=".pdf,.docx" />,
}

/**
 * `uploadOptions`: each file uploads as soon as it's picked, with progress and
 * cancel. The value is the file's URL. Delete asks first and offers Undo.
 */
export const Upload: Story = {
  render: () => {
    const [value, setValue] = React.useState<string[]>([])
    return (
      <div className="flex flex-col gap-3">
        <FileUpload
          multiple
          accept=".pdf,.docx"
          maxSize={28 * 1024 * 1024}
          uploadOptions={{ presign }}
          value={value}
          onValueChange={setValue}
          confirmDelete
          deleteToast
        />
        <pre className="text-caption-1 text-dark-75">value: {JSON.stringify(value, null, 1)}</pre>
      </div>
    )
  },
}

export const UploadSingle: Story = {
  name: 'Upload, one file',
  render: () => <FileUpload accept=".pdf" uploadOptions={{ presign }} />,
}

/** Values saved earlier show as uploaded cards. A URL value is named from its path. */
export const SavedFiles: Story = {
  render: () => (
    <FileUpload
      multiple
      uploadOptions={{ presign }}
      defaultValue={[
        'https://bucket.s3.amazonaws.com/orders/123/Contract%20of%20sale.pdf',
        'https://bucket.s3.amazonaws.com/orders/123/Section%2032.docx',
      ]}
    />
  ),
}

/** A failed upload shows the error and Retry, which asks for a new URL. */
export const UploadFails: Story = {
  render: () => <FileUpload multiple uploadOptions={{ presign: presignThatFails }} />,
}

/** A file that fails `accept` or `maxSize` is refused with a message. */
export const RefusedFile: Story = {
  render: () => <FileUpload multiple accept=".pdf" maxSize={1024 * 1024} />,
}

/** The size limit in megabytes rather than bytes. */
export const MaxSizeMb: Story = {
  name: 'Max size in MB',
  render: () => <FileUpload multiple accept=".pdf,.docx" maxSizeMb={1} />,
}

export const Disabled: Story = {
  render: () => <FileUpload disabled />,
}

/** In a Field: the label points at the drop zone, and the error look follows aria-invalid. */
export const InAField: Story = {
  render: () => (
    <Field data-invalid>
      <FieldLabel htmlFor="contract">Contract of sale</FieldLabel>
      <FileUpload id="contract" accept=".pdf,.docx" uploadOptions={{ presign }} aria-invalid />
      <FieldDescription>PDF or DOCX, up to 28 MB.</FieldDescription>
      <FieldError>Attach the contract to continue.</FieldError>
    </Field>
  ),
}

/** A plain form: `name` puts the files in FormData, and `required` blocks submit until there's a file. */
export const InAPlainForm: Story = {
  render: () => {
    const [sent, setSent] = React.useState<string[] | null>(null)
    return (
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          const data = new FormData(e.currentTarget)
          setSent(data.getAll('documents').map((f) => (f instanceof File ? `${f.name} (${f.size} bytes)` : String(f))))
        }}
      >
        <FileUpload name="documents" multiple required />
        <Button type="submit" className="self-start">
          Submit
        </Button>
        {sent && <pre className="text-caption-1 text-dark-75">FormData documents: {JSON.stringify(sent, null, 1)}</pre>}
      </form>
    )
  },
}
