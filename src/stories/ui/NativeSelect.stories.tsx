import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from '../../components/ui/native-select'

const meta: Meta<typeof NativeSelect> = {
  title: 'BYB Components/NativeSelect',
  component: NativeSelect,
  tags: ['autodocs'],
  argTypes: { size: { control: 'select', options: ['default', 'sm'] } },
  render: (args) => (
    <NativeSelect {...args}>
      <NativeSelectOption value="">Select a state</NativeSelectOption>
      <NativeSelectOption value="nsw">New South Wales</NativeSelectOption>
      <NativeSelectOption value="vic">Victoria</NativeSelectOption>
      <NativeSelectOption value="qld">Queensland</NativeSelectOption>
    </NativeSelect>
  ),
}

export default meta
type Story = StoryObj<typeof NativeSelect>

export const Default: Story = {}
export const Small: Story = { args: { size: 'sm' } }
export const Disabled: Story = { args: { disabled: true } }
export const Invalid: Story = { args: { 'aria-invalid': true } }

export const Grouped: Story = {
  render: () => (
    <NativeSelect>
      <NativeSelectOptGroup label="Inspections">
        <NativeSelectOption value="bpi">Building & pest</NativeSelectOption>
        <NativeSelectOption value="pool">Pool</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Reports">
        <NativeSelectOption value="strata">Strata report</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  ),
}
