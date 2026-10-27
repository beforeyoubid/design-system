import type { Meta, StoryObj } from '@storybook/react-vite'
import { Kbd, KbdGroup } from '../../components/ui/kbd'

const meta: Meta<typeof Kbd> = {
  title: 'BYB Components/Kbd',
  component: Kbd,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Kbd>

export const Default: Story = { render: () => <Kbd>Esc</Kbd> }

export const Group: Story = {
  render: () => (
    <p className="text-body-5 text-muted-foreground">
      Search reports with{' '}
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </p>
  ),
}
