import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScoreGauge, type ScoreGaugeProps } from '../components/score-gauge'

/** Story controls: the gauge's props plus on/off switches for its optional text. */
type ScoreGaugeStoryArgs = ScoreGaugeProps & {
  /** Shows the button under the legend. */
  showAction?: boolean
  /** Shows the status under the score. */
  showStatus?: boolean
  /** Shows the line under the dial. */
  showDescription?: boolean
  /** Legend name for each band. */
  improveLabel?: string
  risingLabel?: string
  topLabel?: string
}

const meta: Meta<ScoreGaugeStoryArgs> = {
  title: 'BYB Components/ScoreGauge',
  component: ScoreGauge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A score out of 100 on a half dial of ticks, coloured by band (Improve under 70, Rising 70–89, Top 90+), with the status, the points to the next band, a legend and an optional button. Use Progress for a plain completion bar.',
      },
    },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    variant: { control: 'inline-radio', options: ['navy', 'white'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    compact: { control: 'boolean', description: 'Just the dial, the score and the status.' },
    showAction: { control: 'boolean', description: 'In code: set `actionLabel` (and `onAction` or `actionHref`) to show the button.' },
    actionLabel: { control: 'text', if: { arg: 'showAction' } },
    showStatus: { control: 'boolean', description: 'In code: `statusLabel={null}` hides it.' },
    statusLabel: { control: 'text', description: 'Leave empty for the band’s status.', if: { arg: 'showStatus' } },
    showDescription: { control: 'boolean', description: 'In code: `description={null}` hides it.' },
    description: { control: 'text', description: 'Leave empty for the points to the next band.', if: { arg: 'showDescription' } },
    legend: { control: 'inline-radio', options: ['bands', 'none'] },
    scale: { control: 'inline-radio', options: ['labels', 'none'] },
    improveLabel: { control: 'text', description: '`labels={{ improve: … }}`' },
    risingLabel: { control: 'text', description: '`labels={{ rising: … }}`' },
    topLabel: { control: 'text', description: '`labels={{ top: … }}`' },
  },
  args: {
    value: 83,
    variant: 'navy',
    size: 'md',
    compact: false,
    showAction: true,
    actionLabel: 'See score details',
    showStatus: true,
    statusLabel: '',
    showDescription: true,
    description: '',
    legend: 'bands',
    scale: 'labels',
    improveLabel: 'Improve',
    risingLabel: 'Rising',
    topLabel: 'Top',
  },
  render: ({
    showAction,
    actionLabel,
    showStatus,
    statusLabel,
    showDescription,
    description,
    improveLabel,
    risingLabel,
    topLabel,
    ...args
  }) => (
    <ScoreGauge
      {...args}
      className={args.variant === 'white' ? 'border border-border' : undefined}
      actionLabel={showAction ? actionLabel : undefined}
      onAction={() => {}}
      statusLabel={!showStatus ? null : statusLabel || undefined}
      description={!showDescription ? null : description || undefined}
      labels={{ improve: improveLabel, rising: risingLabel, top: topLabel }}
    />
  ),
}

export default meta
type Story = StoryObj<ScoreGaugeStoryArgs>

export const Default: Story = {}
export const White: Story = { args: { variant: 'white' } }
export const NearTheTop: Story = { name: 'Score near the top (52)', args: { value: 52 } }
export const WithoutButton: Story = { name: 'Without button', args: { showAction: false } }
export const CustomText: Story = {
  name: 'Custom text',
  args: {
    value: 88,
    statusLabel: 'Almost there',
    description: '2 more five-star reviews to reach Top',
    actionLabel: 'View reviews',
    improveLabel: 'Building',
    risingLabel: 'Strong',
    topLabel: 'Leading',
  },
}
export const Minimal: Story = {
  name: 'No legend, scale or description',
  args: { showDescription: false, legend: 'none', scale: 'none', showAction: false },
}

export const Bands: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-6">
      {[52, 83, 95].map((value) => (
        <ScoreGauge key={value} value={value} variant={args.variant} size="sm" actionLabel="See details" />
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-end gap-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <ScoreGauge key={size} value={args.value} variant={args.variant} size={size} />
      ))}
    </div>
  ),
}

export const Compact: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-end gap-6">
      <ScoreGauge value={args.value} compact size="sm" />
      <ScoreGauge value={args.value} compact size="sm" variant="white" className="border border-border" />
      <ScoreGauge value={95} compact size="md" />
    </div>
  ),
}

export const WhiteSurface: Story = {
  name: 'White surface, every band',
  render: () => (
    <div className="flex flex-wrap gap-6">
      {[52, 83, 95].map((value) => (
        <ScoreGauge key={value} variant="white" size="sm" value={value} className="border border-border" />
      ))}
    </div>
  ),
}
