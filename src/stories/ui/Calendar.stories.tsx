import type { Meta, StoryObj } from '@storybook/react-vite'
import type { DateRange } from 'react-day-picker'
import React from 'react'
import { Calendar } from '../../components/calendar'

const meta: Meta<typeof Calendar> = {
  title: 'BYB Components/Calendar',
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
    const [range, setRange] = React.useState<DateRange | undefined>(() => {
      const from = new Date()
      return { from, to: new Date(from.getFullYear(), from.getMonth(), from.getDate() + 4) }
    })
    return <Calendar mode="range" selected={range} onSelect={setRange} className="rounded-md border" />
  },
}

/** Weekends and past days can't be picked. */
export const DisabledDays: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={[{ before: today }, { dayOfWeek: [0, 6] }]}
        className="rounded-md border"
      />
    )
  },
}
