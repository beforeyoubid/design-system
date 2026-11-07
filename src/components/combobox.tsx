import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react"

import { IconX } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import {
  Combobox as UiCombobox,
  ComboboxChip as UiComboboxChip,
  ComboboxContent as UiComboboxContent,
  ComboboxTrigger,
} from "@/components/ui/combobox"

export * from "@/components/ui/combobox"

/**
 * The field a single combobox's popup lines up with. Stock anchors the popup to the
 * text input, which sits inside the field's padding and stops short of the chevron,
 * so the popup came out indented and narrower than the field.
 */
const FieldContext = React.createContext<{
  field: HTMLElement | null
  setField: (field: HTMLElement | null) => void
} | null>(null)

function Combobox<Value, Multiple extends boolean | undefined = false, Item = Value>(
  props: ComboboxPrimitive.Root.Props<Value, Multiple, Item>
) {
  const [field, setField] = React.useState<HTMLElement | null>(null)
  const value = React.useMemo(() => ({ field, setField }), [field])
  return (
    <FieldContext.Provider value={value}>
      <UiCombobox {...props} />
    </FieldContext.Provider>
  )
}

/**
 * Stock ComboboxInput, filling its container like every input; the layout around it sets the width.
 *
 * Its chevron and clear buttons are named here: stock leaves both as icon-only buttons with no
 * accessible name, so a screen reader announced each as just "button". The chevron also leaves the
 * tab order, as the combobox pattern has it: the input already opens the list (click, or the arrow
 * keys), and a second tab stop that does the same thing only got in the way.
 */
function ComboboxInput({
  className,
  ref,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  triggerLabel = "Show options",
  clearLabel = "Clear",
  ...props
}: ComboboxPrimitive.Input.Props & {
  showTrigger?: boolean
  showClear?: boolean
  /** The chevron's accessible name. */
  triggerLabel?: string
  /** The clear button's accessible name. */
  clearLabel?: string
}) {
  const setField = React.useContext(FieldContext)?.setField
  const register = React.useCallback(
    (input: HTMLInputElement | null) => {
      // A search input inside the popup isn't the field the popup hangs from.
      if (input?.closest('[data-slot="combobox-content"]')) return
      setField?.(input?.closest<HTMLElement>('[data-slot="input-group"]') ?? null)
    },
    [setField]
  )
  const merged = React.useMemo(() => mergeRefs(ref, register), [ref, register])
  return (
    <InputGroup className={cn("w-full", className)}>
      <ComboboxPrimitive.Input ref={merged} render={<InputGroupInput disabled={disabled} />} {...props} />
      <InputGroupAddon align="inline-end">
        {showTrigger && (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            render={<ComboboxTrigger />}
            data-slot="input-group-button"
            className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
            disabled={disabled}
            aria-label={triggerLabel}
            tabIndex={-1}
          />
        )}
        {showClear && (
          <ComboboxPrimitive.Clear
            data-slot="combobox-clear"
            render={<InputGroupButton variant="ghost" size="icon-xs" />}
            disabled={disabled}
            aria-label={clearLabel}
          >
            <IconX className="pointer-events-none" />
          </ComboboxPrimitive.Clear>
        )}
      </InputGroupAddon>
      {children}
    </InputGroup>
  )
}

/**
 * Stock ComboboxContent, anchored to the whole field (as the chips field is) unless `anchor` says otherwise.
 * Stock's popup is exactly the field's width, so long labels wrapped onto two or three lines in a narrow
 * field. Like Select, it grows to fit the widest option; stock already keeps it at least the field's
 * width and stops it at the screen edge, where labels wrap.
 */
function ComboboxContent({ anchor, className, ...props }: React.ComponentProps<typeof UiComboboxContent>) {
  const field = React.useContext(FieldContext)?.field
  return <UiComboboxContent anchor={anchor ?? field ?? undefined} className={cn("w-fit", className)} {...props} />
}

/**
 * Stock ComboboxChip with its remove button named. Stock leaves it icon-only with no accessible
 * name; it is now "Remove" plus the chip's text when that is a string ("Remove Apple"), or
 * `removeLabel`.
 *
 * It also never grows past the field. Stock sizes a chip to its text and never wraps it, so a long
 * value (an email address, say) ran out past the field's edge; the chip now stops at the field's
 * width and its text truncates, with the whole value on hover.
 */
function ComboboxChip({
  children,
  className,
  showRemove = true,
  removeLabel,
  ...props
}: React.ComponentProps<typeof UiComboboxChip> & {
  /** The remove button's accessible name. Defaults to "Remove" plus the chip's text. */
  removeLabel?: string
}) {
  const label = removeLabel ?? (typeof children === "string" ? `Remove ${children}` : "Remove")
  return (
    <UiComboboxChip showRemove={false} className={cn("min-w-0 max-w-full", className)} {...props}>
      <span data-slot="combobox-chip-label" className="min-w-0 truncate" title={typeof children === "string" ? children : undefined}>
        {children}
      </span>
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          render={<Button variant="ghost" size="icon-xs" />}
          className="-ms-1 opacity-(--_combobox-chip-remove-opacity) hover:opacity-(--_combobox-chip-remove-hover-opacity)"
          data-slot="combobox-chip-remove"
          aria-label={label}
        >
          <IconX className="pointer-events-none" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </UiComboboxChip>
  )
}

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node
    }
  }
}

export { Combobox, ComboboxChip, ComboboxContent, ComboboxInput }
