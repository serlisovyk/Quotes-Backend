import { defineConfig } from 'vitest/config'

if (!process.env.DATABASE_URL || !process.env.DB_DIALECT) {
  throw new Error(
    'Integration tests truncate the database: set DATABASE_URL and DB_DIALECT explicitly (a throwaway Postgres, see AGENTS.md)',
  )
}

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.int.test.js'],
    setupFiles: ['src/tests/integration/setup.js'],
    fileParallelism: false,
  },
})
