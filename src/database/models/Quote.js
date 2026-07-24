import { TEXT, STRING } from 'sequelize'
import sequelize from '../db.js'
import { formatQuoteCategoriesAfterFind } from './hooks/quoteHooks.js'

const Quote = sequelize.define(
  'Quote',
  {
    text: { type: TEXT, allowNull: false },
    author: { type: STRING },
  },
  { hooks: { afterFind: formatQuoteCategoriesAfterFind } },
)

export default Quote
