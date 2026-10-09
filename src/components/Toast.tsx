import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { IconCheck, IconExclamationMark, IconX } from "@tabler/icons-react"
import { toast as sonnerToast } from "sonner"

import { cn } from "../lib/utils"

const toastVariants = cva(
  "relative flex w-full items-center gap-2 rounded-xl px-2 py-3 font-sans",
  {
    variants: {
      tone: {
        success: "bg-mint-l3 text-mint-60",
        warning: "bg-warning-l3 text-warning-60",
        error: "bg-error-l1 text-error-60",
      },
    },
    defaultVariants: { tone: "success" },
  }
)

const TONE_ICON = {
  success: IconCheck,
  warning: IconExclamationMark,
  error: IconX,
} as const

/** Auto-dismiss delay per tone (ms). `Infinity` = stays until dismissed. */
const TOAST_DURATIONS = {
  success: 5000,
  warning: 8000,
  error: Infinity,
} as const

type ToastTone = NonNullable<VariantProps<typeof toastVariants>["tone"]>

export interface ToastProps
  extends Omit<React.ComponentProps<"div">, "title">,
    VariantProps<typeof toastVariants> {
  title?: React.ReactNode
  description?: React.ReactNode
  /** Optional text-link action, e.g. "Undo". Never a filled button. */
  actionLabel?: React.ReactNode
  onAction?: () => void
  /** Fired on × click. */
  onClose?: () => void
}

/**
 * The toast surface. Render it inline, or fire it as a real toast with
 * `showToast()` (needs `<Toaster />` mounted once in the app).
 */
function Toast({
  tone,
  title,
  description,
  actionLabel,
  onAction,
  onClose,
  className,
  ...props
}: ToastProps) {
  const t: ToastTone = tone ?? "success"
  const Icon = TONE_ICON[t]
  return (
    <div
      role={t === "error" ? "alert" : "status"}
      aria-live={t === "error" ? "assertive" : "polite"}
      data-slot="toast"
      className={cn(toastVariants({ tone: t }), className)}
      {...props}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-current bg-white">
        <Icon className="size-4.5" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1 pe-6">
        {title && (
          <div className="text-body-sm font-semibold">{title}</div>
        )}
        {(description || actionLabel) && (
          <div className="text-body-sm text-dark-90">
            {description}
            {actionLabel && (
              <button
                type="button"
                onClick={onAction}
                className={cn(
                  "inline cursor-pointer font-semibold underline underline-offset-3",
                  description && "ms-1",
                  t === "success"
                    ? "text-mint-60"
                    : t === "warning"
                      ? "text-warning-60"
                      : "text-error-60"
                )}
              >
                {actionLabel}
              </button>
            )}
          </div>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onClose}
          className="absolute end-2 top-2 flex cursor-pointer p-1"
        >
          <IconX className="size-4.5" />
        </button>
      )}
    </div>
  )
}

export interface ShowToastOptions
  extends Pick<ToastProps, "title" | "description" | "actionLabel" | "onAction"> {
  tone?: ToastTone
  /** Override the tone's default delay (success 5s · warning 8s · error never). */
  duration?: number
  /** Fired when the toast is dismissed (auto or ×). */
  onClose?: () => void
}

/**
 * Fire a BYB toast through sonner. Requires `<Toaster />` to be mounted.
 * Desktop: bottom-right · mobile: full-width bottom. Pauses on hover.
 * Returns the toast id (pass it to `dismissToast`).
 */
function showToast({
  tone = "success",
  duration,
  onClose,
  onAction,
  ...rest
}: ShowToastOptions) {
  return sonnerToast.custom(
    (id) => (
      <Toast
        tone={tone}
        {...rest}
        onAction={() => {
          onAction?.()
          sonnerToast.dismiss(id)
        }}
        onClose={() => sonnerToast.dismiss(id)}
      />
    ),
    {
      duration: duration ?? TOAST_DURATIONS[tone],
      onDismiss: onClose,
      onAutoClose: onClose,
    }
  )
}

const dismissToast = (id?: string | number) => sonnerToast.dismiss(id)

export { Toast, toastVariants, showToast, dismissToast, TOAST_DURATIONS }
