import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
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
