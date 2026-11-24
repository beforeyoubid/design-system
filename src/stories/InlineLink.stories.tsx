import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconArrowRight, IconDownload } from '@tabler/icons-react'
import { InlineLink } from '../components/inline-link'

const meta: Meta<typeof InlineLink> = {
  title: 'BYB Components/InlineLink',
  component: InlineLink,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A text link styled like the text button (semibold, UPPERCASE, underline on hover) for use inside or after a sentence. Use Button variant="link" for an action that sits with other buttons.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['default', 'navy', 'destructive', 'white'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  args: { href: '#', children: 'View report' },
}

export default meta
type Story = StoryObj<typeof InlineLink>

// White links are for dark sections, so their stories sit on navy.
const onNavy = (Story: React.ComponentType) => (
  <div className="rounded-lg bg-navy p-6">
    <Story />
  </div>
)

export const Default: Story = {}
export const Navy: Story = { args: { variant: 'navy' } }
export const Destructive: Story = { args: { variant: 'destructive', children: 'Remove property' } }
export const White: Story = { args: { variant: 'white' }, decorators: [onNavy] }
export const Disabled: Story = { args: { disabled: true } }

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-6">
      <InlineLink {...args} size="sm">Small · 12px</InlineLink>
      <InlineLink {...args} size="md">Medium · 14px</InlineLink>
      <InlineLink {...args} size="lg">Large · 16px</InlineLink>
    </div>
  ),
}

export const WithIcon: Story = {
  name: 'With icon',
  render: (args) => (
    <div className="flex flex-wrap items-center gap-6">
      <InlineLink {...args}>
        See all reports
        <IconArrowRight />
      </InlineLink>
      <InlineLink {...args} variant="navy">
        <IconDownload />
        Download PDF
      </InlineLink>
    </div>
  ),
}

export const InSentence: Story = {
  name: 'In a sentence',
  render: (args) => (
    <p className="max-w-md text-body-4 text-dark-90">
      Your building &amp; pest report for 12 Smith St is ready.{' '}
      <InlineLink {...args}>View report</InlineLink>
    </p>
  ),
}

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-6">
          <span className="w-6 text-caption-1 text-dark-75">{size}</span>
          <InlineLink {...args} size={size}>Default</InlineLink>
          <InlineLink {...args} size={size} variant="navy">Navy</InlineLink>
          <InlineLink {...args} size={size} variant="destructive">Destructive</InlineLink>
          <span className="rounded-md bg-navy px-3 py-1.5">
            <InlineLink {...args} size={size} variant="white">White</InlineLink>
          </span>
          <InlineLink {...args} size={size} disabled>Disabled</InlineLink>
        </div>
      ))}
    </div>
  ),
}
