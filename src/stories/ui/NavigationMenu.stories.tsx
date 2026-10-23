import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../../components/ui/navigation-menu'

const meta: Meta<typeof NavigationMenu> = {
  title: 'BYB Components/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NavigationMenu>

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Services</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-72">
              <li><NavigationMenuLink href="#" active>Pre-purchase inspection</NavigationMenuLink></li>
              <li><NavigationMenuLink href="#">Pest inspection</NavigationMenuLink></li>
              <li><NavigationMenuLink href="#">Building inspection</NavigationMenuLink></li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="h-10 px-3 font-medium">Pricing</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}
