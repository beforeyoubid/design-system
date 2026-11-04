"use client"

// BYB Calendar: the stock component with the BYB look (lime selected day, light
// range, quiet navigation). Kept as our own component because the look lives in
// the classNames map and the day button, which the CLI rewrites wholesale.
// Component tokens: src/tokens/components/calendar.css.

import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { IconChevronLeft, IconChevronRight, IconChevronDown } from "@tabler/icons-react"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-background p-3 [--cell-radius:var(--radius-4xl)] [--cell-size:--spacing(8)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) rounded-md p-0 text-(--_calendar-nav-foreground) transition-colors select-none hover:text-(--_calendar-nav-hover-foreground) aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) rounded-md p-0 text-(--_calendar-nav-foreground) transition-colors select-none hover:text-(--_calendar-nav-hover-foreground) aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-body-5 font-medium text-(--_calendar-caption-foreground)",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-(--cell-radius)",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 cursor-pointer bg-popover opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none text-(--_calendar-caption-foreground)",
          captionLayout === "label"
            ? "text-body-5 font-semibold"
            : "flex items-center gap-1 rounded-(--cell-radius) text-body-5 font-medium [&>svg]:size-3 [&>svg]:text-(--_calendar-nav-foreground)",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-(--cell-radius) text-caption-2 font-normal text-(--_calendar-weekday-foreground) select-none",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-caption-1 text-muted-foreground select-none",
          defaultClassNames.week_number
        ),
        // The band between a range's ends rounds off where it meets the edge of a week row. Only the
        // band: the ends are full circles, and a cell-radius corner beside a full radius gets scaled
        // down to almost nothing, which flattened that side of an end falling on a Sunday or Saturday.
        day: cn(
          "group/day relative aspect-square size-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button[data-range-middle=true]]:rounded-e-(--cell-radius)",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button[data-range-middle=true]]:rounded-s-(--cell-radius)"
            : "[&:first-child[data-selected=true]_button[data-range-middle=true]]:rounded-s-(--cell-radius)",
          defaultClassNames.day
        ),
        // A range's start carries the band on towards the next day, and its end back towards the
        // previous one, except across the edge of a week row.
        range_start: cn(
          "relative isolate z-0 rounded-s-(--cell-radius) bg-(--_calendar-range) after:absolute after:inset-y-0 after:end-0 after:w-4 after:bg-(--_calendar-range) last:rounded-e-(--cell-radius) last:after:hidden",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "relative isolate z-0 rounded-e-(--cell-radius) bg-(--_calendar-range) after:absolute after:inset-y-0 after:start-0 after:w-4 after:bg-(--_calendar-range)",
          props.showWeekNumber
            ? "[&:nth-child(2)]:rounded-s-(--cell-radius) [&:nth-child(2)]:after:hidden"
            : "first:rounded-s-(--cell-radius) first:after:hidden",
          defaultClassNames.range_end
        ),
        today: cn(
          "rounded-(--_calendar-day-radius) bg-(--_calendar-today) text-(--_calendar-today-foreground) data-[selected=true]:bg-transparent",
          defaultClassNames.today
        ),
        outside: cn(
          "text-(--_calendar-outside-foreground) aria-selected:text-(--_calendar-outside-foreground)",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-(--_calendar-disabled-foreground) opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <IconChevronLeft className={cn("rtl:rotate-180 size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <IconChevronRight className={cn("rtl:rotate-180 size-4", className)} {...props} />
            )
          }

          return (
            <IconChevronDown className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 rounded-(--_calendar-day-radius) border-0 text-body-5 leading-none font-normal tracking-normal text-(--_calendar-day-foreground) normal-case shadow-none hover:bg-(--_calendar-day-hover) hover:text-(--_calendar-day-foreground) group-data-[outside=true]/day:text-(--_calendar-outside-foreground) data-[selected-single=true]:font-medium data-[range-end=true]:rounded-(--_calendar-day-radius) data-[range-end=true]:bg-(--_calendar-day-selected) data-[range-end=true]:text-(--_calendar-day-selected-foreground) data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-(--_calendar-range) data-[range-middle=true]:text-(--_calendar-day-foreground) data-[range-start=true]:rounded-(--_calendar-day-radius) data-[range-start=true]:bg-(--_calendar-day-selected) data-[range-start=true]:text-(--_calendar-day-selected-foreground) data-[selected-single=true]:rounded-(--_calendar-day-radius) data-[selected-single=true]:bg-(--_calendar-day-selected) data-[selected-single=true]:text-(--_calendar-day-selected-foreground) dark:hover:text-foreground [&>span]:text-caption-2 [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
