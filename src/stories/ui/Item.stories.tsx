import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconChevronRight, IconFileText } from '@tabler/icons-react'
import { Button } from '../../components/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '../../components/ui/item'

const meta: Meta<typeof Item> = {
  title: 'BYB Components/Item',
  component: Item,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'A row of media, title, description and actions, for lists and settings.' } } },
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

const PHOTO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#D2EFEA"/><path d="M8 30l9-11 7 8 4-5 6 8z" fill="#009E87"/></svg>')

/** An image thumbnail at each item size, in groups of that size. */
export const WithImage: Story = {
  render: () => (
    <div className="flex w-110 flex-col gap-6">
      {(['default', 'sm', 'xs'] as const).map((size) => (
        <ItemGroup key={size}>
          {['12 Smith St, Newtown', '4/88 King St, Enmore'].map((address) => (
            <Item key={address} size={size} variant="outline">
              <ItemMedia variant="image">
                <img src={PHOTO} alt="" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{address}</ItemTitle>
                <ItemDescription>Building & pest · {size}</ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      ))}
    </div>
  ),
}

/** A header above the content and a footer below it. */
export const WithHeaderAndFooter: Story = {
  render: () => (
    <div className="w-110">
      <Item variant="outline" className="flex-col items-stretch">
        <ItemHeader>
          <ItemTitle>Strata report</ItemTitle>
          <ItemDescription>Ready 18 Oct</ItemDescription>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>Levies, sinking fund, by-laws and the last two years of minutes.</ItemDescription>
        </ItemContent>
        <ItemFooter>
          <Button variant="tertiary" size="sm">
            Download
          </Button>
          <Button size="sm">View</Button>
        </ItemFooter>
      </Item>
    </div>
  ),
}
