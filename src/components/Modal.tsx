import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"
import { IconX } from "@tabler/icons-react"

import { cn } from "../lib/utils"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { Button } from "./ui/button"

export interface ModalProps {
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
  cancelLabel?: React.ReactNode
  actionLabel?: React.ReactNode
  /** Fires on Cancel, ×, or Escape. */
  onCancel?: () => void
  /** Fires on the confirm action. */
  onAction?: () => void
  /** Use the red destructive Button for the action. */
  destructive?: boolean
  className?: string
}

/**
 * Confirm before an irreversible action. Tertiary Cancel + primary (or
 * `destructive`) action. Focus is trapped, Escape cancels, and clicking the
 * backdrop does not close it.
 */
function Modal({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  title = "Are you absolutely sure?",
  description,
  cancelLabel = "Cancel",
  actionLabel = "Continue",
  onCancel,
  onAction,
  destructive = false,
  className,
}: ModalProps) {
  const [openState, setOpenState] = React.useState(defaultOpen)
  const open = openProp ?? openState
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next)
    onOpenChange?.(next)
  }
  const cancelRef = React.useRef<HTMLButtonElement>(null)

  const triggerNode =
    trigger == null ? null : typeof trigger === "string" ? (
      <AlertDialogTrigger render={<Button variant="tertiary" />}>
        {trigger}
      </AlertDialogTrigger>
    ) : React.isValidElement(trigger) ? (
      <AlertDialogTrigger render={trigger as React.ReactElement} />
    ) : null

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        // Base UI only reports closes it initiated (Cancel, ×, Escape).
        if (!next) onCancel?.()
        setOpen(next)
      }}
    >
      {triggerNode}
      <AlertDialogContent
        initialFocus={cancelRef}
        className={cn(
          "w-11/12 gap-4 rounded-3xl border-0 bg-white p-6 text-dark-90 data-[size=default]:max-w-120 data-[size=default]:sm:max-w-120",
          className
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-light-l3 pb-4">
          <AlertDialogTitle className="text-body-lg leading-tight font-semibold text-navy">
            {title}
          </AlertDialogTitle>
          <AlertDialogPrimitive.Close
            aria-label="Close"
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-dark-75 outline-none hover:bg-light-l1 focus-visible:ring-2 focus-visible:ring-mint-45"
          >
            <IconX className="size-5" />
          </AlertDialogPrimitive.Close>
        </div>
        {description && (
          <AlertDialogDescription className="text-body-md leading-normal text-dark-90">
            {description}
          </AlertDialogDescription>
        )}
        <div className="flex flex-wrap justify-end gap-2">
          <AlertDialogCancel ref={cancelRef} variant="tertiary" size="md">
            {cancelLabel}
          </AlertDialogCancel>
          <Button
            variant={destructive ? "destructive" : "primary"}
            onClick={() => {
              onAction?.()
              setOpen(false)
            }}
          >
            {actionLabel}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { Modal }
