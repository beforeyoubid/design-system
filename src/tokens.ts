// Design tokens for non-CSS contexts (Stripe Elements, canvas, charts, emails).
// In the DOM, use the Tailwind utilities (`bg-mint-45`, `text-h1`) instead.
//
// The defaults are generated from globals.css (src/generated/default-tokens.ts),
// so they always match the CSS. An app that overrides a CSS variable passes the
// same value here, so its JS and CSS stay in step:
//
//   // app/theme.ts — the one place the app reads tokens from
//   export const tokens = generateDesignSystemTokens({
//     overrides: { colors: { mint45: '#00A08A' } },
//   })
//
//   tokens.colors.mint45           // '#00A08A'
//   tokens.colors.primary          // '#00A08A': a role follows its colour token
//   tokens.typography.h1.fontSize  // '40px'
import {
  defaultBadgeProductAliases,
  defaultColors,
  defaultSemanticAliases,
  defaultTypography,
} from './generated/default-tokens'

export type BrandColorToken = keyof typeof defaultColors
export type SemanticColorToken = keyof typeof defaultSemanticAliases
/** A brand colour (`mint45`) or a semantic role (`primary`, `mutedForeground`). */
export type ColorToken = BrandColorToken | SemanticColorToken
export type BadgeProductToken = keyof typeof defaultBadgeProductAliases
export type TypographyToken = keyof typeof defaultTypography

export interface TypographyStyle {
  fontSize: string
  lineHeight: string
  fontWeight: number
  letterSpacing?: string
  textTransform?: 'uppercase'
}

export interface DesignSystemTokens {
  /** Brand colours and semantic roles. Each role follows its brand colour unless overridden directly. */
  colors: Record<ColorToken, string>
  /** Product badge colours. Each follows its colour token unless overridden directly. */
  badgeProductColors: Record<BadgeProductToken, string>
  typography: Record<TypographyToken, TypographyStyle>
}

export interface GenerateDesignSystemTokensOptions {
  /** Values the app sets differently from the design system, matching its CSS overrides. */
  overrides?: {
    colors?: Partial<Record<ColorToken, string>>
    badgeProductColors?: Partial<Record<BadgeProductToken, string>>
    typography?: Partial<Record<TypographyToken, Partial<TypographyStyle>>>
  }
}

export function generateDesignSystemTokens(
  options: GenerateDesignSystemTokensOptions = {},
): DesignSystemTokens {
  const { overrides = {} } = options

  const brand = Object.fromEntries(
    (Object.keys(defaultColors) as BrandColorToken[]).map((token) => [token, overrides.colors?.[token] ?? defaultColors[token]]),
  ) as Record<BrandColorToken, string>

  const semantic = Object.fromEntries(
    (Object.keys(defaultSemanticAliases) as SemanticColorToken[]).map((role) => [
      role,
      overrides.colors?.[role] ?? brand[defaultSemanticAliases[role]],
    ]),
  ) as Record<SemanticColorToken, string>

  const colors: Record<ColorToken, string> = { ...brand, ...semantic }

  const badgeProductColors = Object.fromEntries(
    (Object.keys(defaultBadgeProductAliases) as BadgeProductToken[]).map((product) => [
      product,
      overrides.badgeProductColors?.[product] ?? colors[defaultBadgeProductAliases[product]],
    ]),
  ) as Record<BadgeProductToken, string>

  const typography = Object.fromEntries(
    (Object.keys(defaultTypography) as TypographyToken[]).map((style) => [
      style,
      { ...defaultTypography[style], ...overrides.typography?.[style] },
    ]),
  ) as Record<TypographyToken, TypographyStyle>

  return { colors, badgeProductColors, typography }
}
