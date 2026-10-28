export * from "@/components/ui/input"

/**
 * Shared BYB "control" chrome, used by Input, Textarea and InputGroup.
 * 40px tall, 12px radius, dark-45 hairline, mint focus ring, error-75 invalid.
 * The ui files inline the same classes; keep them in step.
 */
export const inputControlBase =
  "w-full min-w-0 rounded-lg border border-dark-45 bg-white px-3 text-body-5 text-dark-100 transition outline-none placeholder:text-dark-90 focus-visible:border-mint-45 focus-visible:ring-3 focus-visible:ring-mint-45/30 aria-invalid:border-error-75 aria-invalid:focus-visible:border-error-75 aria-invalid:focus-visible:ring-error-75/20 disabled:cursor-not-allowed disabled:bg-light-l2 disabled:text-dark-45"
