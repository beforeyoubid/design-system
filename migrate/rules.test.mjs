import { test } from 'node:test'
import assert from 'node:assert/strict'
import { migrateSource } from './rules.mjs'

const run = (text, options) => migrateSource(text, options).text

test('renames type classes and keeps variant prefixes on every expanded class', () => {
  assert.equal(
    run('<h1 className="text-heading-lg md:text-medium-4xl !text-btn-sm">'),
    '<h1 className="text-h1 md:text-h1 md:font-medium !text-button-sm">',
  )
})

test('maps main-branch names, not the deprecated PR names', () => {
  // main: heading-lg 40px → h1; heading-sm 20px → h5; body-sm 13px → body-5
  assert.equal(run("cn('text-heading-sm', 'text-body-sm')"), "cn('text-h5', 'text-body-5')")
})

test('text-display only matches the exact class', () => {
  assert.equal(run('text-display text-display-xl text-display-sm'), 'text-display-3 text-display-1 text-display-4')
})

test('swaps rounded-xl and rounded-2xl in one pass, including side forms', () => {
  assert.equal(
    run('rounded-xl md:rounded-2xl rounded-t-xl rounded-tl-2xl rounded-3xl text-xl'),
    'rounded-2xl md:rounded-xl rounded-t-2xl rounded-tl-xl rounded-3xl text-xl',
  )
})

test('maps rounded-btn to rounded-xl without swapping it again', () => {
  assert.equal(run('rounded-btn rounded-b-btn rounded-xl'), 'rounded-xl rounded-b-xl rounded-2xl')
})

test('renames cobalt utilities and CSS variables, keeping opacity modifiers', () => {
  assert.equal(
    run('bg-cobalt text-cobalt-l1 border-cobalt/40 hover:ring-cobalt var(--cobalt) --color-cobalt-l1'),
    'bg-electric-blue text-electric-blue-l1 border-electric-blue/40 hover:ring-electric-blue var(--electric-blue) --color-electric-blue-l1',
  )
})

test('moves dark-60 text and icons to dark-75 and placeholders to dark-90; leaves fills alone', () => {
  assert.equal(
    run('text-dark-60 fill-dark-60 placeholder:text-dark-60 bg-dark-60 border-dark-60'),
    'text-dark-75 fill-dark-75 placeholder:text-dark-90 bg-dark-60 border-dark-60',
  )
})

test('text-xs keeps its 10px by default and can be remapped per app', () => {
  assert.equal(run('text-xs'), 'text-caption-2')
  assert.equal(run('text-xs md:text-xs', { classRenames: { 'text-xs': 'text-sm' } }), 'text-sm md:text-sm')
})

test('leaves classes that only contain an old name alone', () => {
  const text = 'text-xs-custom my-text-xs .text-xs { } data-rounded-xl text-sm text-caption-1'
  assert.equal(run(text), text)
})

test('is a no-op on already-migrated classes except the radius swap', () => {
  const text = 'text-h1 font-medium text-body-5 text-caption-2 text-button-sm tracking-button bg-electric-blue'
  assert.equal(run(text), text)
})

const withImports = (body, names = 'Button, Badge, Switch, TabsList, buttonVariants') =>
  `import { ${names} } from '@beforeyoubid/design-system'\n${body}`

test('renames component variants on package components', () => {
  const { text, reviews } = migrateSource(
    withImports(
      [
        '<Button variant="outline" size="default" onClick={() => go(a > b)}>Go</Button>',
        "<Button variant={'lime'}>Buy</Button>",
        '<Badge variant="destructive">Late</Badge>',
        '<Switch size="default" />',
        '<TabsList variant="pills">',
      ].join('\n'),
    ),
  )
  assert.match(text, /<Button variant="tertiary" size="md" onClick=\{\(\) => go\(a > b\)\}>/)
  assert.match(text, /<Button variant="primary">Buy/)
  assert.match(text, /<Badge variant="error">/)
  assert.match(text, /<Switch size="md" \/>/)
  assert.match(text, /<TabsList variant="pill">/)
  assert.equal(reviews.length, 0)
})

test('flags variants with no replacement, removed props and implicit Button defaults', () => {
  const { reviews } = migrateSource(
    withImports('<Button>Go</Button>\n<Button variant="navy" />\n<Badge variant="cobalt" dot>New</Badge>'),
  )
  assert.deepEqual(
    reviews.map((r) => r.line),
    [2, 3, 4, 4],
  )
  assert.match(reviews[0].message, /no variant/)
  assert.match(reviews[1].message, /navy/)
})

test('respects aliased imports and ignores components from elsewhere', () => {
  const text = [
    "import { Button as DSButton } from '@beforeyoubid/design-system'",
    "import { Button } from '@/components/Button'",
    '<DSButton variant="outline" />',
    '<Button variant="outline" />',
  ].join('\n')
  const result = run(text)
  assert.match(result, /<DSButton variant="tertiary" \/>/)
  assert.match(result, /<Button variant="outline" \/>/)
})

test('renames cva helper calls', () => {
  assert.equal(
    run(withImports("buttonVariants({ variant: 'outline', size: 'default' })")).split('\n')[1],
    "buttonVariants({ variant: 'tertiary', size: 'md' })",
  )
})

test('flags removed exports', () => {
  const { reviews } = migrateSource("import { colors, cn } from '@beforeyoubid/design-system'\nconst c = colors.mint45")
  assert.equal(reviews.length, 1)
  assert.match(reviews[0].message, /colors is no longer exported/)
})

test('reports the line of each change', () => {
  const { changes } = migrateSource('a\n<p className="text-caption">\nrounded-xl')
  assert.deepEqual(
    changes.map((c) => c.line),
    [2, 3],
  )
})
