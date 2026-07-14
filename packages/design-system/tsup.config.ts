import { defineConfig } from 'tsup'

const shared = {
  format: ['esm', 'cjs'] as const,
  dts: true,
  sourcemap: true,
  // @tabler/icons-react is external so `src/icons.ts` compiles to a thin
  // re-export and the consumer's bundler tree-shakes against the real package.
  external: ['react', 'react-dom', 'next', 'tailwindcss', '@tabler/icons-react'],
  outDir: 'dist',
}

export default defineConfig([
  {
    ...shared,
    entry: ['src/index.ts'],
    // Cleaning is done once via the `build` script (rm -rf dist) before tsup
    // runs — setting clean here would race the concurrent icons config and
    // wipe its freshly-emitted .d.ts.
    clean: false,
    // Required for Next.js App Router (RSC): without this directive the dist
    // bundle is evaluated in the server context causing createContext errors.
    // Server-safe utilities (cn, colors) that server components need should
    // be imported directly from clsx/tailwind-merge or lib/design-tokens.ts.
    banner: {
      js: "'use client';",
    },
  },
  {
    ...shared,
    entry: ['src/icons.ts'],
    // Don't wipe the index build above; this config runs after it.
    clean: false,
    // No 'use client' banner — Tabler icons are plain SVG and stay usable
    // inside RSC server components.
  },
])
