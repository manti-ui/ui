import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // `backlog/` holds frozen source for shelved components (see backlog/README.md).
    // It ships nowhere and is deliberately not held to the live packages' rules.
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      'storybook-static/**',
      'backlog/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Node build scripts (e.g. packages/styles/scripts/gen-tokens-css.mjs).
    files: ['**/*.mjs', '**/scripts/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
);
