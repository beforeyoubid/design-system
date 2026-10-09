import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../../components/ui/badge'

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
    category: { control: { type: 'number', min: 1, max: 16 } },
    dot: { control: 'boolean' },
    spinner: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

const TONES = ['gray', 'mint', 'lime', 'success', 'error', 'warning'] as const
const CATEGORIES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] as const

export const Default: Story = { args: { children: 'Badge', dot: true } }
export const Syncing: Story = { args: { variant: 'mint', spinner: true, children: 'Syncing' } }
export const Category: Story = { args: { category: 5, children: 'Category' } }

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
