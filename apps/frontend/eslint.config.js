import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '_backup', '**/src/_backup/**', 'scripts/**']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        process: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^(_|Icon$)', destructuredArrayIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.test.{js,jsx}', '**/__tests__/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        process: 'readonly',
        vi: 'readonly',
        vitest: 'readonly',
      },
    },
  },
  {
    files: ['tailwind.config.js', 'vite.config.js', 'vitest.config.js', 'scripts/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...reactHooks.configs['recommended-latest'].rules,
      'react-refresh/only-export-components': [
        'warn',
        { 
          allowConstantExport: true,
          allowExportNames: ['DEFAULT_SECURITY_CONFIG', 'SecurityMiddleware', 'useLockAccess'],
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^[A-Z_]' },
      ],
      'no-unused-vars': 'off', // Désactiver la règle de base pour utiliser celle de TypeScript
    },
  },
  {
    files: ['**/LockAccess/index.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['**/ui/button.jsx', '**/ui/form.jsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
