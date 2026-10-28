import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"

import { cn } from "@/lib/utils"
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react"

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-dark-15", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex cursor-pointer flex-1 items-center justify-between text-start font-semibold text-dark-100 transition-colors outline-none hover:text-mint-45 aria-expanded:text-mint-45 aria-disabled:pointer-events-none aria-disabled:opacity-50 gap-6 py-5 text-h5 [&_svg]:size-5",
          className
        )}
        {...props}
      >
        {children}
        <IconChevronDown className="pointer-events-none shrink-0 text-dark-75 transition-colors group-hover/accordion-trigger:text-mint-45 group-aria-expanded/accordion-trigger:hidden" />
        <IconChevronUp className="pointer-events-none hidden shrink-0 text-mint-45 group-aria-expanded/accordion-trigger:inline" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="h-(--accordion-panel-height) overflow-hidden text-dark-75 transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none"
      {...props}
    >
      <div
        className={cn(
          "px-4 pt-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground pb-5 text-body-4 [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
