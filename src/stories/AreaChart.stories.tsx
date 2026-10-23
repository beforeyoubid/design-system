import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconDeviceDesktop, IconDeviceMobile } from '@tabler/icons-react'
import { AreaChart } from '../components/AreaChart'

const monthly = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]

const series = [
  { key: 'mobile', label: 'Mobile', icon: IconDeviceMobile },
  { key: 'desktop', label: 'Desktop', icon: IconDeviceDesktop },
]

/** Deterministic daily data: 91 days ending 30 June 2024. */
const daily = Array.from({ length: 91 }, (_, i) => {
  const date = new Date(2024, 3, 1 + i)
  return {
    date,
    desktop: Math.round(220 + 120 * Math.sin(i / 6) + ((i * 37) % 60)),
    mobile: Math.round(160 + 90 * Math.cos(i / 8) + ((i * 53) % 50)),
  }
})

const meta: Meta<typeof AreaChart> = {
  title: 'BYB Components/AreaChart',
  component: AreaChart,
  tags: ['autodocs'],
  argTypes: {
    curve: { control: 'select', options: ['natural', 'linear', 'step'] },
  },
  args: {
    title: 'Area Chart',
    description: 'Showing total visitors for the last 6 months',
    data: monthly,
    series,
    trend: 'Trending up by 5.2% this month',
    caption: 'January – June 2024',
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-lg">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AreaChart>

export const Default: Story = {
  args: { series: [{ key: 'desktop', label: 'Desktop' }] },
}

export const Linear: Story = {
  args: { curve: 'linear', series: [{ key: 'desktop', label: 'Desktop' }] },
}

export const Step: Story = {
  args: { curve: 'step', series: [{ key: 'desktop', label: 'Desktop' }] },
}

export const Stacked: Story = {}

export const Unstacked: Story = { args: { stacked: false } }

export const Expanded: Story = {
  args: {
    expand: true,
    yAxis: true,
    series: [
      ...series,
      { key: 'other', label: 'Other' },
    ],
    data: monthly.map((row, i) => ({ ...row, other: 60 + i * 15 })),
  },
}

export const Gradient: Story = { args: { gradient: true } }

export const Legend: Story = { args: { legend: true } }

export const LegendIcons: Story = { args: { legendIcons: true } }

export const YAxis: Story = { args: { yAxis: true } }

export const Interactive: Story = {
  args: {
    title: 'Area Chart - Interactive',
    description: 'Showing total visitors for the last 3 months',
    data: daily,
    interactive: true,
    gradient: true,
    trend: undefined,
    caption: undefined,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl">
        <Story />
      </div>
    ),
  ],
}
