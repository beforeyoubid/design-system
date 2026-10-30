import { test } from 'node:test'
import assert from 'node:assert/strict'
import { checkClasses, checkSource, fixSource } from './check.mjs'

const uses = (classes, options) => checkClasses(classes, options).map(({ rule, found, use }) => `${rule}: ${found}${use ? ` → ${use}` : ''}`)
const fixed = (classes, options) => fixSource(`<div className="${classes}" />`, 'a.tsx', undefined, options).text.slice(16, -4)

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

test('arbitrary values are flagged; arbitrary variants, (--var) values and values with no token are not', () => {
  assert.deepEqual(uses('w-[313px] [mask-type:luminance] data-[state=open]:bg-primary w-(--sidebar-width) h-[calc(100vh-4rem)] w-[50%] grid-cols-[1fr_auto]'), [
    'arbitrary-value: w-[313px]',
    'arbitrary-value: [mask-type:luminance]',
  ])
})

test('arbitrary values already on a scale become the scale class', () => {
  assert.equal(
    fixed('p-[8px] max-w-[1920px] -mt-[4px] top-[-2px] w-[1px] gap-[0.75rem] rounded-[8px] rounded-t-[1rem] rounded-[9999px] opacity-[0.87] opacity-[50%] z-[100] aspect-[16/9] aspect-[4/3] bg-[var(--x)] tracking-[0.04em] tracking-[-0.005em]'),
    'p-2 max-w-480 -mt-1 -top-0.5 w-px gap-3 rounded-md rounded-t-xl rounded-full opacity-87 opacity-50 z-100 aspect-video aspect-4/3 bg-(--x) tracking-button tracking-heading',
  )
  // Off the 2px grid, a radius off the scale, a fractional opacity and a negative padding stay as they are.
  assert.equal(fixed('p-[13px] rounded-[48px] opacity-[0.875] p-[-4px]'), 'p-[13px] rounded-[48px] opacity-[0.875] p-[-4px]')
})

test('a brand hex becomes its colour, then its semantic twin', () => {
  assert.deepEqual(uses('text-[#00AE95] bg-[#00ae95]/50 border-[#123456]'), [
    'arbitrary-value: text-[#00AE95] → text-mint-45',
    'arbitrary-value: bg-[#00ae95]/50 → bg-mint-45/50',
    'semantic-colour: bg-[#00ae95]/50 → bg-primary/50',
    'arbitrary-value: border-[#123456]',
  ])
  assert.equal(fixed('bg-[#00ae95]/50 ml-[8px]'), 'bg-primary/50 ms-2')
})

test("Tailwind's text sizes and px sizes become type classes, picked by weight", () => {
  assert.deepEqual(uses('text-sm md:text-2xl/7 text-body-4'), ['type-scale: text-sm → text-body-5', 'type-scale: md:text-2xl/7 → md:text-body-1/7'])
  assert.equal(fixed('text-[16px] text-2xl font-semibold md:text-xl'), 'text-body-4 text-h4 font-semibold md:text-h5')
  // A size only a heading has keeps its regular weight.
  assert.equal(fixed('text-[28px]'), 'text-h3 font-normal')
  assert.equal(fixed('text-[28px] font-medium'), 'text-h3 font-medium')
})

test('off-scale text sizes are reported with their neighbours, or snapped with nearest', () => {
  assert.deepEqual(uses('text-[13px] text-3xl'), ['type-scale: text-[13px] → text-caption-1 (12px) or text-body-5 (14px)', 'type-scale: text-3xl → text-h3 (28px) or text-h2 (36px)'])
  assert.equal(fixed('text-[13px] text-[11px] text-[22px] font-bold', { nearest: true }), 'text-body-5 text-caption-1 text-h4 font-bold')
})

test('a line-height the type class already sets is dropped; a different one stays', () => {
  assert.equal(fixed('text-[16px] leading-[1.4]'), 'text-body-4')
  assert.equal(fixed('text-body-4 leading-[140%] md:text-h1 md:leading-[48px]'), 'text-body-4 md:text-h1')
  assert.equal(fixed('text-[16px] leading-[1.5]'), 'text-body-4 leading-[1.5]')
  // Unprefixed, it also sets the h1's line-height at md, which is 1.2: keep it.
  assert.equal(fixed('text-[16px] leading-[1.4] md:text-h1'), 'text-body-4 leading-[1.4] md:text-h1')
})

test('directions with no logical twin are flagged for review; centring is not', () => {
  assert.deepEqual(uses('origin-top-left translate-x-full bg-right object-left'), [
    'direction-review: origin-top-left',
    'direction-review: translate-x-full',
    'direction-review: bg-right',
    'direction-review: object-left',
  ])
  assert.deepEqual(uses('absolute left-1/2 -translate-x-1/2'), ['logical-direction: left-1/2 → start-1/2'])
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
    'size-shorthand: w-full h-full → size-full',
  ])
})

test('half-step classes are classes, not file extensions', () => {
  assert.equal(fixed('mt-0.5 text-sm py-2.5 md:text-sm text-dark-75'), 'mt-0.5 text-body-5 py-2.5 md:text-body-5 text-muted-foreground')
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

test('--fix rewrites only what has one safe answer, and only on the lines asked for', () => {
  const source = [
    'import { IconX } from "@tabler/icons-react"',
    'const a = <div className="ml-2 w-4 h-4 dark:bg-navy text-dark-75 text-sm" />',
    'const b = <div className="absolute left-1/2 -translate-x-1/2 pr-3" />',
  ].join('\n')
  assert.equal(fixSource(source, 'a.tsx').text, [
    'import { IconX } from "@beforeyoubid/design-system/icons"',
    'const a = <div className="ms-2 size-4 text-muted-foreground text-body-5" />',
    'const b = <div className="absolute left-1/2 -translate-x-1/2 pe-3" />',
  ].join('\n'))
  assert.equal(fixSource(source, 'a.tsx', (line) => line === 3).fixed.length, 1)
})
