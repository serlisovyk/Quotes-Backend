import { TEXT, STRING } from 'sequelize'
import sequelize from '#database'
import { formatQuoteCategoriesAfterFind } from '#models/hooks'

const Quote = sequelize.define(
  'Quote',
  {
    text: { type: TEXT, allowNull: false },
    author: { type: STRING },
  },
  { hooks: { afterFind: formatQuoteCategoriesAfterFind } },
)

export default Quote
