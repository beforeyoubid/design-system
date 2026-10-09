import * as React from "react"
import { IconCalendar, IconChevronDown } from "@tabler/icons-react"

import { cn } from "../lib/utils"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

const controlClasses =
  "h-10 rounded-lg border border-dark-15 bg-white text-body-sm text-dark-100 outline-none transition-all focus-visible:border-mint-45 focus-visible:ring-3 focus-visible:ring-mint-45/30 disabled:cursor-not-allowed disabled:bg-light-l2"

export interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  /** Trailing icon: `chevron` (default, flips when open) or `calendar`. */
  icon?: "chevron" | "calendar"
  /** Override the shown text, e.g. "In 2 days" for natural-language input. */
  displayValue?: string
  /** Pass a "HH:MM:SS" string to show a time input beside the date. */
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
  /** Formats the selected date for the trigger. Default "June 21, 2025". */
  formatDate?: (date: Date) => string
  /** Classes for the wrapper. */
  className?: string
  /** Classes for the trigger. Use to change its width (default `w-50`, 200px). */
  triggerClassName?: string
}

const defaultFormat = (d: Date) =>
  d.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  })

/** 40px trigger that opens a popover Calendar, with an optional time input. */
function DatePicker({
  value,
  onChange,
  placeholder = "Select a date",
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
  formatDate = defaultFormat,
  className,
  triggerClassName,
}: DatePickerProps) {
  const [openState, setOpenState] = React.useState(false)
  const open = openProp ?? openState
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next)
    onOpenChange?.(next)
  }
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
            className={cn(
              controlClasses,
              "group flex w-50 cursor-pointer items-center justify-between gap-2 px-3 text-start data-popup-open:border-mint-45 data-popup-open:bg-mint-l4 data-popup-open:ring-3 data-popup-open:ring-mint-45/30",
              triggerClassName
            )}
          >
            <span
              className={cn(
                "truncate",
                text
                  ? "text-dark-100 group-data-popup-open:text-mint-75"
                  : "text-dark-60"
              )}
            >
              {text || placeholder}
            </span>
            {icon === "calendar" ? (
              <IconCalendar className="size-4 shrink-0 text-dark-60 group-data-popup-open:text-mint-75" />
            ) : (
              <IconChevronDown className="size-4 shrink-0 text-dark-60 transition-transform group-data-popup-open:rotate-180 group-data-popup-open:text-mint-75" />
            )}
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={6}
            aria-label="Choose a date"
            className="w-auto rounded-lg border-light-l3 p-0 shadow-md"
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
          <input
            type="time"
            step={1}
            value={time}
            disabled={disabled}
            aria-label="Time"
            onChange={(e) => onTimeChange?.(e.target.value)}
            className={cn(controlClasses, "w-28 px-2.5 font-mono text-caption")}
          />
        )}
      </div>
      {description && (
        <span className="text-body-sm text-dark-60">{description}</span>
      )}
    </div>
  )
}

export { DatePicker }
