import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePicker } from '../components/DatePicker'

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
export const Selected: Story = { args: { value: new Date(2025, 5, 21) } }
export const WithTime: Story = { args: { time: '10:30:00' } }
export const WithDescription: Story = {
  args: {
    value: new Date(2025, 5, 21),
    description: 'Your inspection will be booked for this date.',
  },
}
export const Disabled: Story = { args: { disabled: true } }
