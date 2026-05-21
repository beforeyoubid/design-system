import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/accordion'

const meta: Meta<typeof Accordion> = {
  title: 'shadcn/Accordion',
  component: Accordion,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Accordion>

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-96">
      <AccordionItem value="a">
        <AccordionTrigger>What is BYB?</AccordionTrigger>
        <AccordionContent>Before You Buy connects buyers with inspection professionals.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>How long does it take?</AccordionTrigger>
        <AccordionContent>Most inspections are scheduled within 48 hours.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>Is the report shareable?</AccordionTrigger>
        <AccordionContent>Yes — download as PDF or share via a secure link.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-96">
      <AccordionItem value="a">
        <AccordionTrigger>Item one</AccordionTrigger>
        <AccordionContent>Content one.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Item two</AccordionTrigger>
        <AccordionContent>Content two.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
