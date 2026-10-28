import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconChevronRight, IconFileText } from '@tabler/icons-react'
import { Button } from '../../components/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '../../components/ui/item'

const meta: Meta<typeof Item> = {
  title: 'BYB Components/Item',
  component: Item,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'outline', 'muted'] },
    size: { control: 'select', options: ['default', 'sm', 'xs'] },
  },
  args: { variant: 'outline', size: 'default' },
  render: (args) => (
    <div className="w-110">
      <Item {...args}>
        <ItemMedia variant="icon">
          <IconFileText />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Building & pest report</ItemTitle>
          <ItemDescription>12 Smith St, Newtown · Ready 18 Oct</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            View
          </Button>
        </ItemActions>
      </Item>
    </div>
  ),
}

export default meta
type Story = StoryObj<typeof Item>

export const Outline: Story = {}
export const Default: Story = { args: { variant: 'default' } }
export const Muted: Story = { args: { variant: 'muted' } }
export const Small: Story = { args: { size: 'sm' } }
export const ExtraSmall: Story = { args: { size: 'xs' } }

/** A list of link items. */
export const Group: Story = {
  render: () => (
    <div className="w-110">
      <ItemGroup>
        {['Building & pest report', 'Strata report', 'Pool inspection'].map((title, i) => (
          <div key={title}>
            {i > 0 && <ItemSeparator />}
            <Item render={<a href="#" />}>
              <ItemContent>
                <ItemTitle>{title}</ItemTitle>
                <ItemDescription>12 Smith St, Newtown</ItemDescription>
              </ItemContent>
              <ItemActions>
                <IconChevronRight />
              </ItemActions>
            </Item>
          </div>
        ))}
      </ItemGroup>
    </div>
  ),
}
