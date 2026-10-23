import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from '../../components/ui/skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'BYB Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  render: () => <Skeleton className="h-12 w-48" />,
}

export const Card: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-62.5" />
        <Skeleton className="h-4 w-50" />
      </div>
    </div>
  ),
}

/** Reads clearly on both white and light-l1 (muted) surfaces. */
export const OnSurfaces: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {['bg-white', 'bg-light-l1'].map((bg) => (
        <div key={bg} className={`${bg} flex flex-col gap-3 rounded-lg border border-dark-15 p-4`}>
          <span className="text-caption-1 text-dark-75">{bg}</span>
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-1/2 rounded-md" />
        </div>
      ))}
    </div>
  ),
}

export const TableRows: Story = {
  render: () => (
    <div className="flex w-120 flex-col gap-3">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 flex-1 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
      ))}
    </div>
  ),
}
