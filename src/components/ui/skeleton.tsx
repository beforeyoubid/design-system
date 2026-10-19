import { cn } from "@/lib/utils"

/**
 * Loading placeholder: a light-l2 block with a white highlight sweeping across
 * it (`animate-shimmer`). The sweep is dropped for `prefers-reduced-motion`.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "relative isolate overflow-hidden rounded-2xl bg-light-l2",
        "before:absolute before:inset-0 before:-z-10 before:animate-shimmer before:bg-linear-to-r before:from-transparent before:via-white/70 before:to-transparent motion-reduce:before:hidden",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
