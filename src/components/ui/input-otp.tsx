import * as React from "react"
import { cn } from "@/lib/utils"
import { OTPInput, OTPInputContext } from "input-otp"
import { IconMinus } from "@tabler/icons-react"

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "cn-input-otp flex items-center has-disabled:opacity-50",
        containerClassName
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(
        "flex items-center dark:has-aria-invalid:ring-destructive/40 gap-(--_input-otp-group-gap)",
        className
      )}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex size-(--_input-otp-slot-size) items-center justify-center border-(--_input-otp-slot-border) bg-(--_input-otp-slot) text-body-5 transition outline-none aria-invalid:border-(--_input-otp-slot-invalid-border) data-[active=true]:z-10 data-[active=true]:border-(--_input-otp-slot-active-border) data-[active=true]:ring-3 data-[active=true]:ring-(--_input-otp-slot-active-ring) data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 rounded-(--_input-otp-slot-radius) font-(--_input-otp-slot-font-weight) text-(--_input-otp-slot-foreground) data-[active=true]:text-(--_input-otp-slot-active-foreground) border group-has-aria-invalid/input-otp:border-destructive group-has-aria-invalid/input-otp:data-[active=true]:ring-destructive/20 group-has-disabled/input-otp:bg-light-l2 group-has-disabled/input-otp:text-dark-45",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center px-(--_input-otp-separator-padding-x) text-(--_input-otp-separator-foreground) text-body-5 [&_svg]:size-3"
      role="separator"
      {...props}
    >
      <IconMinus
      />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
