import * as React from "react"
import {
  IconAlertCircle,
  IconCircleCheck,
  IconDownload,
  IconFileText,
  IconTrash,
  IconX,
} from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import {
  Attachment,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentError,
  AttachmentMedia,
  AttachmentProgress,
  AttachmentStatus,
  AttachmentTitle,
  type AttachmentUploadStatus,
} from "@/components/attachment"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { FieldDescription } from "@/components/field"
import { FileDropZone } from "@/components/file-drop-zone"
import { Spinner } from "@/components/spinner"
import { toast } from "@/components/toast"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

/**
 * Gets a presigned S3 PUT URL for one file, usually by calling the app's own
 * "prepare upload" mutation with the file's name and type. Called once per
 * file, and again on Retry, because presigned URLs expire. Return the URL as
 * the mutation gave it; FileUpload PUTs the file there with
 * `Content-Type: file.type`.
 */
export type FileUploadPresignFn = (file: File) => Promise<string>

/**
 * Runs once the PUT succeeds, e.g. to record the upload on the server. What it
 * returns becomes the field's value. Without it, the value is the presigned URL
 * minus its query string: the stored file's address.
 */
export type FileUploadOnUploadFinishedHandler<TValue = string> = (
  file: File,
  url: string
) => Promise<TValue>

export interface FileUploadOptions<TValue = string> {
  presign: FileUploadPresignFn
  onUploadFinished?: FileUploadOnUploadFinishedHandler<TValue>
}

/** What a card shows for a value saved earlier (one FileUpload didn't upload itself). */
export interface FileUploadFileInfo {
  name: string
  /** Bytes. */
  size?: number
  uploadedAt?: Date | string
  /** Shows the download action. */
  url?: string
}

export interface FileUploadBaseProps {
  /** Put on the drop zone, so a FieldLabel's htmlFor points at it. */
  id?: string
  name?: string
  /** Comma list of extensions or MIME types, as on a file input. */
  accept?: string
  /** Largest file allowed, in bytes. */
  maxSize?: number
  required?: boolean
  disabled?: boolean
  /** The error look, e.g. while the field has a validation error. */
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
  "aria-describedby"?: string
  /**
   * Help line under the drop zone, between it and the files (e.g. "PDF or DOCX, up to 28 MB").
   * Its id is `<id>-hint`. A refused file's message shows in its place.
   */
  hint?: React.ReactNode
  /** Shown when a picked file fails `accept` or `maxSize`. Defaults to a message naming the file. */
  invalidText?: string
  /** Ask in a ConfirmDialog before deleting a file (not when cancelling an upload). */
  confirmDelete?: boolean
  /** A "File deleted" toast with Undo after a delete. Needs `<Toaster />`. */
  deleteToast?: boolean
  /** The file input's native change event, for react-hook-form's `register`. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLElement>
  className?: string
}

/** TValue as given by uploadOptions; `value` and friends must match it, not decide it. */
type FromUpload<T> = [T][T extends unknown ? 0 : never]

/** No `uploadOptions`: the files stay in the browser and the value is `File[]`, like a file input. */
export interface FileUploadLocalProps {
  uploadOptions?: undefined
  multiple?: boolean
  value?: File[]
  defaultValue?: File[]
  onValueChange?: (files: File[]) => void
  describe?: undefined
}

/** With `uploadOptions` and one file: each file uploads as it's picked, and the value is what the upload returned. */
export interface FileUploadSingleProps<TValue> {
  uploadOptions: FileUploadOptions<TValue>
  multiple?: false
  value?: FromUpload<TValue> | null
  defaultValue?: FromUpload<TValue> | null
  onValueChange?: (value: FromUpload<TValue> | null) => void
  /** Name, size, date and link for a value saved earlier. Strings that are URLs are described without it. */
  describe?: (value: FromUpload<TValue>) => FileUploadFileInfo
}

export interface FileUploadMultipleProps<TValue> {
  uploadOptions: FileUploadOptions<TValue>
  multiple: true
  value?: FromUpload<TValue>[]
  defaultValue?: FromUpload<TValue>[]
  onValueChange?: (value: FromUpload<TValue>[]) => void
  describe?: (value: FromUpload<TValue>) => FileUploadFileInfo
}

export type FileUploadProps<TValue = string> = FileUploadBaseProps &
  (FileUploadLocalProps | FileUploadSingleProps<TValue> | FileUploadMultipleProps<TValue>)

// -----------------------------------------------------------------------------

const UPLOAD_FAILED = "Upload failed. Please try again."

const formatBytes = (b: number) =>
  b >= 1048576 ? `${Math.round(b / 1048576)} MB` : b >= 1024 ? `${Math.round(b / 1024)} KB` : `${b} B`

const formatDate = (d: Date | string) =>
  typeof d === "string"
    ? d
    : d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })

/** A URL's file name ("…/contract%20of%20sale.pdf?X-Amz-…" → "contract of sale.pdf"). */
function describeString(value: string): FileUploadFileInfo {
  try {
    const url = new URL(value)
    const last = url.pathname.split("/").filter(Boolean).pop()
    return { name: last ? decodeURIComponent(last) : value, url: value }
  } catch {
    return { name: value }
  }
}

function accepts(file: File, accept: string | undefined) {
  const rules = (accept ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
  if (!rules.length) return true
  const name = file.name.toLowerCase()
  return rules.some((r) =>
    r.startsWith(".") ? name.endsWith(r) : r.endsWith("/*") ? file.type.startsWith(r.slice(0, -1)) : file.type === r
  )
}

/** PUT the file to a presigned URL, reporting progress (0–100). Rejects on a non-2xx status or abort. */
function putFile(url: string, file: File, onProgress: (percent: number) => void, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("PUT", url)
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream")
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress((e.loaded / e.total) * 100)
    }
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`))
    xhr.onerror = () => reject(new Error("Upload network error"))
    xhr.onabort = () => reject(new DOMException("Upload cancelled", "AbortError"))
    signal.addEventListener("abort", () => xhr.abort())
    xhr.send(file)
  })
}

/** An upload in flight or failed. Once it succeeds, it leaves this list and its value joins the field's. */
type Pending = {
  key: string
  file: File
  status: "uploading" | "error"
  progress: number
}

export interface FileUploadCardProps {
  name: string
  /** Bytes. */
  size?: number
  /** No status: a file that isn't uploaded (FileUpload without uploadOptions). */
  status?: AttachmentUploadStatus
  /** 0–100, while `uploading`. */
  progress?: number
  /** Shown on an `uploaded` card: "Uploaded 12 Oct 2026". */
  uploadedAt?: Date | string
  /** Shows the download action. */
  url?: string
  /** The message on an `error` card. */
  error?: string
  /** The × while `uploading`. */
  onCancel?: () => void
  /** The Retry link on an `error` card. */
  onRetry?: () => void
  /** Shows the delete action. */
  onDelete?: () => void
  className?: string
}

type Card = FileUploadCardProps & { key: string }

let nextKey = 0
const newKey = () => `f${++nextKey}`

/** Icon-only card action with a tooltip; a download link when `href` is set. */
function CardAction({
  action,
  label,
  tooltip,
  href,
  onClick,
  children,
}: {
  action: "download" | "delete" | "cancel"
  label: string
  tooltip?: string
  href?: string
  onClick?: () => void
  children: React.ReactNode
}) {
  // Native elements, so the tooltip can anchor to them on React 18 too.
  const props = {
    "data-slot": "file-upload-action",
    "data-action": action,
    "aria-label": label,
    onClick,
    className:
      "flex size-(--_file-upload-action-size) shrink-0 cursor-pointer items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-2 focus-visible:ring-(--_file-upload-action-focus-ring) [&_svg]:size-(--_file-upload-action-icon-size) group-data-[size=sm]/attachment:[&_svg]:size-(--_file-upload-action-sm-icon-size) data-[action=download]:text-(--_file-upload-action-download-foreground) data-[action=download]:hover:text-(--_file-upload-action-download-hover-foreground) data-[action=delete]:text-(--_file-upload-action-delete-foreground) data-[action=delete]:hover:text-(--_file-upload-action-delete-hover-foreground) data-[action=cancel]:text-(--_file-upload-action-cancel-foreground) data-[action=cancel]:hover:text-(--_file-upload-action-cancel-hover-foreground)",
    children,
  }
  const element = href ? <a href={href} download {...props} /> : <button type="button" {...props} />
  if (!tooltip) return element
  return (
    <Tooltip>
      <TooltipTrigger delay={300} render={element} />
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

/**
 * One file, as FileUpload draws it: the uploaded card (size, date, download,
 * delete) or, while uploading, completed or failed, the compact card with the
 * status, progress bar, cancel and Retry. Also for listing files outside an
 * upload field.
 */
function FileUploadCard(card: FileUploadCardProps) {
  const { name, size, status, progress = 0 } = card
  const uploading = status === "uploading"
  const sizeText = size
    ? uploading
      ? `${formatBytes(Math.round((size * progress) / 100))} / ${formatBytes(size)}`
      : formatBytes(size)
    : null
  return (
    <Attachment
      status={status}
      // In flight, completed or failed: the compact card. Saved files and local files: the full one.
      size={status === "uploading" || status === "completed" || status === "error" ? "sm" : "default"}
      className={cn("w-full", card.className)}
      aria-label={name}
      role="group"
    >
      <AttachmentMedia>
        <IconFileText />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{name}</AttachmentTitle>
        <AttachmentDescription>
          {[
            sizeText,
            status === "uploaded" && card.uploadedAt ? `Uploaded ${formatDate(card.uploadedAt)}` : null,
          ]
            .filter(Boolean)
            .join(" · ")}
          {(uploading || status === "completed" || status === "error") && (
            <>
              <AttachmentStatus className={cn(sizeText && "ms-2")}>
                {uploading ? <Spinner variant="dots" aria-hidden /> : status === "completed" ? <IconCircleCheck /> : <IconAlertCircle />}
                {uploading ? "Uploading" : status === "completed" ? "Completed" : "Failed"}
              </AttachmentStatus>
            </>
          )}
        </AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions className="-me-1 gap-1 group-data-[size=sm]/attachment:-me-1.5 group-data-[size=sm]/attachment:-mt-1.5 group-data-[size=sm]/attachment:gap-0.5 group-data-[size=sm]/attachment:self-start">
        {uploading ? (
          <CardAction action="cancel" label={`Cancel upload of ${name}`} onClick={card.onCancel}>
            <IconX />
          </CardAction>
        ) : (
          <>
            {card.url && (
              <CardAction action="download" label={`Download ${name}`} tooltip="Download" href={card.url}>
                <IconDownload />
              </CardAction>
            )}
            {card.onDelete && (
              <CardAction action="delete" label={`Delete ${name}`} tooltip="Delete" onClick={card.onDelete}>
                <IconTrash />
              </CardAction>
            )}
          </>
        )}
      </AttachmentActions>
      {uploading && <AttachmentProgress value={Math.round(progress)} aria-label={`Uploading ${name}`} />}
      {status === "error" && <AttachmentError onRetry={card.onRetry}>{card.error ?? UPLOAD_FAILED}</AttachmentError>}
    </Attachment>
  )
}

// -----------------------------------------------------------------------------

function FileUploadImpl<TValue = string>(
  props: FileUploadProps<TValue>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const {
    id,
    name,
    accept,
    maxSize,
    required,
    disabled,
    hint,
    invalidText,
    confirmDelete,
    deleteToast,
    onChange,
    onBlur,
    className,
    uploadOptions,
    multiple = false,
  } = props
  const uploads = !!uploadOptions
  // Every value is handled as a list: File[] without uploadOptions, TValue[] with it.
  type Item = File | TValue
  const toList = (v: unknown): Item[] => (Array.isArray(v) ? v : v == null ? [] : [v as TValue])
  const controlled = props.value !== undefined
  const [internal, setInternal] = React.useState<Item[]>(() => toList(props.defaultValue))
  const committed = controlled ? toList(props.value) : internal
  const committedRef = React.useRef(committed)
  committedRef.current = committed

  const [pending, setPending] = React.useState<Pending[]>([])
  const [invalid, setInvalid] = React.useState("")
  const [toDelete, setToDelete] = React.useState<Item | null>(null)
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const controllers = React.useRef(new Map<string, AbortController>())
  // Files uploaded in this session, by the value they produced: their cards say "Completed" and show the size.
  const fresh = React.useRef(new Map<Item, File>())
  // Set while FileUpload writes to the file input itself, so its change event isn't read as a new pick.
  const syncing = React.useRef(false)

  React.useEffect(() => {
    const live = controllers.current
    return () => live.forEach((c) => c.abort())
  }, [])

  const commit = (next: Item[]) => {
    committedRef.current = next
    if (!controlled) setInternal(next)
    const onValueChange = props.onValueChange as ((v: unknown) => void) | undefined
    onValueChange?.(!uploads || multiple ? next : (next[0] ?? null))
  }

  // Without uploadOptions the file input holds the files, so a plain form submit or FormData sends them.
  const writeInput = (files: File[], notify: boolean) => {
    const input = inputRef.current
    if (!input || typeof DataTransfer === "undefined") return
    const dt = new DataTransfer()
    files.forEach((f) => dt.items.add(f))
    input.files = dt.files
    if (notify && onChange) {
      syncing.current = true
      input.dispatchEvent(new Event("change", { bubbles: true }))
      syncing.current = false
    }
  }
  React.useEffect(() => {
    if (uploads) return
    const input = inputRef.current
    const files = committed as File[]
    const same = input?.files && input.files.length === files.length && files.every((f, i) => input.files![i] === f)
    if (!same) writeInput(files, false)
  })

  const patch = (key: string, p: Partial<Pending>) =>
    setPending((list) => list.map((x) => (x.key === key ? { ...x, ...p } : x)))

  const upload = async (item: Pending) => {
    if (!uploadOptions) return
    controllers.current.get(item.key)?.abort()
    const controller = new AbortController()
    controllers.current.set(item.key, controller)
    patch(item.key, { status: "uploading", progress: 0 })
    try {
      const url = await uploadOptions.presign(item.file)
      if (controller.signal.aborted) return
      await putFile(url, item.file, (p) => patch(item.key, { progress: p }), controller.signal)
      const value = uploadOptions.onUploadFinished
        ? await uploadOptions.onUploadFinished(item.file, url)
        : (url.split("?")[0] as TValue)
      if (controller.signal.aborted) return
      fresh.current.set(value, item.file)
      setPending((list) => list.filter((x) => x.key !== item.key))
      commit(multiple ? [...committedRef.current, value] : [value])
    } catch {
      if (!controller.signal.aborted) patch(item.key, { status: "error" })
    } finally {
      if (controllers.current.get(item.key) === controller) controllers.current.delete(item.key)
    }
  }

  const cancel = (key: string) => {
    controllers.current.get(key)?.abort()
    controllers.current.delete(key)
    setPending((list) => list.filter((x) => x.key !== key))
  }

  /** Files picked or dropped: check them, then keep them (no uploadOptions) or start uploading. */
  const add = (picked: File[]) => {
    if (disabled || !picked.length) return
    const tooBig = (f: File) => maxSize != null && f.size > maxSize
    const ok = picked.filter((f) => accepts(f, accept) && !tooBig(f))
    const bad = picked.find((f) => !ok.includes(f))
    setInvalid(
      bad
        ? (invalidText ??
            (tooBig(bad)
              ? `${bad.name} is larger than ${formatBytes(maxSize!)}.`
              : `${bad.name} isn't an accepted file type.`))
        : ""
    )
    const chosen = multiple ? ok : ok.slice(0, 1)
    if (!chosen.length) return
    if (!uploads) {
      const next = multiple ? [...(committedRef.current as File[]), ...chosen] : chosen
      writeInput(next, false)
      commit(next)
      return
    }
    const items = chosen.map((file): Pending => ({ key: newKey(), file, status: "uploading", progress: 0 }))
    if (!multiple) pending.forEach((p) => cancel(p.key))
    setPending((list) => (multiple ? [...list, ...items] : items))
    items.forEach(upload)
  }

  const remove = (item: Item) => {
    const before = committedRef.current
    const index = before.indexOf(item)
    if (index < 0) return
    const next = before.filter((x) => x !== item)
    if (!uploads) writeInput(next as File[], true)
    commit(next)
    if (!deleteToast) return
    const label = item instanceof File ? item.name : infoOf(item as TValue).name
    toast.add({
      type: "success",
      title: "File deleted",
      description: `${label} was removed.`,
      actionProps: {
        children: "Undo",
        onClick: () => {
          const now = committedRef.current
          if (now.includes(item)) return
          const restored = multiple || !uploads ? [...now] : []
          restored.splice(Math.min(index, restored.length), 0, item)
          if (!uploads) writeInput(restored as File[], true)
          commit(restored)
        },
      },
    })
  }
  const requestRemove = (item: Item) => {
    if (!confirmDelete) return remove(item)
    setToDelete(item)
    setConfirmOpen(true)
  }

  const infoOf = (value: TValue): FileUploadFileInfo => {
    const describe = props.describe as ((v: TValue) => FileUploadFileInfo) | undefined
    if (describe) return describe(value)
    return typeof value === "string" ? describeString(value) : { name: "File" }
  }

  const cards: Card[] = [
    ...committed.map((item, i): Card => {
      if (item instanceof File) {
        return { key: `c${i}-${item.name}`, name: item.name, size: item.size, onDelete: () => requestRemove(item) }
      }
      const info = infoOf(item as TValue)
      const file = fresh.current.get(item)
      return {
        key: `c${i}-${info.name}`,
        name: file?.name ?? info.name,
        size: file?.size ?? info.size,
        status: file ? "completed" : "uploaded",
        uploadedAt: info.uploadedAt,
        url: info.url,
        onDelete: () => requestRemove(item),
      }
    }),
    ...pending.map(
      (p): Card => ({
        key: p.key,
        name: p.file.name,
        size: p.file.size,
        status: p.status,
        progress: p.progress,
        onCancel: () => cancel(p.key),
        onRetry: () => upload(p),
        onDelete: () => cancel(p.key),
      })
    ),
  ]

  // One file: its card takes the drop zone's place; deleting it brings the zone back.
  const zoneHidden = !multiple && cards.length > 0
  const isInvalid = !!invalid || (props["aria-invalid"] != null && props["aria-invalid"] !== false && props["aria-invalid"] !== "false")
  const generatedId = React.useId()
  const hintId = `${id ?? generatedId}-hint`
  const showHint = !zoneHidden && (!!invalid || hint != null)
  const describedBy = [props["aria-describedby"], showHint ? hintId : null].filter(Boolean).join(" ") || undefined

  return (
    <div data-slot="file-upload" className={cn("flex w-full flex-col gap-(--_file-upload-gap)", className)}>
      {!zoneHidden && (
        <FileDropZone
          id={id}
          multiple={multiple}
          disabled={disabled}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy}
          onClick={() => inputRef.current?.click()}
          onBlur={onBlur}
          onFilesDropped={add}
        />
      )}
      <input
        ref={(el) => {
          inputRef.current = el
          if (typeof ref === "function") ref(el)
          else if (ref) ref.current = el
        }}
        type="file"
        name={uploads ? undefined : name}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        required={required && committed.length === 0 && pending.length === 0}
        tabIndex={-1}
        aria-hidden
        className="sr-only"
        onChange={(e) => {
          if (!syncing.current) {
            add(Array.from(e.target.files ?? []))
            // With uploadOptions the input only picks; clear it so the same file can be picked again.
            if (uploads) e.target.value = ""
          }
          onChange?.(e)
        }}
      />
      {uploads &&
        name &&
        committed.map((v, i) => (
          <input key={i} type="hidden" name={name} value={typeof v === "string" ? v : JSON.stringify(v)} />
        ))}
      {showHint &&
        (invalid ? (
          <p id={hintId} role="alert" data-slot="file-upload-message" className="text-body-5 text-(--_file-upload-message-foreground)">
            {invalid}
          </p>
        ) : (
          <FieldDescription id={hintId} className={cn(disabled && "opacity-50")}>
            {hint}
          </FieldDescription>
        ))}
      {cards.length > 0 && (
        <div data-slot="file-upload-list" className="mt-1 flex flex-col gap-(--_file-upload-list-gap)">
          {cards.map(({ key, ...card }) => (
            <FileUploadCard key={key} {...card} />
          ))}
        </div>
      )}
      {confirmDelete && (
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          destructive
          size="md"
          icon={<IconTrash />}
          title="Delete this file?"
          description={
            toDelete != null ? (
              <>
                <span className="font-semibold">
                  {toDelete instanceof File ? toDelete.name : infoOf(toDelete as TValue).name}
                </span>{" "}
                will be removed.
              </>
            ) : null
          }
          actionLabel="Delete"
          onAction={() => {
            if (toDelete != null) remove(toDelete)
          }}
        />
      )}
    </div>
  )
}

/**
 * A file field: a drop zone, a hidden file input, and a card per file.
 *
 * Without `uploadOptions` it behaves like `<input type="file">`: the value is
 * `File[]`, and `name` puts the files in a plain form submit or FormData. The
 * ref is the file input's, so react-hook-form's `register` works.
 *
 * With `uploadOptions`, each file uploads as soon as it's picked: `presign`
 * gets a URL, FileUpload PUTs the file there (progress bar, cancel, Retry), and
 * the value is what `onUploadFinished` returns (or the file's URL). One file
 * gives `TValue | null`, `multiple` gives `TValue[]`. With `name`, the values
 * also go into hidden inputs. The value only changes once an upload finishes,
 * so a required check blocks submit while one is still running.
 *
 * Levers: src/tokens/components/file-upload.css, file-drop-zone.css and the
 * attachment-status/progress/error levers in attachment.css.
 */
type RefProp = { ref?: React.Ref<HTMLInputElement> }

// One signature per mode, so a callback like onValueChange gets its type from the mode in use.
const FileUpload = React.forwardRef(FileUploadImpl) as {
  <TValue = string>(props: FileUploadBaseProps & FileUploadMultipleProps<TValue> & RefProp): React.ReactElement
  <TValue = string>(props: FileUploadBaseProps & FileUploadSingleProps<TValue> & RefProp): React.ReactElement
  (props: FileUploadBaseProps & FileUploadLocalProps & RefProp): React.ReactElement
}

export { FileUpload, FileUploadCard }
