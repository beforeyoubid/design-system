import type { Meta, StoryObj } from '@storybook/react-vite'
import { BYBCard } from '../components/BYBCard'

const meta: Meta<typeof BYBCard> = {
  title: 'Components/BYBCard',
  component: BYBCard,
  tags: ['autodocs'],
  argTypes: {
    hoverable: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof BYBCard>

export const Default: Story = {
  args: {
    children: (
      <div>
        <p className="text-heading-sm text-dark-100 mb-2">Building Inspections</p>
        <p className="text-body-sm text-dark-75">Compare inspectors and buy shared reports at the best price.</p>
      </div>
    ),
  },
}

export const Hoverable: Story = {
  args: {
    hoverable: true,
    children: (
      <div>
        <p className="text-heading-sm text-dark-100 mb-2">Pest Inspections</p>
        <p className="text-body-sm text-dark-75">Qualified pest inspectors across every major Australian city.</p>
      </div>
    ),
  },
}

export const WithImage: Story = {
  args: {
    imageSlot: <div className="h-40 bg-mint-45 w-full" />,
    children: (
      <div>
        <p className="text-heading-sm text-dark-100 mb-2">Strata Reports</p>
        <p className="text-body-sm text-dark-75">Full strata history and levy forecasts before you commit.</p>
      </div>
    ),
  },
}

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {['Building Inspections', 'Pest Inspections', 'Strata Reports'].map(title => (
        <BYBCard key={title} hoverable>
          <p className="text-heading-sm text-dark-100 mb-2">{title}</p>
          <p className="text-body-sm text-dark-75">Description goes here for this inspection type.</p>
        </BYBCard>
      ))}
    </div>
  ),
}
