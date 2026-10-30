import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
  useComboboxAnchor,
} from '../../components/combobox'

const reports = [
  'Building & pest report',
  'Building report',
  'Pest report',
  'Strata report',
  'Pool inspection',
  'Electrical report',
]

const meta: Meta<typeof Combobox> = {
  title: 'BYB Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Pick one or many options by typing to filter. Use over Select when the list is long or searchable; chips for multiple.' } } },
}

export default meta
type Story = StoryObj<typeof Combobox>

export const Default: Story = {
  render: () => (
    <div className="w-72">
      <Combobox items={reports}>
        <ComboboxInput placeholder="Search reports" />
        <ComboboxContent>
          <ComboboxEmpty>No reports found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  ),
}

/** `multiple` with chips anchored to the chip field. */
export const Multiple: Story = {
  render: function Render() {
    const anchor = useComboboxAnchor()
    return (
      <div className="w-96">
        <Combobox multiple items={reports} defaultValue={[reports[0]]}>
          <ComboboxChips ref={anchor}>
            <ComboboxValue>
              {(values: string[]) => (
                <>
                  {values.map((value) => (
                    <ComboboxChip key={value}>{value}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput placeholder="Add a report" />
                </>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor}>
            <ComboboxEmpty>No reports found.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    )
  },
}

const groups = [
  { value: 'Inspections', items: ['Building & pest report', 'Pool inspection', 'Electrical report'] },
  { value: 'Documents', items: ['Strata report', 'Contract review'] },
]

/** Options in labelled groups with a line between them, and one option that can't be picked. */
export const Grouped: Story = {
  render: () => (
    <div className="w-80">
      <Combobox items={groups}>
        <ComboboxInput placeholder="Search reports" />
        <ComboboxContent>
          <ComboboxEmpty>No reports found.</ComboboxEmpty>
          <ComboboxList>
            {(group: (typeof groups)[number], index: number) => (
              <ComboboxGroup key={group.value} items={group.items}>
                {index > 0 && <ComboboxSeparator />}
                <ComboboxLabel>{group.value}</ComboboxLabel>
                <ComboboxCollection>
                  {(item: string) => (
                    <ComboboxItem key={item} value={item} disabled={item === 'Contract review'}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  ),
}

/** A multiple combobox that's disabled, and one that's invalid. */
export const MultipleStates: Story = {
  render: function Render() {
    const disabledAnchor = useComboboxAnchor()
    const invalidAnchor = useComboboxAnchor()
    const field = (anchor: ReturnType<typeof useComboboxAnchor>, props: { disabled?: boolean; invalid?: boolean }) => (
      <Combobox multiple items={reports} defaultValue={[reports[0], reports[3]]} disabled={props.disabled}>
        <ComboboxChips ref={anchor} aria-invalid={props.invalid || undefined}>
          <ComboboxValue>
            {(values: string[]) => (
              <>
                {values.map((value) => (
                  <ComboboxChip key={value}>{value}</ComboboxChip>
                ))}
                <ComboboxChipsInput placeholder="Add a report" aria-invalid={props.invalid || undefined} />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    )
    return (
      <div className="flex w-96 flex-col gap-4">
        {field(disabledAnchor, { disabled: true })}
        {field(invalidAnchor, { invalid: true })}
      </div>
    )
  },
}
