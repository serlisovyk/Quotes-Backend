import { TEXT, STRING } from 'sequelize'
import QuoteCategory from './QuoteCategory.js'
import Category from './Category.js'
import sequelize from '../database/db.js'
import { afterFindHook } from '../utils/utils.js'

const Quote = sequelize.define(
  'Quote',
  {
    text: { type: TEXT, allowNull: false },
    author: { type: STRING },
  },
  { hooks: { afterFind: afterFindHook } }
)

Quote.belongsToMany(Category, { through: QuoteCategory })
Category.belongsToMany(Quote, { through: QuoteCategory })

export default Quote
