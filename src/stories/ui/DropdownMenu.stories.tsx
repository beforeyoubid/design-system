import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  IconChevronDown,
  IconCreditCard,
  IconDownload,
  IconLogout,
  IconSettings,
  IconShare,
  IconTrash,
  IconUser,
} from '@tabler/icons-react'
import { ArrowUpRight, FileText, Gavel, Home, Link, Send, ShieldCheck } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { productBadges, type ProductBadgeKey } from '../../lib/product-badges'
import {
  DropdownMenu,
  DropdownMenuCardGrid,
  DropdownMenuCardItem,
  DropdownMenuCardTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuIconTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuProductItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  ProductSwitcher,
} from '../../components/ui/dropdown-menu'

const meta: Meta<typeof DropdownMenu> = {
  title: 'BYB Components/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DropdownMenu>

/** Open-state look for the tertiary trigger (applied while the menu is expanded). */
const openTrigger =
  'aria-expanded:bg-mint-l4 aria-expanded:text-mint-75 aria-expanded:ring-3 aria-expanded:ring-mint-45/30'

function Trigger({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenuTrigger
      render={
        <Button variant="tertiary" className={openTrigger}>
          {children}
          <IconChevronDown data-icon="inline-end" />
        </Button>
      }
    />
  )
}

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <Trigger>My account</Trigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <IconUser />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconCreditCard />
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconSettings />
            Settings
            <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <IconShare />
            Share report
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Email</DropdownMenuItem>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
            <DropdownMenuItem>SMS</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem disabled>
          <IconDownload />
          Download PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <IconLogout />
          Sign out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const DefaultOpen: Story = {
  name: 'Open (trigger active state)',
  render: () => (
    <DropdownMenu defaultOpen>
      <Trigger>Actions</Trigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <IconShare />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconDownload />
          Download
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <IconTrash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

function CheckboxesDemo() {
  const [building, setBuilding] = React.useState(true)
  const [pest, setPest] = React.useState(true)
  const [strata, setStrata] = React.useState(false)
  return (
    <DropdownMenu>
      <Trigger>Report types</Trigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Show reports</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuCheckboxItem checked={building} onCheckedChange={setBuilding}>
            Building
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={pest} onCheckedChange={setPest}>
            Pest
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={strata} onCheckedChange={setStrata}>
            Strata
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem disabled checked={false}>
            Pool (coming soon)
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const Checkboxes: Story = {
  render: () => <CheckboxesDemo />,
}

function RadioDemo() {
  const [sort, setSort] = React.useState('newest')
  return (
    <DropdownMenu>
      <Trigger>Sort by</Trigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
          <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="price">Price</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="distance" disabled>
            Distance
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const RadioItems: Story = {
  name: 'Radio items',
  render: () => <RadioDemo />,
}

/* ---------------------------------------------------------------- */
/* Card menu: rich trigger + grid of option cards                  */
/* ---------------------------------------------------------------- */

const JOBS: Partial<Record<ProductBadgeKey, string>> = {
  bpi: '26 jobs',
  'building-inspection': '9 jobs',
  'pest-inspection': '4 jobs',
  'strata-report': '12 jobs',
  'owners-corp-cert': '3 jobs',
  'pool-inspection': '2 jobs',
  'electrical-report': '5 jobs',
  'electrical-safety-cert': '1 job',
}

function ProductSwitcherDemo({ all = false }: { all?: boolean }) {
  const [value, setValue] = React.useState<ProductBadgeKey>('bpi')
  return (
    <div className="w-180 pb-120">
      <ProductSwitcher
        value={value}
        onValueChange={setValue}
        meta={JOBS}
        products={all ? undefined : (Object.keys(JOBS) as ProductBadgeKey[])}
      />
    </div>
  )
}

/** Product badge colours (`bg-badge-product-*`) and Lucide icons come from `productBadges`. */
export const ProductSwitcherStory: Story = {
  name: 'Product switcher',
  render: () => <ProductSwitcherDemo />,
}

export const ProductSwitcherAllProducts: Story = {
  name: 'Product switcher (all products)',
  render: () => <ProductSwitcherDemo all />,
}

function CardMenuDemo() {
  const [value, setValue] = React.useState('report')
  const options = [
    { value: 'report', title: 'Inspection report', meta: 'PDF · 24 pages', icon: <FileText /> },
    { value: 'property', title: 'Property details', meta: 'Address, title, zoning', icon: <Home /> },
    { value: 'insurance', title: 'Insurance', meta: 'Certificate of currency', icon: <ShieldCheck /> },
  ]
  const current = options.find((o) => o.value === value)!
  return (
    <div className="w-120 pb-80">
      <DropdownMenu>
        <DropdownMenuCardTrigger
          icon={current.icon}
          label="Document"
          title={current.title}
          meta={current.meta}
        />
        <DropdownMenuContent sideOffset={8} className="p-3">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-1 pt-0 pb-2 text-dark-60">
              Switch document
            </DropdownMenuLabel>
            <DropdownMenuCardGrid columns={1} value={value} onValueChange={setValue}>
              {options.map((o) => (
                <DropdownMenuCardItem key={o.value} {...o} />
              ))}
            </DropdownMenuCardGrid>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

/** The generic parts: any icon, title and meta; no product dot. */
export const CardMenu: Story = {
  name: 'Card menu (generic)',
  render: () => <CardMenuDemo />,
}

/** Product names with a badge-colour dot, as plain radio items. */
export const ProductRadioItems: Story = {
  name: 'Product radio items',
  render: function Render() {
    const [value, setValue] = React.useState<string>('bpi')
    return (
      <DropdownMenu>
        <Trigger>Product</Trigger>
        <DropdownMenuContent className="w-80">
          <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
            {productBadges.slice(0, 6).map(({ key }) => (
              <DropdownMenuProductItem key={key} product={key} />
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}

const ROW_ACTIONS = (
  <>
    <DropdownMenuItem>
      <Send />
      Send link letter
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Link />
      Copy purchase link
    </DropdownMenuItem>
    <DropdownMenuItem>
      <ArrowUpRight />
      Open product
    </DropdownMenuItem>
  </>
)

/**
 * Icon-only trigger: no button styling, just the icon. Pick it with `icon`
 * (`kebab` ⋮ default, `meatball` ⋯, `chevron`, `settings`, or any element),
 * plus `tone` (mint / dark / navy) and `size` (sm / md / lg). Always pass a
 * `label` for screen readers.
 */
export const IconTrigger: Story = {
  name: 'Icon trigger',
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-6">
        {(['kebab', 'meatball', 'chevron', 'settings'] as const).map((icon) => (
          <div key={icon} className="flex flex-col items-center gap-2">
            <DropdownMenu>
              <DropdownMenuIconTrigger icon={icon} label={`${icon} menu`} />
              <DropdownMenuContent className="w-56">{ROW_ACTIONS}</DropdownMenuContent>
            </DropdownMenu>
            <span className="text-caption-1 text-dark-60">{icon}</span>
          </div>
        ))}
        <div className="flex flex-col items-center gap-2">
          <DropdownMenu>
            <DropdownMenuIconTrigger icon={<FileText />} label="Report menu" />
            <DropdownMenuContent className="w-56">{ROW_ACTIONS}</DropdownMenuContent>
          </DropdownMenu>
          <span className="text-caption-1 text-dark-60">custom</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        {(['mint', 'dark', 'navy'] as const).map((tone) =>
          (['sm', 'md', 'lg'] as const).map((size) => (
            <DropdownMenu key={tone + size}>
              <DropdownMenuIconTrigger tone={tone} size={size} label={`${tone} ${size} menu`} />
              <DropdownMenuContent className="w-56">{ROW_ACTIONS}</DropdownMenuContent>
            </DropdownMenu>
          ))
        )}
      </div>
    </div>
  ),
}

/** The row-actions pattern from the design: a ⋮ beside an item, opening icon + label actions. */
export const RowActionsMenu: Story = {
  name: 'Row actions (kebab)',
  render: () => (
    <div className="flex w-80 items-start justify-between rounded-lg bg-mint-l4 p-4">
      <div className="flex gap-2">
        <Gavel className="mt-0.5 size-5 shrink-0 text-mint-75" aria-hidden="true" />
        <div className="flex flex-col">
          <span className="text-body-4 font-semibold text-navy">Auction</span>
          <span className="text-body-4 text-dark-100">25/11/2026</span>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuIconTrigger label="Auction actions" />
        <DropdownMenuContent align="end" className="w-56">{ROW_ACTIONS}</DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
}
