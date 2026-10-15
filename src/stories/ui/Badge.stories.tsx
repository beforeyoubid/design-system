import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge, type BadgeCategory, type BadgeProduct } from '../../components/ui/badge'

const meta: Meta<typeof Badge> = {
  title: 'BYB Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'gray', 'mint', 'lime', 'success', 'error', 'warning',
      ],
    },
    category: { control: { type: 'number', min: 1, max: 35 } },
    product: {
      control: 'select',
      options: [
        'bpi',
        'building-inspection',
        'pest-inspection',
        'strata-report',
        'owners-corp-cert',
        'pool-inspection',
        'electrical-report',
        'electrical-safety-cert',
        'plumbing-report',
        'handover-inspection',
        'valuations',
        'asbestos-testing',
        'dilapidation-report',
        'depreciation-schedule',
        'owner-builder-report',
        'minimum-standards',
        'new-building-inspection',
        'home-energy-rating',
        'bmc',
      ],
    },
    dot: { control: 'boolean' },
    spinner: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

const TONES = ['gray', 'mint', 'lime', 'success', 'error', 'warning'] as const
const CATEGORIES = Array.from({ length: 35 }, (_, i) => (i + 1) as BadgeCategory)

const PRODUCTS: { product: BadgeProduct; label: string }[] = [
  { product: 'bpi', label: 'Building & Pest Inspection' },
  { product: 'building-inspection', label: 'Building Inspection' },
  { product: 'pest-inspection', label: 'Pest Inspection' },
  { product: 'strata-report', label: 'Strata Inspection' },
  { product: 'owners-corp-cert', label: 'Owners Corporation Certificate (VIC)' },
  { product: 'pool-inspection', label: 'Pool Inspection' },
  { product: 'electrical-report', label: 'Electrical Inspection' },
  { product: 'electrical-safety-cert', label: 'Electrical Safety Certificate' },
  { product: 'plumbing-report', label: 'Plumbing Inspection' },
  { product: 'handover-inspection', label: 'Handover Inspection' },
  { product: 'valuations', label: 'Valuations' },
  { product: 'asbestos-testing', label: 'Asbestos Testing' },
  { product: 'dilapidation-report', label: 'Dilapidation Report' },
  { product: 'depreciation-schedule', label: 'Depreciation Schedule' },
  { product: 'owner-builder-report', label: 'Owner Builder Report' },
  { product: 'minimum-standards', label: 'Minimum Standards' },
  { product: 'new-building-inspection', label: 'New Build Inspection' },
  { product: 'home-energy-rating', label: 'Home Energy Rating' },
  { product: 'bmc', label: 'BMC' },
]

export const Default: Story = { args: { children: 'Badge', dot: true } }
export const Syncing: Story = { args: { variant: 'mint', spinner: true, children: 'Syncing' } }
export const Category: Story = { args: { category: 5, children: 'Category' } }
export const Product: Story = { args: { product: 'electrical-report', children: 'Electrical Inspection' } }

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {TONES.map((t) => <Badge key={t} variant={t} dot>{t}</Badge>)}
      </div>
      <div className="flex flex-wrap gap-2">
        {TONES.map((t) => <Badge key={t} variant={t}>{t}</Badge>)}
      </div>
      <div className="flex flex-wrap gap-2">
        {TONES.map((t) => <Badge key={t} variant={t} spinner>{t}</Badge>)}
      </div>
    </div>
  ),
}

export const Categories: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((c) => <Badge key={c} category={c}>Category {c}</Badge>)}
    </div>
  ),
}

export const Products: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {PRODUCTS.map(({ product, label }) => (
          <Badge key={product} product={product}>{label}</Badge>
        ))}
      </div>
      {/* Plain CSS class — usable outside React */}
      <div className="flex flex-wrap gap-2">
        {PRODUCTS.map(({ product, label }) => (
          <span
            key={product}
            className={`badge-product-${product} rounded-full px-2.5 py-0.5 text-body-5 font-medium`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  ),
}
