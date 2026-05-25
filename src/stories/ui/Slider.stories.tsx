import type { Meta, StoryObj } from '@storybook/react-vite'
import { Slider } from '../../components/ui/slider'

const meta: Meta<typeof Slider> = {
  title: 'shadcn/Slider',
  component: Slider,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = {
  render: () => <Slider className="w-72" defaultValue={[50]} max={100} step={1} />,
}

export const Range: Story = {
  render: () => <Slider className="w-72" defaultValue={[25, 75]} max={100} step={1} />,
}
