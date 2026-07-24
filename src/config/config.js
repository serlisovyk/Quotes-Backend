import 'dotenv/config'

export const APP_PORT = process.env.APP_PORT

export const NODE_ENV = process.env.NODE_ENV

export const DATABASE_URL = process.env.DATABASE_URL
export const DB_DIALECT = process.env.DB_DIALECT || 'postgres'

export const CSV_IMPORT_BATCH_SIZE = process.env.CSV_IMPORT_BATCH_SIZE
export const CSV_IMPORT_BATCH_TIMEOUT = process.env.CSV_IMPORT_BATCH_TIMEOUT
