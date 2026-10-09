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
import { SelectField } from '../../components/SelectField'

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
