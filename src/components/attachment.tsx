import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "@/lib/utils"
import { Attachment as StockAttachment } from "@/components/ui/attachment"

export * from "@/components/ui/attachment"

/**
 * Where a file is in its upload:
 *   uploading · completed (just uploaded) · error · uploaded (saved earlier,
 *   e.g. loaded from the server).
 */
export type AttachmentUploadStatus = "uploading" | "completed" | "error" | "uploaded"

const stateFor = {
  uploading: "uploading",
  completed: "done",
  error: "error",
  uploaded: "done",
} as const

/**
 * Stock `Attachment` plus `status`, the upload's step. It sets stock's `state`
 * (which drives the shimmer and error border) and `data-status`, which
 * AttachmentStatus reads for its colour. Pass `state` instead for stock's own
 * steps (idle, processing).
 */
function Attachment({
  status,
  state,
  ...props
}: React.ComponentProps<typeof StockAttachment> & {
  status?: AttachmentUploadStatus
}) {
  return (
    <StockAttachment
      data-status={status}
      state={state ?? (status ? stateFor[status] : undefined)}
      {...props}
    />
  )
}

/** The status label in the description ("Uploading", "Completed", "Failed"), coloured by the card's status. */
function AttachmentStatus({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-status"
      className={cn(
        "inline-flex items-center gap-(--_attachment-status-gap) align-bottom text-(--_attachment-status-foreground) group-data-[status=completed]/attachment:text-(--_attachment-status-completed-foreground) group-data-[status=error]/attachment:text-(--_attachment-status-error-foreground) [&_svg]:size-3.5 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

/** Upload progress, as a full-width bar under the card's content. `value` is 0–100. */
function AttachmentProgress({ className, ...props }: ProgressPrimitive.Root.Props) {
  return (
    <ProgressPrimitive.Root
      data-slot="attachment-progress"
      className={cn("basis-full", className)}
      {...props}
    >
      <ProgressPrimitive.Track className="relative block h-(--_attachment-progress-height) w-full overflow-hidden rounded-(--_attachment-progress-radius) bg-(--_attachment-progress)">
        <ProgressPrimitive.Indicator
          data-slot="attachment-progress-indicator"
          className="h-full rounded-(--_attachment-progress-radius) bg-(--_attachment-progress-indicator) transition-all"
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  )
}

/** A full-width error line under the card's content, with a Retry link when `onRetry` is set. */
function AttachmentError({
  className,
  children,
  onRetry,
  retryLabel = "Retry",
  ...props
}: React.ComponentProps<"div"> & {
  onRetry?: () => void
  retryLabel?: React.ReactNode
}) {
  return (
    <div
      data-slot="attachment-error"
      role="alert"
      className={cn(
        "flex basis-full items-center justify-between gap-3 text-xs text-(--_attachment-error-foreground)",
        className
      )}
      {...props}
    >
      <span className="min-w-0">{children}</span>
      {onRetry && (
        <button
          type="button"
          data-slot="attachment-retry"
          onClick={onRetry}
          className="shrink-0 cursor-pointer font-(--_attachment-retry-font-weight) text-(--_attachment-retry-foreground) outline-none hover:underline focus-visible:underline"
        >
          {retryLabel}
        </button>
      )}
    </div>
  )
}

export { Attachment, AttachmentStatus, AttachmentProgress, AttachmentError }
