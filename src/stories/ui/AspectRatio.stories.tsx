import type { Meta, StoryObj } from '@storybook/react-vite'
import { AspectRatio } from '../../components/ui/aspect-ratio'

const meta: Meta<typeof AspectRatio> = {
  title: 'shadcn/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AspectRatio>

export const Default: Story = {
  render: () => (
    <div className="w-[400px]">
      <AspectRatio ratio={16 / 9} className="bg-light-l2 rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">16:9</span>
      </AspectRatio>
    </div>
  ),
}

export const Square: Story = {
  render: () => (
    <div className="w-[200px]">
      <AspectRatio ratio={1} className="bg-mint-l3 rounded-lg flex items-center justify-center">
        <span className="text-mint-90">1:1</span>
      </AspectRatio>
    </div>
  ),
}
