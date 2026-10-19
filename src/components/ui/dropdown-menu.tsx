"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown, Ellipsis, EllipsisVertical, Settings2 } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  productBadgeByKey,
  productBadges,
  type ProductBadgeKey,
} from "@/lib/product-badges"
import { IconTile } from "@/components/ui/icon-tile"
import { IconChevronRight, IconCheck } from "@tabler/icons-react"

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
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
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-mint-45 disabled:pointer-events-none disabled:text-dark-45",
  {
    variants: {
      tone: {
        mint: "text-mint-75 hover:text-mint-45 data-popup-open:text-mint-45",
        dark: "text-dark-75 hover:text-dark-100 data-popup-open:text-dark-100",
        navy: "text-navy hover:text-dark-75 data-popup-open:text-dark-75",
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

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "z-50 max-h-(--available-height) w-(--anchor-width) min-w-55 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg border border-light-l3 bg-white p-1 text-body-5 text-dark-90 shadow-md duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

/**
 * Base UI's GroupLabel throws outside a Menu.Group / Menu.RadioGroup. Track
 * whether we're inside one so DropdownMenuLabel can also be used as a plain
 * heading at the top of a menu.
 */
const InGroupContext = React.createContext(false)

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return (
    <InGroupContext.Provider value={true}>
      <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
    </InGroupContext.Provider>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}) {
  const inGroup = React.useContext(InGroupContext)
  const labelClassName = cn(
    "px-2.5 pt-2 pb-1.5 text-body-5 font-semibold text-navy data-inset:ps-9",
    className
  )
  if (!inGroup) {
    // `render` is a Base UI prop; it has no meaning on a plain div.
    const divProps: Record<string, unknown> = { ...props }
    delete divProps.render
    return (
      <div
        data-slot="dropdown-menu-label"
        data-inset={inset}
        className={typeof labelClassName === "string" ? labelClassName : undefined}
        {...(divProps as React.ComponentProps<"div">)}
      />
    )
  }
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={labelClassName}
      {...props}
    />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "group/dropdown-menu-item relative flex h-8 cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-body-5 text-dark-90 outline-hidden select-none data-highlighted:bg-mint-l2 data-highlighted:text-mint-75 data-disabled:pointer-events-none data-disabled:text-dark-45 data-inset:ps-9 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:text-error-60 data-[variant=destructive]:data-highlighted:bg-error-l1 data-[variant=destructive]:data-highlighted:text-error-75",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex h-8 cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-body-5 text-dark-90 outline-hidden select-none data-highlighted:bg-mint-l2 data-highlighted:text-mint-75 data-disabled:pointer-events-none data-disabled:text-dark-45 data-inset:ps-9 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-popup-open:bg-mint-l2 data-popup-open:text-mint-75",
        className
      )}
      {...props}
    >
      {children}
      <IconChevronRight className="ms-auto size-3.5 text-dark-75 rtl:rotate-180" />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "inline-end",
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn("w-auto min-w-44", className)}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

/**
 * Shared row style for checkbox/radio items. Matches the Select list:
 * neutral highlight (light-l1), dark-100 text.
 */
const selectableItemClassName =
  "relative flex min-h-8 cursor-pointer items-center rounded-md py-1.5 text-body-5 text-dark-100 outline-hidden select-none data-highlighted:bg-light-l1 data-disabled:pointer-events-none data-disabled:text-dark-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

/** Multi-select row: leading checkbox, same as Select `indicator="checkbox"`. */
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        selectableItemClassName,
        "group/dropdown-menu-checkbox-item gap-2.5 px-2.5 data-inset:ps-9",
        className
      )}
      checked={checked}
      {...props}
    >
      <span
        aria-hidden="true"
        data-slot="dropdown-menu-checkbox-item-indicator"
        className="pointer-events-none flex size-4 shrink-0 items-center justify-center rounded-sm border border-dark-30 bg-white text-white transition-colors group-data-checked/dropdown-menu-checkbox-item:border-mint-45 group-data-checked/dropdown-menu-checkbox-item:bg-mint-45 group-data-disabled/dropdown-menu-checkbox-item:opacity-50"
      >
        <MenuPrimitive.CheckboxItemIndicator className="flex items-center justify-center">
          <IconCheck className="size-3" stroke={3} />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <InGroupContext.Provider value={true}>
      <MenuPrimitive.RadioGroup
        data-slot="dropdown-menu-radio-group"
        {...props}
      />
    </InGroupContext.Provider>
  )
}

/** Single-select row: the selected row is marked by a mint fill (no check mark). */
function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(
        selectableItemClassName,
        "gap-2.5 px-2.5 data-checked:bg-mint-l2 data-checked:text-mint-75 data-inset:ps-9",
        className
      )}
      {...props}
    >
      {children}
    </MenuPrimitive.RadioItem>
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

function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-light-l3", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ms-auto text-caption-1 text-dark-75",
        className
      )}
      {...props}
    />
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
        "group/card-trigger flex w-full cursor-pointer items-center gap-4 rounded-lg border border-dark-15 bg-white p-3 pe-4 text-start outline-none transition-[background-color,border-color,box-shadow] hover:border-mint-30 focus-visible:border-mint-45 focus-visible:ring-3 focus-visible:ring-mint-45/30 data-popup-open:border-mint-45 data-popup-open:bg-mint-l4 data-popup-open:ring-3 data-popup-open:ring-mint-45/30 disabled:cursor-not-allowed disabled:bg-light-l2",
        className
      )}
      {...props}
    >
      {icon && <IconTile tone="mint" size="lg" icon={icon} />}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        {label && (
          <span className="text-overline text-dark-90">{label}</span>
        )}
        <span className="flex min-w-0 items-center gap-2">
          {dotClassName && (
            <span
              aria-hidden="true"
              className={cn("size-2 shrink-0 rounded-full", dotClassName)}
            />
          )}
          <span className="truncate text-body-3 font-semibold text-dark-100">
            {title}
          </span>
        </span>
      </span>
      {meta && (
        <span className="shrink-0 text-body-5 text-dark-75">{meta}</span>
      )}
      <ChevronDown
        aria-hidden="true"
        className="size-4 shrink-0 text-dark-75 transition-transform group-data-popup-open/card-trigger:rotate-180 group-data-popup-open/card-trigger:text-mint-75"
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
        "flex min-h-18 cursor-pointer items-center gap-3 rounded-lg border border-light-l3 bg-white p-3 text-start outline-hidden transition-colors select-none data-highlighted:border-dark-15 data-highlighted:bg-light-l1 data-checked:border-mint-45 data-checked:bg-mint-l3 data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {icon && <IconTile tone="neutral" size="md" icon={icon} />}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-start gap-2">
          {dotClassName && (
            <span
              aria-hidden="true"
              className={cn("mt-2 size-2 shrink-0 rounded-full", dotClassName)}
            />
          )}
          <span className="text-body-4 font-medium text-dark-100">{title}</span>
        </span>
        {meta && (
          <span
            className={cn(
              "text-body-5 text-dark-75",
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

interface ProductSwitcherProps {
  /** Selected product key. */
  value: ProductBadgeKey
  onValueChange?: (value: ProductBadgeKey) => void
  /** Products to offer, in order. Default: every product badge. */
  products?: readonly ProductBadgeKey[]
  /** Meta per product, e.g. `{ bpi: "26 jobs" }`. */
  meta?: Partial<Record<ProductBadgeKey, React.ReactNode>>
  /** Trigger overline. Default "Inspection type". */
  label?: React.ReactNode
  /** Heading inside the panel. Default "Switch inspection type". */
  heading?: React.ReactNode
  className?: string
  contentClassName?: string
}

/**
 * Ready-made product switcher: card trigger + 2-column card grid, with each
 * product's Lucide icon and badge colour from `productBadges`.
 */
function ProductSwitcher({
  value,
  onValueChange,
  products = productBadges.map((p) => p.key),
  meta,
  label = "Inspection type",
  heading = "Switch inspection type",
  className,
  contentClassName,
}: ProductSwitcherProps) {
  const current = productBadgeByKey[value]
  const CurrentIcon = current.icon
  return (
    <DropdownMenu>
      <DropdownMenuCardTrigger
        className={className}
        icon={<CurrentIcon />}
        label={label}
        dotClassName={current.bg}
        title={current.label}
        meta={meta?.[value]}
      />
      <DropdownMenuContent
        sideOffset={8}
        className={cn("w-160 max-w-(--available-width) p-3", contentClassName)}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-1 pt-0 pb-2 text-dark-90">
            {heading}
          </DropdownMenuLabel>
          <DropdownMenuCardGrid
            value={value}
            onValueChange={(next) => onValueChange?.(next as ProductBadgeKey)}
          >
            {products.map((key) => {
              const p = productBadgeByKey[key]
              const Icon = p.icon
              return (
                <DropdownMenuCardItem
                  key={key}
                  value={key}
                  icon={<Icon />}
                  dotClassName={p.bg}
                  title={p.label}
                  meta={meta?.[key]}
                />
              )
            })}
          </DropdownMenuCardGrid>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuIconTrigger,
  dropdownMenuIconTriggerVariants,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuProductItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCardTrigger,
  DropdownMenuCardGrid,
  dropdownMenuCardGridVariants,
  DropdownMenuCardItem,
  ProductSwitcher,
}
export type {
  DropdownMenuIconTriggerProps,
  DropdownMenuIconName,
  DropdownMenuProductItemProps,
  DropdownMenuCardTriggerProps,
  DropdownMenuCardItemProps,
  ProductSwitcherProps,
}
