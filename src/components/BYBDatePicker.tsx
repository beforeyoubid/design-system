import * as React from "react"
import { IconCalendar, IconChevronDown } from "@tabler/icons-react"

import { cn } from "../lib/utils"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { pad, popoverClasses, TimePicker, TriggerText, triggerClasses, useControllableOpen } from "./time-picker"

// =============================================================================
// BYBDatePicker
// =============================================================================

export interface BYBDatePickerProps {
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
function BYBDatePicker({
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
}: BYBDatePickerProps) {
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

export { BYBDatePicker, formatDateDMY }
