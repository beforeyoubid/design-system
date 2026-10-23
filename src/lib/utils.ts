import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Extend tailwind-merge with every custom design-system token so it correctly
// classifies our text-color and font-size utilities and never drops one when
// the other appears in the same class list (e.g. text-mint-75 + text-button-md).
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            // Display + heading (600)
            'display-1', 'display-2', 'display-3', 'display-4',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            // Body + caption (400)
            'body-1', 'body-2', 'body-3', 'body-4', 'body-5',
            'caption-1', 'caption-2', 'caption-3',
            // Uppercase UI text (600)
            'overline', 'button-lg', 'button-md', 'button-sm',
          ],
        },
      ],
      'text-color': [
        {
          text: [
            // Mint scale
            'mint-90', 'mint-75', 'mint-60', 'mint-45', 'mint-30', 'mint-15',
            'mint-l1', 'mint-l2', 'mint-l3', 'mint-l4',
            // Brand
            'navy', 'lime', 'lime-l1', 'electric-blue', 'electric-blue-l1', 'teal', 'teal-l1',
            // Dark neutrals
            'dark-100', 'dark-90', 'dark-75', 'dark-60', 'dark-45', 'dark-30', 'dark-15',
            // Light neutrals
            'light-l1', 'light-l2', 'light-l3', 'light-sandy', 'white',
            // Success
            'success-90', 'success-75', 'success-60', 'success-45', 'success-30', 'success-15', 'success-l1',
            // Error
            'error-90', 'error-75', 'error-60', 'error-45', 'error-30', 'error-15', 'error-l1', 'error-l2',
            // Warning
            'warning-75', 'warning-60', 'warning-45', 'warning-30', 'warning-15',
            'warning-l1', 'warning-l2', 'warning-l3',
            // Category palette (data-viz)
            'category-01', 'category-02', 'category-03', 'category-04', 'category-05',
            'category-06', 'category-07', 'category-08', 'category-09', 'category-10',
            'category-11', 'category-12', 'category-13', 'category-14', 'category-15',
            'category-16',
            'category-17', 'category-18', 'category-19', 'category-20', 'category-21',
            'category-22', 'category-23', 'category-24', 'category-25', 'category-26',
            'category-27', 'category-28', 'category-29', 'category-30', 'category-31',
            'category-32', 'category-33', 'category-34', 'category-35',
            // Product badges
            'badge-product-bpi', 'badge-product-building-inspection', 'badge-product-pest-inspection',
            'badge-product-strata-report', 'badge-product-owners-corp-cert', 'badge-product-pool-inspection',
            'badge-product-electrical-report', 'badge-product-electrical-safety-cert', 'badge-product-plumbing-report',
            'badge-product-handover-inspection', 'badge-product-valuations', 'badge-product-asbestos-testing',
            'badge-product-dilapidation-report', 'badge-product-depreciation-schedule', 'badge-product-owner-builder-report',
            'badge-product-minimum-standards', 'badge-product-new-building-inspection', 'badge-product-home-energy-rating',
            'badge-product-bmc',
            // Semantic (shadcn slots)
            'background', 'foreground',
            'card', 'card-foreground', 'popover', 'popover-foreground',
            'primary', 'primary-foreground',
            'secondary', 'secondary-foreground',
            'muted', 'muted-foreground',
            'accent', 'accent-foreground',
            'destructive', 'destructive-foreground',
            'success-foreground', 'warning-foreground',
            'border', 'input', 'ring',
            'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5',
            'sidebar', 'sidebar-foreground',
            'sidebar-primary', 'sidebar-primary-foreground',
            'sidebar-accent', 'sidebar-accent-foreground',
            'sidebar-border', 'sidebar-ring',
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
