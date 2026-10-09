import * as React from "react"
import { cva } from "class-variance-authority"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import {
  IconAlertCircle,
  IconCircleCheck,
  IconFileText,
  IconFileUpload,
  IconTrash,
  IconX,
} from "@tabler/icons-react"

import { cn } from "../lib/utils"
import { ProgressIndicator, ProgressTrack } from "./ui/progress"
import { Spinner } from "./ui/spinner"

export type AttachmentStatus = "uploading" | "completed" | "error"

export interface AttachmentFile {
  name: string
  /** Bytes */
  size: number
  status?: AttachmentStatus
  /** 0–100 */
  progress?: number
  error?: string
}

export interface AttachmentUploadHandlers {
  onProgress: (percent: number) => void
  onDone: () => void
  onError: (message: string) => void
}

const formatBytes = (b: number) =>
  b >= 1048576
    ? `${Math.round(b / 1048576)} MB`
    : b >= 1024
      ? `${Math.round(b / 1024)} KB`
      : `${b} B`

// -----------------------------------------------------------------------------
// FileUploadCard
// -----------------------------------------------------------------------------

export interface FileUploadCardProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  name: string
  /** Bytes */
  size?: number
  /** 0–100 */
  progress?: number
  status?: AttachmentStatus
  error?: string
  /** × while uploading */
  onCancel?: () => void
  /** Trash when completed or failed */
  onRemove?: () => void
  /** Shows a Retry action on failed cards */
  onRetry?: () => void
}

function FileUploadCard({
  name,
  size = 0,
  progress = 0,
  status = "uploading",
  error = "Upload failed. Please try again.",
  onCancel,
  onRemove,
  onRetry,
  className,
  ...props
}: FileUploadCardProps) {
  const uploading = status === "uploading"
  const done = status === "completed"
  const failed = status === "error"
  const loaded = done ? size : Math.round((size * progress) / 100)

  return (
    <div
      role="group"
      aria-label={name}
      data-slot="file-upload-card"
      data-status={status}
      className={cn(
        "flex w-full flex-col gap-3 rounded-lg border bg-white p-4 shadow-xs",
        failed ? "border-error-75" : "border-dark-15",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-mint-l3 text-mint-60">
          <IconFileText className="size-4.5" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-body-sm font-semibold text-navy">
            {name}
          </span>
          <span className="flex flex-wrap items-center gap-2 text-caption-sm text-dark-60">
            <span>
              {done
                ? formatBytes(size)
                : `${formatBytes(loaded)} / ${formatBytes(size)}`}
            </span>
            {uploading && (
              <span className="inline-flex items-center gap-1 text-dark-75">
                <Spinner size="sm" variant="dots" label="Uploading" />
                Uploading
              </span>
            )}
            {done && (
              <span className="inline-flex items-center gap-1 text-mint-60">
                <IconCircleCheck className="size-3.5" />
                Completed
              </span>
            )}
            {failed && (
              <span className="inline-flex items-center gap-1 text-error-75">
                <IconAlertCircle className="size-3.5" />
                Failed
              </span>
            )}
          </span>
        </div>
        <button
          type="button"
          aria-label={uploading ? `Cancel upload of ${name}` : `Remove ${name}`}
          onClick={uploading ? onCancel : onRemove}
          className="-me-1 -mt-1 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-dark-60 outline-none hover:bg-light-l1 hover:text-dark-90 focus-visible:ring-2 focus-visible:ring-mint-45"
        >
          {uploading ? (
            <IconX className="size-4" />
          ) : (
            <IconTrash className="size-4" />
          )}
        </button>
      </div>
      {uploading && (
        <ProgressPrimitive.Root
          value={Math.round(progress)}
          aria-label={`Uploading ${name}`}
        >
          <ProgressTrack className="h-1.5 bg-mint-l2">
            <ProgressIndicator className="rounded-full bg-mint-60" />
          </ProgressTrack>
        </ProgressPrimitive.Root>
      )}
      {failed && (
        <div className="flex items-center justify-between gap-3 text-caption text-error-75">
          <span>{error}</span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="cursor-pointer font-semibold text-error-75 hover:underline"
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Attachment
// -----------------------------------------------------------------------------

const dropZoneVariants = cva(
  "flex min-h-26 items-center justify-center gap-2.5 rounded-lg border border-dashed p-4 text-center text-body-md outline-none transition-all duration-150",
  {
    variants: {
      state: {
        default:
          "group cursor-pointer border-dark-15 bg-white text-dark-90 hover:border-mint-45 hover:bg-mint-l3 hover:text-mint-75 focus-visible:border-mint-45 focus-visible:ring-3 focus-visible:ring-mint-45/30",
        dragging: "cursor-copy border-mint-45 bg-mint-l3 text-mint-75",
        error:
          "cursor-pointer border-error-75 bg-error-l1 text-dark-90 focus-visible:ring-3 focus-visible:ring-error-75/20",
        disabled: "cursor-not-allowed border-dark-15 bg-light-l1 text-dark-45",
      },
    },
    defaultVariants: { state: "default" },
  }
)

const dropZoneIconVariants = cva("size-5 shrink-0", {
  variants: {
    state: {
      default: "text-mint-60 group-hover:text-mint-75",
      dragging: "text-mint-75",
      error: "text-dark-90",
      disabled: "text-dark-45",
    },
  },
  defaultVariants: { state: "default" },
})

type AttachmentItem = AttachmentFile & { id: string; file?: File }

export interface AttachmentProps {
  label?: React.ReactNode
  /** Appends "(optional)" to the label. */
  optional?: boolean
  /** Helper line under the drop zone. */
  hint?: React.ReactNode
  /** Comma list of extensions or MIME types. Default ".pdf,.docx". */
  accept?: string
  /** Bytes. Default 28 MB. */
  maxSize?: number
  /**
   * true (default) = keep the drop zone and stack a card per file below it.
   * false = single upload: the file card replaces the drop zone; removing it brings the zone back.
   */
  multiple?: boolean
  disabled?: boolean
  /** External error message; puts the zone in its error state. */
  error?: string
  /** Message shown when a dropped file fails `accept` / `maxSize`. */
  invalidText?: string
  /** Files already attached (shown as Completed). */
  defaultFiles?: AttachmentFile[]
  onFilesChange?: (files: AttachmentFile[]) => void
  /** Real upload hook. Omit to simulate progress (useful for prototypes and stories). */
  onUpload?: (file: File, handlers: AttachmentUploadHandlers) => void
  className?: string
}

/** Labelled drop zone + file list with upload progress, retry and remove. */
function Attachment({
  label = "Attachments",
  optional = true,
  hint = "PDF or DOCX. Maximum file size 28 MB.",
  accept = ".pdf,.docx",
  maxSize = 28 * 1024 * 1024,
  multiple = true,
  disabled = false,
  error,
  invalidText = "Choose a PDF or DOCX file under 28 MB.",
  defaultFiles = [],
  onFilesChange,
  onUpload,
  className,
}: AttachmentProps) {
  const [files, setFiles] = React.useState<AttachmentItem[]>(() =>
    defaultFiles.map((f, i) => ({
      id: `d${i}`,
      status: "completed",
      progress: 100,
      ...f,
    }))
  )
  const [dragging, setDragging] = React.useState(false)
  const [invalid, setInvalid] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const timers = React.useRef<Record<string, ReturnType<typeof setInterval>>>(
    {}
  )
  const mounted = React.useRef(false)
  const uid = React.useId()

  React.useEffect(
    () => () => Object.values(timers.current).forEach(clearInterval),
    []
  )
  React.useEffect(() => {
    if (mounted.current) {
      onFilesChange?.(
        files.map(({ name, size, status, progress, error }) => ({
          name,
          size,
          status,
          progress,
          error,
        }))
      )
    } else {
      mounted.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files])

  const patch = (id: string, p: Partial<AttachmentItem>) =>
    setFiles((fs) => fs.map((f) => (f.id === id ? { ...f, ...p } : f)))

  const start = (item: AttachmentItem) => {
    patch(item.id, { status: "uploading", progress: 0, error: undefined })
    if (onUpload && item.file) {
      onUpload(item.file, {
        onProgress: (p) => patch(item.id, { progress: p }),
        onDone: () => patch(item.id, { status: "completed", progress: 100 }),
        onError: (msg) => patch(item.id, { status: "error", error: msg }),
      })
      return
    }
    // No upload hook — simulate progress.
    clearInterval(timers.current[item.id])
    timers.current[item.id] = setInterval(() => {
      setFiles((fs) =>
        fs.map((x) => {
          if (x.id !== item.id) return x
          const p = Math.min(100, (x.progress ?? 0) + 8 + Math.random() * 14)
          if (p >= 100) {
            clearInterval(timers.current[item.id])
            return { ...x, progress: 100, status: "completed" }
          }
          return { ...x, progress: p }
        })
      )
    }, 250)
  }

  const accepts = (file: File) => {
    const rules = accept
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
    const name = file.name.toLowerCase()
    const okType =
      !rules.length ||
      rules.some((r) =>
        r.startsWith(".")
          ? name.endsWith(r)
          : r.endsWith("/*")
            ? file.type.startsWith(r.slice(0, -1))
            : file.type === r
      )
    return okType && file.size <= maxSize
  }

  const add = (list: FileList | null) => {
    if (disabled) return
    const arr = Array.from(list ?? [])
    if (!arr.length) return
    const ok = arr.filter(accepts)
    setInvalid(ok.length < arr.length ? invalidText : "")
    const items: AttachmentItem[] = (multiple ? ok : ok.slice(0, 1)).map(
      (file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        size: file.size,
        file,
        status: "uploading",
        progress: 0,
      })
    )
    if (!items.length) return
    if (!multiple) Object.values(timers.current).forEach(clearInterval)
    setFiles((fs) => (multiple ? [...fs, ...items] : items))
    items.forEach(start)
  }

  const remove = (id: string) => {
    clearInterval(timers.current[id])
    setFiles((fs) => fs.filter((f) => f.id !== id))
  }
  const browse = () => {
    if (!disabled) inputRef.current?.click()
  }

  const err = error || invalid
  const state = disabled
    ? "disabled"
    : dragging
      ? "dragging"
      : err
        ? "error"
        : "default"
  const single = !multiple && files.length > 0
  const first = files[0]

  const card = (f: AttachmentItem) => (
    <FileUploadCard
      key={f.id}
      name={f.name}
      size={f.size}
      progress={f.progress}
      status={f.status}
      error={f.error}
      onCancel={() => remove(f.id)}
      onRemove={() => remove(f.id)}
      onRetry={() => start(f)}
    />
  )

  return (
    <div
      data-slot="attachment"
      className={cn("flex w-full flex-col gap-2", className)}
    >
      {label && (
        <label
          htmlFor={`${uid}-input`}
          className={cn(
            "text-body-sm leading-tight font-semibold",
            disabled ? "text-dark-45" : "text-navy"
          )}
        >
          {label}
          {optional && (
            <span
              className={cn(
                "ms-1 font-normal",
                disabled ? "text-dark-45" : "text-dark-60"
              )}
            >
              (optional)
            </span>
          )}
        </label>
      )}
      {single ? (
        card(first)
      ) : (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || undefined}
          aria-describedby={`${uid}-hint`}
          aria-label={
            typeof label === "string"
              ? `${label}: drop files or browse`
              : "Drop files or browse"
          }
          onClick={browse}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              browse()
            }
          }}
          onDragEnter={(e) => {
            e.preventDefault()
            if (!disabled) setDragging(true)
          }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null))
              setDragging(false)
          }}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            add(e.dataTransfer.files)
          }}
          className={dropZoneVariants({ state })}
        >
          <IconFileUpload className={dropZoneIconVariants({ state })} />
          <span>
            Drop files or{" "}
            <span
              className={cn(
                "font-semibold",
                disabled ? "text-dark-45" : "text-mint-75"
              )}
            >
              browse
            </span>
          </span>
        </div>
      )}
      <input
        ref={inputRef}
        id={`${uid}-input`}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          add(e.target.files)
          e.target.value = ""
        }}
        className="hidden"
      />
      {(!single || err) && (
        <span
          id={`${uid}-hint`}
          role={err ? "alert" : undefined}
          className={cn(
            "text-body-sm",
            err ? "text-error-75" : disabled ? "text-dark-45" : "text-dark-60"
          )}
        >
          {err || hint}
        </span>
      )}
      {!single && files.length > 0 && (
        <div className="mt-1 flex flex-col gap-2">{files.map(card)}</div>
      )}
    </div>
  )
}

export { Attachment, FileUploadCard, dropZoneVariants }
