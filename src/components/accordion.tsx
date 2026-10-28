import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  Accordion as AccordionBase,
  AccordionContent as AccordionContentBase,
  AccordionTrigger as AccordionTriggerBase,
} from "@/components/ui/accordion"

export * from "@/components/ui/accordion"

/**
 * Trigger row. md is the stock trigger (accordion-trigger levers); sm and lg
 * set their own title size, padding and chevron size.
 */
const accordionTriggerVariants = cva("", {
  variants: {
    size: {
      sm: "gap-(--_accordion-trigger-sm-gap) py-(--_accordion-trigger-sm-padding-y) text-body-4 [&_svg]:size-4",
      md: "",
      lg: "py-(--_accordion-trigger-lg-padding-y) text-h4 [&_svg]:size-6",
    },
  },
  defaultVariants: { size: "md" },
})

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
