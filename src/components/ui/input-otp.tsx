"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"

import { cn } from "@/lib/utils"

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
        "cn-input-otp group/input-otp flex items-center gap-1 has-disabled:cursor-not-allowed",
        containerClassName
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

/** A run of separate slots, 2px apart. */
function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-0.5", className)}
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
        "relative flex size-8 items-center justify-center rounded-md border border-dark-15 bg-white text-body-sm font-medium text-dark-100 transition outline-none",
        // active
        "data-[active=true]:z-10 data-[active=true]:border-mint-45 data-[active=true]:text-navy data-[active=true]:ring-3 data-[active=true]:ring-mint-45/30",
        // error — on the slot itself or anywhere inside an invalid OTP input
        "aria-invalid:border-error-75 group-has-aria-invalid/input-otp:border-error-75 data-[active=true]:aria-invalid:ring-error-75/20 group-has-aria-invalid/input-otp:data-[active=true]:ring-error-75/20",
        // disabled
        "group-has-disabled/input-otp:bg-light-l2 group-has-disabled/input-otp:text-dark-45",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-pulse bg-mint-75" />
        </div>
      )}
    </div>
  )
}

/** Dash between slot groups. */
function InputOTPSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      className={cn("flex items-center px-1 text-body-sm text-dark-60", className)}
      {...props}
    >
      -
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
