import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconBold, IconItalic, IconUnderline } from '@tabler/icons-react'
import { Toggle } from '../../components/ui/toggle'

const meta: Meta<typeof Toggle> = {
  title: 'BYB Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'A button that stays pressed or unpressed.' } } },
}

export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {
  render: () => <Toggle aria-label="Toggle bold"><IconBold className="h-4 w-4" /></Toggle>,
}

export const Outline: Story = {
  render: () => <Toggle variant="outline" aria-label="Toggle italic"><IconItalic className="h-4 w-4" /></Toggle>,
}

export const All: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toggle aria-label="Bold"><IconBold className="h-4 w-4" /></Toggle>
      <Toggle aria-label="Italic"><IconItalic className="h-4 w-4" /></Toggle>
      <Toggle aria-label="Underline"><IconUnderline className="h-4 w-4" /></Toggle>
    </div>
  ),
}

/** The three sizes, icon only and with a label beside the icon. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <div key={size} className="flex items-center gap-2">
          <Toggle size={size} aria-label={`Bold (${size})`}>
            <IconBold />
          </Toggle>
          <Toggle size={size} variant="outline">
            <IconItalic data-icon="inline-start" />
            Italic
          </Toggle>
        </div>
      ))}
    </div>
  ),
}

/** Disabled, and invalid in a form. */
export const States: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toggle disabled aria-label="Bold (disabled)">
        <IconBold />
      </Toggle>
      <Toggle variant="outline" aria-invalid aria-label="Underline (invalid)">
        <IconUnderline />
      </Toggle>
    </div>
  ),
}
