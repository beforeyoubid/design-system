import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArrowUpRight, Link, Send } from 'lucide-react'
import {
  IconAdjustmentsHorizontal,
  IconDots,
  IconDownload,
  IconEye,
  IconFileSearch,
  IconMoodEmpty,
  IconPlus,
  IconSearch,
  IconShare,
  IconTrash,
} from '@tabler/icons-react'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Checkbox } from '../../components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuIconTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../../components/ui/input-group'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableControlsHead,
  TableExpandableRow,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableViewMore,
  type SortDirection,
} from '../../components/ui/table'

const meta: Meta<typeof Table> = {
  title: 'BYB Components/Table',
  component: Table,
  tags: ['autodocs'],
  args: { variant: 'default', size: 'md' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'card', 'striped', 'bordered'],
      description: 'Visual style. `card` and `bordered` add an outer frame and a tinted header.',
      table: {
        type: { summary: "'default' | 'card' | 'striped' | 'bordered'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Row density: header height and cell padding.',
      table: {
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
      },
    },
  },
  parameters: {
    controls: { include: ['variant', 'size'] },
    docs: {
      description: {
        component:
          'Data table with BYB typography: uppercase `text-overline` headers in `dark-100` and `text-body-5` cells. Headers can sort (`sortable`), rows can expand (`TableExpandableRow`) and long tables can collapse behind `TableViewMore`. Set `variant` and `size` on `Table`; rows and cells pick them up automatically.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Table>

type Status = 'completed' | 'in-progress' | 'scheduled'

const reports = [
  { id: 'R-1042', address: '12 Smith St', suburb: 'Newtown NSW', type: 'Building & Pest', inspector: 'Alex Chen', date: '02 Oct 2026', status: 'completed' as Status, price: 495 },
  { id: 'R-1043', address: '4/88 Bay Rd', suburb: 'Waverton NSW', type: 'Strata', inspector: 'Priya Nair', date: '03 Oct 2026', status: 'completed' as Status, price: 325 },
  { id: 'R-1044', address: '27 Grove Ave', suburb: 'Marrickville NSW', type: 'Building & Pest', inspector: 'Sam Doyle', date: '07 Oct 2026', status: 'in-progress' as Status, price: 495 },
  { id: 'R-1045', address: '9 Ocean Pde', suburb: 'Coogee NSW', type: 'Pool', inspector: 'Jordan Lee', date: '08 Oct 2026', status: 'in-progress' as Status, price: 220 },
  { id: 'R-1046', address: '15/3 King St', suburb: 'Glebe NSW', type: 'Strata', inspector: 'Priya Nair', date: '14 Oct 2026', status: 'scheduled' as Status, price: 325 },
]

const statusBadge: Record<Status, { label: string; variant: 'success' | 'warning' | 'gray' }> = {
  completed: { label: 'Completed', variant: 'success' },
  'in-progress': { label: 'In progress', variant: 'warning' },
  scheduled: { label: 'Scheduled', variant: 'gray' },
}

const aud = (n: number) => `$${n.toLocaleString('en-AU')}`

function HeaderRow({ select }: { select?: React.ReactNode }) {
  return (
    <TableRow>
      {select && <TableHead>{select}</TableHead>}
      <TableHead>Property</TableHead>
      <TableHead>Report</TableHead>
      <TableHead>Inspector</TableHead>
      <TableHead>Date</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-end">Price</TableHead>
    </TableRow>
  )
}

function Cells({ r }: { r: (typeof reports)[number] }) {
  return (
    <>
      <TableCell>
        <div className="text-body-5 font-medium text-navy">{r.address}</div>
        <div className="text-caption-1 text-dark-60">{r.suburb}</div>
      </TableCell>
      <TableCell>{r.type}</TableCell>
      <TableCell>{r.inspector}</TableCell>
      <TableCell className="text-dark-75">{r.date}</TableCell>
      <TableCell>
        <Badge variant={statusBadge[r.status].variant}>{statusBadge[r.status].label}</Badge>
      </TableCell>
      <TableCell className="text-end text-body-5 font-medium text-navy tabular-nums">{aud(r.price)}</TableCell>
    </>
  )
}

function BasicTable(props: React.ComponentProps<typeof Table>) {
  return (
    <Table {...props}>
      <TableHeader>
        <HeaderRow />
      </TableHeader>
      <TableBody>
        {reports.map((r) => (
          <TableRow key={r.id}>
            <Cells r={r} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const frame = 'w-full max-w-4xl'

// ── Variants ─────────────────────────────────────────────────────────────────

/** Use the `variant` and `size` controls to try every combination. */
export const Default: Story = {
  render: (args) => (
    <div className={frame}>
      <BasicTable {...args} />
    </div>
  ),
}

export const Card: Story = { ...Default, args: { variant: 'card' } }

export const Striped: Story = { ...Default, args: { variant: 'striped' } }

export const Bordered: Story = { ...Default, args: { variant: 'bordered' } }

export const Sizes: Story = {
  render: ({ variant }) => (
    <div className={`${frame} flex flex-col gap-8`}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <p className="text-overline text-dark-60">size=&quot;{size}&quot;</p>
          <BasicTable variant={variant ?? 'card'} size={size} />
        </div>
      ))}
    </div>
  ),
  args: { variant: 'card' },
}

// ── Compositions ─────────────────────────────────────────────────────────────

export const WithFooterAndCaption: Story = {
  name: 'With footer & caption',
  args: { variant: 'card' },
  render: (args) => (
    <div className={frame}>
      <Table {...args}>
        <TableCaption>Reports ordered in October 2026.</TableCaption>
        <TableHeader>
          <HeaderRow />
        </TableHeader>
        <TableBody>
          {reports.map((r) => (
            <TableRow key={r.id}>
              <Cells r={r} />
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total ({reports.length} reports)</TableCell>
            <TableCell className="text-end tabular-nums">
              {aud(reports.reduce((sum, r) => sum + r.price, 0))}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
}

export const SelectableRows: Story = {
  name: 'Selectable rows',
  args: { variant: 'card' },
  render: function Render(args) {
    const [selected, setSelected] = React.useState<string[]>(['R-1043'])
    const all = selected.length === reports.length
    const some = selected.length > 0 && !all
    const toggle = (id: string, on: boolean) =>
      setSelected((prev) => (on ? [...prev, id] : prev.filter((x) => x !== id)))
    return (
      <div className={frame}>
        <Table {...args}>
          <TableHeader>
            <HeaderRow
              select={
                <Checkbox
                  aria-label="Select all"
                  checked={all}
                  indeterminate={some}
                  onCheckedChange={(on) => setSelected(on ? reports.map((r) => r.id) : [])}
                />
              }
            />
          </TableHeader>
          <TableBody>
            {reports.map((r) => {
              const isSelected = selected.includes(r.id)
              return (
                // The whole row toggles selection; the checkbox stays for keyboard users.
                <TableRow
                  key={r.id}
                  aria-selected={isSelected}
                  data-state={isSelected ? 'selected' : undefined}
                  className="cursor-pointer select-none"
                  onClick={() => toggle(r.id, !isSelected)}
                >
                  <TableCell>
                    <Checkbox
                      aria-label={`Select ${r.address}`}
                      checked={isSelected}
                      onCheckedChange={(on) => toggle(r.id, on)}
                      // Don't let the click bubble to the row, or it toggles twice.
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <Cells r={r} />
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <p className="mt-3 text-body-5 text-dark-60">{selected.length} of {reports.length} selected</p>
      </div>
    )
  },
}

function RowActions({ address }: { address: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${address}`}>
            <IconDots />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem><IconEye /> View report</DropdownMenuItem>
          <DropdownMenuItem><IconDownload /> Download PDF</DropdownMenuItem>
          <DropdownMenuItem><IconShare /> Share</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive"><IconTrash /> Cancel order</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Section header, options toolbar (search, filter, export) and per-row actions. */
export const WithHeaderAndOptions: Story = {
  name: 'With header & options',
  args: { variant: 'card' },
  parameters: { layout: 'padded' },
  render: function Render(args) {
    const [query, setQuery] = React.useState('')
    const rows = reports.filter((r) =>
      `${r.address} ${r.suburb} ${r.inspector}`.toLowerCase().includes(query.trim().toLowerCase())
    )
    return (
      <section className={`${frame} flex flex-col gap-4`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h4 text-navy">Inspection reports</h2>
            <p className="text-body-5 text-dark-60">All reports ordered for your properties.</p>
          </div>
          <Button size="sm">
            <IconPlus data-icon="inline-start" />
            Order report
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <InputGroup className="w-72">
            <InputGroupAddon align="inline-start">
              <IconSearch />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search address or inspector…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>
          <div className="flex items-center gap-2">
            <Button variant="tertiary" size="sm">
              <IconAdjustmentsHorizontal data-icon="inline-start" />
              Filter
            </Button>
            <Button variant="tertiary" size="sm">
              <IconDownload data-icon="inline-start" />
              Export
            </Button>
          </div>
        </div>

        <Table {...args}>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Report</TableHead>
              <TableHead>Inspector</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-end">Price</TableHead>
              <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableEmpty
                colSpan={7}
                icon={<IconFileSearch />}
                title="No matching reports"
                description={`Nothing matches “${query}”. Try a different address or inspector name.`}
                actions={
                  <Button variant="tertiary" size="sm" onClick={() => setQuery('')}>
                    Clear search
                  </Button>
                }
              />
            ) : (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <Cells r={r} />
                  <TableCell className="text-end">
                    <RowActions address={r.address} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>
    )
  },
}

export const Empty: Story = {
  args: { variant: 'card' },
  render: (args) => (
    <div className={frame}>
      <Table {...args}>
        <TableHeader>
          <HeaderRow />
        </TableHeader>
        <TableBody>
          <TableEmpty
            colSpan={6}
            icon={<IconMoodEmpty />}
            title="No reports yet"
            description="Order a property report and it will show up here."
            actions={
              <>
                <Button size="sm">
                  <IconPlus data-icon="inline-start" />
                  Order a report
                </Button>
                <Button variant="tertiary" size="sm">Learn more</Button>
              </>
            }
            footer="Need help? Contact support"
          />
        </TableBody>
      </Table>
    </div>
  ),
}

export const NoResults: Story = {
  name: 'Empty, no results',
  args: { variant: 'card' },
  render: (args) => (
    <div className={frame}>
      <Table {...args}>
        <TableHeader>
          <HeaderRow />
        </TableHeader>
        <TableBody>
          <TableEmpty
            colSpan={6}
            icon={<IconFileSearch />}
            title="No matching reports"
            description="Try adjusting your search or filters to find what you’re looking for."
            actions={
              <>
                <Button variant="tertiary" size="sm">Clear filters</Button>
                <Button variant="ghost" size="sm">Reset search</Button>
              </>
            }
          />
        </TableBody>
      </Table>
    </div>
  ),
}

type SortKey = 'address' | 'date' | 'price'

/** Click a sortable header to cycle ascending → descending → unsorted. Arrows are dark-60; the header sets aria-sort. */
export const Sortable: Story = {
  render: function Render(args) {
    const [sort, setSort] = React.useState<{
      key: SortKey;
      dir: SortDirection;
    }>({
      key: 'price',
      dir: 'desc'
    });
    const cycle = (key: SortKey) => setSort(s => ({
      key,
      dir: s.key !== key ? 'asc' : s.dir === 'asc' ? 'desc' : s.dir === 'desc' ? false : 'asc'
    }));
    const dirFor = (key: SortKey): SortDirection => sort.key === key ? sort.dir : false;
    const rows = [...reports].sort((a, b) => {
      if (!sort.dir) return 0;
      const av = sort.key === 'price' ? a.price : sort.key === 'date' ? a.id : a.address;
      const bv = sort.key === 'price' ? b.price : sort.key === 'date' ? b.id : b.address;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return <div className={frame}>
        <Table {...args}>
          <TableHeader>
            <TableRow>
              <TableHead sortable sortDirection={dirFor('address')} onSort={() => cycle('address')}>Property</TableHead>
              <TableHead>Report</TableHead>
              <TableHead>Inspector</TableHead>
              <TableHead sortable sortDirection={dirFor('date')} onSort={() => cycle('date')}>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-end" sortable sortDirection={dirFor('price')} onSort={() => cycle('price')}>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(r => <TableRow key={r.id}>
                <Cells r={r} />
              </TableRow>)}
          </TableBody>
        </Table>
      </div>;
  }
}

/** Row actions menu (⋮) used in the controls column. */
function ControlsMenu({ address }: { address: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuIconTrigger label={`Actions for ${address}`} />
      <DropdownMenuContent align="end" className="w-56">
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Expandable rows: a trailing **Controls** column with the expand chevron and a
 * ⋮ actions menu. Click anywhere on a row to expand it; the chevron and menu do
 * their own thing.
 */
export const WithControlsColumn: Story = {
  name: 'Collapsible: with controls column',
  render: (args) => (
    <div className={frame}>
      <Table {...args}>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Report</TableHead>
            <TableHead>Inspector</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-end">Price</TableHead>
            <TableControlsHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((r, i) => (
            <TableExpandableRow
              key={r.id}
              colSpan={7}
              defaultOpen={i === 0}
              toggleLabel={`Show details for ${r.address}`}
              controls={<ControlsMenu address={r.address} />}
              detail={
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-overline text-dark-60">Report ID</div>
                    <div className="text-navy">{r.id}</div>
                  </div>
                  <div>
                    <div className="text-overline text-dark-60">Access</div>
                    <div>Keys with agent, 9:00 am</div>
                  </div>
                  <div>
                    <div className="text-overline text-dark-60">Notes</div>
                    <div>Roof void access via hallway hatch.</div>
                  </div>
                </div>
              }
            >
              <Cells r={r} />
            </TableExpandableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
}

/** Show the first rows and reveal the rest with "View more". */
export const ViewMore: Story = {
  name: 'Collapsible: view more',
  render: function Render(args) {
    const [expanded, setExpanded] = React.useState(false)
    const limit = 3
    const visible = expanded ? reports : reports.slice(0, limit)
    return (
      <div className={frame}>
        <Table {...args}>
          <TableHeader>
            <HeaderRow />
          </TableHeader>
          <TableBody>
            {visible.map((r) => (
              <TableRow key={r.id}>
                <Cells r={r} />
              </TableRow>
            ))}
            <TableViewMore
              colSpan={6}
              expanded={expanded}
              onExpandedChange={setExpanded}
              hiddenCount={reports.length - limit}
            />
          </TableBody>
        </Table>
      </div>
    )
  },
}
