import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'

const meta: Meta<typeof TabsList> = {
  title: 'BYB Components/Tabs',
  component: TabsList,
  tags: ['autodocs'],
  args: { variant: 'pill' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['pill', 'line', 'segmented'],
      description: 'Visual style of the tab list. Triggers inherit it automatically.',
      table: {
        type: { summary: "'pill' | 'line' | 'segmented'" },
        defaultValue: { summary: 'pill' },
      },
    },
  },
  parameters: {
    controls: { include: ['variant'] },
    docs: {
      description: {
        component:
          'Tabs switch between related views. Set `variant` on `TabsList` (`pill`, `line` or `segmented`; default `pill`) and every `TabsTrigger` inside follows it.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof TabsList>

const copy = 'py-4 text-body-md text-dark-75'

// ── Basic examples ───────────────────────────────────────────────────────────

/** Use the `variant` control to switch styles. */
export const Default: Story = {
  render: ({ variant }) => (
    <Tabs defaultValue="building" className="w-120">
      <TabsList variant={variant}>
        <TabsTrigger value="building">Building</TabsTrigger>
        <TabsTrigger value="pest">Pest</TabsTrigger>
        <TabsTrigger value="strata">Strata</TabsTrigger>
      </TabsList>
      <TabsContent value="building" className={copy}>Structural defects, roofing and drainage.</TabsContent>
      <TabsContent value="pest" className={copy}>Termite activity and conducive conditions.</TabsContent>
      <TabsContent value="strata" className={copy}>Levies, sinking fund and meeting minutes.</TabsContent>
    </Tabs>
  ),
}

export const Pill: Story = { ...Default, args: { variant: 'pill' } }

export const Line: Story = {
  args: { variant: 'line' },
  render: ({ variant }) => (
    <Tabs defaultValue="overview" className="w-120">
      <TabsList variant={variant}>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="history" disabled>History</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className={copy}>Property summary and key dates.</TabsContent>
      <TabsContent value="reports" className={copy}>Building &amp; pest, strata and pool reports.</TabsContent>
      <TabsContent value="documents" className={copy}>Contract of sale and section 32.</TabsContent>
    </Tabs>
  ),
}

export const Segmented: Story = {
  args: { variant: 'segmented' },
  render: ({ variant }) => (
    <Tabs defaultValue="monthly" className="w-120">
      <TabsList variant={variant} className="w-full">
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="yearly">Yearly</TabsTrigger>
      </TabsList>
      <TabsContent value="weekly" className={copy}>Median price movement over the last 7 days.</TabsContent>
      <TabsContent value="monthly" className={copy}>Median price movement over the last 30 days.</TabsContent>
      <TabsContent value="yearly" className={copy}>Median price movement over the last 12 months.</TabsContent>
    </Tabs>
  ),
}

export const SegmentedCompact: Story = {
  name: 'Segmented, fit to content',
  args: { variant: 'segmented' },
  render: ({ variant }) => (
    <Tabs defaultValue="buy" className="w-120">
      <TabsList variant={variant}>
        <TabsTrigger value="buy">Buy</TabsTrigger>
        <TabsTrigger value="rent">Rent</TabsTrigger>
        <TabsTrigger value="sold" disabled>Sold</TabsTrigger>
      </TabsList>
      <TabsContent value="buy" className={copy}>Properties for sale.</TabsContent>
      <TabsContent value="rent" className={copy}>Properties for rent.</TabsContent>
    </Tabs>
  ),
}

export const Vertical: Story = {
  args: { variant: 'line' },
  render: ({ variant }) => (
    <Tabs defaultValue="account" orientation="vertical" className="w-120 gap-6">
      <TabsList variant={variant}>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className={copy}>Update your account details.</TabsContent>
      <TabsContent value="password" className={copy}>Change your password.</TabsContent>
      <TabsContent value="billing" className={copy}>Manage invoices and payment methods.</TabsContent>
    </Tabs>
  ),
}

export const Panel: Story = {
  render: ({ variant }) => (
    <Tabs defaultValue="overview" className="w-120">
      <TabsList variant={variant}>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" panel>
        <p className="text-caption text-dark-60">Property</p>
        <h3 className="text-heading-xs text-navy">12 Smith St, Newtown</h3>
        <p className="text-body-md text-dark-90">3 bed · 2 bath terrace with two reports available.</p>
      </TabsContent>
      <TabsContent value="reports" panel>
        <p className="text-caption text-dark-60">2 available</p>
        <h3 className="text-heading-xs text-navy">Reports</h3>
        <p className="text-body-md text-dark-90">Building &amp; pest, strata.</p>
      </TabsContent>
      <TabsContent value="history" panel>
        <p className="text-caption text-dark-60">Timeline</p>
        <h3 className="text-heading-xs text-navy">History</h3>
        <p className="text-body-md text-dark-90">Listed 14 days ago.</p>
      </TabsContent>
    </Tabs>
  ),
}

export const DisabledTab: Story = {
  name: 'Disabled tab',
  render: ({ variant }) => (
    <Tabs defaultValue="building" className="w-120">
      <TabsList variant={variant}>
        <TabsTrigger value="building">Building</TabsTrigger>
        <TabsTrigger value="pest">Pest</TabsTrigger>
        <TabsTrigger value="pool" disabled>Pool</TabsTrigger>
      </TabsList>
      <TabsContent value="building" className={copy}>Building report.</TabsContent>
      <TabsContent value="pest" className={copy}>Pest report.</TabsContent>
    </Tabs>
  ),
}
