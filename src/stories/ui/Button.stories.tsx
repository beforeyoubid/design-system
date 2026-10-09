import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconArrowLeft, IconArrowUpRight } from '@tabler/icons-react'
import { Button } from '../../components/ui/button'

const meta: Meta<typeof Button> = {
  title: 'BYB Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary', 'secondary', 'tertiary', 'ghost', 'destructive', 'link',
      ],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xs', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'] },
    loading: { control: 'boolean' },
    iconPosition: { control: 'select', options: ['left', 'right'] },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = { args: { children: 'Button' } }
export const Secondary: Story = { args: { variant: 'secondary', children: 'Secondary' } }
export const Tertiary: Story = { args: { variant: 'tertiary', children: 'Tertiary' } }
export const Ghost: Story = { args: { variant: 'ghost', children: 'Ghost' } }
export const Destructive: Story = { args: { variant: 'destructive', children: 'Delete' } }
export const LinkStyle: Story = { args: { variant: 'link', children: 'Link' } }
export const Loading: Story = { args: { loading: true, children: 'Saving' } }
export const IconRight: Story = {
  args: { children: 'Get a quote', icon: <IconArrowUpRight />, iconPosition: 'right' },
}
export const IconLeft: Story = {
  args: { variant: 'tertiary', children: 'Back', icon: <IconArrowLeft />, iconPosition: 'left' },
}

const DESIGN_VARIANTS = ['primary', 'secondary', 'tertiary', 'ghost', 'destructive', 'link'] as const

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['default', 'icon-left', 'icon-right', 'disabled', 'loading'] as const).map((state) => (
        <div key={state} className="flex flex-wrap items-center gap-3">
          {DESIGN_VARIANTS.map((v) => (
            <Button
              key={v}
              variant={v}
              disabled={state === 'disabled'}
              loading={state === 'loading'}
              icon={state.startsWith('icon') ? <IconArrowUpRight /> : undefined}
              iconPosition={state === 'icon-left' ? 'left' : 'right'}
            >
              {v}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">sm · 36</Button>
      <Button size="md">md · 40</Button>
      <Button size="lg">lg · 44</Button>
    </div>
  ),
}
