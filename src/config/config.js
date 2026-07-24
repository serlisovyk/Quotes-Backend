import 'dotenv/config'

export const APP_PORT = process.env.APP_PORT
export const NODE_ENV = process.env.NODE_ENV

export const CSV_IMPORT_BATCH_SIZE = process.env.CSV_IMPORT_BATCH_SIZE
export const CSV_IMPORT_BATCH_TIMEOUT = process.env.CSV_IMPORT_BATCH_TIMEOUT

export const DB_HOST = process.env.DB_HOST
export const DB_PORT = process.env.DB_PORT

export const POSTGRES_USER = process.env.POSTGRES_USER
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD
export const POSTGRES_DB = process.env.POSTGRES_DB

export const DB_DIALECT = process.env.DB_DIALECT
export const DB_SSL = process.env.DB_SSL
