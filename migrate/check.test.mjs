import { test } from 'node:test'
import assert from 'node:assert/strict'
import { checkClasses, checkSource } from './check.mjs'

const uses = (classes) => checkClasses(classes).map(({ rule, found, use }) => `${rule}: ${found}${use ? ` → ${use}` : ''}`)

test('physical sides map to logical ones and keep their variants', () => {
  assert.deepEqual(uses('ml-4 -right-2 text-left rounded-tl-lg border-r md:pl-6'), [
    'logical-direction: ml-4 → ms-4',
    'logical-direction: -right-2 → -end-2',
    'logical-direction: text-left → text-start',
    'logical-direction: rounded-tl-lg → rounded-ss-lg',
    'logical-direction: border-r → border-e',
    'logical-direction: md:pl-6 → md:ps-6',
  ])
})

test('colour names that start with r or l are not sides', () => {
  assert.deepEqual(uses('border-red-500 border-ring bg-light-l3'), [])
})

test('arbitrary values are flagged; arbitrary variants and (--var) values are not', () => {
  assert.deepEqual(uses('w-[312px] [mask-type:luminance] data-[state=open]:bg-primary w-(--sidebar-width)'), [
    'arbitrary-value: w-[312px]',
    'arbitrary-value: [mask-type:luminance]',
  ])
})

test("Tailwind's text sizes point at the type classes", () => {
  assert.deepEqual(uses('text-sm md:text-2xl/7 text-body-4'), ['type-scale: text-sm → text-body-5', 'type-scale: md:text-2xl/7 → md:text-h4'])
})

test('brand colours with an exact semantic twin suggest it, by what they paint', () => {
  // bg-white stays: white isn't always a surface, so bg-background isn't a safe suggestion.
  assert.deepEqual(uses('bg-white text-dark-100 border-dark-15 hover:bg-mint-45/80 text-mint-45'), [
    'semantic-colour: text-dark-100 → text-foreground',
    'semantic-colour: border-dark-15 → border-border',
    'semantic-colour: hover:bg-mint-45/80 → hover:bg-primary/80',
  ])
})

test('space-*, matching w/h and dark: are flagged', () => {
  assert.deepEqual(uses('space-y-4 w-4 h-4 md:w-6 md:h-6 w-full h-full dark:bg-navy'), [
    'gap-not-space: space-y-4 → flex gap-…',
    'no-dark-variant: dark:bg-navy',
    'size-shorthand: w-4 h-4 → size-4',
    'size-shorthand: md:w-6 md:h-6 → md:size-6',
  ])
})

test('prose, paths and URLs are not class strings', () => {
  assert.deepEqual(uses('Right-click the left-hand side.'), [])
  assert.deepEqual(uses('./components/left-panel.tsx'), [])
  assert.deepEqual(uses('https://example.com/text-sm'), [])
})

test('source checks report lines, read template literals and skip imports', () => {
  const source = [
    'import { IconX } from "@tabler/icons-react"',
    'import {',
    '  text,',
    '} from "./text-sm"',
    'export const A = () => <div className="ml-2" style={{ width: 3 }}><Button asChild /></div>',
    'const b = `p-2 ${on ? "pl-1" : ""}`',
  ].join('\n')
  assert.deepEqual(checkSource(source, 'a.tsx').map(({ line, rule }) => `${line} ${rule}`), [
    '1 icon-import',
    '5 inline-style',
    '5 render-not-as-child',
    '5 logical-direction',
    '6 logical-direction',
  ])
})

test('css files are checked in @apply only; tests are skipped', () => {
  assert.deepEqual(checkSource('.a { margin-left: 4px; @apply ml-2; }', 'a.css').map((f) => f.found), ['ml-2'])
  assert.deepEqual(checkSource('cy.get("[data-testid=x]"); const c = "ml-2"', 'a.test.tsx'), [])
})
