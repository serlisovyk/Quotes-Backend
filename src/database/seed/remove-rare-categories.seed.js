import { Op } from 'sequelize'
import sequelize from '../db.js'
import Category from '../models/category.model.js'
import Quote from '../models/quote.model.js'
import QuoteCategory from '../models/quote-category.model.js'
import Logger from '../../logger/logger.service.js'
import '../models/associations.js'

async function removeRareCategories() {
  try {
    const rareCategories = await QuoteCategory.findAll({
      attributes: ['CategoryId'],
      group: ['CategoryId'],
      having: sequelize.where(
        sequelize.fn('COUNT', sequelize.col('CategoryId')),
        Op.lte,
        2,
      ),
      raw: true,
    })

    const rareCategoryIds = rareCategories.map((category) => category.CategoryId)

    if (rareCategoryIds.length) {
      await Category.destroy({ where: { id: rareCategoryIds } })
      Logger.success('Rare categories removed successfully')
    } else {
      Logger.info('No rare categories found')
    }

    const quotesWithoutCategories = await Quote.findAll({
      include: {
        model: Category,
        attributes: [],
        through: { attributes: [] },
        required: false,
      },
      where: {
        '$Categories.id$': null,
      },
    })

    const quotesWithoutCategoriesIds = quotesWithoutCategories.map(
      (quote) => quote.id,
    )

    if (quotesWithoutCategoriesIds.length) {
      await Quote.destroy({ where: { id: quotesWithoutCategoriesIds } })
      Logger.success('Quotes without categories removed successfully')
    } else {
      Logger.info('No quotes without categories found')
    }
  } catch (error) {
    Logger.error('Error removing rare categories', error)
  }
}

removeRareCategories()
