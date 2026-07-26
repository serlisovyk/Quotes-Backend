import Category from '#models/category.model'
import Quote from '#models/quote.model'
import QuoteCategory from '#models/quote-category.model'

Quote.belongsToMany(Category, { through: QuoteCategory })
Category.belongsToMany(Quote, { through: QuoteCategory })
