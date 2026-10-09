import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { BarChart } from '../components/BarChart'

const monthly = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]

const withNegatives = [
  { month: 'January', visitors: 186 },
  { month: 'February', visitors: 205 },
  { month: 'March', visitors: -207 },
  { month: 'April', visitors: 173 },
  { month: 'May', visitors: -209 },
  { month: 'June', visitors: 214 },
]

const browsers = [
  { browser: 'Chrome', visitors: 275 },
  { browser: 'Safari', visitors: 200 },
  { browser: 'Firefox', visitors: 187 },
  { browser: 'Edge', visitors: 173 },
  { browser: 'Other', visitors: 90 },
]

/** Deterministic daily data: 91 days ending 30 June 2024. */
const daily = Array.from({ length: 91 }, (_, i) => ({
  date: new Date(2024, 3, 1 + i),
  desktop: Math.round(220 + 120 * Math.sin(i / 6) + ((i * 37) % 60)),
  mobile: Math.round(160 + 90 * Math.cos(i / 8) + ((i * 53) % 50)),
}))

const desktop = [{ key: 'desktop', label: 'Desktop' }]
const both = [
  { key: 'desktop', label: 'Desktop' },
  { key: 'mobile', label: 'Mobile' },
]

const meta: Meta<typeof BarChart> = {
  title: 'BYB Components/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  argTypes: {
    layout: { control: 'select', options: ['vertical', 'horizontal'] },
    labels: { control: 'select', options: ['none', 'value', 'category', 'inside'] },
    colorBy: { control: 'select', options: ['series', 'category'] },
  },
  args: {
    title: 'Bar Chart',
    description: 'January – June 2024',
    data: monthly,
    series: desktop,
    trend: 'Trending up by 5.2% this month',
    caption: 'Showing total visitors for the last 6 months',
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
type Story = StoryObj<typeof BarChart>

export const Default: Story = {}

export const MultipleSeries: Story = { args: { series: both, legend: true } }

export const Stacked: Story = { args: { series: both, stacked: true, legend: true } }

export const Horizontal: Story = { args: { layout: 'horizontal' } }

export const ValueLabels: Story = { args: { labels: 'value' } }

export const CategoryLabelsWithNegatives: Story = {
  args: {
    labels: 'category',
    data: withNegatives,
    series: [{ key: 'visitors', label: 'Visitors' }],
  },
}

export const InsideLabels: Story = {
  args: { layout: 'horizontal', labels: 'inside', height: 240 },
}

export const ColorByCategory: Story = {
  args: {
    data: browsers,
    xKey: 'browser',
    series: [{ key: 'visitors', label: 'Visitors' }],
    colorBy: 'category',
    colors: [
      'var(--mint-90)',
      'var(--mint-75)',
      'var(--mint-60)',
      'var(--mint-30)',
      'var(--mint-15)',
    ],
    legend: true,
  },
}

export const Active: Story = { args: { defaultActiveIndex: 2 } }

export const Selectable: Story = {
  render: (args) => {
    const [active, setActive] = useState<number | null>(1)
    return (
      <div className="flex flex-col gap-2">
        <BarChart
          {...args}
          selectable
          activeIndex={active}
          onActiveChange={setActive}
        />
        <p className="text-caption text-dark-60">
          Active: {active === null ? 'none' : monthly[active]?.month}
        </p>
      </div>
    )
  },
}

export const Interactive: Story = {
  args: {
    title: 'Bar Chart - Interactive',
    description: 'Showing total visitors for the last 3 months',
    data: daily,
    series: both,
    interactive: true,
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
