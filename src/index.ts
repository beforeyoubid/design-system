// =============================================================================
// BYB-opinionated components — domain-specific, no shadcn equivalent
// =============================================================================
export { Counter } from './components/counter'
export { PillCard } from './components/pill-card'
export { BYBImage } from './components/BYBImage'

// =============================================================================
// Form composites — thin wrappers around ui/input and ui/select that add
// label/hint/error slots.
// =============================================================================
export { InputField } from './components/InputField'
export type { InputFieldProps } from './components/InputField'
export { SelectField, productSelectOptions } from './components/SelectField'
export type { SelectFieldProps, SelectFieldOption, SelectFieldOptionGroup } from './components/SelectField'

// =============================================================================
// BYB components (Rey's design library) — product-specific, no shadcn equivalent
// =============================================================================
export * from './components/icon-tile'
export * from './components/color-dot'
export { Stepper, stepIndicatorVariants } from './components/stepper'
export type { StepperProps, StepperStep } from './components/stepper'

// =============================================================================
// BYB components kept for side-by-side review while their stock shadcn
// replacements are styled to match. Removed once the replacements are signed off.
// =============================================================================
export * from './components/BYBSpinner'
export { BYBEmptyState, bybEmptyStateVariants } from './components/BYBEmptyState'
export type { BYBEmptyStateProps } from './components/BYBEmptyState'
export { BYBFieldset } from './components/BYBFieldset'
export type { BYBFieldsetProps } from './components/BYBFieldset'
export { BYBDatePicker, BYBTimePicker, formatDateDMY } from './components/BYBDatePicker'
export type { BYBDatePickerProps, BYBTimePickerProps } from './components/BYBDatePicker'
export { BYBAttachment, BYBFileUploadCard, bybDropZoneVariants } from './components/BYBAttachment'
export type {
  BYBAttachmentProps,
  BYBAttachmentFile,
  BYBAttachmentStatus,
  BYBAttachmentUploadHandlers,
  BYBFileUploadCardProps,
} from './components/BYBAttachment'
export { BYBAreaChart } from './components/BYBAreaChart'
export type { BYBAreaChartProps, BYBAreaChartSeries, BYBAreaChartRange, BYBAreaChartDatum } from './components/BYBAreaChart'
export { BYBBarChart, bybStatToggleVariants } from './components/BYBBarChart'
export type { BYBBarChartProps, BYBBarChartSeries, BYBBarChartDatum } from './components/BYBBarChart'
export { ChartFrame, ChartLegendList, CHART_PALETTE } from './components/chart-frame'
export type { ChartFrameProps, ChartLegendListProps, ChartLegendItem } from './components/chart-frame'

// =============================================================================
// shadcn/ui primitives — generated via `npx shadcn add` against base-maia into
// components/ui/. Where we extend one (extra props or variants), our wrapper in
// components/<name>.tsx re-exports the stock module and is exported instead.
// =============================================================================
export * from './components/accordion'
export * from './components/ui/alert'
export * from './components/ui/alert-dialog'
export * from './components/ui/aspect-ratio'
export * from './components/ui/attachment'
export * from './components/ui/avatar'
export * from './components/badge'
export * from './components/ui/breadcrumb'
export * from './components/button'
export * from './components/ui/button-group'
export * from './components/calendar'
export * from './components/card'
export * from './components/ui/carousel'
export * from './components/ui/chart'
export * from './components/checkbox'
export * from './components/ui/collapsible'
export * from './components/ui/combobox'
export * from './components/ui/command'
export * from './components/ui/context-menu'
export * from './components/dialog'
export * from './components/confirm-dialog'
export * from './components/ui/direction'
export * from './components/ui/drawer'
export * from './components/dropdown-menu'
export * from './components/product-switcher'
export * from './components/empty'
export * from './components/ui/field'
export * from './components/ui/hover-card'
export * from './components/input'
export * from './components/input-group'
export * from './components/input-otp'
export * from './components/ui/item'
export * from './components/ui/kbd'
export * from './components/ui/label'
export * from './components/ui/menubar'
export * from './components/ui/native-select'
export * from './components/ui/navigation-menu'
export * from './components/pagination'
export * from './components/ui/popover'
export * from './components/ui/progress'
export * from './components/radio-group'
export * from './components/ui/resizable'
export * from './components/ui/scroll-area'
export * from './components/select'
export * from './components/ui/separator'
export * from './components/ui/sheet'
export * from './components/ui/sidebar'
export * from './components/ui/skeleton'
export * from './components/ui/slider'
export * from './components/ui/spinner'
export * from './components/switch'
export * from './components/table'
export * from './components/tabs'
export * from './components/ui/textarea'
export * from './components/toast'
export * from './components/ui/toggle'
export * from './components/ui/toggle-group'
export * from './components/ui/tooltip'

// =============================================================================
// Hooks, utilities, tokens
// =============================================================================
export { useIsMobile } from './hooks/use-mobile'
export { cn } from './lib/utils'
export * from './tokens'
export * from './lib/product-badges'
