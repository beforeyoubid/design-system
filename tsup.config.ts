import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'next', 'tailwindcss'],
  outDir: 'dist',
  // Required for Next.js App Router (RSC): without this directive the dist
  // bundle is evaluated in the server context causing createContext errors.
  // Server-safe utilities (cn, colors) that server components need should
  // be imported directly from clsx/tailwind-merge or lib/design-tokens.ts.
  banner: {
    js: "'use client';",
  },
})
