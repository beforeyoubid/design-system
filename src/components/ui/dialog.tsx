"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { IconTile, type IconTileTone } from "@/components/ui/icon-tile"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-dark-100/50 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * One layout for every dialog: a divider under the header and above the
 * actions, with `DialogBody` scrolling in between on long content. A header
 * `icon` centres the header and the actions.
 */
const dialogContentVariants = cva(
  "group/dialog fixed top-1/2 start-1/2 z-50 flex max-h-11/12 w-11/12 rounded-3xl -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 flex-col gap-4 bg-white p-6 text-body-5 text-dark-90 shadow-2xl duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
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

function DialogContent({
  className,
  children,
  showCloseButton = true,
  size,
  ...props
}: DialogPrimitive.Popup.Props &
  VariantProps<typeof dialogContentVariants> & {
    showCloseButton?: boolean
  }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(dialogContentVariants({ size }), className)}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            aria-label="Close"
            className="absolute top-5 end-5 inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-dark-75 transition-colors outline-none hover:text-dark-100 focus-visible:ring-2 focus-visible:ring-navy [&_svg]:size-5"
          >
            <X />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

interface DialogHeaderProps extends React.ComponentProps<"div"> {
  /** Lucide icon in an `IconTile` above the title; centres the header and actions. */
  icon?: React.ReactNode
  /** IconTile colour. Default `mint`; use `error` for destructive confirms. */
  iconTone?: IconTileTone
}

function DialogHeader({
  className,
  icon,
  iconTone = "mint",
  children,
  ...props
}: DialogHeaderProps) {
  return (
    <div
      data-slot="dialog-header"
      data-with-icon={icon ? "" : undefined}
      className={cn(
        "flex flex-col gap-3 border-b border-light-l3 pe-10 pb-4",
        icon && "items-center px-10 text-center",
        className
      )}
      {...props}
    >
      {icon && <IconTile tone={iconTone} size="md" icon={icon} />}
      <div className={cn("flex flex-col gap-1.5", icon && "items-center")}>
        {children}
      </div>
    </div>
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-wrap justify-end gap-2 border-t border-light-l3 pt-4 group-has-data-with-icon/dialog:justify-center [[data-slot=dialog-header]+&]:border-t-0 [[data-slot=dialog-header]+&]:pt-0",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="tertiary" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-body-3 leading-tight font-semibold text-navy", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "*:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-navy",
        "text-body-5 text-dark-75",
        className
      )}
      {...props}
    />
  )
}

/** Main content area between the dividers; scrolls on its own when content is long. */
function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn("-mx-6 min-h-0 flex-1 overflow-y-auto px-6", className)}
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
        variant === "dropdown" && "rounded-lg border border-light-l3",
        className
      )}
    >
      {variant === "dropdown" ? (
        <>
          <CollapsiblePrimitive.Trigger className="group/dc flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-4 py-3 text-start text-body-5 font-semibold text-navy outline-none hover:text-mint-75 focus-visible:ring-2 focus-visible:ring-mint-45">
            {label ?? "Details"}
            <ChevronDown className="size-4 shrink-0 text-dark-60 transition-transform group-data-panel-open/dc:rotate-180" />
          </CollapsiblePrimitive.Trigger>
          <CollapsiblePrimitive.Panel className="border-t border-light-l3 px-4 py-3 text-body-5 text-dark-90">
            {children}
          </CollapsiblePrimitive.Panel>
        </>
      ) : (
        <>
          {preview && <div className="text-body-5 text-dark-90">{preview}</div>}
          <CollapsiblePrimitive.Panel className="text-body-5 text-dark-90">
            {children}
          </CollapsiblePrimitive.Panel>
          <CollapsiblePrimitive.Trigger className="group/dc mt-2 inline-flex w-fit cursor-pointer items-center gap-1 rounded-sm text-body-5 font-semibold text-mint-75 outline-none hover:text-mint-45 focus-visible:ring-2 focus-visible:ring-mint-45">
            {isOpen ? lessLabel : (label ?? "View more")}
            <ChevronDown className="size-4 transition-transform group-data-panel-open/dc:rotate-180" />
          </CollapsiblePrimitive.Trigger>
        </>
      )}
    </CollapsiblePrimitive.Root>
  )
}

export interface ConfirmDialogProps {
  /** Controlled open state. */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /**
   * A string renders a tertiary Button trigger; pass an element for a custom
   * trigger, or omit/null for none (control it with `open`).
   */
  trigger?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  /** Extra content between the description and the actions. */
  children?: React.ReactNode
  cancelLabel?: React.ReactNode
  actionLabel?: React.ReactNode
  /** Fires on Cancel, ×, or Escape. */
  onCancel?: () => void
  /** Fires on the confirm action. */
  onAction?: () => void
  /** Use the red destructive Button for the action. */
  destructive?: boolean
  /** Lucide icon in an IconTile above the title. */
  icon?: React.ReactNode
  /** IconTile colour. Defaults to `error` when `destructive`, else `mint`. */
  iconTone?: IconTileTone
  size?: VariantProps<typeof dialogContentVariants>["size"]
  className?: string
}

/**
 * Confirm before an irreversible action (replaces the old `Modal`). Tertiary
 * Cancel + primary (or `destructive`) action. Focus starts on Cancel, Escape
 * cancels, and clicking the backdrop does not close it.
 */
function ConfirmDialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  title = "Are you absolutely sure?",
  description,
  children,
  cancelLabel = "Cancel",
  actionLabel = "Continue",
  onCancel,
  onAction,
  destructive = false,
  icon,
  iconTone,
  size = "lg",
  className,
}: ConfirmDialogProps) {
  const [openState, setOpenState] = React.useState(defaultOpen)
  const open = openProp ?? openState
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next)
    onOpenChange?.(next)
  }
  const cancelRef = React.useRef<HTMLButtonElement>(null)

  const triggerNode =
    trigger == null ? null : typeof trigger === "string" ? (
      <DialogTrigger render={<Button variant="tertiary" />}>{trigger}</DialogTrigger>
    ) : React.isValidElement(trigger) ? (
      <DialogTrigger render={trigger as React.ReactElement} />
    ) : null

  return (
    <Dialog
      open={open}
      disablePointerDismissal
      onOpenChange={(next) => {
        // Base UI only reports closes it initiated (Cancel, ×, Escape).
        if (!next) onCancel?.()
        setOpen(next)
      }}
    >
      {triggerNode}
      <DialogContent
        size={size}
        role="alertdialog"
        initialFocus={cancelRef}
        className={className}
      >
        <DialogHeader
          icon={icon}
          iconTone={iconTone ?? (destructive ? "error" : "mint")}
        >
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {description && <DialogDescription>{description}</DialogDescription>}
        {children}
        <DialogFooter>
          <DialogClose
            ref={cancelRef}
            render={<Button variant="tertiary" size="md" />}
          >
            {cancelLabel}
          </DialogClose>
          <Button
            variant={destructive ? "destructive" : "primary"}
            onClick={() => {
              onAction?.()
              setOpen(false)
            }}
          >
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogCollapsible,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  ConfirmDialog,
  dialogContentVariants,
}
export type { DialogHeaderProps, DialogCollapsibleProps }
