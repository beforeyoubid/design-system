// =============================================================================
// BYB-opinionated components — domain-specific, no shadcn equivalent
// =============================================================================
export { BYBCounter } from './components/BYBCounter'
export { BYBPillCard } from './components/BYBPillCard'
export { BYBImage } from './components/BYBImage'

// =============================================================================
// Form composites — thin wrappers around ui/input and ui/select that add
// label/hint/error slots.
// =============================================================================
export { InputField } from './components/InputField'
export type { InputFieldProps } from './components/InputField'
export { SelectField } from './components/SelectField'
export type { SelectFieldProps, SelectFieldOption } from './components/SelectField'
export { Fieldset } from './components/Fieldset'
export type { FieldsetProps } from './components/Fieldset'
export { DatePicker } from './components/DatePicker'
export type { DatePickerProps } from './components/DatePicker'
export { Attachment, FileUploadCard, dropZoneVariants } from './components/Attachment'
export type {
  AttachmentProps,
  AttachmentFile,
  AttachmentStatus,
  AttachmentUploadHandlers,
  FileUploadCardProps,
} from './components/Attachment'

// =============================================================================
// BYB design-system components (Claude Design library)
// =============================================================================
export { EmptyState, emptyStateVariants } from './components/EmptyState'
export type { EmptyStateProps } from './components/EmptyState'
export { Stepper, stepIndicatorVariants } from './components/Stepper'
export type { StepperProps, StepperStep } from './components/Stepper'
export { Modal } from './components/Modal'
export type { ModalProps } from './components/Modal'
export { Toast, toastVariants, showToast, dismissToast, TOAST_DURATIONS } from './components/Toast'
export type { ToastProps, ShowToastOptions } from './components/Toast'
export { AreaChart } from './components/AreaChart'
export type { AreaChartProps, AreaChartSeries, AreaChartRange, AreaChartDatum } from './components/AreaChart'
export { BarChart, statToggleVariants } from './components/BarChart'
export type { BarChartProps, BarChartSeries, BarChartDatum } from './components/BarChart'
export { ChartFrame, ChartLegendList, CHART_PALETTE } from './components/ChartFrame'
export type { ChartFrameProps, ChartLegendListProps, ChartLegendItem } from './components/ChartFrame'

// =============================================================================
// shadcn/ui primitives — generated via `npx shadcn add` against base-maia
// =============================================================================
export * from './components/ui/accordion'
export * from './components/ui/alert'
export * from './components/ui/alert-dialog'
export * from './components/ui/aspect-ratio'
export * from './components/ui/avatar'
export * from './components/ui/badge'
export * from './components/ui/breadcrumb'
export * from './components/ui/button'
export * from './components/ui/calendar'
export * from './components/ui/card'
export * from './components/ui/carousel'
export * from './components/ui/chart'
export * from './components/ui/checkbox'
export * from './components/ui/collapsible'
export * from './components/ui/command'
export * from './components/ui/context-menu'
export * from './components/ui/dialog'
export * from './components/ui/drawer'
export * from './components/ui/dropdown-menu'
export * from './components/ui/hover-card'
export * from './components/ui/input'
export * from './components/ui/input-group'
export * from './components/ui/input-otp'
export * from './components/ui/label'
export * from './components/ui/menubar'
export * from './components/ui/navigation-menu'
export * from './components/ui/pagination'
export * from './components/ui/popover'
export * from './components/ui/progress'
export * from './components/ui/radio-group'
export * from './components/ui/resizable'
export * from './components/ui/scroll-area'
export * from './components/ui/select'
export * from './components/ui/separator'
export * from './components/ui/sheet'
export * from './components/ui/sidebar'
export * from './components/ui/skeleton'
export * from './components/ui/slider'
export * from './components/ui/spinner'
export * from './components/ui/sonner'
export * from './components/ui/switch'
export * from './components/ui/table'
export * from './components/ui/tabs'
export * from './components/ui/textarea'
export * from './components/ui/toggle'
export * from './components/ui/toggle-group'
export * from './components/ui/tooltip'

// =============================================================================
// Hooks, utilities, tokens
// =============================================================================
export { useIsMobile } from './hooks/use-mobile'
export { cn } from './lib/utils'
export * from './tokens'
