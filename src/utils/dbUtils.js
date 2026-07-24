import pg from 'pg'
import {
  DB_DIALECT,
  DB_HOST,
  DB_PORT,
  DB_SSL,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
} from '../config/config.js'

export function getDatabaseUrl() {
  return `${DB_DIALECT}://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}`
}

export function getSequelizeOptions() {
  const options = {
    dialect: DB_DIALECT,
    dialectModule: pg,
    logging: false,
  }

  if (DB_SSL) {
    options.dialectOptions = {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  }

  return options
}
