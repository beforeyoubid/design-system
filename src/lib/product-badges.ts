import {
  BadgeCheck,
  Bug,
  Building,
  Building2,
  Calculator,
  ClipboardCheck,
  Construction,
  Droplets,
  FlaskConical,
  Gavel,
  HardHat,
  HousePlus,
  KeyRound,
  Leaf,
  TrendingDown,
  Users,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react"

/**
 * Every BYB product badge: its token key, display name, Lucide icon and the
 * Tailwind classes for its colour. Mirrors the Confluence "Product Badges"
 * page and the `--badge-product-*` tokens in globals.css.
 *
 * Class strings are written out in full (not built at runtime) so Tailwind
 * can see them when scanning `dist/`.
 */
const productBadges = [
  { key: "bpi", label: "Building & Pest Inspection", icon: Bug, bg: "bg-badge-product-bpi", text: "text-badge-product-bpi" },
  { key: "building-inspection", label: "Building Inspection", icon: Building2, bg: "bg-badge-product-building-inspection", text: "text-badge-product-building-inspection" },
  { key: "pest-inspection", label: "Pest Inspection", icon: Bug, bg: "bg-badge-product-pest-inspection", text: "text-badge-product-pest-inspection" },
  { key: "strata-report", label: "Strata Inspection", icon: Building, bg: "bg-badge-product-strata-report", text: "text-badge-product-strata-report" },
  { key: "owners-corp-cert", label: "Owners Corporation Certificate (VIC)", icon: Gavel, bg: "bg-badge-product-owners-corp-cert", text: "text-badge-product-owners-corp-cert" },
  { key: "pool-inspection", label: "Pool Inspection", icon: Waves, bg: "bg-badge-product-pool-inspection", text: "text-badge-product-pool-inspection" },
  { key: "electrical-report", label: "Electrical Inspection", icon: Zap, bg: "bg-badge-product-electrical-report", text: "text-badge-product-electrical-report" },
  { key: "electrical-safety-cert", label: "Electrical Safety Certificate", icon: BadgeCheck, bg: "bg-badge-product-electrical-safety-cert", text: "text-badge-product-electrical-safety-cert" },
  { key: "plumbing-report", label: "Plumbing Inspection", icon: Droplets, bg: "bg-badge-product-plumbing-report", text: "text-badge-product-plumbing-report" },
  { key: "handover-inspection", label: "Handover Inspection", icon: KeyRound, bg: "bg-badge-product-handover-inspection", text: "text-badge-product-handover-inspection" },
  { key: "valuations", label: "Valuations", icon: Calculator, bg: "bg-badge-product-valuations", text: "text-badge-product-valuations" },
  { key: "asbestos-testing", label: "Asbestos Testing", icon: FlaskConical, bg: "bg-badge-product-asbestos-testing", text: "text-badge-product-asbestos-testing" },
  { key: "dilapidation-report", label: "Dilapidation Report", icon: Construction, bg: "bg-badge-product-dilapidation-report", text: "text-badge-product-dilapidation-report" },
  { key: "depreciation-schedule", label: "Depreciation Schedule", icon: TrendingDown, bg: "bg-badge-product-depreciation-schedule", text: "text-badge-product-depreciation-schedule" },
  { key: "owner-builder-report", label: "Owner Builder Report", icon: HardHat, bg: "bg-badge-product-owner-builder-report", text: "text-badge-product-owner-builder-report" },
  { key: "minimum-standards", label: "Minimum Standards", icon: ClipboardCheck, bg: "bg-badge-product-minimum-standards", text: "text-badge-product-minimum-standards" },
  { key: "new-building-inspection", label: "New Build Inspection", icon: HousePlus, bg: "bg-badge-product-new-building-inspection", text: "text-badge-product-new-building-inspection" },
  { key: "home-energy-rating", label: "Home Energy Rating", icon: Leaf, bg: "bg-badge-product-home-energy-rating", text: "text-badge-product-home-energy-rating" },
  { key: "bmc", label: "BMC (Building Management Committee)", icon: Users, bg: "bg-badge-product-bmc", text: "text-badge-product-bmc" },
] as const satisfies readonly {
  key: string
  label: string
  icon: LucideIcon
  bg: string
  text: string
}[]

type ProductBadgeKey = (typeof productBadges)[number]["key"]
type ProductBadgeInfo = (typeof productBadges)[number]

const productBadgeByKey = Object.fromEntries(
  productBadges.map((p) => [p.key, p])
) as Record<ProductBadgeKey, ProductBadgeInfo>

export { productBadges, productBadgeByKey }
export type { ProductBadgeKey, ProductBadgeInfo }
