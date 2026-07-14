import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/accordion'

const meta: Meta<typeof Accordion> = {
  title: 'shadcn/Accordion',
  component: Accordion,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Accordion>

const FAQ_ITEMS = [
  {
    value: 'share-cost',
    question: 'How does the share-cost / refund work?',
    answer: 'When you share your report with another buyer, you receive a partial refund on the cost of your inspection. This makes it more affordable for everyone involved.',
  },
  {
    value: 'inspectors',
    question: 'Who are your inspectors and how are they vetted?',
    answer: 'All BYB inspectors are licensed building professionals with a minimum of 5 years field experience. Each inspector is background checked and holds full professional indemnity insurance.',
  },
  {
    value: 'turnaround',
    question: 'How long does it take to get my report?',
    answer: 'Most inspections are scheduled within 48 hours and reports are delivered within 24 hours of the inspection being completed.',
  },
  {
    value: 'seller-report',
    question: 'What if the seller has already ordered a report?',
    answer: 'You can purchase the existing report directly through BYB at a reduced cost, or commission your own independent inspection for complete peace of mind.',
  },
  {
    value: 'report-types',
    question: 'What types of reports does BYB offer?',
    answer: 'BYB offers building and pest inspections, strata reports, and combined building + pest packages depending on the property type.',
  },
  {
    value: 'no-purchase',
    question: "What happens if I don't end up buying the property?",
    answer: 'Your report is yours to keep regardless of the outcome. You can also choose to share it with other buyers to recoup part of your cost.',
  },
  {
    value: 'independence',
    question: 'Is the inspector truly independent from the agent and seller?',
    answer: 'Yes. BYB inspectors have no commercial relationship with agents or sellers. They are engaged directly by you and report only to you.',
  },
  {
    value: 'payment',
    question: 'How do I pay for my report?',
    answer: 'Payment is made securely online at the time of booking via credit card or bank transfer. You will receive a tax invoice upon completion.',
  },
  {
    value: 'unhappy',
    question: "What if I'm unhappy with the inspector or the report?",
    answer: 'Contact our support team within 7 days of receiving your report and we will work with you to resolve the issue, including arranging a re-inspection where warranted.',
  },
]

export const Default: Story = {
  render: () => (
    <Accordion defaultValue={null} className="max-w-2xl">
      {FAQ_ITEMS.map(item => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
}

export const SingleOpen: Story = {
  render: () => (
    <Accordion defaultValue="share-cost" className="max-w-2xl">
      {FAQ_ITEMS.map(item => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
}
