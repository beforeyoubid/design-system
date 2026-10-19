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
//   tokens.typography.h1.fontSize  // '40px'
import {
  defaultBadgeProductAliases,
  defaultColors,
  defaultTypography,
} from './generated/default-tokens'

export type ColorToken = keyof typeof defaultColors
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

  const colors = { ...defaultColors, ...overrides.colors } as Record<ColorToken, string>

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
