import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconSearch, IconMail } from '@tabler/icons-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../../components/ui/input-group'

const meta: Meta<typeof InputGroup> = {
  title: 'shadcn/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof InputGroup>

export const Default: Story = {
  render: () => (
    <InputGroup className="w-80">
      <InputGroupAddon align="inline-start"><IconSearch className="h-4 w-4" /></InputGroupAddon>
      <InputGroupInput placeholder="Search…" />
    </InputGroup>
  ),
}

export const InlineEnd: Story = {
  render: () => (
    <InputGroup className="w-80">
      <InputGroupInput placeholder="you@example.com" />
      <InputGroupAddon align="inline-end"><IconMail className="h-4 w-4" /></InputGroupAddon>
    </InputGroup>
  ),
}
