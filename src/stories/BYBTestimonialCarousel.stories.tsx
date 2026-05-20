import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  BYBTestimonialCarousel,
  BYBTestimonialCard,
} from '../components/BYBTestimonialCarousel'
import type { Testimonial } from '../components/BYBTestimonialCarousel'

// ── Shared placeholder data ───────────────────────────────────────────────────

const TESTIMONIALS: Testimonial[] = [
  {
    stars: 5,
    content:
      'BYB works perfectly for me having it all online and knowing BYB will have the reports to me quickly without having to follow anyone up. Potentially saving my clients money on the re-sale of the report is an added bonus as well.',
    name: 'John Carew',
    role: 'Buyers Agent',
    image: 'https://i.pravatar.cc/160?img=11',
  },
  {
    stars: 5,
    content:
      "The last thing we wanted was an inexperienced conveyancer so the professionalism of BYB's lawyer was appreciated and made settlement a drama free process.",
    name: 'K Marriman',
    role: 'Customer',
    image: 'https://i.pravatar.cc/160?img=5',
  },
  {
    stars: 5,
    content:
      "Getting a $240 refund after the property came off the market was fantastic! It meant we didn't waste any money unnecessarily whilst finding our home. I would definitely use you again.",
    name: 'M. Westhoff',
    role: 'Customer',
    image: 'https://i.pravatar.cc/160?img=8',
  },
  {
    stars: 5,
    content:
      'Having reports accessible and the inspector panel is thorough — the reports are detailed and BYB is easy to work with.',
    name: 'T. Nguyen',
    role: 'Property Manager',
    image: 'https://i.pravatar.cc/160?img=3',
  },
  {
    stars: 5,
    content:
      'As a first home buyer the process was seamless. I found BYB easy to use at every step and the reports are thorough. Highly recommend.',
    name: 'L. Brooks',
    role: 'Customer',
    image: 'https://i.pravatar.cc/160?img=9',
  },
  {
    stars: 4,
    content:
      'Found the perfect building inspector in minutes. The report helped us negotiate $15k off the purchase price. Excellent service throughout.',
    name: 'S. Mitchell',
    role: 'Property Buyer',
    image: 'https://i.pravatar.cc/160?img=15',
  },
]

// ════════════════════════════════════════════════════════════════════════════
// Card stories — single card with controllable stars & content
// ════════════════════════════════════════════════════════════════════════════

const cardMeta: Meta<typeof BYBTestimonialCard> = {
  title: 'Components/BYBTestimonialCard',
  component: BYBTestimonialCard,
  tags: ['autodocs'],
  argTypes: {
    stars:           { control: { type: 'number', min: 1, max: 5, step: 1 } },
    content:         { control: 'text' },
    name:            { control: 'text' },
    role:            { control: 'text' },
    triangleVariant: { control: 'select', options: ['cobalt', 'lime'] },
  },
  parameters: { backgrounds: { default: 'light' } },
}

export default cardMeta
type CardStory = StoryObj<typeof BYBTestimonialCard>

export const CardCobalt: CardStory = {
  args: {
    stars:           5,
    content:         'BYB works perfectly for me having it all online and knowing BYB will have the reports to me quickly without having to follow anyone up.',
    name:            'John Carew',
    role:            'Buyers Agent',
    image:           'https://i.pravatar.cc/160?img=11',
    triangleVariant: 'cobalt',
  },
}

export const CardLime: CardStory = {
  args: {
    stars:           5,
    content:         "The last thing we wanted was an inexperienced conveyancer so the professionalism of BYB's lawyer was appreciated and made settlement a drama free process.",
    name:            'K Marriman',
    role:            'Customer',
    image:           'https://i.pravatar.cc/160?img=5',
    triangleVariant: 'lime',
  },
}

export const CardNoImage: CardStory = {
  args: {
    stars:           4,
    content:         'Great service — the report was thorough and the team was professional throughout the whole process.',
    name:            'Sarah M.',
    role:            'Property Buyer',
    triangleVariant: 'cobalt',
  },
}

// ════════════════════════════════════════════════════════════════════════════
// Carousel stories
// ════════════════════════════════════════════════════════════════════════════

type CarouselStory = StoryObj<typeof BYBTestimonialCarousel>

export const Default: CarouselStory = {
  render: () => (
    <div className="bg-light-sandy py-16">
      <BYBTestimonialCarousel testimonials={TESTIMONIALS} variant="cobalt" />
    </div>
  ),
}

export const StartingLime: CarouselStory = {
  render: () => (
    <div className="bg-light-sandy py-16">
      <BYBTestimonialCarousel testimonials={TESTIMONIALS} variant="lime" />
    </div>
  ),
}

export const WithSectionHeader: CarouselStory = {
  render: () => (
    <div className="bg-light-sandy py-16">
      <div className="max-w-site mx-auto px-8 mb-10">
        <h2 className="text-heading-lg font-semibold text-navy">
          What our customers say
        </h2>
        <p className="text-body-md text-dark-75 mt-2">
          Thousands of Australians trust Before You Buy every year.
        </p>
      </div>
      <BYBTestimonialCarousel testimonials={TESTIMONIALS} variant="cobalt" />
    </div>
  ),
  parameters: { layout: 'fullscreen' },
}
