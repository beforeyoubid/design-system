export const colors = {
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
  // Navy
  navy: '#090034',
  // Dark (Neutrals)
  dark100: '#16181D',
  dark90: '#444A5A',
  dark75: '#656E85',
  dark60: '#858EA3',
  dark45: '#A5ABBB',
  dark30: '#C2C6D1',
  dark15: '#DFE1E7',
  // Light (Neutrals)
  lightWhite: '#FFFFFF',
  lightL1: '#F9FAFB',
  lightL2: '#F2F4F7',
  lightL3: '#EAECF0',
  // Lime — pending designer confirmation
  lime: '#D4F269',
  // Green (Success) — pending designer confirmation
  green: '#15803D',
} as const

export type ColorToken = keyof typeof colors
