import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card'
import { Button } from '../../components/ui/button'

const meta: Meta<typeof Card> = {
  title: 'shadcn/Card',
  component: Card,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Inspection report</CardTitle>
        <CardDescription>Generated 3 hours ago</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-body-sm text-muted-foreground">
          The property passed all 47 critical checks. View the full report for room-by-room detail.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline">Download PDF</Button>
        <Button>View report</Button>
      </CardFooter>
    </Card>
  ),
}

export const Minimal: Story = {
  render: () => (
    <Card className="w-96 p-6">
      <p className="text-body-md">A minimal card with just content.</p>
    </Card>
  ),
}
