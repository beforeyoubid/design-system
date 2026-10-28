import * as React from 'react'
import { composeStories } from '@storybook/react-vite'

/**
 * Every Storybook story, composed so it renders outside Storybook. The
 * playground shows a component's real stories as its live examples.
 */
const modules = import.meta.glob('../../src/stories/**/*.stories.tsx', { eager: true }) as Record<string, Record<string, unknown>>

export interface StoryEntry { id: string; name: string; Story: React.ComponentType }

/** "DropdownMenu.stories.tsx" → "dropdown-menu", "Counter" → "counter", "InputOTP" → "input-otp". */
const kebab = (file: string) =>
  file
    .replace(/^.*\//, '')
    .replace(/\.stories\.tsx$/, '')
    .replace(/^BYB/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()

export const storiesByComponent = new Map<string, StoryEntry[]>()
for (const [file, mod] of Object.entries(modules)) {
  if (/Tokens\.stories/.test(file)) continue
  const key = kebab(file)
  try {
    const composed = composeStories(mod as Parameters<typeof composeStories>[0]) as Record<string, React.ComponentType & { storyName?: string }>
    const entries = Object.entries(composed).map(([exportName, Story]) => ({
      id: `${key}--${exportName}`,
      name: Story.storyName ?? exportName.replace(/([a-z])([A-Z])/g, '$1 $2'),
      Story,
    }))
    storiesByComponent.set(key, [...(storiesByComponent.get(key) ?? []), ...entries])
  } catch (e) {
    console.warn('Could not compose', file, e)
  }
}

/** A story that throws shows a quiet note instead of taking the page down. */
export class StoryBoundary extends React.Component<{ children: React.ReactNode }, { error: string | null }> {
  state = { error: null as string | null }
  static getDerivedStateFromError(e: Error) {
    return { error: e.message }
  }
  render() {
    return this.state.error ? <p className="pg-story-error">This example couldn't render: {this.state.error}</p> : this.props.children
  }
}
