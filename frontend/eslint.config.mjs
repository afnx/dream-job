import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    languageOptions: {
      globals: {
        // Browser globals
        fetch: 'readonly',
        RequestInit: 'readonly',
        Response: 'readonly',
        Headers: 'readonly',
        Request: 'readonly',
        // Node.js process for environment variables
        process: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'destructuredArrayIgnorePattern': '^_',
        'ignoreRestSiblings': true
      }],

      '@next/next/google-font-display': 'error',
      '@next/next/google-font-preconnect': 'error',
      '@next/next/inline-script-id': 'error',
      '@next/next/next-script-for-ga': 'error',
      '@next/next/no-assign-module-variable': 'error',
      '@next/next/no-async-client-component': 'error',
      '@next/next/no-before-interactive-script-outside-document': 'error',
      '@next/next/no-css-tags': 'error',
      '@next/next/no-document-import-in-page': 'error',
      '@next/next/no-duplicate-head': 'error',
      '@next/next/no-head-element': 'error',
      '@next/next/no-head-import-in-document': 'error',
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'error',
      '@next/next/no-page-custom-font': 'error',
      '@next/next/no-script-component-in-head': 'error',
      '@next/next/no-styled-jsx-in-document': 'error',
      '@next/next/no-sync-scripts': 'error',
      '@next/next/no-title-in-document-head': 'error',
      '@next/next/no-typos': 'error',
      '@next/next/no-unwanted-polyfillio': 'error',
      'react-hooks/set-state-in-effect': 'off', // TODO: enable this after fixing existing issues
    },
  },
])

export default eslintConfig