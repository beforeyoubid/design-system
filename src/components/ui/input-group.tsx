"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

/**
 * Wrapper carries the BYB control chrome (40px, 12px radius, dark-15 border,
 * white fill). The inner control is borderless; focus/invalid/disabled are
 * reflected on the wrapper.
 */
function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex min-h-10 w-full min-w-0 items-center gap-2 rounded-lg border border-dark-15 bg-white px-3 transition outline-none",
        // focus
        "focus-within:border-mint-45 focus-within:ring-3 focus-within:ring-mint-45/30",
        // error
        "has-[[data-slot=input-group-control][aria-invalid=true]]:border-error-75 has-[[data-slot=input-group-control][aria-invalid=true]]:focus-within:ring-error-75/20",
        // disabled
        "has-[[data-slot=input-group-control]:disabled]:cursor-not-allowed has-[[data-slot=input-group-control]:disabled]:bg-light-l2 has-[[data-slot=input-group-control]:disabled]:opacity-70 data-[disabled=true]:bg-light-l2 data-[disabled=true]:opacity-70",
        // combobox popup: no ring
        "in-data-[slot=combobox-content]:focus-within:border-dark-15 in-data-[slot=combobox-content]:focus-within:ring-0",
        // block addons / textarea stack vertically
        "has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:flex-col has-[>textarea]:items-stretch",
        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 text-body-sm text-dark-60 select-none group-data-[disabled=true]/input-group:opacity-50 **:data-[slot=kbd]:rounded-sm **:data-[slot=kbd]:bg-light-l2 **:data-[slot=kbd]:px-1.5 [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start": "order-first has-[>button]:-ms-1.5",
        "inline-end": "order-last has-[>button]:-me-1.5",
        "block-start":
          "order-first w-full justify-start pt-2.5 [.border-b]:pb-2.5",
        "block-end": "order-last w-full justify-start pb-2.5 [.border-t]:pt-2.5",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement
          ?.querySelector<HTMLElement>("input, textarea")
          ?.focus()
      }}
      {...props}
    />
  )
}

/**
 * Compact button that sits inside the group. Defaults to `ghost` (icon /
 * text action); use `primary` (lime), `secondary` (mint-75) or `tertiary`
 * (outlined) for a filled inline CTA.
 */
const inputGroupButtonVariants = cva(
  "text-overline flex items-center gap-1 rounded-md shadow-none",
  {
    variants: {
      size: {
        xs: "h-7 px-2.5 py-0 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 px-3 py-0 [&>svg:not([class*='size-'])]:size-4",
        "icon-xs": "size-7 p-0 has-[>svg]:p-0 [&>svg:not([class*='size-'])]:size-4",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0 [&>svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
)

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset"
  }) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      size="xs"
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

/** Inline text/prefix inside an addon (e.g. `https://`, `AUD`). */
function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-body-sm text-dark-75 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "h-auto min-h-9 flex-1 rounded-none border-0 bg-transparent px-0 shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 disabled:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "w-full flex-1 resize-none rounded-none border-0 bg-transparent px-0 py-2.5 shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 disabled:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
  inputGroupAddonVariants,
  inputGroupButtonVariants,
}
