import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress } from '../../components/ui/progress'

const meta: Meta<typeof Progress> = {
  title: 'shadcn/Progress',
  component: Progress,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {
  args: { value: 60 },
  render: (args) => <Progress className="w-72" {...args} />,
}

export const Stages: Story = {
  render: () => (
    <div className="w-72 space-y-3">
      {[10, 33, 66, 100].map((v) => (
        <div key={v}>
          <div className="text-body-sm text-muted-foreground mb-1">{v}%</div>
          <Progress value={v} />
        </div>
      ))}
    </div>
  ),
}
