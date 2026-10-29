import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

const attachmentVariants = cva(
  "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-(--_attachment-radius) border bg-(--_attachment) text-(--_attachment-foreground) transition-colors focus-within:ring-1 focus-within:ring-(--_attachment-focus-ring) has-[>a,>button]:hover:bg-muted/50 data-[state=error]:border-(--_attachment-error-border) data-[state=idle]:border-dashed shadow-(--_attachment-shadow)",
  {
    variants: {
      size: {
        default:
          "gap-(--_attachment-default-gap) text-sm p-(--_attachment-default-padding)",
        sm: "gap-(--_attachment-sm-gap) text-xs p-(--_attachment-sm-padding)",
        xs: "gap-(--_attachment-xs-gap) rounded-(--_attachment-xs-radius) text-xs has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1",
      },
      orientation: {
        horizontal: "min-w-40 items-center",
        vertical: "w-(--_attachment-vertical-width) flex-col has-data-[slot=attachment-content]:w-(--_attachment-vertical-with-content-width)",
      },
    },
  }
)

function Attachment({
  className,
  state = "done",
  size = "default",
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof attachmentVariants> & {
    state?: "idle" | "uploading" | "processing" | "error" | "done"
  }) {
  return (
    <div
      data-slot="attachment"
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      className={cn(attachmentVariants({ size, orientation }), className)}
      {...props}
    />
  )
}

const attachmentMediaVariants = cva(
  "relative flex aspect-square w-(--_attachment-media-width) shrink-0 items-center justify-center overflow-hidden rounded-(--_attachment-media-radius) bg-(--_attachment-media) text-(--_attachment-media-foreground) group-data-[orientation=vertical]/attachment:w-full group-data-[size=sm]/attachment:w-(--_attachment-media-sm-width) group-data-[size=xs]/attachment:w-(--_attachment-media-xs-width) group-data-[size=xs]/attachment:rounded-(--_attachment-media-xs-radius) group-data-[state=error]/attachment:bg-(--_attachment-media-error) group-data-[state=error]/attachment:text-(--_attachment-media-error-foreground) group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-6! [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-(--_attachment-media-icon-size) group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5 group-data-[size=sm]/attachment:[&_svg:not([class*='size-'])]:size-(--_attachment-media-sm-icon-size)",
  {
    variants: {
      variant: {
        icon: "",
        image:
          "opacity-(--_attachment-media-image-opacity) group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  }
)

function AttachmentMedia({
  className,
  variant = "icon",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof attachmentMediaVariants>) {
  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(attachmentMediaVariants({ variant }), className)}
      {...props}
    />
  )
}

function AttachmentContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-content"
      className={cn(
        "max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1",
        className
      )}
      {...props}
    />
  )
}

function AttachmentTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-title"
      className={cn(
        "block max-w-full min-w-0 truncate font-(--_attachment-title-font-weight) group-data-[state=processing]/attachment:shimmer group-data-[state=uploading]/attachment:shimmer text-(--_attachment-title-foreground) text-body-4 group-data-[size=sm]/attachment:text-body-5",
        className
      )}
      {...props}
    />
  )
}

function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-description"
      className={cn(
        "mt-0.5 block min-w-0 truncate text-(--_attachment-description-foreground) group-data-[state=error]/attachment:text-(--_attachment-description-error-foreground) max-w-full text-caption-1 group-data-[size=sm]/attachment:text-caption-2",
        "max-w-full",
        className
      )}
      {...props}
    />
  )
}

function AttachmentActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-actions"
      className={cn(
        "relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:end-3 group-data-[orientation=vertical]/attachment:gap-1",
        className
      )}
      {...props}
    />
  )
}

function AttachmentAction({
  className,
  variant,
  size = "icon-xs",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="attachment-action"
      variant={variant ?? "ghost"}
      size={size}
      className={cn(className)}
      {...props}
    />
  )
}

function AttachmentTrigger({
  className,
  render,
  type,
  ...props
}: useRender.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: render ? type : (type ?? "button"),
        className: cn("absolute inset-0 z-10 outline-none", className),
      },
      props
    ),
    render,
    state: {
      slot: "attachment-trigger",
    },
  })
}

function AttachmentGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-group"
      className={cn(
        "flex min-w-0 scroll-fade-x snap-x snap-mandatory scroll-px-1 gap-(--_attachment-group-gap) overflow-x-auto overscroll-x-contain py-(--_attachment-group-padding-y) *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start no-scrollbar",
        className
      )}
      {...props}
    />
  )
}

export {
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
}
