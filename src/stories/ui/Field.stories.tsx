import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '../../components/field'
import { Checkbox } from '../../components/checkbox'
import { Input } from '../../components/ui/input'

const meta: Meta<typeof FieldSet> = {
  title: 'BYB Components/Field',
  component: FieldSet,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Form layout parts: FieldGroup, Field, FieldLabel, FieldDescription, FieldError, FieldSet and FieldLegend. Apps with @beforeyoubid/form use its fields instead.' } } },
}

export default meta
type Story = StoryObj<typeof FieldSet>

/** A section: legend, description, then a group of fields. */
export const Default: Story = {
  render: () => (
    <div className="w-full max-w-96">
      <FieldSet>
        <FieldLegend>Contact details</FieldLegend>
        <FieldDescription>How we reach you about this property.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="full-name">Full name</FieldLabel>
            <Input id="full-name" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input id="phone" />
            <FieldDescription>We&apos;ll only call about your inspection.</FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  ),
}

/** `required` on the label adds the mint asterisk; `required` on the control is what screen readers announce. */
export const Required: Story = {
  render: () => (
    <div className="w-full max-w-96">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="address" required>Property address</FieldLabel>
          <Input id="address" required />
        </Field>
      </FieldGroup>
    </div>
  ),
}

/** `data-invalid` on the Field, `aria-invalid` on the control. */
export const Invalid: Story = {
  render: () => (
    <div className="w-full max-w-96">
      <FieldGroup>
        <Field data-invalid>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" aria-invalid defaultValue="sam@" />
          <FieldError>Enter a valid email address.</FieldError>
        </Field>
      </FieldGroup>
    </div>
  ),
}

/** Sections split by a `FieldSeparator` (replaces BYBFieldset `divided`). */
export const Separated: Story = {
  render: () => (
    <div className="w-full max-w-96">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Contact details</FieldLegend>
          <Field>
            <FieldLabel htmlFor="name-2">Full name</FieldLabel>
            <Input id="name-2" />
          </Field>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend>Property</FieldLegend>
          <Field>
            <FieldLabel htmlFor="address">Address</FieldLabel>
            <Input id="address" />
          </Field>
        </FieldSet>
      </FieldGroup>
    </div>
  ),
}

/** A set of checkboxes, each with a label and description beside it. */
export const Choices: Story = {
  render: () => (
    <div className="w-full max-w-96">
      <FieldSet>
        <FieldLegend>Reports to include</FieldLegend>
        <FieldDescription>Pick at least one.</FieldDescription>
        <FieldGroup data-slot="checkbox-group">
          {[
            { id: 'bp', label: 'Building & pest', hint: 'Structure, roof and termites', checked: true },
            { id: 'strata', label: 'Strata', hint: 'Levies, by-laws and minutes', checked: false },
          ].map((c) => (
            <Field key={c.id} orientation="horizontal">
              <Checkbox id={c.id} defaultChecked={c.checked} />
              <FieldContent>
                <FieldLabel htmlFor={c.id}>{c.label}</FieldLabel>
                <FieldDescription>{c.hint}</FieldDescription>
              </FieldContent>
            </Field>
          ))}
        </FieldGroup>
      </FieldSet>
    </div>
  ),
}

/** A separator with words in it, between two ways to fill the form. */
export const SeparatorWithText: Story = {
  render: () => (
    <div className="w-full max-w-96">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="listing">Listing link</FieldLabel>
          <Input id="listing" placeholder="https://" />
        </Field>
        <FieldSeparator>or</FieldSeparator>
        <Field>
          <FieldLabel htmlFor="street">Street address</FieldLabel>
          <Input id="street" />
        </Field>
      </FieldGroup>
    </div>
  ),
}
