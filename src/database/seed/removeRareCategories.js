import { QueryTypes } from 'sequelize'
import sequelize from '../db.js'
import Category from '../../models/Category.js'
import Quote from '../../models/Quote.js'
import QuoteCategory from '../../models/QuoteCategory.js'

async function removeRareCategories() {
  try {
    // STEP 1. Remove rare categories
    // Find categories that appear only in one or two quotes
    const rareCategories = await QuoteCategory.findAll({
      attributes: ['CategoryId'],
      group: ['CategoryId'],
      having: sequelize.literal('COUNT(*) <= 2'),
      raw: true,
      pluck: 'CategoryId',
    })

    const rareCategoryIds = rareCategories.map((category) => category.CategoryId)

    await Category.destroy({ where: { id: rareCategoryIds } })

    // STEP 2. Remove quotes without categories which are left after removal of the rare categories
    // Find quotes without categories
    const quotesWithoutCategories = await sequelize.query(
      `SELECT "Quotes".*
       FROM "Quotes"
       LEFT JOIN "QuoteCategories" ON "Quotes".id = "QuoteCategories"."QuoteId"
       WHERE "QuoteCategories"."CategoryId" IS NULL;`,
      { type: QueryTypes.SELECT }
    )

    // Get the IDs of the quotes without categories
    const quotesWithoutCategoriesIds = quotesWithoutCategories.map(
      (quote) => quote.id
    )

    // remove quotes without categories
    await Quote.destroy({ where: { id: quotesWithoutCategoriesIds } })

    console.log('Rare categories removed successfully.')
    console.log('Quotes without categories removed successfully.')
  } catch (error) {
    console.error('Error removing rare categories:', error)
  }
}

removeRareCategories()
