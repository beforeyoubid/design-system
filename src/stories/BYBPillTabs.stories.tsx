import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  IconHome,
  IconBuildingSkyscraper,
  IconUsers,
  IconScaleOutline,
  IconClipboardList,
  IconArrowRight,
} from '@tabler/icons-react'
import { BYBPillTabs } from '../components/BYBPillTabs'
import type { PillTab } from '../components/BYBPillTabs'

const meta: Meta<typeof BYBPillTabs> = {
  title: 'Components/BYBPillTabs',
  component: BYBPillTabs,
  tags: ['autodocs'],
  argTypes: {
    variant:        { control: 'select', options: ['navy', 'mint', 'lime'] },
    trackClassName: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof BYBPillTabs>

// ── Shared feature card helper ────────────────────────────────────────────────

function FeatureCard({
  heading,
  body,
  items,
}: {
  heading: string
  body: string
  items: string[]
}) {
  return (
    <div className="flex flex-col gap-4 p-8 bg-white rounded-2xl border border-dark-15 max-w-2xl">
      <h3 className="text-heading-md font-semibold text-navy">{heading}</h3>
      <p className="text-body-md text-dark-75">{body}</p>
      <ul className="flex flex-col gap-2 mt-2">
        {items.map(item => (
          <li key={item} className="flex items-start gap-2 text-body-sm text-dark-90">
            <IconArrowRight size={16} className="text-mint-75 mt-0.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Tab data — "One platform. Built for every user." ─────────────────────────

const PLATFORM_TABS: PillTab[] = [
  {
    id: 'buyers',
    label: 'Buyers',
    icon: IconHome,
    content: (
      <FeatureCard
        heading="Find and order reports with confidence"
        body="Access thousands of existing building and pest inspection reports, or order a new one instantly. Make informed decisions before you buy."
        items={[
          'Search reports by property address',
          'Compare certified inspectors side by side',
          'Order a new report in minutes',
          'Re-use a report and split the cost with other buyers',
        ]}
      />
    ),
  },
  {
    id: 'agents',
    label: 'Buyers Agents',
    icon: IconUsers,
    content: (
      <FeatureCard
        heading="Streamline due diligence for your clients"
        body="Give your clients instant access to inspection reports and help them move faster. No chasing inspectors — everything is handled online."
        items={[
          'Access reports on behalf of your clients',
          'Manage multiple properties in one dashboard',
          'Potentially save clients money on re-sale of reports',
          'Professional panel of certified inspectors',
        ]}
      />
    ),
  },
  {
    id: 'conveyancers',
    label: 'Conveyancers',
    icon: IconScaleOutline,
    content: (
      <FeatureCard
        heading="Seamless settlement support"
        body="Our legal team handles contracts with professionalism and precision, making settlement a drama-free process for your clients."
        items={[
          'Experienced conveyancing lawyers on staff',
          'Online document management',
          'Transparent fee structure',
          '$240 refund if the property comes off the market',
        ]}
      />
    ),
  },
  {
    id: 'managers',
    label: 'Property Managers',
    icon: IconClipboardList,
    content: (
      <FeatureCard
        heading="Keep your portfolio in top condition"
        body="Easily order and access inspection reports across your entire portfolio. Maintain records and stay ahead of maintenance issues."
        items={[
          'Portfolio-level report management',
          'Accessible inspector panel',
          'Detailed, easy-to-read reports',
          'Fast turnaround times',
        ]}
      />
    ),
  },
  {
    id: 'investors',
    label: 'Investors',
    icon: IconBuildingSkyscraper,
    content: (
      <FeatureCard
        heading="Due diligence at scale"
        body="Whether you're acquiring your first investment property or building a portfolio, BYB gives you the insights to move with confidence."
        items={[
          'Bulk report ordering',
          'Compare inspectors by price and rating',
          'Nationwide coverage',
          'Instant access to existing reports',
        ]}
      />
    ),
  },
]

// ── Stories ───────────────────────────────────────────────────────────────────

export const Navy: Story = {
  render: () => (
    <div className="p-8 bg-light-sandy rounded-2xl max-w-3xl">
      <BYBPillTabs tabs={PLATFORM_TABS} variant="navy" />
    </div>
  ),
}

export const Mint: Story = {
  render: () => (
    <div className="p-8 bg-light-sandy rounded-2xl max-w-3xl">
      <BYBPillTabs tabs={PLATFORM_TABS} variant="mint" />
    </div>
  ),
}

export const Lime: Story = {
  render: () => (
    <div className="p-8 bg-light-sandy rounded-2xl max-w-3xl">
      <BYBPillTabs tabs={PLATFORM_TABS} variant="lime" />
    </div>
  ),
}

export const OnNavyBackground: Story = {
  render: () => (
    <div className="p-8 bg-navy rounded-2xl max-w-3xl">
      <BYBPillTabs
        tabs={PLATFORM_TABS}
        variant="lime"
        trackClassName="bg-white/10"
      />
    </div>
  ),
}

export const WithSectionHeading: Story = {
  render: () => (
    <div className="p-8 bg-light-sandy rounded-2xl max-w-3xl">
      <div className="mb-8">
        <h2 className="text-heading-lg font-semibold text-navy">
          One platform. Built for every user.
        </h2>
        <p className="text-body-md text-dark-75 mt-2">
          Whether you're buying, investing or managing — BYB has you covered.
        </p>
      </div>
      <BYBPillTabs tabs={PLATFORM_TABS} variant="navy" defaultTab="buyers" />
    </div>
  ),
}

export const SimpleLabelsOnly: Story = {
  render: () => (
    <div className="p-8 max-w-xl">
      <BYBPillTabs
        variant="mint"
        tabs={[
          { id: 'all',      label: 'All',       content: <p className="text-body-md text-dark-75">Showing all results.</p> },
          { id: 'reports',  label: 'Reports',   content: <p className="text-body-md text-dark-75">Showing reports only.</p> },
          { id: 'inspectors', label: 'Inspectors', content: <p className="text-body-md text-dark-75">Showing inspectors only.</p> },
        ]}
      />
    </div>
  ),
}
