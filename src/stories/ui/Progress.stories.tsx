import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress, ProgressLabel, ProgressValue } from '../../components/ui/progress'

const meta: Meta<typeof Progress> = {
  title: 'BYB Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'How far through a known amount of work something is.' } } },
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
          <div className="text-body-5 text-muted-foreground mb-1">{v}%</div>
          <Progress value={v} />
        </div>
      ))}
    </div>
  ),
}

/** With a label and the value as a percentage. */
export const WithLabel: Story = {
  render: () => (
    <Progress value={66} className="w-72">
      <ProgressLabel>Uploading contract</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
}
