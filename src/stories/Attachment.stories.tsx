import type { Meta, StoryObj } from '@storybook/react-vite'
import { Attachment, FileUploadCard } from '../components/Attachment'

const meta: Meta<typeof Attachment> = {
  title: 'BYB Components/Attachment',
  component: Attachment,
  tags: ['autodocs'],
  render: (args) => (
    <div className="w-112">
      <Attachment {...args} />
    </div>
  ),
}

export default meta
type Story = StoryObj<typeof Attachment>

export const Default: Story = {}
/** Already-attached files (`defaultFiles`) show as `uploaded` cards: size, upload date, download and delete. */
export const WithFiles: Story = {
  args: {
    defaultFiles: [
      { name: 'Contract of sale.pdf', size: 4_200_000, uploadedAt: new Date(2026, 9, 12), url: '#' },
      { name: 'Section 32.docx', size: 860_000, uploadedAt: new Date(2026, 9, 14), url: '#' },
    ],
  },
}

/** Single upload with a file already attached: the card replaces the drop zone. */
export const SingleUploaded: Story = {
  name: 'Single, already attached',
  args: {
    multiple: false,
    label: 'Signed contract',
    optional: false,
    defaultFiles: [{ name: 'Contract of sale.pdf', size: 4_200_000, uploadedAt: new Date(2026, 9, 12), url: '#' }],
  },
}
export const Single: Story = { args: { multiple: false, label: 'Signed contract', optional: false } }
export const Error: Story = { args: { error: 'Attach the contract of sale to continue.' } }
export const Disabled: Story = { args: { disabled: true } }

export const FileCards: Story = {
  render: () => (
    <div className="flex w-112 flex-col gap-2">
      <FileUploadCard name="Building report.pdf" size={4_200_000} progress={45} status="uploading" />
      <FileUploadCard name="Pest report.pdf" size={1_800_000} status="completed" />
      <FileUploadCard name="Strata report.pdf" size={3_100_000} status="error" onRetry={() => {}} />
    </div>
  ),
}

/**
 * `status="uploaded"`: a file that was already attached. Download (mint-75) and
 * delete (error-75) are icon-only with tooltips; hover changes colour only.
 */
export const UploadedCard: Story = {
  name: 'Uploaded (already attached)',
  render: () => (
    <div className="flex w-112 flex-col gap-2">
      <FileUploadCard
        name="Contract of sale.pdf"
        size={4_200_000}
        status="uploaded"
        uploadedAt={new Date(2026, 9, 12)}
        onDownload={() => {}}
        onRemove={() => {}}
      />
      <FileUploadCard
        name="Pest report.pdf"
        size={1_800_000}
        status="completed"
        onDownload={() => {}}
        onRemove={() => {}}
      />
    </div>
  ),
}
