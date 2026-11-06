import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'tsup'

const shared = {
  dts: true,
  sourcemap: true,
  // The icon packages are external so `src/icons.ts` / `src/icons-lucide.ts`
  // compile to thin re-exports and the consumer's bundler tree-shakes against
  // the real packages.
  external: ['react', 'react-dom', 'next', 'tailwindcss', '@tabler/icons-react', 'lucide-react'],
  outDir: 'dist',
}

// Required for Next.js App Router (RSC): without this directive the dist
// bundle is evaluated in the server context causing createContext errors.
const useClient = { js: "'use client';" }

// The ESM build keeps one file per module that src/index.ts re-exports, so an
// app only ships the components it imports. A single bundled file is one
// client module: importing any component pulled every component (charts,
// command palette, calendars) into the page. Shared code goes into chunks.
const indexSource = fs.readFileSync('src/index.ts', 'utf8')
const modules = [...new Set([...indexSource.matchAll(/from '\.\/([^']+)'/g)].map((m) => m[1]))]
const sourceOf = (m: string) =>
  ['.tsx', '.ts'].map((ext) => `src/${m}${ext}`).find((f) => fs.existsSync(f)) ?? `src/${m}/index.ts`
const esmEntries = Object.fromEntries(modules.map((m) => [m, sourceOf(m)]))

/** dist/esm/index.mjs: src/index.ts with each module pointed at its built file. */
function writeEsmBarrel() {
  const barrel = indexSource
    .split('\n')
    .filter((line) => !/^export type /.test(line))
    // Drop inline type-only names (`export { A, type B } from …`).
    .map((line) =>
      line.replace(/^export \{([^}]*)\}/, (_, names: string) =>
        `export {${names.split(',').filter((n) => !/^\s*type\s/.test(n)).join(',')}}`
      )
    )
    .map((line) => line.replace(/from '\.\/([^']+)'/, "from './$1.mjs'"))
    .join('\n')
  fs.writeFileSync(path.join('dist', 'esm', 'index.mjs'), barrel)
}

export default defineConfig([
  {
    // CommonJS and type declarations: one bundle, as before.
    ...shared,
    format: ['cjs'],
    entry: ['src/index.ts'],
    // Cleaning is done once via the `build` script (rm -rf dist) before tsup
    // runs — setting clean here would race the concurrent configs.
    clean: false,
    banner: useClient,
  },
  {
    ...shared,
    format: ['esm'],
    entry: esmEntries,
    outDir: 'dist/esm',
    splitting: true,
    dts: false,
    clean: false,
    banner: useClient,
    outExtension: () => ({ js: '.mjs' }),
    onSuccess: async () => writeEsmBarrel(),
  },
  {
    ...shared,
    format: ['esm', 'cjs'],
    entry: ['src/icons.ts', 'src/icons-lucide.ts'],
    // Don't wipe the index build above; this config runs after it.
    clean: false,
    // No 'use client' banner — Tabler and Lucide icons are plain SVG and stay usable
    // inside RSC server components.
  },
])
