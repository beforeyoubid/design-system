import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bug, CircleAlert, FileText, TriangleAlert } from 'lucide-react'
import { IconTile } from '../components/icon-tile'
import { productBadges } from '../lib/product-badges'

const meta: Meta<typeof IconTile> = {
  title: 'BYB Components/IconTile',
  component: IconTile,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'An icon on a tinted rounded tile. The icon chip used by Card, Dialog headers and product menus.' } } },
  argTypes: {
    variant: { control: 'select', options: ['mint', 'navy', 'lime', 'warning', 'error', 'neutral'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    shape: { control: 'select', options: ['circle', 'square'] },
  },
  args: { icon: <Bug /> },
}

export default meta
type Story = StoryObj<typeof IconTile>

const VARIANTS = ['mint', 'navy', 'lime', 'warning', 'error', 'neutral'] as const
const SIZES = ['sm', 'md', 'lg'] as const

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex gap-3">
      <IconTile variant="mint" icon={<FileText />} />
      <IconTile variant="navy" icon={<FileText />} />
      <IconTile variant="lime" icon={<FileText />} />
      <IconTile variant="warning" icon={<TriangleAlert />} />
      <IconTile variant="error" icon={<CircleAlert />} />
      <IconTile variant="neutral" icon={<Bug />} />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          {SIZES.map((size) => (
            <IconTile key={size} variant={variant} size={size} icon={<Bug />} />
          ))}
          {SIZES.map((size) => (
            <IconTile key={`sq-${size}`} variant={variant} size={size} shape="square" icon={<Bug />} />
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
          <IconTile variant="neutral" size="sm" icon={<Icon />} />
          <span className="text-body-5 text-dark-90">{label}</span>
        </div>
      ))}
    </div>
  ),
}
