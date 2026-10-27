import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '../../components/ui/field'
import { Input } from '../../components/ui/input'

const meta: Meta<typeof FieldSet> = {
  title: 'BYB Components/Field',
  component: FieldSet,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FieldSet>

/** A section: legend, description, then a group of fields. */
export const Default: Story = {
  render: () => (
    <div className="w-96">
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

/** `data-invalid` on the Field, `aria-invalid` on the control. */
export const Invalid: Story = {
  render: () => (
    <div className="w-96">
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

/** Sections split by a `FieldSeparator` (replaces Fieldset `divided`). */
export const Separated: Story = {
  render: () => (
    <div className="w-96">
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
