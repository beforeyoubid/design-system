import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from '../../components/ui/spinner'

const meta: Meta<typeof Spinner> = {
  title: 'BYB Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    color: { control: 'select', options: ['mint', 'lime', 'navy', 'current'] },
    variant: { control: 'select', options: ['ring', 'dots'] },
  },
}

export default meta
type Story = StoryObj<typeof Spinner>

export const Default: Story = {}
export const Dots: Story = { args: { variant: 'dots' } }

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['ring', 'dots'] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-4">
          {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
            <Spinner key={size} variant={variant} size={size} />
          ))}
          {(['mint', 'lime', 'navy'] as const).map((color) => (
            <Spinner key={color} variant={variant} size="lg" color={color} />
          ))}
          <span className="inline-flex items-center gap-1 text-error-75">
            <Spinner variant={variant} color="current" /> current
          </span>
        </div>
      ))}
    </div>
  ),
}
