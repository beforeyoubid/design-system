// Typography tokens — mirrors Figma "font / plus jakarta sans" without the family prefix.
// Semi-bold headings always pair with letterSpacing: '-0.005em' (tracking-heading class).
// Button styles are uppercase with letterSpacing: '0.04em' (tracking-button class).
const typographyScale = {
  // Semi-bold (600): display + headings
  display1:   { fontSize: '72px', lineHeight: '1.05', fontWeight: 600, letterSpacing: '-0.005em' },
  display2:   { fontSize: '64px', lineHeight: '1.06', fontWeight: 600, letterSpacing: '-0.005em' },
  display3:   { fontSize: '56px', lineHeight: '1.08', fontWeight: 600, letterSpacing: '-0.005em' },
  display4:   { fontSize: '52px', lineHeight: '1.2',  fontWeight: 600, letterSpacing: '-0.005em' },
  h1:         { fontSize: '40px', lineHeight: '1.2',  fontWeight: 600, letterSpacing: '-0.005em' },
  h2:         { fontSize: '36px', lineHeight: '1.2',  fontWeight: 600, letterSpacing: '-0.005em' },
  h3:         { fontSize: '28px', lineHeight: '1.2',  fontWeight: 600, letterSpacing: '-0.005em' },
  h4:         { fontSize: '24px', lineHeight: '1.2',  fontWeight: 600, letterSpacing: '-0.005em' },
  h5:         { fontSize: '20px', lineHeight: '1.3',  fontWeight: 600, letterSpacing: '-0.005em' },
  h6:         { fontSize: '18px', lineHeight: '1.3',  fontWeight: 600, letterSpacing: '-0.005em' },
  // Regular (400): body + caption. For medium weight, pair with fontWeight: 500.
  body1:      { fontSize: '24px', lineHeight: '1.4', fontWeight: 400 },
  body2:      { fontSize: '20px', lineHeight: '1.4', fontWeight: 400 },
  body3:      { fontSize: '18px', lineHeight: '1.4', fontWeight: 400 },
  body4:      { fontSize: '16px', lineHeight: '1.4', fontWeight: 400 },
  body5:      { fontSize: '14px', lineHeight: '1.4', fontWeight: 400 },
  caption1:   { fontSize: '12px', lineHeight: '1.4', fontWeight: 400 },
  caption2:   { fontSize: '10px', lineHeight: '1.4', fontWeight: 400 },
  caption3:   { fontSize: '8px',  lineHeight: '1.4', fontWeight: 400 },
  // Semi-bold (600), uppercase + 0.04em letter-spacing
  overline:   { fontSize: '12px', lineHeight: '1.4', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' as const },
  buttonLg:   { fontSize: '18px', lineHeight: '1.3', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' as const },
  buttonMd:   { fontSize: '16px', lineHeight: '1.3', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' as const },
  buttonSm:   { fontSize: '14px', lineHeight: '1.3', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' as const },
} as const

export const typography = {
  ...typographyScale,
  // Deprecated aliases for the old display/heading/body/caption names — remove in the next major.
  /** @deprecated use `typography.display1` */
  displayXl: typographyScale.display1,
  /** @deprecated use `typography.display2` */
  displayLg: typographyScale.display2,
  /** @deprecated use `typography.display3` */
  displayMd: typographyScale.display3,
  /** @deprecated use `typography.display4` */
  displaySm: typographyScale.display4,
  /** @deprecated use `typography.h1` */
  headingXl: typographyScale.h1,
  /** @deprecated use `typography.h2` */
  headingLg: typographyScale.h2,
  /** @deprecated use `typography.h3` */
  headingMd: typographyScale.h3,
  /** @deprecated use `typography.h4` */
  headingSm: typographyScale.h4,
  /** @deprecated use `typography.h5` */
  headingXs: typographyScale.h5,
  /** @deprecated use `typography.body1` */
  body2xl: typographyScale.body1,
  /** @deprecated use `typography.body2` */
  bodyXl: typographyScale.body2,
  /** @deprecated use `typography.body3` */
  bodyLg: typographyScale.body3,
  /** @deprecated use `typography.body4` */
  bodyMd: typographyScale.body4,
  /** @deprecated use `typography.body5` */
  bodySm: typographyScale.body5,
  /** @deprecated use `typography.caption1` */
  caption: typographyScale.caption1,
  /** @deprecated use `typography.caption2` */
  captionSm: typographyScale.caption2,
  /** @deprecated use `typography.caption3` */
  captionXs: typographyScale.caption3,
} as const

export type TypographyToken = keyof typeof typography

export const colors = {
  // Brand
  navy:   '#090034',
  lime:   '#D4F269',
  limeL1: '#EAF8B0',
  electricBlue:   '#015AFF',
  electricBlueL1: '#C8D0FB',
  teal:     '#35BDB2',
  tealL1:   '#BFE8E6',
  // Mint (Primary)
  mint90: '#005246',
  mint75: '#007A69',
  mint60: '#009E87',
  mint45: '#00AE95',
  mint30: '#4FC3AE',
  mint15: '#6BCCBB',
  mintL1: '#ABE2D8',
  mintL2: '#D2EFEA',
  mintL3: '#E1F5F1',
  mintL4: '#F4FBFA',
  // Dark (Neutrals)
  dark100: '#16181D',
  dark90:  '#444A5A',
  dark75:  '#656E85',
  dark60:  '#858EA3',
  dark45:  '#A5ABBB',
  dark30:  '#C2C6D1',
  dark15:  '#DFE1E7',
  // Light (Neutrals)
  white:      '#FFFFFF',
  lightSandy: '#F8F3EE',
  lightL1:    '#F9FAFB',
  lightL2:    '#F2F4F7',
  lightL3:    '#EAECF0',
  // Success
  success90: '#0D492E',
  success75: '#15754A',
  success60: '#1C9B62',
  success45: '#22B976',
  success30: '#34DA90',
  success15: '#9CEDC9',
  successL1: '#E9FBF3',
  // Error
  error90: '#7C1A12',
  error75: '#BF271C',
  error60: '#E5584D',
  error45: '#ED8A83',
  error30: '#F3AFAB',
  error15: '#F8D5D3',
  errorL1: '#FDF2F2',
  errorL2: '#FEFBFB',
  // Warning
  warning75: '#906809',
  warning60: '#B68205',
  warning45: '#D49702',
  warning30: '#FDB402',
  warning15: '#FED776',
  warningL1: '#FEEDC1',
  warningL2: '#FEF5DC',
  warningL3: '#FFF9EB',
  // Category colours
  category01: '#068091',
  category02: '#026772',
  category03: '#037DAE',
  category04: '#016299',
  category05: '#4E342E',
  category06: '#6D4C41',
  category07: '#3D0C11',
  category08: '#880E4F',
  category09: '#E4145F',
  category10: '#7B1FA2',
  category11: '#8C4FF5',
  category12: '#673AB7',
  category13: '#757575',
  category14: '#616161',
  category15: '#555555',
  category16: '#262323',
  category17: '#2E7D32',
  category18: '#C2410C',
  category19: '#303F9F',
  category20: '#00796B',
  category21: '#33691E',
  category22: '#827717',
  category23: '#8A6100',
  category24: '#B91C1C',
  category25: '#1565C0',
  category26: '#AD1457',
  category27: '#37474F',
  category28: '#9A3412',
  category29: '#065F46',
  category30: '#4A148C',
  category31: '#9F1239',
  category32: '#A21CAF',
  category33: '#004D40',
  category34: '#546E7A',
  category35: '#5C6BC0',
} as const

export type ColorToken = keyof typeof colors

// Product badge colours — each product aliases a category colour.
// Mirrors --badge-product-* in globals.css.
export const badgeProductColors = {
  bpi: colors.category01,
  buildingInspection: colors.category02,
  pestInspection: colors.category03,
  strataReport: colors.category04,
  ownersCorpCert: colors.category05,
  poolInspection: colors.category06,
  electricalReport: colors.category07,
  electricalSafetyCert: colors.category08,
  plumbingReport: colors.category09,
  handoverInspection: colors.category10,
  valuations: colors.category11,
  asbestosTesting: colors.category12,
  dilapidationReport: colors.category13,
  depreciationSchedule: colors.category14,
  ownerBuilderReport: colors.category15,
  minimumStandards: colors.category16,
  newBuildingInspection: colors.category17,
  homeEnergyRating: colors.category18,
  bmc: colors.category19,
} as const

export type BadgeProductToken = keyof typeof badgeProductColors
