import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '../../components/ui/menubar'

const meta: Meta<typeof Menubar> = {
  title: 'BYB Components/Menubar',
  component: Menubar,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'A desktop-style menu bar with dropdown menus.' } } },
}

export default meta
type Story = StoryObj<typeof Menubar>

export const Default: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
          <MenubarItem>Open <MenubarShortcut>⌘O</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Save <MenubarShortcut>⌘S</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
          <MenubarItem>Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
}

function AllItemsDemo() {
  const [grid, setGrid] = React.useState(true)
  const [zoom, setZoom] = React.useState('100')
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>Layout</MenubarLabel>
            <MenubarCheckboxItem checked={grid} onCheckedChange={setGrid}>
              Show grid
            </MenubarCheckboxItem>
            <MenubarCheckboxItem checked={false} disabled>
              Show rulers
            </MenubarCheckboxItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarRadioGroup value={zoom} onValueChange={setZoom}>
            <MenubarLabel>Zoom</MenubarLabel>
            <MenubarRadioItem value="100">100%</MenubarRadioItem>
            <MenubarRadioItem value="150">150%</MenubarRadioItem>
            <MenubarRadioItem value="200" disabled>
              200%
            </MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem inset>Full screen</MenubarItem>
          <MenubarItem disabled>Present (no slides)</MenubarItem>
          <MenubarSub defaultOpen>
            <MenubarSubTrigger>Panels</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Layers</MenubarItem>
              <MenubarItem>Comments</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

/** Every kind of row in the first menu: labels, checkbox and radio items, inset and disabled items, a sub-menu (opened). */
export const AllItems: Story = {
  render: () => <AllItemsDemo />,
}
