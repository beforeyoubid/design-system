import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bug, CircleAlert, FileText, TriangleAlert } from 'lucide-react'
import { IconTile } from '../../components/ui/icon-tile'
import { productBadges } from '../../lib/product-badges'

const meta: Meta<typeof IconTile> = {
  title: 'BYB Components/IconTile',
  component: IconTile,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: ['mint', 'navy', 'lime', 'warning', 'error', 'neutral'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    shape: { control: 'select', options: ['circle', 'square'] },
  },
  args: { icon: <Bug /> },
}

export default meta
type Story = StoryObj<typeof IconTile>

const TONES = ['mint', 'navy', 'lime', 'warning', 'error', 'neutral'] as const
const SIZES = ['sm', 'md', 'lg'] as const

export const Default: Story = {}

export const Tones: Story = {
  render: () => (
    <div className="flex gap-3">
      <IconTile tone="mint" icon={<FileText />} />
      <IconTile tone="navy" icon={<FileText />} />
      <IconTile tone="lime" icon={<FileText />} />
      <IconTile tone="warning" icon={<TriangleAlert />} />
      <IconTile tone="error" icon={<CircleAlert />} />
      <IconTile tone="neutral" icon={<Bug />} />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {TONES.map((tone) => (
        <div key={tone} className="flex items-center gap-3">
          {SIZES.map((size) => (
            <IconTile key={size} tone={tone} size={size} icon={<Bug />} />
          ))}
          {SIZES.map((size) => (
            <IconTile key={`sq-${size}`} tone={tone} size={size} shape="square" icon={<Bug />} />
          ))}
        </div>
      ))}
    </div>
  ),
}

export const ProductIcons: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      {productBadges.map(({ key, label, icon: Icon }) => (
        <div key={key} className="flex items-center gap-2">
          <IconTile tone="neutral" size="sm" icon={<Icon />} />
          <span className="text-body-5 text-dark-90">{label}</span>
        </div>
      ))}
    </div>
  ),
}
