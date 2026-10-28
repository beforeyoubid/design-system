"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex w-full min-w-0 items-center rounded-(--_input-group-radius) border border-(--_input-group-border) bg-(--_input-group) transition outline-none in-data-[slot=combobox-content]:focus-within:border-dark-45 in-data-[slot=combobox-content]:focus-within:ring-0 has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:flex-col dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 min-h-(--_input-group-min-height) gap-(--_input-group-gap) px-(--_input-group-padding-x) focus-within:border-(--_input-group-focus-border) focus-within:ring-(--_input-group-focus-ring) focus-within:ring-3 has-[[data-slot=input-group-control][aria-invalid=true]]:border-error-75 has-[[data-slot=input-group-control][aria-invalid=true]]:focus-within:ring-error-75/20 has-[[data-slot=input-group-control]:disabled]:cursor-not-allowed has-[[data-slot=input-group-control]:disabled]:bg-light-l2 has-[[data-slot=input-group-control]:disabled]:opacity-70 data-[disabled=true]:bg-light-l2 data-[disabled=true]:opacity-70 has-[>textarea]:items-stretch [&>textarea]:px-0 [&>textarea]:py-2.5",
        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-(--_input-group-addon-gap) text-body-5 text-(--_input-group-addon-foreground) select-none group-data-[disabled=true]/input-group:opacity-50 **:data-[slot=kbd]:rounded-sm **:data-[slot=kbd]:bg-light-l2 **:data-[slot=kbd]:px-1.5 [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "order-first has-[>button]:-ms-1.5",
        "inline-end":
          "order-last has-[>button]:-me-1.5",
        "block-start":
          "order-first w-full justify-start pt-2.5 [.border-b]:pb-2.5",
        "block-end":
          "order-last w-full justify-start pb-2.5 [.border-t]:pt-2.5",
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
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva(
  "flex items-center gap-(--_input-group-button-gap) rounded-(--_input-group-button-radius) shadow-none text-overline",
  {
    variants: {
      size: {
        xs: "h-(--_input-group-button-xs-height) px-(--_input-group-button-xs-padding-x) py-0 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "h-(--_input-group-button-sm-height) px-(--_input-group-button-sm-padding-x) py-0 [&>svg:not([class*='size-'])]:size-4",
        "icon-xs": "size-(--_input-group-button-icon-xs-size) p-0 has-[>svg]:p-0 [&>svg:not([class*='size-'])]:size-4",
        "icon-sm": "size-(--_input-group-button-icon-sm-size) p-0 has-[>svg]:p-0 [&>svg:not([class*='size-'])]:size-4",
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
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
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
        "flex-1 rounded-(--_input-group-control-radius) border-0 bg-transparent shadow-(--_input-group-control-shadow) ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent min-h-(--_input-group-control-min-height) px-(--_input-group-control-padding-x) h-auto disabled:bg-transparent",
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
        "flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent",
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
}
