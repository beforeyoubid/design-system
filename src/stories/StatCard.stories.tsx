import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconClock, IconFlame, IconStar, IconTrendingUp } from '@tabler/icons-react'
import {
  StatCard,
  type StatCardProps,
  StatCardStatus,
  StatCardStatusDescription,
  StatCardStatusTitle,
  StatCardTitle,
  StatCardValue,
} from '../components/stat-card'

/** Story controls: the card's own props plus the title tooltip. */
type StatCardStoryArgs = StatCardProps & {
  /** Show the info icon and its tooltip beside the title. */
  showInfo?: boolean
  /** What the tooltip says. */
  info?: string
  /** Shows the round icon before the status text. */
  showStatusIcon?: boolean
  /** Which icon: the variant's own, or one passed in. */
  statusIcon?: 'variant' | 'clock' | 'trending' | 'star' | 'flame'
}

const STATUS_ICONS = {
  clock: <IconClock />,
  trending: <IconTrendingUp />,
  star: <IconStar />,
  flame: <IconFlame />,
} as const

const meta: Meta<StatCardStoryArgs> = {
  title: 'BYB Components/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A dashboard stat with a status line under it, ringed by a halo that pulses in the status colour (default, success, warning, error). Use Counter for a marketing figure with no status.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['default', 'success', 'warning', 'error'] },
    motion: {
      control: 'inline-radio',
      options: ['pulse', 'none'],
      description: 'Turns the halo pulse on (`pulse`, default) or off (`none`) for this card.',
    },
    showInfo: {
      control: 'boolean',
      description: 'Shows the info icon beside the title. In code: set `info` on `StatCardTitle` to show it, leave it out to hide it.',
    },
    info: {
      control: 'text',
      description: 'Tooltip text (`StatCardTitle info="…"`).',
      if: { arg: 'showInfo' },
    },
    showStatusIcon: {
      control: 'boolean',
      description: 'Shows the round status icon. In code: `StatCardStatus icon={null}` hides it.',
    },
    statusIcon: {
      control: 'select',
      options: ['variant', 'clock', 'trending', 'star', 'flame'],
      description: "`variant` uses the variant's icon (leave `icon` out); the others pass `icon={<IconClock />}` etc.",
      if: { arg: 'showStatusIcon' },
    },
  },
  args: {
    showStatusIcon: true,
    statusIcon: 'variant',
    showInfo: true,
    info: 'Average time from inspection to report, over the last 30 days.',
  },
}

export default meta
type Story = StoryObj<StatCardStoryArgs>

const EXAMPLES = {
  default: { value: '48 hrs', title: 'On the BYB standard', description: 'BYB standard: Max 3d' },
  success: { value: '36 hrs', title: '25% faster than standard', description: 'BYB standard: Max 3d' },
  warning: { value: '46 hrs', title: 'Close to the standard', description: 'BYB standard: Max 3d' },
  error: { value: '55 hrs', title: '15% slower than standard', description: 'BYB standard: Max 3d' },
} as const

const render: Story['render'] = ({ showInfo, info, showStatusIcon, statusIcon, ...args }) => {
  const example = EXAMPLES[args.variant ?? 'default']
  return (
    <StatCard {...args} className="max-w-sm">
      <StatCardTitle info={showInfo ? info : undefined}>Report turnaround</StatCardTitle>
      <StatCardValue>{example.value}</StatCardValue>
      <StatCardStatus
        icon={
          !showStatusIcon ? null : statusIcon && statusIcon !== 'variant' ? STATUS_ICONS[statusIcon] : undefined
        }
      >
        <StatCardStatusTitle>{example.title}</StatCardStatusTitle>
        <StatCardStatusDescription>{example.description}</StatCardStatusDescription>
      </StatCardStatus>
    </StatCard>
  )
}

export const Default: Story = { args: { variant: 'default' }, render }
export const Success: Story = { args: { variant: 'success' }, render }
export const Warning: Story = { args: { variant: 'warning' }, render }
export const Error: Story = { args: { variant: 'error' }, render }
export const NoMotion: Story = { name: 'Still (motion none)', args: { variant: 'error', motion: 'none' }, render }

export const AllVariants: Story = {
  render: (args) => (
    <div className="grid max-w-3xl gap-8 p-3 sm:grid-cols-2">
      {(['default', 'success', 'warning', 'error'] as const).map((variant) => (
        <div key={variant}>{render({ ...args, variant }, {} as never)}</div>
      ))}
    </div>
  ),
}

/** Each card sets its own pulse: `motion="pulse"` (default) or `motion="none"`. */
export const PulseOnAndOff: Story = {
  name: 'Pulse on and off',
  render: (args) => (
    <div className="grid max-w-3xl gap-8 p-3 sm:grid-cols-2">
      {(['default', 'success', 'warning', 'error'] as const).flatMap((variant) =>
        (['pulse', 'none'] as const).map((motion) => (
          <div key={`${variant}-${motion}`} className="flex flex-col gap-3">
            <span className="text-caption-1 text-dark-75">
              {variant} · motion=&quot;{motion}&quot;
            </span>
            {render({ ...args, variant, motion }, {} as never)}
          </div>
        ))
      )}
    </div>
  ),
}

/** `info` on `StatCardTitle` adds the icon and tooltip; leave it out for none. */
export const WithoutTooltip: Story = {
  name: 'Without tooltip',
  args: { variant: 'success', showInfo: false },
  render,
}

/** `icon` on `StatCardStatus`: any icon replaces the variant's, `null` removes it. */
export const StatusIcons: Story = {
  name: 'Status icon props',
  render: (args) => (
    <div className="grid max-w-3xl gap-8 p-3 sm:grid-cols-2">
      <div className="flex flex-col gap-3">
        <span className="text-caption-1 text-dark-75">icon left out (the variant&apos;s icon)</span>
        {render({ ...args, variant: 'success' }, {} as never)}
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-caption-1 text-dark-75">icon=&#123;&lt;IconTrendingUp /&gt;&#125;</span>
        {render({ ...args, variant: 'success', statusIcon: 'trending' }, {} as never)}
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-caption-1 text-dark-75">icon=&#123;null&#125;</span>
        {render({ ...args, variant: 'success', showStatusIcon: false }, {} as never)}
      </div>
    </div>
  ),
}
