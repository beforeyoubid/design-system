import { cn } from "@/lib/utils"
import { IconLoader } from "@tabler/icons-react"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <IconLoader data-slot="spinner" role="status" aria-label="Loading" className={cn("size-(--_spinner-size) animate-spin text-(--_spinner-foreground) shrink-0 data-[icon]:text-current", className)} {...props} />
  )
}

export { Spinner }
