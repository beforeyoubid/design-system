import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TimePicker } from '../components/time-picker'

const meta: Meta<typeof TimePicker> = {
  title: 'BYB Components/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TimePicker>

/** Empty, with seconds, a 15-minute step, and disabled. Same trigger and popover as the date picker. */
export const Default: Story = {
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
