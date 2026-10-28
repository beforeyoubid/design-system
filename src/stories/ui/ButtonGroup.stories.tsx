import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconChevronDown, IconMinus, IconPlus } from '@tabler/icons-react'
import { Button } from '../../components/button'
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from '../../components/ui/button-group'
import { Input } from '../../components/ui/input'

const meta: Meta<typeof ButtonGroup> = {
  title: 'BYB Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ButtonGroup>

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Day</Button>
      <Button variant="outline">Week</Button>
      <Button variant="outline">Month</Button>
    </ButtonGroup>
  ),
}

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button variant="outline" size="icon" aria-label="Increase">
        <IconPlus />
      </Button>
      <Button variant="outline" size="icon" aria-label="Decrease">
        <IconMinus />
      </Button>
    </ButtonGroup>
  ),
}

/** A split button: action plus a menu trigger, divided by a separator. */
export const Split: Story = {
  render: () => (
    <ButtonGroup>
      <Button>Order report</Button>
      <ButtonGroupSeparator />
      <Button size="icon" aria-label="More options">
        <IconChevronDown />
      </Button>
    </ButtonGroup>
  ),
}

export const WithInput: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupText>https://</ButtonGroupText>
      <Input placeholder="beforeyoubuy.com.au" />
      <Button variant="outline">Go</Button>
    </ButtonGroup>
  ),
}
