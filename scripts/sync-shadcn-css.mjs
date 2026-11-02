#!/usr/bin/env node
/**
 * Copies shadcn's stylesheet (custom variants such as `data-horizontal:`, and
 * the `no-scrollbar`, `scroll-fade-*` and `shimmer` utilities) into shadcn.css,
 * which globals.css imports. Copied rather than imported from the `shadcn`
 * package so apps don't install the shadcn CLI. Re-run after bumping `shadcn`.
 *
 *   node scripts/sync-shadcn-css.mjs           write the file
 *   node scripts/sync-shadcn-css.mjs --check   fail if the file is out of date
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const outFile = path.join(root, 'shadcn.css')

// shadcn's exports map hides package.json, so read both files from the install.
const pkgDir = path.join(root, 'node_modules', 'shadcn')
const { version } = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'))
const source = fs.readFileSync(path.join(pkgDir, 'dist', 'tailwind.css'), 'utf8')

const output = `/* Copied from shadcn@${version} dist/tailwind.css by scripts/sync-shadcn-css.mjs.
 * Never edit by hand: run \`pnpm sync-shadcn-css\` after bumping shadcn. */

${source}`

if (process.argv.includes('--check')) {
  const current = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf8') : ''
  if (current !== output) {
    console.error('❌ shadcn.css is out of date. Run `pnpm sync-shadcn-css`.')
    process.exit(1)
  }
  console.log(`✅ shadcn.css matches shadcn@${version}.`)
} else {
  fs.writeFileSync(outFile, output)
  console.log(`✅ Wrote shadcn.css from shadcn@${version}.`)
}
