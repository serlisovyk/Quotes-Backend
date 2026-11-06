import sequelize from '#database'

const QuoteCategory = sequelize.define(
  'QuoteCategory',
  {},
  {
    indexes: [
      { name: 'QuoteCategories_CategoryId', fields: ['CategoryId'] },
      { name: 'QuoteCategories_QuoteId', fields: ['QuoteId'] },
    ],
  },
)

export default QuoteCategory
