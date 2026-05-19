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
        // Navy + Brand Accents
        navy:   '#090034',
        lime:    '#D4F269',
        'lime-l1':'#EAF8B0',
        cobalt:     '#015AFF',
        'cobalt-l1':'#C8D0FB',
        teal:       '#35BDB2',
        'teal-l1':  '#BFE8E6',
        // Dark Neutrals
        'dark-100': '#16181D',
        'dark-90':  '#444A5A',
        'dark-75':  '#656E85',
        'dark-60':  '#858EA3',
        'dark-45':  '#A5ABBB',
        'dark-30':  '#C2C6D1',
        'dark-15':  '#DFE1E7',
        // Light Neutrals
        'light-l1':    '#F9FAFB',
        'light-l2':    '#F2F4F7',
        'light-l3':    '#EAECF0',
        'light-sandy': '#F8F3EE',
        white:         '#FFFFFF',
        // Success
        'success-90': '#0D492E',
        'success-75': '#15754A',
        'success-60': '#1C9B62',
        'success-45': '#22B976',
        'success-30': '#34DA90',
        'success-15': '#9CEDC9',
        'success-l1': '#E9FBF3',
        // Error
        'error-90': '#7C1A12',
        'error-75': '#BF271C',
        'error-60': '#E5584D',
        'error-45': '#ED8A83',
        'error-30': '#F3AFAB',
        'error-15': '#F8D5D3',
        'error-l1': '#FDF2F2',
        'error-l2': '#FEFBFB',
        // Warning
        'warning-75': '#906809',
        'warning-60': '#B68205',
        'warning-45': '#D49702',
        'warning-30': '#FDB402',
        'warning-15': '#FED776',
        'warning-l1': '#FEEDC1',
        'warning-l2': '#FEF5DC',
        'warning-l3': '#FFF9EB',
        // Overlays
        'overlay-95': '#16181DF2',
        'overlay-50': '#16181D80',
        // Transparent UI
        'button-a': '#F2F4F7CC',
        'button-b': '#C2C6D1CC',
        // Category colours (inspection service types)
        'category-01': '#00BCD4',
        'category-02': '#0097A7',
        'category-03': '#29B6F6',
        'category-04': '#0288D1',
        'category-05': '#4E342E',
        'category-06': '#6D4C41',
        'category-07': '#3D0C11',
        'category-08': '#880E4F',
        'category-09': '#E91E63',
        'category-10': '#7B1FA2',
        'category-11': '#9357FD',
        'category-12': '#673AB7',
        'category-13': '#9E9E9E',
        'category-14': '#BDBDBD',
        'category-15': '#555555',
        'category-16': '#262323',
      },
      maxWidth: {
        site: '1280px',
      },
      fontSize: {
        // Semi-bold headings (600) — pair with tracking-heading for correct letter-spacing
        'display-xl': ['72px', { lineHeight: '1.05', fontWeight: '600' }],
        'display':    ['56px', { lineHeight: '1.08', fontWeight: '600' }],
        'display-sm': ['52px', { lineHeight: '1.2',  fontWeight: '600' }],  //  semi bold / 5xl-52
        'heading-lg': ['40px', { lineHeight: '1.2',  fontWeight: '600' }],  //  semi bold / 4xl-40
        'heading-3xl': ['36px', { lineHeight: '1.2', fontWeight: '600' }],  // semi bold / 3xl-36
        'heading-md': ['28px', { lineHeight: '1.2',  fontWeight: '600' }],  // semi bold / 2xl-28
        'heading-base': ['24px', { lineHeight: '1.2', fontWeight: '600' }], //  semi bold / xl-24
        'heading-sm': ['20px', { lineHeight: '1.3',  fontWeight: '600' }],
        // Body / regular (400)
        'body-lg':    ['18px', { lineHeight: '1.4' }],  //  regular / regular-18
        'body-md':    ['16px', { lineHeight: '1.4' }],  // regular / base-16
        'body-sm':    ['13px', { lineHeight: '1.4' }],  // regular / sm-13
        'caption':    ['12px', { lineHeight: '1.4' }],
        'text-xs':    ['10px', { lineHeight: '1.4' }],  // regular / xs-10
        'text-2xs':   ['8px',  { lineHeight: '1.4' }],  // regular / 2xs-8
        // Medium weight (500) — Figma: medium scale, lh 1.2
        'medium-5xl':  ['52px', { lineHeight: '1.2', fontWeight: '500' }],
        'medium-4xl':  ['40px', { lineHeight: '1.2', fontWeight: '500' }],
        'medium-3xl':  ['36px', { lineHeight: '1.2', fontWeight: '500' }],
        'medium-2xl':  ['28px', { lineHeight: '1.2', fontWeight: '500' }],
        'medium-xl':   ['24px', { lineHeight: '1.2', fontWeight: '500' }],
        'medium-lg':   ['18px', { lineHeight: '1.2', fontWeight: '500' }],
        'medium-base': ['16px', { lineHeight: '1.2', fontWeight: '500' }],
        'medium-sm':   ['13px', { lineHeight: '1.2', fontWeight: '500' }],
        'medium-xs':   ['10px', { lineHeight: '1.2', fontWeight: '500' }],
        'medium-2xs':  ['8px',  { lineHeight: '1.2', fontWeight: '500' }],
        // Button text — semi-bold (600); uppercase + 0.04em letter-spacing applied globally via @layer utilities
        'btn-lg': ['18px', { lineHeight: '1.3', fontWeight: '600' }],
        'btn-md': ['16px', { lineHeight: '1.3', fontWeight: '600' }],
        'btn-sm': ['13px', { lineHeight: '1.3', fontWeight: '600' }],
      },
      letterSpacing: {
        'heading': '-0.005em',
        'btn':     '0.04em',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'marquee':        'marquee 35s linear infinite',
        'marquee-paused': 'marquee 35s linear infinite paused',
        'fade-in':        'fade-in 0.25s ease-out both',
      },
      borderRadius: {
        sm:   '4px',
        md:   '8px',
        lg:   '12px',
        xl:   '20px',
        btn:  '18px',
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
