import Category from './Category.js'
import Quote from './Quote.js'
import QuoteCategory from './QuoteCategory.js'

Quote.belongsToMany(Category, { through: QuoteCategory })
Category.belongsToMany(Quote, { through: QuoteCategory })
