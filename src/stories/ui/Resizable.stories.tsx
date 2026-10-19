import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../components/ui/resizable'

const meta: Meta<typeof ResizablePanelGroup> = {
  title: 'BYB Components/Resizable',
  component: ResizablePanelGroup,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ResizablePanelGroup>

export const Horizontal: Story = {
  render: () => (
    <div className="h-48 w-150 max-w-full overflow-hidden rounded-md border">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize="50%">
          <div className="flex h-full items-center justify-center p-6 text-body-5">One</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="50%">
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize="50%">
              <div className="flex h-full items-center justify-center p-6 text-body-5">Two</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="50%">
              <div className="flex h-full items-center justify-center p-6 text-body-5">Three</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
}
