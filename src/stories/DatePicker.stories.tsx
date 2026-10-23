import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePicker, TimePicker } from '../components/DatePicker'

const meta: Meta<typeof DatePicker> = {
  title: 'BYB Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'select', options: ['chevron', 'calendar'] },
    captionLayout: { control: 'select', options: ['label', 'dropdown'] },
  },
  render: function Render(args) {
    const [date, setDate] = React.useState<Date | undefined>(args.value)
    const [time, setTime] = React.useState(args.time)
    return (
      <div className="h-96">
        <DatePicker
          {...args}
          value={date}
          onChange={setDate}
          time={time}
          onTimeChange={setTime}
        />
      </div>
    )
  },
}

export default meta
type Story = StoryObj<typeof DatePicker>

export const Default: Story = {}
export const CalendarIcon: Story = { args: { icon: 'calendar' } }
export const Selected: Story = { args: { value: new Date(2026, 9, 16) } }
export const WithTime: Story = {
  args: { value: new Date(2026, 9, 16), time: '10:30' },
}
export const WithTimeAndSeconds: Story = { args: { time: '10:30:00' } }
export const EmptyTime: Story = { args: { time: '' } }
export const WithDescription: Story = {
  args: {
    value: new Date(2026, 9, 16),
    description: 'Your inspection will be booked for this date.',
  },
}
export const Disabled: Story = { args: { disabled: true } }

/** Dates show as DD/MM/YYYY by default; pass `formatDate` to override. */
export const DateFormat: Story = {
  args: {
    value: new Date(2026, 9, 16),
    description: 'Shown as 16/10/2026 (DD/MM/YYYY).',
  },
}

/** The time picker on its own: same trigger and popover as the date picker. */
export const StandaloneTimePicker: StoryObj<typeof TimePicker> = {
  render: function Render() {
    const [time, setTime] = React.useState('')
    const [withSec, setWithSec] = React.useState('09:15:30')
    const [stepped, setStepped] = React.useState('14:30')
    return (
      <div className="flex h-96 items-start gap-4">
        <TimePicker value={time} onChange={setTime} />
        <TimePicker value={withSec} onChange={setWithSec} />
        <TimePicker value={stepped} onChange={setStepped} minuteStep={15} />
        <TimePicker value="08:00" disabled />
      </div>
    )
  },
}
