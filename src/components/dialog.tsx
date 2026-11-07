"use client"

import * as React from "react"
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  DialogContent as DialogContentBase,
  DialogFooter as DialogFooterBase,
  DialogHeader as DialogHeaderBase,
} from "@/components/ui/dialog"
import { IconTile, type IconTileVariant } from "@/components/icon-tile"

export * from "@/components/ui/dialog"

/**
 * One layout for every dialog: header, content and actions separated by
 * spacing (no divider lines); long content scrolls in `DialogBody`, whose edges
 * fade while there's more to see. Everything is left-aligned; a header `icon`
 * sits on the left in one row with the title.
 *
 * Two safety nets for content the layout didn't plan for. A dialog without a
 * `DialogBody` scrolls as a whole rather than running its actions off the
 * screen, and text wraps anywhere, so an unbroken string (an email address, a
 * URL) breaks instead of pushing the dialog wider than the screen.
 */
const dialogContentVariants = cva(
  // The look is in the dialog-content component tokens (stock classes). Here: the BYB close
  // button (a plain grey ×, not stock's ghost Button), read from the
  // dialog-close component tokens.
  "overflow-y-auto wrap-anywhere *:data-[slot=dialog-close]:top-5 *:data-[slot=dialog-close]:end-5 *:data-[slot=dialog-close]:size-8 *:data-[slot=dialog-close]:rounded-full *:data-[slot=dialog-close]:bg-transparent *:data-[slot=dialog-close]:text-(--_dialog-close-foreground) *:data-[slot=dialog-close]:hover:bg-transparent *:data-[slot=dialog-close]:hover:text-(--_dialog-close-hover-foreground) *:data-[slot=dialog-close]:[&_svg]:size-5!",
  {
    variants: {
      size: {
        sm: "max-w-96",
        md: "max-w-110",
        lg: "max-w-120",
        xl: "max-w-160",
      },
    },
    defaultVariants: { size: "md" },
  }
)

type DialogContentProps = React.ComponentProps<typeof DialogContentBase> &
  VariantProps<typeof dialogContentVariants>

/** Stock `DialogContent` plus `size` (max width): `sm`, `md` (default), `lg`, `xl`. */
function DialogContent({ className, size, ...props }: DialogContentProps) {
  return (
    <DialogContentBase
      className={cn(dialogContentVariants({ size }), className)}
      {...props}
    />
  )
}

interface DialogHeaderProps extends React.ComponentProps<"div"> {
  /** Lucide icon in an `IconTile` on the left, in one row with the title. */
  icon?: React.ReactNode
  /** IconTile colour. Default `mint`; use `error` for destructive confirms. */
  iconVariant?: IconTileVariant
}

/** Stock `DialogHeader` plus an optional icon tile in one row with the title. */
function DialogHeader({
  className,
  icon,
  iconVariant = "mint",
  children,
  ...props
}: DialogHeaderProps) {
  return (
    <DialogHeaderBase
      data-with-icon={icon ? "" : undefined}
      className={cn(
        // With an icon: icon + title share the first row; the description and
        // anything else wrap below at full width.
        icon &&
          "flex-row flex-wrap items-center gap-3 pe-0 *:data-[slot=dialog-title]:min-w-0 *:data-[slot=dialog-title]:flex-1 *:data-[slot=dialog-title]:pe-10 *:not-first:not-data-[slot=dialog-title]:basis-full",
        className
      )}
      {...props}
    >
      {icon && <IconTile variant={iconVariant} size="md" icon={icon} />}
      {children}
    </DialogHeaderBase>
  )
}

/**
 * Stock `DialogFooter`, plus a phone layout for actions that don't fit on one
 * row. Below `sm`, once the buttons wrap, the main action (the last button)
 * moves to the top row and every button stretches to fill its row, so wrapped
 * buttons read as a stack instead of ragged right-aligned rows. Buttons that
 * fit stay side by side as before, and nothing changes from `sm` up.
 *
 * CSS can't tell when a flex row has wrapped, so the footer measures its
 * buttons and sets `data-wrapped` while they sit on more than one row.
 * Stretching never changes where a row breaks, so this can't flip back.
 */
function DialogFooter({ className, ref, ...props }: React.ComponentProps<typeof DialogFooterBase>) {
  const footerRef = React.useRef<HTMLDivElement | null>(null)
  const [wrapped, setWrapped] = React.useState(false)

  React.useLayoutEffect(() => {
    const footer = footerRef.current
    if (!footer || typeof ResizeObserver === "undefined") return
    const measure = () => {
      const tops = new Set(
        Array.from(footer.children, (child) => Math.round((child as HTMLElement).offsetTop))
      )
      setWrapped(tops.size > 1)
    }
    const resize = new ResizeObserver(measure)
    const observeAll = () => {
      resize.disconnect()
      resize.observe(footer)
      Array.from(footer.children).forEach((child) => resize.observe(child))
      measure()
    }
    const mutation = new MutationObserver(observeAll)
    mutation.observe(footer, { childList: true })
    observeAll()
    return () => {
      resize.disconnect()
      mutation.disconnect()
    }
  }, [])

  return (
    <DialogFooterBase
      ref={(node: HTMLDivElement | null) => {
        footerRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref && typeof ref === "object") (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      }}
      data-wrapped={wrapped ? "" : undefined}
      className={cn("max-sm:flex-wrap-reverse max-sm:data-wrapped:*:grow", className)}
      {...props}
    />
  )
}

/**
 * Main content area. Scrolls on its own when content is long; the top / bottom
 * edges fade only while there is more to scroll to (`scroll-fade-y`).
 *
 * A scrolling box clips what its children draw outside themselves, so a field
 * at the very top or bottom lost its focus ring there. A 4px band inside the
 * scroll area holds the ring (3px), and the matching negative margin keeps the
 * content where it was. The sides already have the `-mx-6 px-6` band.
 */
function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn("-mx-6 -my-1 min-h-0 flex-1 overflow-y-auto px-6 py-1 scroll-fade-y scroll-fade-6", className)}
      {...props}
    />
  )
}

interface DialogCollapsibleProps
  extends Omit<CollapsiblePrimitive.Root.Props, "children"> {
  /**
   * `view-more`: content first, then a "View more / View less" text toggle.
   * `dropdown`: a full-width disclosure row with a chevron above the content.
   */
  variant?: "view-more" | "dropdown"
  /** Label for the dropdown row, or the collapsed "View more" text. */
  label?: React.ReactNode
  /** Expanded text for `view-more`. Default "View less". */
  lessLabel?: React.ReactNode
  /** `view-more` only: always-visible content above the hidden part. */
  preview?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

/**
 * Collapsible section inside dialog content: extra details, terms, or a
 * secondary list that most people don't need to read.
 */
function DialogCollapsible({
  variant = "view-more",
  label,
  lessLabel = "View less",
  preview,
  children,
  className,
  ...props
}: DialogCollapsibleProps) {
  const [open, setOpen] = React.useState(props.defaultOpen ?? false)
  const isOpen = props.open ?? open

  return (
    <CollapsiblePrimitive.Root
      data-slot="dialog-collapsible"
      data-variant={variant}
      {...props}
      onOpenChange={(next, details) => {
        setOpen(next)
        props.onOpenChange?.(next, details)
      }}
      className={cn(
        "flex flex-col",
        variant === "dropdown" && "rounded-lg border border-(--_dialog-collapsible-border)",
        className
      )}
    >
      {variant === "dropdown" ? (
        <>
          <CollapsiblePrimitive.Trigger className="group/dc flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-4 py-3 text-start text-body-5 font-semibold text-(--_dialog-collapsible-trigger-foreground) outline-none hover:text-(--_dialog-collapsible-trigger-hover-foreground) focus-visible:ring-2 focus-visible:ring-(--_dialog-collapsible-focus-ring)">
            {label ?? "Details"}
            <ChevronDown className="size-4 shrink-0 text-(--_dialog-collapsible-icon-foreground) transition-transform group-data-panel-open/dc:rotate-180" />
          </CollapsiblePrimitive.Trigger>
          <CollapsiblePrimitive.Panel className="border-t border-(--_dialog-collapsible-border) px-4 py-3 text-body-5 text-(--_dialog-collapsible-foreground)">
            {children}
          </CollapsiblePrimitive.Panel>
        </>
      ) : (
        <>
          {preview && <div className="text-body-5 text-(--_dialog-collapsible-foreground)">{preview}</div>}
          <CollapsiblePrimitive.Panel className="text-body-5 text-(--_dialog-collapsible-foreground)">
            {children}
          </CollapsiblePrimitive.Panel>
          <CollapsiblePrimitive.Trigger className="group/dc mt-2 inline-flex w-fit cursor-pointer items-center gap-1 rounded-sm text-body-5 font-semibold text-(--_dialog-collapsible-toggle-foreground) outline-none hover:text-(--_dialog-collapsible-toggle-hover-foreground) focus-visible:ring-2 focus-visible:ring-(--_dialog-collapsible-focus-ring)">
            {isOpen ? lessLabel : (label ?? "View more")}
            <ChevronDown className="size-4 transition-transform group-data-panel-open/dc:rotate-180" />
          </CollapsiblePrimitive.Trigger>
        </>
      )}
    </CollapsiblePrimitive.Root>
  )
}

export {
  DialogBody,
  DialogCollapsible,
  DialogContent,
  DialogFooter,
  DialogHeader,
  dialogContentVariants,
}
export type { DialogHeaderProps, DialogCollapsibleProps }
