import * as React from "react"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import { cn } from "@/lib/utils"

function Avatar({
  className,
  size = "default",
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: "default" | "sm" | "lg"
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-(--_avatar-size) shrink-0 rounded-(--_avatar-radius) select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-(--_avatar-lg-size) data-[size=sm]:size-(--_avatar-sm-size) dark:after:mix-blend-lighten",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-(--_avatar-image-radius) object-cover",
        className
      )}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-(--_avatar-fallback-radius) bg-(--_avatar-fallback) text-body-5 text-(--_avatar-fallback-foreground) group-data-[size=sm]/avatar:text-caption-2",
        className
      )}
      {...props}
    />
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute end-0 bottom-0 z-10 inline-flex items-center justify-center rounded-(--_avatar-badge-radius) bg-(--_avatar-badge) text-(--_avatar-badge-foreground) bg-blend-color ring-2 ring-(--_avatar-badge-ring) select-none group-data-[size=sm]/avatar:size-(--_avatar-badge-sm-size) group-data-[size=sm]/avatar:[&>svg]:hidden group-data-[size=default]/avatar:size-(--_avatar-badge-size) group-data-[size=default]/avatar:[&>svg]:size-2 group-data-[size=lg]/avatar:size-(--_avatar-badge-lg-size) group-data-[size=lg]/avatar:[&>svg]:size-2",
        "group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:[&>svg]:size-2",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-(--_avatar-group-count-size) shrink-0 items-center justify-center rounded-(--_avatar-group-count-radius) bg-(--_avatar-group-count) text-body-5 text-(--_avatar-group-count-foreground) ring-2 ring-(--_avatar-group-count-ring) group-has-data-[size=lg]/avatar-group:size-(--_avatar-group-count-lg-size) group-has-data-[size=sm]/avatar-group:size-(--_avatar-group-count-sm-size) [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
}
