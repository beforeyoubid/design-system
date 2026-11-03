import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cn } from '../../src/lib/utils.ts'

// Our type scale and palette are custom tokens, so cn has to be told which
// group each belongs to. A size and a colour in one list must both survive.
test('keeps a custom font size next to a custom text colour', () => {
  assert.equal(cn('text-body-5 text-mint-45'), 'text-body-5 text-mint-45')
  assert.equal(cn('text-mint-75 text-button-md'), 'text-mint-75 text-button-md')
  assert.equal(cn('text-h1', 'text-navy'), 'text-h1 text-navy')
})

test('a later custom size or colour replaces the earlier one', () => {
  assert.equal(cn('text-body-5', 'text-body-4'), 'text-body-4')
  assert.equal(cn('text-mint-45', 'text-dark-90'), 'text-dark-90')
  assert.equal(cn('bg-mint-45', 'bg-primary'), 'bg-primary')
  assert.equal(cn('text-overline', 'text-sm'), 'text-sm')
})

// Component tokens: parts read private variables in their classes. A one-off
// className from the app must still win over the component token.
test('a className override beats a component-token class', () => {
  assert.equal(cn('rounded-(--_input-radius)', 'rounded-none'), 'rounded-none')
  assert.equal(cn('h-(--_input-height)', 'h-12'), 'h-12')
  assert.equal(cn('px-(--_button-padding-x)', 'px-6'), 'px-6')
  assert.equal(cn('bg-(--_card)', 'bg-white'), 'bg-white')
  assert.equal(cn('border-(--_input-border)', 'border-error-75'), 'border-error-75')
  assert.equal(cn('shadow-(--_card-shadow)', 'shadow-none'), 'shadow-none')
})

test('a colour token and a font-size token on text- stay apart', () => {
  assert.equal(
    cn('text-(--_input-foreground) text-(length:--_input-font-size)'),
    'text-(--_input-foreground) text-(length:--_input-font-size)',
  )
  assert.equal(cn('text-(--_input-foreground)', 'text-body-5'), 'text-(--_input-foreground) text-body-5')
  assert.equal(cn('text-(length:--_input-font-size)', 'text-mint-45'), 'text-(length:--_input-font-size) text-mint-45')
})

test('a border colour token leaves the border width alone', () => {
  assert.equal(cn('border border-(--_input-border)', 'border-2'), 'border-(--_input-border) border-2')
})

test('conditional inputs work like clsx', () => {
  assert.equal(cn('a', false, null, undefined, { b: true, c: false }, ['d', ['e']]), 'a b d e')
})

// A font size resets the line height, so cn drops a leading- class that comes
// before one. A line height has to follow the size it overrides.
test('a line height survives only after the font size', () => {
  assert.equal(cn('leading-none', 'text-caption-1'), 'text-caption-1')
  assert.equal(cn('text-caption-1 leading-none'), 'text-caption-1 leading-none')
})
