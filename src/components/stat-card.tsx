import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  IconAlertTriangle,
  IconCheck,
  IconExclamationMark,
  IconInfoCircle,
  IconInfoSmall,
} from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { IconTile, type IconTileVariant } from "@/components/icon-tile"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type StatCardVariant = "default" | "success" | "warning" | "error"

const StatCardContext = React.createContext<StatCardVariant>("default")

/**
 * A white card with a coloured halo around it that pulses gently. The halo
 * colour, the status icon and the status title follow `variant`. The root
 * holds the halo and the card; the card is drawn on top of the halo.
 */
const statCardVariants = cva(
  "relative isolate w-full",
  {
    variants: {
      variant: {
        default: "",
        success: "",
        warning: "",
        error: "",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

/** The halo behind the card. */
const statCardHaloVariants = cva(
  "pointer-events-none absolute -inset-(--_stat-card-halo-width) rounded-(--_stat-card-halo-radius)",
  {
    variants: {
      variant: {
        default: "bg-(--_stat-card-halo)",
        success: "bg-(--_stat-card-halo-success)",
        warning: "bg-(--_stat-card-halo-warning)",
        error: "bg-(--_stat-card-halo-error)",
      },
      motion: {
        pulse: "animate-halo-pulse motion-reduce:animate-none",
        none: "",
      },
    },
    defaultVariants: { variant: "default", motion: "pulse" },
  }
)

/** Colour of the status title, per variant. */
const statCardStatusTitleVariants = cva(
  "text-body-4 font-(--_stat-card-status-title-font-weight)",
  {
    variants: {
      variant: {
        default: "text-(--_stat-card-status-title-foreground)",
        success: "text-(--_stat-card-status-title-success-foreground)",
        warning: "text-(--_stat-card-status-title-warning-foreground)",
        error: "text-(--_stat-card-status-title-error-foreground)",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

const STATUS_TILE: Record<StatCardVariant, IconTileVariant> = {
  default: "neutral",
  success: "mint",
  warning: "warning",
  error: "error",
}

const STATUS_ICON: Record<StatCardVariant, React.ReactNode> = {
  default: <IconInfoSmall className="size-6" />,
  success: <IconCheck />,
  warning: <IconAlertTriangle />,
  error: <IconExclamationMark />,
}

interface StatCardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof statCardVariants> {
  /** `pulse` (default) breathes the halo; `none` keeps it still. Reduced-motion users always get it still. */
  motion?: VariantProps<typeof statCardHaloVariants>["motion"]
}

function StatCard({
  className,
  variant,
  motion = "pulse",
  children,
  ...props
}: StatCardProps) {
  const v: StatCardVariant = variant ?? "default"
  return (
    <StatCardContext.Provider value={v}>
      <div
        data-slot="stat-card"
        data-variant={v}
        className={cn(statCardVariants({ variant: v }), className)}
        {...props}
      >
        <span
          aria-hidden
          data-slot="stat-card-halo"
          className={statCardHaloVariants({ variant: v, motion })}
        />
        <div
          data-slot="stat-card-surface"
          className="relative flex flex-col gap-(--_stat-card-gap) rounded-(--_stat-card-radius) border border-(--_stat-card-border) bg-(--_stat-card) p-(--_stat-card-padding) text-(--_stat-card-foreground) shadow-(--_stat-card-shadow)"
        >
          {children}
        </div>
      </div>
    </StatCardContext.Provider>
  )
}

interface StatCardTitleProps extends React.ComponentProps<"div"> {
  /**
   * Tooltip text for an info icon after the title, e.g. how the stat is worked
   * out. Leave it out and there is no icon. For full control, put a
   * `StatCardInfo` in the children instead.
   */
  info?: React.ReactNode
  /** Name of the info icon for screen readers. Default "More information". */
  infoLabel?: string
}

/** The label row: the title and, when `info` is set, an info icon with a tooltip. */
function StatCardTitle({
  className,
  info,
  infoLabel,
  children,
  ...props
}: StatCardTitleProps) {
  return (
    <div
      data-slot="stat-card-title"
      className={cn(
        "flex items-center gap-(--_stat-card-title-gap) text-body-4 font-(--_stat-card-title-font-weight) text-(--_stat-card-title-foreground)",
        className
      )}
      {...props}
    >
      {children}
      {info != null && info !== "" && (
        <StatCardInfo label={infoLabel}>{info}</StatCardInfo>
      )}
    </div>
  )
}

interface StatCardInfoProps
  extends Omit<React.ComponentProps<"button">, "children"> {
  /** What the tooltip says, e.g. how the stat is worked out. */
  children: React.ReactNode
  /** Name for the icon button. Default "More information". */
  label?: string
}

/** An info icon beside the title; shows `children` in a tooltip. */
function StatCardInfo({
  className,
  children,
  label = "More information",
  ...props
}: StatCardInfoProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        delay={200}
        render={
          <button
            type="button"
            data-slot="stat-card-info"
            aria-label={label}
            className={cn(
              "inline-flex cursor-pointer rounded-full text-(--_stat-card-info-foreground) transition-colors outline-none hover:text-(--_stat-card-info-hover-foreground) focus-visible:ring-2 focus-visible:ring-(--_stat-card-info-focus-ring) [&_svg]:size-4.5",
              className
            )}
            {...props}
          />
        }
      >
        <IconInfoCircle />
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  )
}

/** The headline figure, e.g. "55 hrs". */
function StatCardValue({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-card-value"
      className={cn(
        "text-h3 font-(--_stat-card-value-font-weight) text-(--_stat-card-value-foreground)",
        className
      )}
      {...props}
    />
  )
}

interface StatCardStatusProps extends React.ComponentProps<"div"> {
  /**
   * The round icon before the status text. Leave it out for the variant's icon
   * (! error, triangle warning, tick success, i default), pass any icon to
   * replace it, or `null` for no icon.
   */
  icon?: React.ReactNode
}

/** The row under the divider: a status icon, then `StatCardStatusTitle` and `StatCardStatusDescription`. */
function StatCardStatus({
  className,
  icon,
  children,
  ...props
}: StatCardStatusProps) {
  const variant = React.useContext(StatCardContext)
  return (
    <div
      data-slot="stat-card-status"
      className={cn(
        "flex items-center gap-(--_stat-card-status-gap) border-t border-(--_stat-card-status-border) pt-(--_stat-card-status-padding-top)",
        className
      )}
      {...props}
    >
      {icon !== null && icon !== false && (
        <IconTile
          size="sm"
          variant={STATUS_TILE[variant]}
          icon={icon === undefined ? STATUS_ICON[variant] : icon}
          className="[&_svg:not([class*='size-'])]:size-4.5"
        />
      )}
      <div className="flex min-w-0 flex-col">{children}</div>
    </div>
  )
}

/** The status line in the variant's colour, e.g. "15% slower than standard". */
function StatCardStatusTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const variant = React.useContext(StatCardContext)
  return (
    <div
      data-slot="stat-card-status-title"
      className={cn(statCardStatusTitleVariants({ variant }), className)}
      {...props}
    />
  )
}

/** Supporting text under the status title, e.g. "BYB standard: Max 48h". */
function StatCardStatusDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-card-status-description"
      className={cn(
        "text-body-5 text-(--_stat-card-status-description-foreground)",
        className
      )}
      {...props}
    />
  )
}

export {
  StatCard,
  StatCardTitle,
  StatCardInfo,
  StatCardValue,
  StatCardStatus,
  StatCardStatusTitle,
  StatCardStatusDescription,
  statCardVariants,
  statCardHaloVariants,
  statCardStatusTitleVariants,
}
export type {
  StatCardProps,
  StatCardTitleProps,
  StatCardInfoProps,
  StatCardStatusProps,
  StatCardVariant,
}
