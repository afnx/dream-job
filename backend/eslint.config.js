const globals = require('globals');
const js = require('@eslint/js');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
    js.configs.recommended,
    {
        ignores: [
            'prisma/generated/**/*',
            'node_modules/**/*',
            'dist/**/*',
            'build/**/*'
        ]
    },
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
                ...globals.es2021,
            },
        },
        rules: {
            // Node.js specific rules
            'no-console': 'warn',
            'prefer-const': 'error',
            'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
            'no-process-exit': 'error',
        },
    },
    {
        // Test files configuration
        files: ['**/__tests__/**/*', '**/*.test.js', '**/*.test.cjs'],
        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },
    },
    {
        // Browser context files (for Playwright page.evaluate)
        files: ['**/scrapers/**/*.js', '**/site-adapters/**/*.js'],
        languageOptions: {
            globals: {
                ...globals.browser, // Adds document, window, etc.
            },
        },
    },
];