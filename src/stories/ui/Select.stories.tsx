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
} from '../../components/select'

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
