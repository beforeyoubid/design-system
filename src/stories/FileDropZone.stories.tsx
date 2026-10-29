import type { Meta, StoryObj } from '@storybook/react-vite'
import { FileDropZone } from '../components/file-drop-zone'

/** The drop zone on its own. FileUpload uses it; most apps want FileUpload. */
const meta: Meta<typeof FileDropZone> = {
  title: 'BYB Components/FileDropZone',
  component: FileDropZone,
  tags: ['autodocs'],
  render: (args) => (
    <div className="w-112">
      <FileDropZone {...args} />
    </div>
  ),
}

export default meta
type Story = StoryObj<typeof FileDropZone>

export const Default: Story = {}
export const Multiple: Story = { args: { multiple: true } }
export const Invalid: Story = { args: { 'aria-invalid': true } }
export const Disabled: Story = { args: { disabled: true } }
