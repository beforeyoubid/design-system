import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Select,
  SelectContent,
  SelectFooter,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { FileText, ShieldCheck, Waves } from 'lucide-react'
import { SelectField, productSelectOptions } from '../../components/SelectField'
import { ColorDot } from '../../components/ui/color-dot'

const meta: Meta<typeof Select> = {
  title: 'BYB Components/Select',
  component: Select,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Select>

const STATES = [
  { label: 'New South Wales', value: 'nsw' },
  { label: 'Victoria', value: 'vic' },
  { label: 'Queensland', value: 'qld' },
  { label: 'Western Australia', value: 'wa' },
  { label: 'South Australia', value: 'sa' },
  { label: 'Tasmania', value: 'tas' },
  { label: 'Northern Territory', value: 'nt', disabled: true },
]

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <Select>
        <SelectTrigger aria-label="State">
          <SelectValue placeholder="Select a state" />
        </SelectTrigger>
        <SelectContent>
          {STATES.map((s) => (
            <SelectItem key={s.value} value={s.value} disabled={s.disabled}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
}

export const Selected: Story = {
  render: () => (
    <div className="w-80">
      <Select defaultValue="vic">
        <SelectTrigger aria-label="State">
          <SelectValue placeholder="Select a state" />
        </SelectTrigger>
        <SelectContent>
          {STATES.map((s) => (
            <SelectItem key={s.value} value={s.value} disabled={s.disabled}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
}

export const Small: Story = {
  render: () => (
    <div className="w-60">
      <Select>
        <SelectTrigger size="sm" aria-label="State">
          <SelectValue placeholder="Select a state" />
        </SelectTrigger>
        <SelectContent>
          {STATES.map((s) => (
            <SelectItem key={s.value} value={s.value} disabled={s.disabled}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
}

export const Grouped: Story = {
  render: () => (
    <div className="w-80">
      <Select>
        <SelectTrigger aria-label="Report type">
          <SelectValue placeholder="Choose a report" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Inspections</SelectLabel>
            <SelectItem value="building">Building</SelectItem>
            <SelectItem value="pest">Pest</SelectItem>
            <SelectItem value="building-pest">Building &amp; pest</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Documents</SelectLabel>
            <SelectItem value="strata">Strata report</SelectItem>
            <SelectItem value="contract">Contract review</SelectItem>
            <SelectItem value="pool" disabled>
              Pool compliance
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
}

/* ---------------------------------------------------------------- */
/* SelectField: label + select + hint/error                        */
/* ---------------------------------------------------------------- */

export const WithLabel: Story = {
  render: () => (
    <div className="w-80">
      <SelectField label="State" options={STATES} placeholder="Select a state" />
    </div>
  ),
}

export const WithHint: Story = {
  render: () => (
    <div className="w-80">
      <SelectField
        label="State"
        options={STATES}
        placeholder="Select a state"
        hint="Where is the property located?"
      />
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="w-80">
      <SelectField
        label="State"
        options={STATES}
        placeholder="Select a state"
        error="Please choose a state."
      />
    </div>
  ),
}

export const Required: Story = {
  render: () => (
    <div className="w-80">
      <SelectField label="State" options={STATES} placeholder="Select a state" required />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <SelectField
        label="State"
        options={STATES}
        defaultValue="nsw"
        hint="State can't be changed after booking."
        disabled
      />
    </div>
  ),
}

export const Multiple: Story = {
  render: () => (
    <div className="w-80">
      <SelectField
        multiple
        label="Reports"
        hint="Pick every report you want for this property."
        placeholder="Select reports"
        defaultValue={['building', 'strata']}
        options={[
          { label: 'Building & pest', value: 'building' },
          { label: 'Strata', value: 'strata' },
          { label: 'Pool compliance', value: 'pool' },
          { label: 'Title search', value: 'title' },
        ]}
      />
    </div>
  ),
}

export const MultipleManySelected: Story = {
  render: () => (
    <div className="w-80">
      <SelectField
        multiple
        label="States"
        options={STATES}
        defaultValue={['nsw', 'vic', 'qld', 'wa']}
        maxDisplayed={2}
      />
    </div>
  ),
}

export const MultiplePrimitive: Story = {
  name: 'Multiple (primitive)',
  render: () => (
    <Select multiple defaultValue={['nsw', 'qld']}>
      <SelectTrigger className="w-80">
        <SelectValue>
          {(value: string[]) =>
            value.length ? `${value.length} states selected` : 'Select states'
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {STATES.map((s) => (
          <SelectItem key={s.value} value={s.value} disabled={s.disabled} indicator="checkbox">
            {s.label}
          </SelectItem>
        ))}
        <SelectFooter>
          <span>Pick any number of states</span>
        </SelectFooter>
      </SelectContent>
    </Select>
  ),
}

/* ---------------------------------------------------------------- */
/* Multiple: categories and right-hand labels                      */
/* ---------------------------------------------------------------- */

const REPORT_GROUPS = [
  {
    label: 'Inspections',
    options: [
      { label: 'Building & pest', value: 'bpi', meta: '26' },
      { label: 'Building', value: 'building', meta: '9' },
      { label: 'Pest', value: 'pest', meta: '4' },
    ],
  },
  {
    label: 'Certificates',
    options: [
      { label: 'Owners corporation (VIC)', value: 'oc', meta: '3' },
      { label: 'Electrical safety', value: 'esc', meta: '1' },
    ],
  },
  {
    label: 'Reports',
    options: [
      { label: 'Strata', value: 'strata', meta: '12' },
      { label: 'Dilapidation', value: 'dilap', meta: '0', disabled: true },
    ],
  },
]

/** `options` entries shaped `{ label, options }` render as category headings. */
export const MultipleWithCategories: Story = {
  name: 'Multiple: categories',
  render: () => (
    <div className="w-80">
      <SelectField
        multiple
        label="Reports"
        placeholder="Select reports"
        defaultValue={['bpi', 'strata']}
        options={REPORT_GROUPS.map((g) => ({
          ...g,
          options: g.options.map((o) => ({ label: o.label, value: o.value, disabled: o.disabled })),
        }))}
      />
    </div>
  ),
}

/** `meta` on an option shows a right-aligned label, e.g. a count. */
export const MultipleWithRightLabel: Story = {
  name: 'Multiple: right label',
  render: () => (
    <div className="w-80">
      <SelectField
        multiple
        label="Reports"
        placeholder="Select reports"
        defaultValue={['bpi']}
        options={REPORT_GROUPS.flatMap((g) => g.options)}
      />
    </div>
  ),
}

export const MultipleWithCategoriesAndRightLabel: Story = {
  name: 'Multiple: categories + right label',
  render: () => (
    <div className="w-80">
      <SelectField
        multiple
        label="Reports"
        placeholder="Select reports"
        options={REPORT_GROUPS}
      />
    </div>
  ),
}

/** Single select also supports `meta`; it sits before the trailing check. */
/** Single choice with a right label: the label replaces the trailing check; the mint row marks the selection. */
export const SingleWithRightLabel: Story = {
  name: 'Single: right label',
  render: () => (
    <div className="w-80">
      <Select
        defaultValue="vic"
        items={{
          nsw: "New South Wales",
          vic: "Victoria",
          qld: "Queensland",
          wa: "Western Australia",
          sa: "South Australia",
        }}
      >
        <SelectTrigger aria-label="State">
          <SelectValue placeholder="Select a state" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Eastern states</SelectLabel>
            <SelectItem value="nsw" meta="142 jobs">New South Wales</SelectItem>
            <SelectItem value="vic" meta="98 jobs">Victoria</SelectItem>
            <SelectItem value="qld" meta="61 jobs">Queensland</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Western states</SelectLabel>
            <SelectItem value="wa" meta="17 jobs">Western Australia</SelectItem>
            <SelectItem value="sa" meta="9 jobs">South Australia</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
}

/**
 * Custom content per option: `meta` (right side of the row) and `chip`
 * (inside the selected chip) take any node. `productSelectOptions()` builds
 * product options with their badge-colour dots.
 */
export const MultipleWithProductColours: Story = {
  name: 'Multiple: product colours',
  render: () => (
    <div className="w-80">
      <SelectField
        multiple
        label="Products"
        maxDisplayed={1}
        defaultValue={['bpi', 'building-inspection', 'strata-report', 'electrical-report', 'pool-inspection']}
        options={productSelectOptions(
          ['bpi', 'building-inspection', 'pest-inspection', 'strata-report', 'electrical-report', 'pool-inspection'],
          { bpi: { label: 'Building & Pest Report' }, 'pest-inspection': { label: 'Timber Pest Inspection' } }
        )}
      />
    </div>
  ),
}

/** Single choice with product colours: the dot sits on the right of each row and before the chosen value. */
export const SingleWithProductColours: Story = {
  name: 'Single: product colours',
  render: () => (
    <div className="w-80">
      <SelectField label="Product" defaultValue="strata-report" options={productSelectOptions()} />
    </div>
  ),
}

/**
 * Scales to any content: `start` for a leading icon, `meta` for anything on
 * the right, `chip` for what the field shows once picked.
 */
export const MultipleWithCustomContent: Story = {
  name: 'Multiple: custom content',
  render: () => (
    <div className="w-80">
      <SelectField
        multiple
        label="Add-ons"
        defaultValue={['report']}
        options={[
          { value: 'report', label: 'PDF report', start: <FileText className="text-dark-75" />, meta: 'Free', chip: <FileText className="size-3.5" /> },
          { value: 'pool', label: 'Pool check', start: <Waves className="text-dark-75" />, meta: '$120', chip: <Waves className="size-3.5" /> },
          { value: 'warranty', label: 'Warranty review', start: <ShieldCheck className="text-dark-75" />, meta: <ColorDot className="bg-warning-45" />, chip: <ColorDot className="bg-warning-45" /> },
        ]}
      />
    </div>
  ),
}
