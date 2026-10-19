import * as React from "react"
import { useTheme } from "next-themes"
import {
  Toaster as Sonner,
  toast as sonnerToast,
  type ExternalToast,
  type ToasterProps,
} from "sonner"
import { cva, type VariantProps } from "class-variance-authority"
import {
  IconBell,
  IconCheck,
  IconExclamationMark,
  IconInfoSmall,
  IconLoader2,
  IconX,
} from "@tabler/icons-react"

import { cn } from "@/lib/utils"

/**
 * Auto-dismiss delay per tone (ms). `Infinity` = stays until closed.
 * success 5s · warning 8s · error stays until the user closes it ·
 * info / default 5s.
 */
const TOAST_DURATIONS = {
  success: 5000,
  warning: 8000,
  error: Infinity,
  info: 5000,
  default: 5000,
} as const

/** The toast surface: tint fill, tone-coloured title / icon / ×. */
const toastVariants = cva(
  "relative flex w-full items-center gap-2 rounded-2xl px-2 py-3 font-sans",
  {
    variants: {
      tone: {
        success: "bg-mint-l3 text-mint-60",
        warning: "bg-warning-l3 text-warning-60",
        error: "bg-error-l1 text-error-60",
        info: "bg-mint-l4 text-mint-75",
        default: "bg-light-l2 text-navy",
      },
    },
    defaultVariants: { tone: "success" },
  }
)

type ToastTone = NonNullable<VariantProps<typeof toastVariants>["tone"]>

const TONE_ICON = {
  success: IconCheck,
  warning: IconExclamationMark,
  error: IconX,
  info: IconInfoSmall,
  default: IconBell,
} as const

/** Inline action link colour per tone (description text itself is dark-90). */
const toastActionVariants = cva(
  "inline cursor-pointer font-semibold underline underline-offset-3",
  {
    variants: {
      tone: {
        success: "text-mint-60",
        warning: "text-warning-60",
        error: "text-error-60",
        info: "text-mint-75",
        default: "text-navy",
      },
    },
    defaultVariants: { tone: "success" },
  }
)

export interface ToastProps
  extends Omit<React.ComponentProps<"div">, "title">,
    VariantProps<typeof toastVariants> {
  title?: React.ReactNode
  description?: React.ReactNode
  /** Optional text-link action, e.g. "Undo". Never a filled button. */
  actionLabel?: React.ReactNode
  onAction?: (event: React.MouseEvent<HTMLButtonElement>) => void
  /** Fired on × click. The × only shows when this is set. */
  onClose?: () => void
  /** In-progress state: the tone icon becomes a spinner (used by `sonner.promise` / `sonner.loading`). */
  loading?: boolean
}

/**
 * The toast surface. `sonner.success(...)` etc. render this through sonner;
 * render it inline for previews or custom placements.
 */
function Toast({
  tone,
  title,
  description,
  actionLabel,
  onAction,
  onClose,
  loading = false,
  className,
  ...props
}: ToastProps) {
  const t: ToastTone = tone ?? "success"
  const Icon = loading ? IconLoader2 : TONE_ICON[t]
  return (
    <div
      role={t === "error" ? "alert" : "status"}
      aria-live={t === "error" ? "assertive" : "polite"}
      data-slot="toast"
      data-tone={t}
      aria-busy={loading || undefined}
      className={cn(toastVariants({ tone: t }), className)}
      {...props}
    >
      {Icon && (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-current bg-white">
          <Icon className={cn("size-4.5", loading && "animate-spin")} />
        </span>
      )}
      <div className={cn("flex min-w-0 flex-1 flex-col gap-1", onClose && "pe-6")}>
        {title && <div className="text-body-5 font-semibold">{title}</div>}
        {(description || actionLabel) && (
          <div className="text-body-5 text-dark-90">
            {description}
            {description && actionLabel && " "}
            {actionLabel && (
              <button
                type="button"
                onClick={onAction}
                className={toastActionVariants({ tone: t })}
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
          className="absolute end-2 top-2 flex cursor-pointer p-1 transition-colors hover:text-navy"
        >
          <IconX className="size-4.5" />
        </button>
      )}
    </div>
  )
}

/**
 * Mount once in the app root.
 * - Placement: bottom-right on desktop (440px wide); full-width at the bottom
 *   on mobile (< 768px).
 * - Dismissal: success 5s, warning 8s, error stays until closed, info /
 *   default 5s. Hovering pauses the timer.
 */
const Toaster = ({ className, toastOptions, ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-right"
      // sonner only goes full-width below 600px; BYB's mobile tier is < 768px (md),
      // so stretch the 600–767px range too (24px side offsets).
      className={cn(
        "toaster group max-md:[--width:calc(100vw-48px)]! [&_[data-sonner-toast]]:w-full",
        className
      )}
      icons={{ loading: <IconLoader2 className="size-4.5 animate-spin" /> }}
      style={
        {
          // BYB toasts are 440px wide on desktop (full-width on mobile)
          "--width": "440px",
        } as React.CSSProperties
      }
      toastOptions={{
        ...toastOptions,
        // Only sonner-native toasts (toast.loading / toast.promise) use these;
        // every BYB tone renders the <Toast> surface above.
        classNames: {
          toast: "rounded-2xl! border-light-l3! font-sans! text-body-5!",
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  )
}

type ToastMessage = Parameters<typeof sonnerToast>[0]

const resolve = (node: ToastMessage | ExternalToast["description"]) =>
  typeof node === "function" ? node() : node

/** Render a BYB `<Toast>` through sonner with the tone's default duration. */
function fire(
  tone: ToastTone,
  message: ToastMessage,
  data: ExternalToast = {},
  loading = false
) {
  const { description, action, duration, ...rest } = data
  const act =
    action && typeof action === "object" && "label" in action ? action : undefined
  return sonnerToast.custom(
    (id) => (
      <Toast
        tone={tone}
        loading={loading}
        title={resolve(message)}
        description={resolve(description)}
        actionLabel={act?.label}
        onAction={(event) => {
          act?.onClick(event)
          if (!event.defaultPrevented) sonnerToast.dismiss(id)
        }}
        onClose={() => sonnerToast.dismiss(id)}
      />
    ),
    { ...rest, duration: duration ?? TOAST_DURATIONS[tone] }
  )
}

let promiseCount = 0

/** Tone while a promise / loading toast is in progress. */
type SonnerProgressTone = Exclude<ToastTone, "success">

interface SonnerLoadingOptions extends ExternalToast {
  /**
   * Colour while in progress, matching what the action does: `error` (red)
   * for deleting / removing, `warning` (amber) for risky changes, `info`
   * (light mint, default) for everything else.
   */
  tone?: SonnerProgressTone
}

interface SonnerPromiseOptions<T>
  extends Omit<ExternalToast, "description" | "action" | "duration"> {
  /** Title while the promise is pending. */
  loading: React.ReactNode
  /** Title once it resolves (turns the toast green). */
  success: React.ReactNode | ((data: T) => React.ReactNode)
  /** Title if it rejects (turns the toast red; stays until closed). */
  error: React.ReactNode | ((error: unknown) => React.ReactNode)
  /** Pending colour: `error` for deleting, `warning` for risky changes, `info` (default). */
  tone?: SonnerProgressTone
  /** Description while pending. */
  description?: React.ReactNode
  successDescription?: React.ReactNode | ((data: T) => React.ReactNode)
  errorDescription?: React.ReactNode | ((error: unknown) => React.ReactNode)
  /** Runs after success or error. */
  finally?: () => void
}

/**
 * One toast that follows a promise: a spinner in the action's tone while
 * pending (red for deleting, amber for warnings, light mint otherwise), then
 * green on success (5s) or red on error (stays until closed).
 * Returns the toast `id` and `unwrap()` (the original promise).
 */
function sonnerPromise<T>(
  input: Promise<T> | (() => Promise<T>),
  {
    loading,
    success,
    error,
    tone = "info",
    description,
    successDescription,
    errorDescription,
    finally: onFinally,
    ...rest
  }: SonnerPromiseOptions<T>
) {
  const id = rest.id ?? `byb-promise-${++promiseCount}`
  fire(tone, loading, { ...rest, id, description, duration: Infinity }, true)
  const promise = typeof input === "function" ? input() : input
  const pick = <V,>(value: React.ReactNode | ((v: V) => React.ReactNode), v: V) =>
    typeof value === "function" ? value(v) : value
  promise
    .then((data) =>
      fire("success", pick(success, data), {
        ...rest,
        id,
        description: pick(successDescription, data),
      })
    )
    .catch((err: unknown) =>
      fire("error", pick(error, err), {
        ...rest,
        id,
        description: pick(errorDescription, err),
      })
    )
    .finally(() => onFinally?.())
  return { id, unwrap: () => promise }
}

/** In-progress toast with a spinner; update it later with `sonner.success(msg, { id })`. */
function sonnerLoading(message: ToastMessage, { tone = "info", ...data }: SonnerLoadingOptions = {}) {
  return fire(tone, message, { duration: Infinity, ...data }, true)
}

type SonnerApi = ((message: ToastMessage, data?: ExternalToast) => string | number) &
  Omit<typeof sonnerToast, "promise" | "loading"> & {
    promise: typeof sonnerPromise
    loading: typeof sonnerLoading
  }

/**
 * Fire BYB toasts: `sonner(...)`, `sonner.success`, `sonner.info`,
 * `sonner.warning`, `sonner.error`. Options: `description`,
 * `action: { label, onClick }` (inline text link; closes the toast unless
 * `event.preventDefault()`), `duration`, `id`, `onDismiss`, `onAutoClose`.
 * `sonner.promise` / `sonner.loading` take a `tone` for the in-progress
 * colour; `sonner.dismiss` is sonner's own. Requires `<Toaster />` to be mounted.
 */
const sonner: SonnerApi = Object.assign(
  (message: ToastMessage, data?: ExternalToast) => fire("default", message, data),
  sonnerToast,
  {
    success: (message: ToastMessage, data?: ExternalToast) => fire("success", message, data),
    info: (message: ToastMessage, data?: ExternalToast) => fire("info", message, data),
    warning: (message: ToastMessage, data?: ExternalToast) => fire("warning", message, data),
    error: (message: ToastMessage, data?: ExternalToast) => fire("error", message, data),
    promise: sonnerPromise,
    loading: sonnerLoading,
  }
)

/** @deprecated Renamed to `sonner` (`sonner.success(...)`, `sonner.promise(...)`). */
const toast: SonnerApi = sonner

/** @deprecated Use `sonner.success | sonner.info | sonner.warning | sonner.error`. */
export interface ShowToastOptions {
  tone?: ToastTone
  title?: React.ReactNode
  description?: React.ReactNode
  /** Optional text-link action, e.g. "Undo". */
  actionLabel?: React.ReactNode
  onAction?: () => void
  /** Override the tone's default delay. */
  duration?: number
  /** Fired when the toast is dismissed (auto or ×). */
  onClose?: () => void
}

/** @deprecated Use `sonner.success(title, { description, action })` etc. */
function showToast({
  tone = "success",
  title,
  description,
  actionLabel,
  onAction,
  duration,
  onClose,
}: ShowToastOptions) {
  return fire(tone, title, {
    description,
    duration,
    action: actionLabel ? { label: actionLabel, onClick: () => onAction?.() } : undefined,
    onDismiss: onClose,
    onAutoClose: onClose,
  })
}

/** @deprecated Use `sonner.dismiss(id)`. */
const dismissToast = (id?: string | number) => sonnerToast.dismiss(id)

export {
  Toaster,
  Toast,
  sonner,
  toast,
  toastVariants,
  showToast,
  dismissToast,
  TOAST_DURATIONS,
}
export type {
  ToastTone,
  SonnerApi,
  SonnerProgressTone,
  SonnerPromiseOptions,
  SonnerLoadingOptions,
}
