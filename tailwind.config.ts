import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Mint (Primary)
        'mint-90': '#005246',
        'mint-75': '#007A69',
        'mint-60': '#009E87',
        'mint-45': '#00AE95',
        'mint-30': '#4FC3AE',
        'mint-15': '#6BCCBB',
        'mint-l1': '#ABE2D8',
        'mint-l2': '#D2EFEA',
        'mint-l3': '#E1F5F1',
        'mint-l4': '#F4FBFA',
        // Navy
        navy: 'var(--color-navy)',
        // Dark Neutrals
        'dark-100': '#16181D',
        'dark-90':  '#444A5A',
        'dark-75':  'var(--color-dark-75)',
        'dark-60':  '#858EA3',
        'dark-45':  '#A5ABBB',
        'dark-30':  '#C2C6D1',
        'dark-15':  '#DFE1E7',
        // Light Neutrals
        'light-white': '#FFFFFF',
        'light-l1': '#F9FAFB',
        'light-l2': '#F2F4F7',
        'light-l3': '#EAECF0',
        // Lime — pending designer confirmation
        lime: 'var(--color-lime)',
        // Green (Success) — pending designer confirmation
        green: {
          DEFAULT: '#15803D',
        },
      },
      maxWidth: {
        site: '1280px',
      },
      fontSize: {
        'display-xl': ['72px', { lineHeight: '1.05', fontWeight: '700' }],
        'display':    ['56px', { lineHeight: '1.08', fontWeight: '700' }],
        'heading-lg': ['40px', { lineHeight: '1.1',  fontWeight: '700' }],
        'heading-md': ['28px', { lineHeight: '1.2',  fontWeight: '700' }],
        'heading-sm': ['20px', { lineHeight: '1.3',  fontWeight: '600' }],
        'body-lg':    ['18px', { lineHeight: '1.6' }],
        'body-md':    ['16px', { lineHeight: '1.6' }],
        'body-sm':    ['14px', { lineHeight: '1.5' }],
        'caption':    ['12px', { lineHeight: '1.4' }],
      },
      borderRadius: {
        sm:   '4px',
        md:   '8px',
        lg:   '12px',
        xl:   '20px',
        full: '9999px',
      },
      spacing: {
        'section-sm': '48px',
        'section-md': '80px',
        'section-lg': '120px',
      },
    },
  },
  plugins: [],
}

export default config
