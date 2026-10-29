import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TimePicker } from '../components/time-picker'
import { Field, FieldError, FieldLabel } from '../components/field'

const meta: Meta<typeof TimePicker> = {
  title: 'BYB Components/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TimePicker>

/** Empty, with seconds, a 15-minute step, and disabled. The trigger fills its container; here a 128px grid column. */
export const Default: Story = {
  render: function Render() {
    const [time, setTime] = React.useState('')
    const [withSec, setWithSec] = React.useState('09:15:30')
    const [stepped, setStepped] = React.useState('14:30')
    return (
      <div className="grid h-96 grid-cols-[repeat(4,8rem)] items-start gap-4">
        <TimePicker value={time} onChange={setTime} />
        <TimePicker value={withSec} onChange={setWithSec} />
        <TimePicker value={stepped} onChange={setStepped} minuteStep={15} />
        <TimePicker value="08:00" disabled />
      </div>
    )
  },
}

/** In a Field: the label points at the trigger, and `aria-invalid` gives the error look. */
export const InAField: Story = {
  render: function Render() {
    const [time, setTime] = React.useState('')
    return (
      <Field data-invalid className="h-96 w-48">
        <FieldLabel htmlFor="tp-start">Start time</FieldLabel>
        <TimePicker id="tp-start" value={time} onChange={setTime} aria-invalid aria-describedby="tp-start-error" />
        <FieldError id="tp-start-error">Choose a start time.</FieldError>
      </Field>
    )
  },
}
