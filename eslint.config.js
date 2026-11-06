import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

const SOURCE_FILES = 'src/**/*.js'
const NODE_FILES = [SOURCE_FILES, 'eslint.config.js', 'vitest.config.js']
const ROUTES_FILES = 'src/routes/**/*.js'
const SERVICES_FILES = 'src/services/**/*.js'
const CONSTANTS_FILES = 'src/constants/**/*.js'
const TEST_FILES = '**/*.test.js'

const PARENT_IMPORT_GROUP = ['../*', '../../*', '../../../*', '../../../../*']
const SERVICES_IMPORT_GROUP = ['\\#services/*']
const MODELS_IMPORT_GROUP = ['\\#models/*']

const PARENT_IMPORT_MESSAGE =
  'Use a `#` alias instead of a relative `../` import (ai/rules/style.md).'
const SERVICES_IMPORT_MESSAGE =
  'A router never imports a service; the controller calls it.'
const EXPRESS_IMPORT_MESSAGE = 'A service knows nothing about HTTP.'
const VALIDATOR_IMPORT_MESSAGE = 'A service does not validate request input.'
const MODELS_IMPORT_MESSAGE = 'Constants must not import a model.'

const restrictImports = ({ paths = [], patterns = [] } = {}) => [
  'error',
  {
    paths,
    patterns: [
      { group: PARENT_IMPORT_GROUP, message: PARENT_IMPORT_MESSAGE },
      ...patterns,
    ],
  },
]

export default defineConfig([
  globalIgnores(['.claude', 'node_modules']),
  {
    files: ['**/*.js'],
    extends: [js.configs.recommended],
  },
  {
    files: NODE_FILES,
    languageOptions: { globals: globals.node },
  },
  {
    files: [SOURCE_FILES],
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-restricted-imports': restrictImports(),
    },
  },
  {
    files: [ROUTES_FILES],
    ignores: [TEST_FILES],
    rules: {
      'no-restricted-imports': restrictImports({
        patterns: [
          { group: SERVICES_IMPORT_GROUP, message: SERVICES_IMPORT_MESSAGE },
        ],
      }),
    },
  },
  {
    files: [SERVICES_FILES],
    rules: {
      'no-restricted-imports': restrictImports({
        paths: [
          { name: 'express', message: EXPRESS_IMPORT_MESSAGE },
          { name: 'express-validator', message: VALIDATOR_IMPORT_MESSAGE },
        ],
      }),
    },
  },
  {
    files: [CONSTANTS_FILES],
    rules: {
      'no-restricted-imports': restrictImports({
        paths: [{ name: '#models', message: MODELS_IMPORT_MESSAGE }],
        patterns: [{ group: MODELS_IMPORT_GROUP, message: MODELS_IMPORT_MESSAGE }],
      }),
    },
  },
  prettier,
])
