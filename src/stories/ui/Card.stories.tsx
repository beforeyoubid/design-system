import type { Meta, StoryObj } from '@storybook/react-vite'
import { CircleAlert, FileText, Receipt, TriangleAlert, Users } from 'lucide-react'
import { Card, CardAction, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card'
import { Button } from '../../components/ui/button'

const meta: Meta<typeof Card> = {
  title: 'BYB Components/Card',
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
        <p className="text-body-5 text-muted-foreground">
          The property passed all 47 critical checks. View the full report for room-by-room detail.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="tertiary">Download PDF</Button>
        <Button>View report</Button>
      </CardFooter>
    </Card>
  ),
}

export const Minimal: Story = {
  render: () => (
    <Card className="w-96 p-6">
      <p className="text-body-4">A minimal card with just content.</p>
    </Card>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader icon={<FileText />} iconTone="mint">
        <CardTitle>Inspection report</CardTitle>
        <CardDescription>Generated 3 hours ago</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">Share</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-body-5 text-muted-foreground">
          The property passed all 47 critical checks.
        </p>
      </CardContent>
    </Card>
  ),
}

const ICON_CARDS = [
  { tone: 'mint', icon: <FileText />, title: 'Reports', description: '12 ready to download' },
  { tone: 'navy', icon: <Users />, title: 'Team', description: '4 members' },
  { tone: 'lime', icon: <FileText />, title: 'Express report', description: 'Ready in 24 hours' },
  { tone: 'warning', icon: <TriangleAlert />, title: 'Payment pending', description: 'Card needs verification' },
  { tone: 'error', icon: <CircleAlert />, title: 'Upload failed', description: '2 files could not be added' },
  { tone: 'neutral', icon: <Receipt />, title: 'Invoices', description: '3 this month' },
] as const

export const IconTones: Story = {
  render: () => (
    <div className="grid w-200 grid-cols-3 gap-4">
      {ICON_CARDS.map(({ tone, icon, title, description }) => (
        <Card key={tone} size="sm">
          <CardHeader icon={icon} iconTone={tone} iconSize="sm">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
      <Card size="sm">
        <CardHeader icon={<FileText />} iconTone="navy" iconShape="square" iconSize="lg">
          <CardTitle>Square, large</CardTitle>
          <CardDescription>{'iconShape="square" iconSize="lg"'}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
}
