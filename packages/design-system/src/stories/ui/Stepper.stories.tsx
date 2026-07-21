import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stepper } from '../../components/ui/stepper'

// The 7-stage BYB job lifecycle — stage names are story data, not part of the primitive.
const BYB_JOB_LIFECYCLE = [
  'Requested',
  'Confirmed',
  'En route',
  'In progress',
  'Completed',
  'Report drafting',
  'Report ready',
]

const meta: Meta<typeof Stepper> = {
  title: 'shadcn/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  args: { steps: BYB_JOB_LIFECYCLE },
}

export default meta
type Story = StoryObj<typeof Stepper>

/** Done, active, and upcoming states in a single stepper. */
export const Default: Story = {
  args: { activeStep: 2 },
}

/** Nothing done yet — the first step is active. */
export const FirstStepActive: Story = {
  args: { activeStep: 0 },
}

/** Last step active, everything before it done. */
export const LastStepActive: Story = {
  args: { activeStep: BYB_JOB_LIFECYCLE.length - 1 },
}

/** Every step done — pass `steps.length` as `activeStep`. */
export const AllDone: Story = {
  args: { activeStep: BYB_JOB_LIFECYCLE.length },
}

/** Constrained container — the stepper scrolls horizontally on overflow. */
export const Overflow: Story = {
  args: { activeStep: 4 },
  render: (args) => (
    <div className="w-96 rounded-lg border border-border bg-card p-4">
      <Stepper {...args} />
    </div>
  ),
}

/** Steps are plain props — any domain flow works. */
export const CustomSteps: Story = {
  args: {
    steps: ['Cart', 'Shipping', 'Payment', 'Review'],
    activeStep: 1,
  },
}
