import * as React from "react"

import { cn } from "@/lib/utils"
import { ComboboxInput as UiComboboxInput } from "@/components/ui/combobox"

export * from "@/components/ui/combobox"

/** Stock ComboboxInput, filling its container like every input; the layout around it sets the width. */
function ComboboxInput({ className, ...props }: React.ComponentProps<typeof UiComboboxInput>) {
  return <UiComboboxInput className={cn("w-full", className)} {...props} />
}

export { ComboboxInput }
