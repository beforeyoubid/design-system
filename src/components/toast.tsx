"use client"

import * as React from "react"
import {
  Toast as ToastPrimitive,
  type ToastManagerAddOptions,
  type ToastManagerUpdateOptions,
  type ToastObject,
} from "@base-ui/react/toast"
import { cva } from "class-variance-authority"
import {
  IconX,
  IconCheck,
  IconInfoSmall,
  IconExclamationMark,
  IconBell,
  IconLoader2,
} from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import {
  Toast as StockToast,
  ToastAction as StockToastAction,
  ToastClose as StockToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager as createStockToastManager,
} from "@/components/ui/toast"

export * from "@/components/ui/toast"

// The BYB toast keeps the action as an inline underlined link in the
// description and the close as a bare icon; stock renders both as Buttons.
function ToastAction({
  render = <button type="button" />,
  ...props
}: React.ComponentProps<typeof StockToastAction>) {
  return <StockToastAction render={render} {...props} />
}

function ToastClose({
  render = <button type="button" />,
  ...props
}: React.ComponentProps<typeof StockToastClose>) {
  return <StockToastClose render={render} {...props} />
}

/** BYB toast types. Untyped toasts render as `default`. */
type ToastType = "success" | "info" | "warning" | "error" | "default"

/** Colour of an in-flight `loading` toast, set via `data.pendingType`. */
type ToastPendingType = "info" | "warning" | "error"

interface ToastData {
  /** `error` red for deleting, `warning` amber for risky changes, `info` light mint (default). */
  pendingType?: ToastPendingType
}

/**
 * Auto-dismiss delay per type (ms). `0` = stays until closed.
 * success 5s · warning 8s · error stays · info / default 5s.
 */
const TOAST_TIMEOUTS: Record<ToastType, number> = {
  success: 5000,
  warning: 8000,
  error: 0,
  info: 5000,
  default: 5000,
}

/** The toast surface: tint fill, type-coloured title / icon / ×. */
const toastVariants = cva("", {
  variants: {
    type: {
      success: "bg-(--_toast-success) text-(--_toast-success-foreground)",
      warning: "bg-(--_toast-warning) text-(--_toast-warning-foreground)",
      error: "bg-(--_toast-error) text-(--_toast-error-foreground)",
      info: "bg-(--_toast-info) text-(--_toast-info-foreground)",
      // The stock toast fill and text (toast component tokens)
      default: "",
    },
  },
  defaultVariants: { type: "default" },
})

/** The type a toast is painted with: a `loading` toast takes its `pendingType`. */
function getToastType(
  toast: Pick<ToastPrimitive.Root.ToastObject<ToastData>, "type" | "data">
): ToastType {
  if (toast.type === "loading") return toast.data?.pendingType ?? "info"
  return toast.type && toast.type in TOAST_TIMEOUTS
    ? (toast.type as ToastType)
    : "default"
}

type ToastOptions = ToastManagerUpdateOptions<ToastData>

/** Fill in the type's timeout and announcement priority unless the caller set them. */
function withTypeDefaults<O extends ToastOptions>(options: O): O {
  const type = getToastType(options)
  return {
    ...options,
    timeout: options.timeout ?? TOAST_TIMEOUTS[type],
    priority: options.priority ?? (type === "error" ? "high" : "low"),
  }
}

type PromiseStage<Value> =
  | string
  | ToastOptions
  | ((value: Value) => string | ToastOptions)

/** A string stage becomes the toast title (Base UI would make it the description). */
function toStageOptions<Value>(stage: PromiseStage<Value>, value: Value) {
  const resolved = typeof stage === "function" ? stage(value) : stage
  return typeof resolved === "string" ? { title: resolved } : resolved
}

/**
 * Base UI's toast manager with BYB defaults: each type's timeout, and
 * `promise` stages that read as titles. `promise` takes `data.pendingType`
 * on the loading stage for its colour.
 */
function createToastManager() {
  const manager = createStockToastManager<ToastData>()
  return {
    ...manager,
    add: (options: ToastManagerAddOptions<ToastData>) =>
      manager.add(withTypeDefaults(options)),
    update: <T extends ToastData = ToastData>(
      id: string,
      updates:
        | ToastManagerUpdateOptions<T>
        | ((prevToast: ToastObject<T>) => ToastManagerUpdateOptions<T>)
    ) => {
      const retype = (next: ToastManagerUpdateOptions<T>) =>
        next.type ? withTypeDefaults(next) : next
      manager.update<T>(
        id,
        typeof updates === "function"
          ? (prevToast) => retype(updates(prevToast))
          : retype(updates)
      )
    },
    promise: <Value,>(
      promise: Promise<Value>,
      stages: {
        loading: string | ToastOptions
        success: PromiseStage<Value>
        error: PromiseStage<unknown>
      }
    ) =>
      manager.promise(promise, {
        loading: toStageOptions(stages.loading, undefined),
        success: (value: Value) =>
          withTypeDefaults({ ...toStageOptions(stages.success, value), type: "success" }),
        error: (error: unknown) =>
          withTypeDefaults({ ...toStageOptions(stages.error, error), type: "error" }),
      }),
  }
}

/** The app-wide manager `<Toaster />` listens to by default. */
const toast = createToastManager()

/** The stock toast, painted with its type's tint (`data-type` carries the type). */
function Toast({ className, toast, ...props }: ToastPrimitive.Root.Props) {
  const type = getToastType(toast)
  return (
    <StockToast
      data-type={type}
      toast={toast}
      className={cn(toastVariants({ type }), className)}
      {...props}
    />
  )
}

const TOAST_ICONS = {
  success: IconCheck,
  info: IconInfoSmall,
  warning: IconExclamationMark,
  error: IconX,
  default: IconBell,
} as const

/** 32px white circle with a type-coloured border; a spinner while loading. */
function ToastIcon({ type }: { type: string | undefined }) {
  const Icon =
    type === "loading"
      ? IconLoader2
      : TOAST_ICONS[(type ?? "default") as ToastType] ?? IconBell

  return (
    <span
      data-slot="toast-icon"
      className="flex size-(--_toast-icon-size) shrink-0 items-center justify-center rounded-(--_toast-icon-radius) border border-current bg-(--_toast-icon) [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4.5"
    >
      <Icon
        // IconInfoSmall draws its glyph at half the height of the others (7 of 24 units, against the
        // 12–14 of the ! and ×), so it renders larger to match them, with a thinner stroke to keep the same weight.
        className={cn(type === "loading" && "animate-spin", type === "info" && "size-8")}
        stroke={type === "info" ? 1.2 : 2}
        aria-hidden="true"
      />
    </span>
  )
}

function ToastList() {
  const { toasts, close } = ToastPrimitive.useToastManager<ToastData>()

  return toasts.map((toastItem) => (
    <Toast key={toastItem.id} toast={toastItem}>
      <ToastContent>
        <ToastIcon type={toastItem.type} />
        <div className="flex min-w-0 flex-1 flex-col gap-1 pe-6">
          <ToastTitle />
          {(toastItem.description || toastItem.actionProps) && (
            <div className="text-body-5">
              <ToastDescription render={<span />} />
              {toastItem.description && toastItem.actionProps && " "}
              <ToastAction
                // Runs after the caller's onClick: close unless they prevented it.
                onClick={(event) => {
                  if (!event.defaultPrevented) close(toastItem.id)
                }}
              />
            </div>
          )}
        </div>
        <ToastClose />
      </ToastContent>
    </Toast>
  ))
}

/**
 * Mount once in the app root, then fire toasts with `toast.add`,
 * `toast.promise`, `toast.update` and `toast.close`.
 */
function Toaster({
  children,
  toastManager = toast,
  ...props
}: ToastPrimitive.Provider.Props) {
  return (
    <ToastProvider toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  )
}

const useToastManager = ToastPrimitive.useToastManager<ToastData>

export {
  Toaster,
  Toast,
  ToastAction,
  ToastClose,
  createToastManager,
  toast,
  toastVariants,
  useToastManager,
  TOAST_TIMEOUTS,
}
export type { ToastType, ToastPendingType, ToastData }
