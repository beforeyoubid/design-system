module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended', 'plugin:storybook/recommended'],
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
  overrides: [
    {
      // shadcn-generated primitives frequently use library-specific data
      // attributes (cmdk-*, data-radix-*, vaul-*) that aren't recognised by
      // React's prop-types check. Loosen the rule for that directory only.
      files: ['src/components/ui/**/*.{ts,tsx}'],
      rules: {
        'react/no-unknown-property': 'off',
      },
    },
  ],
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
}
