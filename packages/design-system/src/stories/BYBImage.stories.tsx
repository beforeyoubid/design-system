import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { BYBImage } from '../components/byb/BYBImage'
import { AspectRatio } from '../components/ui/aspect-ratio'

const meta: Meta<typeof BYBImage> = {
  title: 'Components/BYBImage',
  component: BYBImage,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Thin wrapper around `next/image` with a sensible responsive `sizes` default ' +
          '(`(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw`). Use instead of raw ' +
          '`next/image` in BYB Next.js apps for content imagery. ' +
          'Stories pass `unoptimized` because Storybook has no Next.js image optimizer — ' +
          'consuming apps get the optimized loader automatically.',
      },
    },
  },
  argTypes: {
    sizes: { control: 'text' },
    alt: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof BYBImage>

const SAMPLE = 'https://picsum.photos/id/164/960/640'

// ── Default — responsive sizes come from the component ────────────────────────

export const Default: Story = {
  render: () => (
    <BYBImage
      src={SAMPLE}
      alt="Sample property exterior"
      width={480}
      height={320}
      className="rounded-lg"
      unoptimized
    />
  ),
}

// ── Custom sizes override ─────────────────────────────────────────────────────

export const CustomSizes: Story = {
  render: () => (
    <BYBImage
      src={SAMPLE}
      alt="Sample property exterior at full viewport width"
      width={960}
      height={640}
      sizes="100vw"
      className="rounded-xl w-full h-auto"
      unoptimized
    />
  ),
}

// ── Fill inside an AspectRatio container ──────────────────────────────────────

export const WithAspectRatio: Story = {
  render: () => (
    <div className="max-w-md">
      <AspectRatio ratio={16 / 9}>
        <BYBImage
          src={SAMPLE}
          alt="Sample property exterior cropped to 16:9"
          fill
          className="rounded-lg object-cover"
          unoptimized
        />
      </AspectRatio>
    </div>
  ),
}
