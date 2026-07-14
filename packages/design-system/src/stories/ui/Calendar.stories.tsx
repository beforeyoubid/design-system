import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { Calendar } from '../../components/ui/calendar'

const meta: Meta<typeof Calendar> = {
  title: 'shadcn/Calendar',
  component: Calendar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    return <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
  },
}

export const Range: Story = {
  render: () => {
    const [range, setRange] = React.useState<{ from?: Date; to?: Date } | undefined>()
    return <Calendar mode="range" selected={range} onSelect={setRange} className="rounded-md border" />
  },
}
