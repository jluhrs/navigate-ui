// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  {
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      // Custom rules here
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    // Test-specific rules
    files: ['src/**/*.{spec,test}.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
  {
    files: ['*.js', '*.config.{js,ts}', '.husky/**/*.{js,ts}'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['*.js', '*.config.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    ignores: ['node_modules', 'dist', 'public', 'reports', 'src/gql/*/gen/*.ts'],
  },
);
