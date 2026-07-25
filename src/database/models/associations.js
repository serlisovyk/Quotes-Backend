import Category from './category.model.js'
import Quote from './quote.model.js'
import QuoteCategory from './quote-category.model.js'

Quote.belongsToMany(Category, { through: QuoteCategory })
Category.belongsToMany(Quote, { through: QuoteCategory })
