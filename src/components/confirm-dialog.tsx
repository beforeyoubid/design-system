"use client"

import * as React from "react"

import { Button } from "@/components/button"
import { type IconTileVariant } from "@/components/icon-tile"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog"

interface ConfirmDialogProps {
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
  /** Lucide icon in a IconTile left of the title (one row). */
  icon?: React.ReactNode
  /** IconTile colour. Defaults to `error` when `destructive`, else `mint`. */
  iconVariant?: IconTileVariant
  size?: React.ComponentProps<typeof DialogContent>["size"]
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
  iconVariant,
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
          iconVariant={iconVariant ?? (destructive ? "error" : "mint")}
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

export { ConfirmDialog }
export type { ConfirmDialogProps }
