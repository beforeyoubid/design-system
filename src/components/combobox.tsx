import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react"

import { cn } from "@/lib/utils"
import {
  Combobox as UiCombobox,
  ComboboxContent as UiComboboxContent,
  ComboboxInput as UiComboboxInput,
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

/** Stock ComboboxInput, filling its container like every input; the layout around it sets the width. */
function ComboboxInput({ className, ref, ...props }: React.ComponentProps<typeof UiComboboxInput>) {
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
  return <UiComboboxInput className={cn("w-full", className)} ref={merged} {...props} />
}

/** Stock ComboboxContent, anchored to the whole field (as the chips field is) unless `anchor` says otherwise. */
function ComboboxContent({ anchor, ...props }: React.ComponentProps<typeof UiComboboxContent>) {
  const field = React.useContext(FieldContext)?.field
  return <UiComboboxContent anchor={anchor ?? field ?? undefined} {...props} />
}

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node
    }
  }
}

export { Combobox, ComboboxContent, ComboboxInput }
