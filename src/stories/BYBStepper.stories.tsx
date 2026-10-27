import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconFileText, IconHome, IconSignature } from '@tabler/icons-react'
import { BYBStepper, type BYBStepperStep } from '../components/BYBStepper'

const STEPS: BYBStepperStep[] = [
  { title: 'Property', description: 'Choose an address', icon: <IconHome /> },
  { title: 'Reports', description: 'Pick your reports', icon: <IconFileText /> },
  { title: 'Sign', description: 'Review and sign', icon: <IconSignature /> },
]

const meta: Meta<typeof BYBStepper> = {
  title: 'BYB Components/BYBStepper',
  component: BYBStepper,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical', 'responsive'] },
    indicator: { control: 'select', options: ['number', 'icon', 'dot'] },
    labelPlacement: { control: 'select', options: ['end', 'bottom'] },
    clickable: { control: 'select', options: ['completed', 'all', 'none'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { steps: STEPS, defaultValue: 1 },
  render: (args) => (
    <div className="w-176 max-w-full">
      <BYBStepper {...args} />
    </div>
  ),
}

export default meta
type Story = StoryObj<typeof BYBStepper>

export const Default: Story = {}
export const LabelsBottom: Story = { args: { orientation: 'horizontal', labelPlacement: 'bottom' } }
export const Vertical: Story = { args: { orientation: 'vertical' } }
export const Icons: Story = { args: { indicator: 'icon', orientation: 'horizontal' } }
export const Dots: Story = { args: { indicator: 'dot', orientation: 'horizontal' } }
export const WithError: Story = {
  args: {
    orientation: 'horizontal',
    steps: [STEPS[0], { ...STEPS[1], error: true, description: 'Payment failed' }, STEPS[2]],
  },
}
export const AllComplete: Story = { args: { orientation: 'horizontal', defaultValue: STEPS.length } }
export const Sizes: Story = {
  render: () => (
    <div className="flex w-176 max-w-full flex-col gap-8">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <BYBStepper key={size} steps={STEPS} defaultValue={1} orientation="horizontal" size={size} clickable="all" />
      ))}
    </div>
  ),
}
