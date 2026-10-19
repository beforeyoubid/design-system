import * as React from "react"
import { IconCalendar, IconChevronDown } from "@tabler/icons-react"
import { Clock } from "lucide-react"

import { cn } from "../lib/utils"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

const controlClasses =
  "h-10 rounded-lg border border-dark-15 bg-white text-body-5 text-dark-100 outline-none transition-all focus-visible:border-mint-45 focus-visible:ring-3 focus-visible:ring-mint-45/30 disabled:cursor-not-allowed disabled:bg-light-l2"

/** Popover trigger shared by the date and time pickers (mint when open). */
const triggerClasses = cn(
  controlClasses,
  "group flex cursor-pointer items-center justify-between gap-2 px-3 text-start data-popup-open:border-mint-45 data-popup-open:bg-mint-l4 data-popup-open:ring-3 data-popup-open:ring-mint-45/30"
)

const popoverClasses = "w-auto rounded-lg border-light-l3 p-0 shadow-md"

function TriggerText({ text, placeholder }: { text: string; placeholder: string }) {
  return (
    <span
      className={cn(
        "truncate",
        text ? "text-dark-100 group-data-popup-open:text-mint-75" : "text-dark-90"
      )}
    >
      {text || placeholder}
    </span>
  )
}

function useControllableOpen(
  openProp: boolean | undefined,
  onOpenChange?: (open: boolean) => void
) {
  const [openState, setOpenState] = React.useState(false)
  const open = openProp ?? openState
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next)
    onOpenChange?.(next)
  }
  return [open, setOpen] as const
}

// =============================================================================
// TimePicker
// =============================================================================

const pad = (n: number) => String(n).padStart(2, "0")

function parseTime(value?: string) {
  const [h, m, s] = (value ?? "").split(":").map((p) => Number.parseInt(p, 10))
  return {
    hour: Number.isFinite(h) ? h : undefined,
    minute: Number.isFinite(m) ? m : undefined,
    second: Number.isFinite(s) ? s : undefined,
  }
}

export interface TimePickerProps {
  /** "HH:MM" or "HH:MM:SS" (24-hour). Seconds are shown when the value has them or `withSeconds` is set. */
  value?: string
  onChange?: (time: string) => void
  placeholder?: string
  /** Show a seconds column. Defaults to true when `value` includes seconds. */
  withSeconds?: boolean
  /** Minute (and second) increment. Default 1. */
  minuteStep?: number
  disabled?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Classes for the trigger. Default width `w-32`. */
  className?: string
  "aria-label"?: string
}

function TimeColumn({
  label,
  count,
  step = 1,
  selected,
  onSelect,
}: {
  label: string
  count: number
  step?: number
  selected?: number
  onSelect: (n: number) => void
}) {
  const listRef = React.useRef<HTMLDivElement>(null)

  // Bring the selected value into view when the popover opens.
  React.useEffect(() => {
    const list = listRef.current
    const item = list?.querySelector<HTMLElement>("[data-selected=true]")
    // Scroll only this column (scrollIntoView would also move the popover).
    if (list && item)
      list.scrollTop = item.offsetTop - (list.clientHeight - item.offsetHeight) / 2
  }, [])

  const values = Array.from({ length: Math.ceil(count / step) }, (_, i) => i * step)
  // Roving tabindex: only one option is tabbable (the selected one, else the
  // first), so the popover's initial focus lands on the current value.
  const focusValue = values.includes(selected ?? -1) ? selected : values[0]

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const options = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>("[role=option]")
    )
    const i = options.indexOf(document.activeElement as HTMLButtonElement)
    const next =
      e.key === "ArrowDown" ? i + 1
      : e.key === "ArrowUp" ? i - 1
      : e.key === "Home" ? 0
      : e.key === "End" ? options.length - 1
      : null
    if (next === null || i === -1) return
    e.preventDefault()
    options[Math.max(0, Math.min(options.length - 1, next))]?.focus()
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="px-2 text-center text-overline text-dark-90">{label}</span>
      <div
        ref={listRef}
        role="listbox"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="relative flex h-56 w-14 flex-col gap-0.5 overflow-y-auto overscroll-contain scrollbar-none px-1"
      >
        {values.map((n) => {
          const isSelected = n === selected
          return (
            <button
              key={n}
              type="button"
              role="option"
              aria-selected={isSelected}
              data-selected={isSelected}
              tabIndex={n === focusValue ? 0 : -1}
              onClick={() => onSelect(n)}
              className="flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-body-5 text-dark-90 outline-none hover:bg-light-l2 focus-visible:ring-3 focus-visible:ring-mint-45/30 data-[selected=true]:bg-lime data-[selected=true]:font-medium data-[selected=true]:text-navy"
            >
              {pad(n)}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** 40px trigger that opens a popover with hour / minute (/ second) columns. */
function TimePicker({
  value,
  onChange,
  placeholder = "Select a time",
  withSeconds,
  minuteStep = 1,
  disabled = false,
  open: openProp,
  onOpenChange,
  className,
  "aria-label": ariaLabel = "Time",
}: TimePickerProps) {
  const [open, setOpen] = useControllableOpen(openProp, onOpenChange)
  const { hour, minute, second } = parseTime(value)
  const showSeconds = withSeconds ?? second !== undefined

  const emit = (next: { hour?: number; minute?: number; second?: number }) => {
    const h = next.hour ?? hour ?? 0
    const m = next.minute ?? minute ?? 0
    const s = next.second ?? second ?? 0
    onChange?.(showSeconds ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(h)}:${pad(m)}`)
  }

  const text =
    hour === undefined
      ? ""
      : showSeconds
        ? `${pad(hour)}:${pad(minute ?? 0)}:${pad(second ?? 0)}`
        : `${pad(hour)}:${pad(minute ?? 0)}`

  return (
    <Popover open={open} onOpenChange={(next) => setOpen(next)}>
      <PopoverTrigger
        disabled={disabled}
        aria-label={ariaLabel}
        data-slot="time-picker"
        className={cn(triggerClasses, "w-32 tabular-nums", className)}
      >
        <TriggerText text={text} placeholder={placeholder} />
        <Clock className="size-4 shrink-0 text-dark-75 group-data-popup-open:text-mint-75" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        aria-label="Choose a time"
        className={cn(popoverClasses, "flex flex-row gap-1 p-3 tabular-nums")}
      >
        <TimeColumn label="Hr" count={24} selected={hour} onSelect={(n) => emit({ hour: n })} />
        <TimeColumn
          label="Min"
          count={60}
          step={minuteStep}
          selected={minute}
          onSelect={(n) => emit({ minute: n })}
        />
        {showSeconds && (
          <TimeColumn
            label="Sec"
            count={60}
            selected={second}
            onSelect={(n) => emit({ second: n })}
          />
        )}
      </PopoverContent>
    </Popover>
  )
}

// =============================================================================
// DatePicker
// =============================================================================

export interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  /** Trailing icon: `chevron` (default, flips when open) or `calendar`. */
  icon?: "chevron" | "calendar"
  /** Override the shown text, e.g. "In 2 days" for natural-language input. */
  displayValue?: string
  /** Pass a "HH:MM" or "HH:MM:SS" string to show a TimePicker beside the date. */
  time?: string
  onTimeChange?: (time: string) => void
  /** Helper line under the control. */
  description?: React.ReactNode
  disabled?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  captionLayout?: "label" | "dropdown"
  /** Close the popover once a date is picked. Default true. */
  closeOnSelect?: boolean
  /** Formats the selected date for the trigger. Default DD/MM/YYYY, e.g. "16/10/2026". */
  formatDate?: (date: Date) => string
  /** Classes for the wrapper. */
  className?: string
  /** Classes for the trigger. Use to change its width (default `w-50`, 200px). */
  triggerClassName?: string
}

/** DD/MM/YYYY — the BYB date format. */
const formatDateDMY = (d: Date) =>
  `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`

/** 40px trigger that opens a popover Calendar, with an optional TimePicker. */
function DatePicker({
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  icon = "chevron",
  displayValue,
  time,
  onTimeChange,
  description,
  disabled = false,
  open: openProp,
  onOpenChange,
  captionLayout = "dropdown",
  closeOnSelect = true,
  formatDate = formatDateDMY,
  className,
  triggerClassName,
}: DatePickerProps) {
  const [open, setOpen] = useControllableOpen(openProp, onOpenChange)
  const text = displayValue || (value ? formatDate(value) : "")

  return (
    <div
      data-slot="date-picker"
      className={cn("inline-flex flex-col gap-2", className)}
    >
      <div className="flex gap-3">
        <Popover open={open} onOpenChange={(next) => setOpen(next)}>
          <PopoverTrigger
            disabled={disabled}
            className={cn(triggerClasses, "w-50", triggerClassName)}
          >
            <TriggerText text={text} placeholder={placeholder} />
            {icon === "calendar" ? (
              <IconCalendar className="size-4 shrink-0 text-dark-75 group-data-popup-open:text-mint-75" />
            ) : (
              <IconChevronDown className="size-4 shrink-0 text-dark-75 transition-transform group-data-popup-open:rotate-180 group-data-popup-open:text-mint-75" />
            )}
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={6}
            aria-label="Choose a date"
            className={popoverClasses}
          >
            <Calendar
              mode="single"
              captionLayout={captionLayout}
              selected={value}
              defaultMonth={value}
              onSelect={(d) => {
                onChange?.(d)
                if (closeOnSelect) setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
        {time !== undefined && (
          <TimePicker
            value={time}
            onChange={onTimeChange}
            disabled={disabled}
            placeholder="HH:MM"
          />
        )}
      </div>
      {description && (
        <span className="text-body-5 text-dark-75">{description}</span>
      )}
    </div>
  )
}

export { DatePicker, TimePicker, formatDateDMY }
