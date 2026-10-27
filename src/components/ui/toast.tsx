import * as React from "react"
import {
  Toast as ToastPrimitive,
  type ToastManagerAddOptions,
  type ToastManagerUpdateOptions,
} from "@base-ui/react/toast"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

import {
  IconX,
  IconCheck,
  IconInfoSmall,
  IconExclamationMark,
  IconBell,
  IconLoader2,
} from "@tabler/icons-react"

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
      success: "bg-mint-l3 text-mint-60",
      warning: "bg-warning-l3 text-warning-60",
      error: "bg-error-l1 text-error-60",
      info: "bg-mint-l4 text-mint-75",
      default: "bg-light-l2 text-navy",
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
  const manager = ToastPrimitive.createToastManager<ToastData>()
  return {
    ...manager,
    add: (options: ToastManagerAddOptions<ToastData>) =>
      manager.add(withTypeDefaults(options)),
    update: (id: string, updates: ToastOptions) =>
      manager.update(id, updates.type ? withTypeDefaults(updates) : updates),
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

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        // Mobile: full width at the bottom. Desktop (md+): bottom-right, 440px.
        "pointer-events-none fixed inset-x-4 bottom-4 z-50 outline-none sm:inset-x-6 sm:bottom-6 md:start-auto md:w-110",
        className
      )}
      {...props}
    />
  )
}

function Toast({ className, toast, ...props }: ToastPrimitive.Root.Props) {
  const type = getToastType(toast)
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      data-type={type}
      toast={toast}
      className={cn(
        "group/toast pointer-events-auto absolute end-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom rounded-2xl font-sans will-change-transform outline-none select-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        toastVariants({ type }),
        "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]",
        "h-(--height) [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]",
        "after:absolute after:top-full after:start-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
        "data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
        "data-limited:opacity-0 data-starting-style:[transform:translateY(150%)]",
        "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
        "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        "data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        className
      )}
      {...props}
    />
  )
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn(
        "relative flex h-full items-center gap-2 overflow-hidden px-2 py-3 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-body-5 font-semibold", className)}
      {...props}
    />
  )
}

function ToastDescription({
  className,
  ...props
}: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-body-5 text-dark-90", className)}
      {...props}
    />
  )
}

/** Inline text link in the type's colour, e.g. "Undo". Never a filled button. */
function ToastAction({ className, ...props }: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      className={cn(
        "inline cursor-pointer font-semibold underline underline-offset-3",
        className
      )}
      {...props}
    />
  )
}

function ToastClose({
  className,
  children,
  ...props
}: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close toast"
      className={cn(
        "absolute end-2 top-2 flex cursor-pointer p-1 transition-colors after:absolute after:-inset-2 after:content-[''] hover:text-navy [&_svg:not([class*='size-'])]:size-4.5",
        className
      )}
      {...props}
    >
      {children ?? (
        <IconX aria-hidden="true" />
      )}
    </ToastPrimitive.Close>
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
      className="flex size-8 shrink-0 items-center justify-center rounded-full border border-current bg-white [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4.5"
    >
      <Icon
        className={cn(type === "loading" && "animate-spin")}
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
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  toast,
  toastVariants,
  useToastManager,
  TOAST_TIMEOUTS,
}
export type { ToastType, ToastPendingType, ToastData }
