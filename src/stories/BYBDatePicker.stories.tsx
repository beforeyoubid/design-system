import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { BYBDatePicker } from '../components/BYBDatePicker'

const meta: Meta<typeof BYBDatePicker> = {
  title: 'BYB Components/BYBDatePicker',
  component: BYBDatePicker,
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
        <BYBDatePicker
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
type Story = StoryObj<typeof BYBDatePicker>

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
