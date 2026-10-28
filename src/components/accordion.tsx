import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  Accordion as AccordionBase,
  AccordionContent as AccordionContentBase,
  AccordionTrigger as AccordionTriggerBase,
} from "@/components/ui/accordion"

export * from "@/components/ui/accordion"

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
  "px-4 pt-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
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

/** Stock `Accordion` plus `size` (`sm`, `md` default, `lg`), applied to every trigger and panel. */
function Accordion({
  size = "md",
  ...props
}: React.ComponentProps<typeof AccordionBase> & { size?: AccordionSize }) {
  return (
    <AccordionSizeContext.Provider value={size}>
      <AccordionBase data-size={size} {...props} />
    </AccordionSizeContext.Provider>
  )
}

/** Stock `AccordionTrigger`; `size` overrides the accordion's. */
function AccordionTrigger({
  className,
  size,
  ...props
}: React.ComponentProps<typeof AccordionTriggerBase> & { size?: AccordionSize }) {
  const groupSize = React.useContext(AccordionSizeContext)
  return (
    <AccordionTriggerBase
      className={cn(accordionTriggerVariants({ size: size ?? groupSize }), className)}
      {...props}
    />
  )
}

/** Stock `AccordionContent`; `size` overrides the accordion's. */
function AccordionContent({
  className,
  size,
  ...props
}: React.ComponentProps<typeof AccordionContentBase> & { size?: AccordionSize }) {
  const groupSize = React.useContext(AccordionSizeContext)
  return (
    <AccordionContentBase
      className={cn(accordionContentVariants({ size: size ?? groupSize }), className)}
      {...props}
    />
  )
}

export {
  Accordion,
  AccordionTrigger,
  AccordionContent,
  accordionTriggerVariants,
  accordionContentVariants,
}
export type { AccordionSize }
