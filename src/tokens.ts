// Typography tokens — mirrors Figma "font / plus jakarta sans" without the family prefix.
// Semi-bold headings always pair with letterSpacing: '-0.005em' (tracking-heading class).
// Button styles are uppercase with letterSpacing: '0.04em' (tracking-btn class).
export const typography = {
  // Semi-bold (600) — headings
  displaySm:    { fontSize: '52px', lineHeight: '1.2',  fontWeight: 600, letterSpacing: '-0.005em' },
  headingLg:    { fontSize: '40px', lineHeight: '1.2',  fontWeight: 600, letterSpacing: '-0.005em' },
  heading3xl:   { fontSize: '36px', lineHeight: '1.2',  fontWeight: 600, letterSpacing: '-0.005em' },
  headingMd:    { fontSize: '28px', lineHeight: '1.2',  fontWeight: 600, letterSpacing: '-0.005em' },
  headingBase:  { fontSize: '24px', lineHeight: '1.2',  fontWeight: 600, letterSpacing: '-0.005em' },
  headingSm:    { fontSize: '20px', lineHeight: '1.3',  fontWeight: 600 },
  // Regular (400) — body
  bodyLg:   { fontSize: '18px', lineHeight: '1.4', fontWeight: 400 },
  bodyMd:   { fontSize: '16px', lineHeight: '1.4', fontWeight: 400 },
  bodySm:   { fontSize: '13px', lineHeight: '1.4', fontWeight: 400 },
  caption:  { fontSize: '12px', lineHeight: '1.4', fontWeight: 400 },
  textXs:   { fontSize: '10px', lineHeight: '1.4', fontWeight: 400 },
  text2xs:  { fontSize: '8px',  lineHeight: '1.4', fontWeight: 400 },
  // Medium (500) — Figma: medium scale
  medium5xl:  { fontSize: '52px', lineHeight: '1.2', fontWeight: 500 },
  medium4xl:  { fontSize: '40px', lineHeight: '1.2', fontWeight: 500 },
  medium3xl:  { fontSize: '36px', lineHeight: '1.2', fontWeight: 500 },
  medium2xl:  { fontSize: '28px', lineHeight: '1.2', fontWeight: 500 },
  mediumXl:   { fontSize: '24px', lineHeight: '1.2', fontWeight: 500 },
  mediumLg:   { fontSize: '18px', lineHeight: '1.2', fontWeight: 500 },
  mediumBase: { fontSize: '16px', lineHeight: '1.2', fontWeight: 500 },
  mediumSm:   { fontSize: '13px', lineHeight: '1.2', fontWeight: 500 },
  mediumXs:   { fontSize: '10px', lineHeight: '1.2', fontWeight: 500 },
  medium2xs:  { fontSize: '8px',  lineHeight: '1.2', fontWeight: 500 },
  // Button (600, uppercase + 0.04em letter-spacing — also applied globally via globals.css)
  btnLg: { fontSize: '18px', lineHeight: '1.3', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' as const },
  btnMd: { fontSize: '16px', lineHeight: '1.3', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' as const },
  btnSm: { fontSize: '13px', lineHeight: '1.3', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' as const },
} as const

export type TypographyToken = keyof typeof typography

export const colors = {
  // Brand
  navy:   '#090034',
  lime:   '#D4F269',
  limeL1: '#EAF8B0',
  cobalt:   '#015AFF',
  cobaltL1: '#C8D0FB',
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
  category01: '#00BCD4',
  category02: '#0097A7',
  category03: '#29B6F6',
  category04: '#0288D1',
  category05: '#4E342E',
  category06: '#6D4C41',
  category07: '#3D0C11',
  category08: '#880E4F',
  category09: '#E91E63',
  category10: '#7B1FA2',
  category11: '#9357FD',
  category12: '#673AB7',
  category13: '#9E9E9E',
  category14: '#BDBDBD',
  category15: '#555555',
  category16: '#262323',
} as const

export type ColorToken = keyof typeof colors
