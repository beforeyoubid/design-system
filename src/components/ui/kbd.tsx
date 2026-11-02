import { cn } from "@/lib/utils"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-(--_kbd-height) w-fit min-w-5 items-center justify-center gap-(--_kbd-gap) rounded-(--_kbd-radius) bg-(--_kbd) px-(--_kbd-padding-x) font-sans text-xs font-(--_kbd-font-weight) text-(--_kbd-foreground) select-none in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-(--_kbd-group-gap)", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
