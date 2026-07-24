import { Sequelize } from 'sequelize'
import { getDatabaseUrl, getSequelizeOptions } from '../utils/dbUtils.js'

const sequelize = new Sequelize(getDatabaseUrl(), getSequelizeOptions())

export default sequelize
