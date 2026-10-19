import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react"

/** Trigger row: title size, vertical padding and chevron size per `size`. */
const accordionTriggerVariants = cva(
  "group/accordion-trigger relative flex cursor-pointer flex-1 items-center justify-between text-start font-semibold text-dark-100 transition-colors outline-none hover:text-mint-45 aria-expanded:text-mint-45 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "gap-4 py-3 text-body-4 [&_svg]:size-4",
        md: "gap-6 py-5 text-h5 [&_svg]:size-5",
        lg: "gap-6 py-6 text-h4 [&_svg]:size-6",
      },
    },
    defaultVariants: { size: "md" },
  }
)

/** Panel body: text size and bottom padding per `size`. */
const accordionContentVariants = cva(
  "h-(--accordion-panel-height) px-4 pt-0 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
  {
    variants: {
      size: {
        sm: "pb-3 text-body-5 [&_p:not(:last-child)]:mb-3",
        md: "pb-5 text-body-4 [&_p:not(:last-child)]:mb-4",
        lg: "pb-6 text-body-3 [&_p:not(:last-child)]:mb-4",
      },
    },
    defaultVariants: { size: "md" },
  }
)

type AccordionSize = NonNullable<VariantProps<typeof accordionTriggerVariants>["size"]>

const AccordionSizeContext = React.createContext<AccordionSize>("md")

function Accordion({
  className,
  size = "md",
  ...props
}: AccordionPrimitive.Root.Props & { size?: AccordionSize }) {
  return (
    <AccordionSizeContext.Provider value={size}>
      <AccordionPrimitive.Root
        data-slot="accordion"
        data-size={size}
        className={cn("flex w-full flex-col", className)}
        {...props}
      />
    </AccordionSizeContext.Provider>
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
  size,
  ...props
}: AccordionPrimitive.Trigger.Props & { size?: AccordionSize }) {
  const groupSize = React.useContext(AccordionSizeContext)
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(accordionTriggerVariants({ size: size ?? groupSize }), className)}
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
  size,
  ...props
}: AccordionPrimitive.Panel.Props & { size?: AccordionSize }) {
  const groupSize = React.useContext(AccordionSizeContext)
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden text-dark-75 data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div className={cn(accordionContentVariants({ size: size ?? groupSize }), className)}>
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  accordionTriggerVariants,
  accordionContentVariants,
}
export type { AccordionSize }
