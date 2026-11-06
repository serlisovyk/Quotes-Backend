import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

const parentImports = {
  group: ['../*', '../../*', '../../../*', '../../../../*'],
  message: 'Use a `#` alias instead of a relative `../` import (ai/rules/style.md).',
}

export default [
  { ignores: ['.claude', 'node_modules'] },
  js.configs.recommended,
  {
    files: ['src/**/*.js', 'eslint.config.js', 'vitest.config.js'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['src/**/*.js'],
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-restricted-imports': ['error', { patterns: [parentImports] }],
    },
  },
  {
    files: ['src/routes/**/*.js'],
    ignores: ['**/*.test.js'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            parentImports,
            {
              group: ['\\#services/*'],
              message: 'A router never imports a service; the controller calls it.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/services/**/*.js'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'express', message: 'A service knows nothing about HTTP.' },
            {
              name: 'express-validator',
              message: 'A service does not validate request input.',
            },
          ],
          patterns: [parentImports],
        },
      ],
    },
  },
  {
    files: ['src/constants/**/*.js'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: '#models', message: 'Constants must not import a model.' },
          ],
          patterns: [
            parentImports,
            {
              group: ['\\#models/*'],
              message: 'Constants must not import a model.',
            },
          ],
        },
      ],
    },
  },
  prettier,
]
