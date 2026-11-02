#!/usr/bin/env node
/**
 * Generates docs/registry.md, the component registry that ships with the
 * package, from the code: each "BYB Components/*" story gives a component's
 * purpose (its docs description) and its variant props (argTypes options);
 * the module the story renders gives the exports; the token files give the
 * component tokens. Every other export of src/index.ts is listed at the end.
 *
 *   node scripts/registry/build.mjs           write docs/registry.md
 *   node scripts/registry/build.mjs --check   fail if it's stale or a story has no description
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseTokenFile, tokenFiles } from '../tokens/lib.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const src = path.join(root, 'src')
const out = path.join(root, 'docs', 'registry.md')
const check = process.argv.includes('--check')
const tokensByComponent = new Map(
  tokenFiles().map(({ component, file }) => [component, parseTokenFile(file).rules.flatMap((rule) => rule.tokens.map((t) => t.public))]),
)

// ---------- exports ----------
const resolveModule = (spec, from) => {
  const base = spec.startsWith('@/') ? path.join(src, spec.slice(2)) : path.resolve(path.dirname(from), spec)
  for (const f of [`${base}.tsx`, `${base}.ts`, path.join(base, 'index.ts')]) if (fs.existsSync(f)) return f
  return null
}
const exportCache = new Map()
/** Value exports of a module, following `export *`. Types are left out. */
function exportsOf(file) {
  if (exportCache.has(file)) return exportCache.get(file)
  const text = fs.readFileSync(file, 'utf8')
  const names = new Set()
  for (const m of text.matchAll(/^export \* from ['"]([^'"]+)['"]/gm)) {
    const target = resolveModule(m[1], file)
    if (target) for (const n of exportsOf(target)) names.add(n)
  }
  for (const m of text.matchAll(/^export \{([^}]*)\}/gm)) {
    for (const part of m[1].split(',')) {
      const name = part.trim().replace(/^type\s+.*/, '').split(/\s+as\s+/).at(-1)
      if (name) names.add(name)
    }
  }
  for (const m of text.matchAll(/^export (?:async )?(?:function|const|class) ([A-Za-z_]\w*)/gm)) names.add(m[1])
  exportCache.set(file, names)
  return names
}
const indexFile = path.join(src, 'index.ts')
const allExports = exportsOf(indexFile)

// ---------- stories ----------
const storyFiles = ['stories', 'stories/ui'].flatMap((dir) =>
  fs.readdirSync(path.join(src, dir)).filter((f) => f.endsWith('.stories.tsx')).map((f) => path.join(src, dir, f)))
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase()
const unquote = (s) => s.replace(/^['"`]|['"`]$/g, '').replace(/\\'/g, "'")

const entries = []
const missing = []
for (const file of storyFiles) {
  const text = fs.readFileSync(file, 'utf8')
  const meta = text.match(/^const meta[^\n]*\{\n([\s\S]*?)^\}/m)?.[1] ?? ''
  const title = meta.match(/title:\s*['"]([^'"]+)['"]/)?.[1] ?? ''
  if (!title.startsWith('BYB Components/')) continue
  const name = title.split('/').pop()
  const description = meta.match(/description:\s*\{\s*component:\s*('(?:\\'|[^'])*'|"[^"]*"|`[^`]*`)/)?.[1]
  if (!description) missing.push(path.relative(root, file))
  const props = [...meta.matchAll(/^ {4}(\w+):\s*\{[^}]*?options:\s*\[([^\]]*)\]/gm)].map(([, prop, list]) => ({
    prop,
    options: list.split(',').map((o) => unquote(o.trim())).filter(Boolean),
  }))
  // The module that renders the story's `component`, else the one named like the story.
  const component = meta.match(/component:\s*(\w+)/)?.[1]
  const imports = [...text.matchAll(/import\s*\{([^}]*)\}\s*from\s*['"](\.\.\/[^'"]*components\/[^'"]+)['"]/g)]
  const source = imports.find(([, names]) => component && names.split(',').some((n) => n.trim() === component))?.[2]
    ?? imports.find(([, , spec]) => spec.endsWith(`/${kebab(name)}`))?.[2]
  const moduleFile = source && resolveModule(source, file)
  const exports = moduleFile ? [...exportsOf(moduleFile)].filter((n) => allExports.has(n)) : []
  const tokenKey = moduleFile ? path.basename(moduleFile).replace(/\.tsx?$/, '') : kebab(name)
  entries.push({ name, description: description ? unquote(description) : '', props, exports, tokens: tokensByComponent.get(tokenKey) ?? [] })
}
entries.sort((a, b) => a.name.localeCompare(b.name))

const listed = new Set(entries.flatMap((e) => e.exports))
const other = [...allExports].filter((n) => !listed.has(n)).sort()

// ---------- write ----------
const code = (s) => `\`${s}\``
const lines = [
  '# Component registry',
  '',
  'Every component `@beforeyoubid/design-system` exports. Generated from the code by `scripts/registry/build.mjs`; don\'t edit by hand.',
  '',
  "Import from the package root: `import { Button } from '@beforeyoubid/design-system'`. Icons come from `@beforeyoubid/design-system/icons`.",
  '',
  "Component tokens change a component's look without touching its code: set them in the app's CSS on `:root` or on a class around the area. See [components.md](./components.md#changing-how-a-component-looks).",
  '',
  entries.map((e) => `[${e.name}](#${e.name.toLowerCase()})`).join(' · '),
  '',
]
for (const e of entries) {
  lines.push(`## ${e.name}`, '', e.description || '_No description yet._', '')
  if (e.exports.length) lines.push(`**Exports:** ${e.exports.map(code).join(', ')}`, '')
  for (const { prop, options } of e.props) lines.push(`**${prop}:** ${options.map(code).join(' · ')}`, '')
  if (e.tokens.length) {
    lines.push(`<details><summary>${e.tokens.length} component tokens</summary>`, '', e.tokens.map(code).join(' '), '', '</details>', '')
  }
}
lines.push('## Other exports', '', 'Helpers, hooks and parts without a story of their own.', '', other.map(code).join(', '), '')
const content = lines.join('\n')

if (missing.length) {
  console.error(`✖ Stories without a docs description (parameters.docs.description.component):\n  ${missing.join('\n  ')}`)
  if (check) process.exit(1)
}
if (check) {
  const current = fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : ''
  if (current !== content) {
    console.error('✖ docs/registry.md is stale. Run pnpm registry:build.')
    process.exit(1)
  }
  console.log(`✅ docs/registry.md is up to date (${entries.length} components).`)
} else {
  fs.writeFileSync(out, content)
  console.log(`Wrote docs/registry.md (${entries.length} components, ${other.length} other exports).`)
}
