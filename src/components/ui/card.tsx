import * as React from "react"
import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-(--_card-gap) overflow-hidden rounded-(--_card-radius) bg-(--_card-fill) py-(--_card-padding-y) text-body-5 text-card-foreground has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-(--_card-radius) *:[img:last-child]:rounded-b-(--_card-radius) border-(--_card-border) shadow-(--_card-shadow) border data-[size=sm]:gap-(--_card-sm-gap) data-[size=sm]:py-(--_card-sm-padding-y)",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-(--_card-header-gap) rounded-t-(--_card-radius) px-(--_card-header-padding-x) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--_card-padding-y) group-data-[size=sm]/card:px-(--_card-header-sm-padding-x) group-data-[size=sm]/card:[.border-b]:pb-(--_card-sm-padding-y)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-body-4 font-(--_card-title-font-weight)", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-body-5 text-(--_card-description-foreground)", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--_card-content-padding-x) group-data-[size=sm]/card:px-(--_card-content-sm-padding-x)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-(--_card-radius) px-(--_card-footer-padding-x) [.border-t]:pt-(--_card-padding-y) group-data-[size=sm]/card:px-(--_card-footer-sm-padding-x) group-data-[size=sm]/card:[.border-t]:pt-(--_card-sm-padding-y)",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
