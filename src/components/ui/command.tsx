"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { cn } from "@/lib/utils"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
} from "@/components/ui/input-group"
import { IconSearch, IconCheck } from "@tabler/icons-react"

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex size-full flex-col overflow-hidden rounded-(--_command-radius) bg-(--_command) text-(--_command-foreground) border-(--_command-border) shadow-(--_command-shadow) border text-body-5 in-data-[slot=dialog-content]:rounded-none in-data-[slot=dialog-content]:border-0 in-data-[slot=dialog-content]:shadow-none",
        className
      )}
      {...props}
    />
  )
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
  children: React.ReactNode
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          "top-1/3 translate-y-0 overflow-hidden rounded-4xl! p-0",
          className
        )}
        showCloseButton={showCloseButton}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" className="h-(--_command-input-wrapper-height) gap-(--_command-input-wrapper-gap) border-(--_command-input-wrapper-border) px-(--_command-input-wrapper-padding-x) flex shrink-0 items-center border-b *:data-[slot=input-group]:h-full *:data-[slot=input-group]:min-h-0 *:data-[slot=input-group]:border-0 *:data-[slot=input-group]:bg-transparent *:data-[slot=input-group]:px-0 *:data-[slot=input-group]:focus-within:ring-0">
      <InputGroup className="h-9 bg-input/30">
        <CommandPrimitive.Input
          data-slot="command-input"
          className={cn(
            "w-full text-body-5 outline-hidden disabled:cursor-not-allowed text-(--_command-input-foreground) placeholder:text-(--_command-input-placeholder) disabled:text-(--_command-input-disabled-foreground) h-full min-w-0 bg-transparent",
            className
          )}
          {...props}
        />
        <InputGroupAddon>
          <IconSearch className="size-4 shrink-0 opacity-50" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "no-scrollbar max-h-80 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none p-(--_command-list-padding)",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("py-(--_command-empty-padding-y) text-center text-body-5 text-(--_command-empty-foreground)", className)}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden text-(--_command-group-foreground) **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:text-caption-1 **:[[cmdk-group-heading]]:text-dark-90 **:[[cmdk-group-heading]]:pt-2 **:[[cmdk-group-heading]]:pb-1",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("my-1 h-(--_command-separator-height) bg-(--_command-separator) -mx-1", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative flex cursor-pointer items-center gap-(--_command-item-gap) rounded-(--_command-item-radius) px-(--_command-item-padding-x) text-body-5 outline-hidden select-none data-[disabled=true]:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 text-(--_command-item-foreground) data-selected:bg-(--_command-item-selected) data-selected:text-(--_command-item-selected-foreground) data-[disabled=true]:text-dark-45 min-h-(--_command-item-min-height) py-(--_command-item-padding-y)",
        className
      )}
      {...props}
    >
      {children}
      <IconCheck className="ms-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" />
    </CommandPrimitive.Item>
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ms-auto text-caption-1 text-(--_command-shortcut-foreground)",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
