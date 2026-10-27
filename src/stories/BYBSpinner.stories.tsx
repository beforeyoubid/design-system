import type { Meta, StoryObj } from '@storybook/react-vite'
import { BYBSpinner } from '../components/BYBSpinner'

const meta: Meta<typeof BYBSpinner> = {
  title: 'BYB Components/BYBSpinner',
  component: BYBSpinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    color: { control: 'select', options: ['mint', 'lime', 'navy', 'current'] },
    variant: { control: 'select', options: ['ring', 'dots'] },
  },
}

export default meta
type Story = StoryObj<typeof BYBSpinner>

export const Default: Story = {}
export const Dots: Story = { args: { variant: 'dots' } }

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['ring', 'dots'] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-4">
          {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
            <BYBSpinner key={size} variant={variant} size={size} />
          ))}
          {(['mint', 'lime', 'navy'] as const).map((color) => (
            <BYBSpinner key={color} variant={variant} size="lg" color={color} />
          ))}
          <span className="inline-flex items-center gap-1 text-error-75">
            <BYBSpinner variant={variant} color="current" /> current
          </span>
        </div>
      ))}
    </div>
  ),
}
