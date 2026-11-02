"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown, Ellipsis, EllipsisVertical, Settings2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { productBadgeByKey, type ProductBadgeKey } from "@/lib/product-badges"
import { IconTile } from "@/components/icon-tile"
import {
  DropdownMenuGroup as DropdownMenuGroupBase,
  DropdownMenuLabel as DropdownMenuLabelBase,
  DropdownMenuRadioGroup as DropdownMenuRadioGroupBase,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

export * from "@/components/ui/dropdown-menu"

/**
 * Base UI's GroupLabel throws outside a Menu.Group / Menu.RadioGroup. Track
 * whether we're inside one so DropdownMenuLabel can also be used as a plain
 * heading at the top of a menu.
 */
const InGroupContext = React.createContext(false)

function DropdownMenuGroup(props: React.ComponentProps<typeof DropdownMenuGroupBase>) {
  return (
    <InGroupContext.Provider value={true}>
      <DropdownMenuGroupBase {...props} />
    </InGroupContext.Provider>
  )
}

function DropdownMenuRadioGroup(
  props: React.ComponentProps<typeof DropdownMenuRadioGroupBase>
) {
  return (
    <InGroupContext.Provider value={true}>
      <DropdownMenuRadioGroupBase {...props} />
    </InGroupContext.Provider>
  )
}

/** Stock `DropdownMenuLabel` that also works outside a group, as a menu heading. */
function DropdownMenuLabel(props: React.ComponentProps<typeof DropdownMenuLabelBase>) {
  const inGroup = React.useContext(InGroupContext)
  if (inGroup) return <DropdownMenuLabelBase {...props} />
  return (
    <DropdownMenuGroup>
      <DropdownMenuLabelBase {...props} />
    </DropdownMenuGroup>
  )
}

/** Preset icons for `DropdownMenuIconTrigger`. */
const DROPDOWN_ICONS = {
  kebab: EllipsisVertical,
  meatball: Ellipsis,
  chevron: ChevronDown,
  settings: Settings2,
} as const

type DropdownMenuIconName = keyof typeof DROPDOWN_ICONS

/** Bare icon trigger: no fill or border; hover and open only change the colour. */
const dropdownMenuIconTriggerVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-(--_dropdown-menu-icon-trigger-focus-ring) disabled:pointer-events-none disabled:text-(--_dropdown-menu-icon-trigger-disabled-foreground)",
  {
    variants: {
      tone: {
        mint: "text-(--_dropdown-menu-icon-trigger-mint-foreground) hover:text-(--_dropdown-menu-icon-trigger-mint-hover-foreground) data-popup-open:text-(--_dropdown-menu-icon-trigger-mint-hover-foreground)",
        dark: "text-(--_dropdown-menu-icon-trigger-dark-foreground) hover:text-(--_dropdown-menu-icon-trigger-dark-hover-foreground) data-popup-open:text-(--_dropdown-menu-icon-trigger-dark-hover-foreground)",
        navy: "text-(--_dropdown-menu-icon-trigger-navy-foreground) hover:text-(--_dropdown-menu-icon-trigger-navy-hover-foreground) data-popup-open:text-(--_dropdown-menu-icon-trigger-navy-hover-foreground)",
      },
      size: {
        sm: "size-6 [&_svg]:size-4",
        md: "size-8 [&_svg]:size-5",
        lg: "size-10 [&_svg]:size-6",
      },
    },
    defaultVariants: { tone: "mint", size: "md" },
  }
)

interface DropdownMenuIconTriggerProps
  extends Omit<MenuPrimitive.Trigger.Props, "children">,
    VariantProps<typeof dropdownMenuIconTriggerVariants> {
  /** A preset (`kebab` ⋮, `meatball` ⋯, `chevron`, `settings`) or any icon element. Default `kebab`. */
  icon?: DropdownMenuIconName | React.ReactElement
  /** Accessible name, since there's no visible text. Default "More actions". */
  label?: string
}

/**
 * Icon-only menu trigger, e.g. the ⋮ on a table row or card. Not a button
 * visually: just the icon, which changes colour on hover / when open.
 */
function DropdownMenuIconTrigger({
  icon = "kebab",
  label = "More actions",
  tone,
  size,
  className,
  ...props
}: DropdownMenuIconTriggerProps) {
  const Preset = typeof icon === "string" ? DROPDOWN_ICONS[icon] : null
  return (
    <MenuPrimitive.Trigger
      data-slot="dropdown-menu-icon-trigger"
      aria-label={label}
      className={cn(dropdownMenuIconTriggerVariants({ tone, size }), className)}
      {...props}
    >
      {Preset ? <Preset /> : (icon as React.ReactElement)}
    </MenuPrimitive.Trigger>
  )
}

interface DropdownMenuProductItemProps
  extends Omit<MenuPrimitive.RadioItem.Props, "value" | "children" | "label"> {
  /** Product badge key; sets the value, icon, label and dot colour. */
  product: ProductBadgeKey
  /** Override the product's display name (also used for type-ahead). */
  label?: string
}

/**
 * Radio row for a product: icon, name, then the product-colour dot on the
 * right. The selected row gets the mint fill. 12px radius; 16px vertical
 * padding on `text-body-4` gives a ~54px row without fixing the height.
 */
function DropdownMenuProductItem({
  product,
  label,
  className,
  ...props
}: DropdownMenuProductItemProps) {
  const { label: defaultLabel, icon: Icon, bg } = productBadgeByKey[product]
  const text = label ?? defaultLabel
  return (
    <DropdownMenuRadioItem
      value={product}
      label={text}
      data-slot="dropdown-menu-product-item"
      className={cn("rounded-lg py-4 text-body-4", className)}
      {...props}
    >
      <Icon className="text-dark-75" />
      <span className="min-w-0 flex-1 truncate">{text}</span>
      <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", bg)} />
    </DropdownMenuRadioItem>
  )
}

/* -----------------------------------------------------------------------------
 * Card menu — a rich trigger plus a grid of selectable option cards, e.g. the
 * "Inspection type" switcher. Single selection with radio semantics.
 * --------------------------------------------------------------------------- */

interface DropdownMenuCardTriggerProps
  extends Omit<MenuPrimitive.Trigger.Props, "title"> {
  /** Lucide icon for the current selection, shown in a mint IconTile. */
  icon?: React.ReactNode
  /** Small uppercase label above the title, e.g. "Inspection type". */
  label?: React.ReactNode
  /** Background class for the dot, e.g. a product badge colour `bg-badge-product-bpi`. */
  dotClassName?: string
  title: React.ReactNode
  /** Right-aligned meta, e.g. "26 jobs". */
  meta?: React.ReactNode
}

function DropdownMenuCardTrigger({
  icon,
  label,
  dotClassName,
  title,
  meta,
  className,
  ...props
}: DropdownMenuCardTriggerProps) {
  return (
    <MenuPrimitive.Trigger
      data-slot="dropdown-menu-card-trigger"
      className={cn(
        "group/card-trigger flex w-full cursor-pointer items-center gap-4 rounded-(--_dropdown-menu-card-trigger-radius) border border-(--_dropdown-menu-card-trigger-border) bg-(--_dropdown-menu-card-trigger) p-3 pe-4 text-start outline-none transition-[background-color,border-color,box-shadow] hover:border-(--_dropdown-menu-card-trigger-hover-border) focus-visible:border-(--_dropdown-menu-card-trigger-open-border) focus-visible:ring-3 focus-visible:ring-(--_dropdown-menu-card-trigger-open-ring) data-popup-open:border-(--_dropdown-menu-card-trigger-open-border) data-popup-open:bg-(--_dropdown-menu-card-trigger-open) data-popup-open:ring-3 data-popup-open:ring-(--_dropdown-menu-card-trigger-open-ring) disabled:cursor-not-allowed disabled:bg-(--_dropdown-menu-card-trigger-disabled)",
        className
      )}
      {...props}
    >
      {icon && <IconTile variant="mint" size="lg" icon={icon} />}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        {label && (
          <span className="text-overline text-(--_dropdown-menu-card-trigger-label-foreground)">{label}</span>
        )}
        <span className="flex min-w-0 items-center gap-2">
          {dotClassName && (
            <span
              aria-hidden="true"
              className={cn("size-2 shrink-0 rounded-full", dotClassName)}
            />
          )}
          <span className="truncate text-body-3 font-semibold text-(--_dropdown-menu-card-trigger-foreground)">
            {title}
          </span>
        </span>
      </span>
      {meta && (
        <span className="shrink-0 text-body-5 text-(--_dropdown-menu-card-trigger-meta-foreground)">{meta}</span>
      )}
      <ChevronDown
        aria-hidden="true"
        className="size-4 shrink-0 text-(--_dropdown-menu-card-trigger-meta-foreground) transition-transform group-data-popup-open/card-trigger:rotate-180 group-data-popup-open/card-trigger:text-(--_dropdown-menu-card-trigger-open-icon-foreground)"
      />
    </MenuPrimitive.Trigger>
  )
}

const dropdownMenuCardGridVariants = cva("grid gap-2 p-1", {
  variants: {
    columns: {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    },
  },
  defaultVariants: { columns: 2 },
})

/** Grid of option cards. A radio group, so pass `value` / `onValueChange`. */
function DropdownMenuCardGrid({
  className,
  columns,
  ...props
}: MenuPrimitive.RadioGroup.Props &
  VariantProps<typeof dropdownMenuCardGridVariants>) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-card-grid"
      className={cn(dropdownMenuCardGridVariants({ columns }), className)}
      {...props}
    />
  )
}

interface DropdownMenuCardItemProps
  extends Omit<MenuPrimitive.RadioItem.Props, "title"> {
  /** Lucide icon, shown in a neutral IconTile. */
  icon?: React.ReactNode
  /** Background class for the dot, e.g. `bg-badge-product-pest-inspection`. */
  dotClassName?: string
  title: React.ReactNode
  /** Secondary line, e.g. "9 jobs". */
  meta?: React.ReactNode
}

/** One selectable card in a `DropdownMenuCardGrid`. Selected: mint-l3 fill + mint border. */
function DropdownMenuCardItem({
  icon,
  dotClassName,
  title,
  meta,
  className,
  ...props
}: DropdownMenuCardItemProps) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-card-item"
      className={cn(
        "flex min-h-18 cursor-pointer items-center gap-3 rounded-(--_dropdown-menu-card-item-radius) border border-(--_dropdown-menu-card-item-border) bg-(--_dropdown-menu-card-item) p-3 text-start outline-hidden transition-colors select-none data-highlighted:border-(--_dropdown-menu-card-item-highlighted-border) data-highlighted:bg-(--_dropdown-menu-card-item-highlighted) data-checked:border-(--_dropdown-menu-card-item-checked-border) data-checked:bg-(--_dropdown-menu-card-item-checked) data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {icon && <IconTile variant="neutral" size="md" icon={icon} />}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-start gap-2">
          {dotClassName && (
            <span
              aria-hidden="true"
              className={cn("mt-2 size-2 shrink-0 rounded-full", dotClassName)}
            />
          )}
          <span className="text-body-4 font-medium text-(--_dropdown-menu-card-item-foreground)">{title}</span>
        </span>
        {meta && (
          <span
            className={cn(
              "text-body-5 text-(--_dropdown-menu-card-item-meta-foreground)",
              dotClassName && "ps-4"
            )}
          >
            {meta}
          </span>
        )}
      </span>
    </MenuPrimitive.RadioItem>
  )
}

export {
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuIconTrigger,
  dropdownMenuIconTriggerVariants,
  DropdownMenuProductItem,
  DropdownMenuCardTrigger,
  DropdownMenuCardGrid,
  dropdownMenuCardGridVariants,
  DropdownMenuCardItem,
}
export type {
  DropdownMenuIconTriggerProps,
  DropdownMenuIconName,
  DropdownMenuProductItemProps,
  DropdownMenuCardTriggerProps,
  DropdownMenuCardItemProps,
}
