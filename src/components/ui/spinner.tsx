import { cn } from "@/lib/utils"
import { IconLoader2 } from "@tabler/icons-react"

// Rey's look (BYBSpinner ring): the loader-2 arc in the primary colour. Inside a
// control, placed with data-icon, it takes the control's text colour instead.
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <IconLoader2
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4 shrink-0 animate-spin text-primary data-[icon]:text-current", className)}
      {...props}
    />
  )
}

export { Spinner }
