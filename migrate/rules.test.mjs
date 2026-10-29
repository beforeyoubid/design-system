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

const withImports = (body, names = 'Button, Badge, Switch, TabsList, buttonVariants, badgeVariants') =>
  `import { ${names} } from '@beforeyoubid/design-system'\n${body}`

test('renames component variants on package components', () => {
  const { text, reviews } = migrateSource(
    withImports(
      [
        '<Badge variant="outline" onClick={() => go(a > b)}>Go</Badge>',
        "<Badge variant={'default'}>New</Badge>",
        '<Badge variant="destructive">Late</Badge>',
        '<Switch size="default" />',
        '<TabsList variant="pills">',
      ].join('\n'),
    ),
  )
  assert.match(text, /<Badge variant="gray" onClick=\{\(\) => go\(a > b\)\}>/)
  assert.match(text, /<Badge variant="gray">New/)
  assert.match(text, /<Badge variant="error">/)
  assert.match(text, /<Switch size="md" \/>/)
  assert.match(text, /<TabsList variant="pill">/)
  assert.equal(reviews.length, 0)
})

test('flags variants with no replacement and removed props', () => {
  const { reviews } = migrateSource(
    withImports('<Button>Go</Button>\n<Button variant="navy" />\n<Badge variant="cobalt" dot>New</Badge>'),
  )
  assert.deepEqual(
    reviews.map((r) => r.line),
    [4, 4],
  )
  assert.match(reviews[0].message, /cobalt/)
})

test('leaves every Button variant and size alone', () => {
  const text = withImports(
    [
      '<Button variant="default" size="default">A</Button>',
      '<Button variant="outline" className="bg-mint-45 text-white">B</Button>',
      "<Button variant={'lime'} />",
      '<Button variant="navy" />',
      "buttonVariants({ variant: 'outline-navy', size: 'default' })",
    ].join('\n'),
  )
  const { text: result, reviews } = migrateSource(text)
  assert.equal(result, text)
  assert.equal(reviews.length, 0)
})

test('reads past comments between props', () => {
  const text = withImports(
    "<Badge\n  // the status can't change\n  /* it's > fine */\n  variant=\"outline\"\n>Refund</Badge>",
  )
  assert.match(run(text), /variant="gray"/)
})

test('renames variant values inside expressions', () => {
  const { text, reviews } = migrateSource(
    withImports("<Badge variant={done ? 'secondary' : 'teal'} />\n<Badge variant={late ? \"destructive\" : 'mint'} />"),
  )
  assert.match(text, /<Badge variant=\{done \? 'gray' : 'teal'\} \/>/)
  assert.match(text, /<Badge variant=\{late \? "error" : 'mint'\} \/>/)
  assert.equal(reviews.length, 1)
  assert.match(reviews[0].message, /teal/)
})

test('flags variants that come from a variable or function', () => {
  const { reviews } = migrateSource(withImports('<Badge variant={statusVariant(row.status)} />'))
  assert.equal(reviews.length, 1)
  assert.match(reviews[0].message, /statusVariant\(row\.status\)/)
})

test('respects aliased imports and ignores components from elsewhere', () => {
  const text = [
    "import { Badge as DSBadge } from '@beforeyoubid/design-system'",
    "import { Badge } from '@/components/Badge'",
    '<DSBadge variant="outline" />',
    '<Badge variant="outline" />',
  ].join('\n')
  const result = run(text)
  assert.match(result, /<DSBadge variant="gray" \/>/)
  assert.match(result, /<Badge variant="outline" \/>/)
})

test('renames cva helper calls', () => {
  assert.equal(
    run(withImports("badgeVariants({ variant: 'secondary' })")).split('\n')[1],
    "badgeVariants({ variant: 'gray' })",
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

test('renames BYBCounter and BYBPillCard through the file', () => {
  const out = run(
    "import { BYBCounter, BYBPillCard, cn } from '@beforeyoubid/design-system'\n<BYBCounter value={1} />\n<BYBPillCard>x</BYBPillCard>",
  )
  assert.equal(out, "import { Counter, PillCard, cn } from '@beforeyoubid/design-system'\n<Counter value={1} />\n<PillCard>x</PillCard>")
})

test('renames BYBTimePicker and its props type', () => {
  assert.equal(
    run("import { BYBTimePicker, type BYBTimePickerProps } from '@beforeyoubid/design-system'\nconst p: BYBTimePickerProps = {}\n<BYBTimePicker {...p} />"),
    "import { TimePicker, type TimePickerProps } from '@beforeyoubid/design-system'\nconst p: TimePickerProps = {}\n<TimePicker {...p} />",
  )
})

test('keeps the local name when the import is aliased or the new name is taken', () => {
  assert.equal(
    run("import { BYBCounter as Count } from '@beforeyoubid/design-system'\n<Count />"),
    "import { Counter as Count } from '@beforeyoubid/design-system'\n<Count />",
  )
  assert.equal(
    run("import { BYBCounter } from '@beforeyoubid/design-system'\nimport { Counter } from './Counter'\n<BYBCounter />"),
    "import { Counter as BYBCounter } from '@beforeyoubid/design-system'\nimport { Counter } from './Counter'\n<BYBCounter />",
  )
})

test('moves InputField and SelectField imports to @beforeyoubid/form', () => {
  assert.equal(
    run("import { Button, InputField, SelectField, type SelectFieldOption } from '@beforeyoubid/design-system'"),
    "import { Button } from '@beforeyoubid/design-system'\nimport { InputField, SelectField, type SelectFieldOption } from '@beforeyoubid/form'",
  )
  assert.equal(
    run('import type { InputFieldProps } from "@beforeyoubid/design-system";'),
    'import { type InputFieldProps } from "@beforeyoubid/form";',
  )
  const { changes } = migrateSource("import { InputField } from '@beforeyoubid/design-system'")
  assert.deepEqual(changes, [{ rule: 'InputField → @beforeyoubid/form', line: 1 }])
})

test('flags BYBImage', () => {
  const { reviews } = migrateSource("import { BYBImage } from '@beforeyoubid/design-system'")
  assert.match(reviews[0].message, /BYBImage is no longer exported: moved to byb-website/)
})

test('leaves an import with nothing to move or rename exactly as written', () => {
  const source = "import {\n  Button,\n  Badge,\n} from '@beforeyoubid/design-system';\n<Button />"
  assert.equal(run(source), source)
})

test('keeps the semicolon when it rewrites an import', () => {
  assert.equal(
    run("import { Button, BYBCounter } from '@beforeyoubid/design-system';\n<BYBCounter />"),
    "import { Button, Counter } from '@beforeyoubid/design-system';\n<Counter />",
  )
})

test('renames BYBSpinner and flags the props Spinner lacks', () => {
  const { text, reviews } = migrateSource(
    "import { BYBSpinner } from '@beforeyoubid/design-system'\n<BYBSpinner size=\"lg\" color=\"navy\" label=\"Saving\" />",
  )
  assert.equal(text, "import { Spinner } from '@beforeyoubid/design-system'\n<Spinner size=\"lg\" color=\"navy\" label=\"Saving\" />")
  assert.deepEqual(
    reviews.map((r) => r.message.split(':')[0]),
    ['BYBSpinner size', 'BYBSpinner color', 'BYBSpinner label'],
  )
  assert.match(reviews[0].message, /lg size-5/)
})

test('renames BYBFileUploadCard and flags its renamed props', () => {
  const { text, reviews } = migrateSource(
    "import { BYBFileUploadCard } from '@beforeyoubid/design-system'\n<BYBFileUploadCard name=\"a.pdf\" downloadHref={url} onRemove={remove} />",
  )
  assert.match(text, /^import \{ FileUploadCard \} from '@beforeyoubid\/design-system'\n<FileUploadCard name/)
  assert.deepEqual(
    reviews.map((r) => r.message),
    ['BYBFileUploadCard onRemove: renamed onDelete', 'BYBFileUploadCard downloadHref: renamed url'],
  )
})

test('flags the BYB components replaced by stock parts, with a recipe', () => {
  const { reviews } = migrateSource(
    "import { BYBEmptyState, BYBFieldset, BYBAttachment, BYBDatePicker } from '@beforeyoubid/design-system'",
  )
  assert.deepEqual(
    reviews.map((r) => r.message.match(/^(\w+) is no longer exported: use (\w+)/).slice(1)),
    [
      ['BYBEmptyState', 'Empty'],
      ['BYBFieldset', 'FieldSet'],
      ['BYBAttachment', 'FileUpload'],
      ['BYBDatePicker', 'DateField'],
    ],
  )
})
