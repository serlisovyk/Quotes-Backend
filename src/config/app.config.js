import 'dotenv/config'

export const APP_PORT = process.env.APP_PORT

export const DATABASE_URL = process.env.DATABASE_URL
export const DB_DIALECT = process.env.DB_DIALECT

export const CSV_IMPORT_BATCH_SIZE = Number(process.env.CSV_IMPORT_BATCH_SIZE)
export const CSV_IMPORT_BATCH_TIMEOUT = Number(process.env.CSV_IMPORT_BATCH_TIMEOUT)
