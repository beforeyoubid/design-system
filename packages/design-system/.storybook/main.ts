import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: '@storybook/react-vite',
  managerHead: (head, { configType }) =>
    configType === 'PRODUCTION' ? `${head}<base href="/design-system/">` : head,
  viteFinal(config, { configType }) {
    // Mirror the tsconfig.json `@/*` → `./src/*` alias for Vite's resolver.
    // TypeScript and tsup read tsconfig paths, but Vite needs its own config.
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string> | undefined),
      '@': path.resolve(__dirname, '../src'),
    };
    if (configType === 'PRODUCTION') {
      return { ...config, base: '/design-system/' };
    }
    return config;
  },
};

export default config;
