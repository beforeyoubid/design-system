import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const here = path.dirname(fileURLToPath(import.meta.url))

// The playground renders the real components and their Storybook stories, so it
// resolves `@/` like Storybook does. `pnpm playground:build` writes one HTML file.
export default defineConfig({
  root: here,
  base: './',
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(here, '../src') } },
  css: { postcss: path.resolve(here, '..') },
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    outDir: path.resolve(here, 'dist'),
    emptyOutDir: true,
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    chunkSizeWarningLimit: 10_000,
    // One JS file, so scripts/playground-inline.mjs can fold the build into one HTML page.
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
  server: { port: 6010 },
})
