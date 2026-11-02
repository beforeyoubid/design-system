import * as React from "react"
import { IconFileUpload } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

export interface FileDropZoneProps extends Omit<React.ComponentProps<"button">, "onDrop"> {
  /** Files dropped on the zone. Clicks call `onClick` as usual; FileUpload opens its file input there. */
  onFilesDropped?: (files: File[]) => void
  /** "Drop files or browse"; without it, "Drop a file or browse". */
  multiple?: boolean
}

/**
 * The dashed "drop files or browse" box. A button, so a FieldLabel can point at
 * it and it takes focus and Enter like any control; set `aria-invalid` for its
 * error look. It only reports drops; FileUpload checks and uploads them.
 * Component tokens: src/tokens/components/file-drop-zone.css.
 */
function FileDropZone({
  className,
  children,
  disabled,
  multiple = false,
  onFilesDropped,
  ...props
}: FileDropZoneProps) {
  const [dragging, setDragging] = React.useState(false)
  return (
    <button
      type="button"
      data-slot="file-drop-zone"
      data-dragging={dragging || undefined}
      data-disabled={disabled || undefined}
      disabled={disabled}
      onDragEnter={(e) => {
        e.preventDefault()
        if (!disabled) setDragging(true)
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        if (!disabled) onFilesDropped?.(Array.from(e.dataTransfer.files))
      }}
      className={cn(
        "group/file-drop-zone flex min-h-(--_file-drop-zone-min-height) w-full cursor-pointer items-center justify-center gap-(--_file-drop-zone-gap) rounded-(--_file-drop-zone-radius) border border-dashed border-(--_file-drop-zone-border) bg-(--_file-drop-zone) p-(--_file-drop-zone-padding) text-center text-body-4 text-(--_file-drop-zone-foreground) outline-none transition-all duration-150",
        "hover:border-(--_file-drop-zone-hover-border) hover:bg-(--_file-drop-zone-hover) hover:text-(--_file-drop-zone-hover-foreground) focus-visible:border-(--_file-drop-zone-hover-border) focus-visible:ring-3 focus-visible:ring-(--_file-drop-zone-focus-ring)",
        "data-dragging:cursor-copy data-dragging:border-(--_file-drop-zone-hover-border) data-dragging:bg-(--_file-drop-zone-hover) data-dragging:text-(--_file-drop-zone-hover-foreground)",
        "aria-invalid:border-(--_file-drop-zone-invalid-border) aria-invalid:bg-(--_file-drop-zone-invalid) aria-invalid:text-(--_file-drop-zone-foreground) aria-invalid:focus-visible:ring-(--_file-drop-zone-invalid-focus-ring)",
        "data-disabled:cursor-not-allowed data-disabled:border-(--_file-drop-zone-border) data-disabled:bg-(--_file-drop-zone-disabled) data-disabled:text-(--_file-drop-zone-disabled-foreground)",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <IconFileUpload
            data-slot="file-drop-zone-icon"
            className="size-5 shrink-0 text-(--_file-drop-zone-icon-foreground) group-hover/file-drop-zone:text-(--_file-drop-zone-icon-hover-foreground) group-data-dragging/file-drop-zone:text-(--_file-drop-zone-icon-hover-foreground) group-aria-invalid/file-drop-zone:text-(--_file-drop-zone-foreground) group-data-disabled/file-drop-zone:text-(--_file-drop-zone-disabled-foreground)"
          />
          <span>
            {multiple ? "Drop files or " : "Drop a file or "}
            <span
              data-slot="file-drop-zone-browse"
              className="font-(--_file-drop-zone-browse-font-weight) text-(--_file-drop-zone-browse-foreground) group-data-disabled/file-drop-zone:text-(--_file-drop-zone-disabled-foreground)"
            >
              browse
            </span>
          </span>
        </>
      )}
    </button>
  )
}

export { FileDropZone }
