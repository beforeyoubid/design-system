import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../components/ui/resizable'

const meta: Meta<typeof ResizablePanelGroup> = {
  title: 'shadcn/Resizable',
  component: ResizablePanelGroup,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ResizablePanelGroup>

export const Horizontal: Story = {
  render: () => (
    <ResizablePanelGroup direction="horizontal" className="h-48 w-[600px] rounded-md border">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6 text-body-sm">One</div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-6 text-body-sm">Two</div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-6 text-body-sm">Three</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}
