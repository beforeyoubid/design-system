import type { Preview } from '@storybook/react-vite'
import '../globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'error',
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light',  value: '#F9FAFB' },
        { name: 'navy',   value: '#090034' },
        { name: 'white',  value: '#FFFFFF' },
      ],
    },
  },
}

export default preview
