import { Op } from 'sequelize'
import sequelize from '#database'
import { Category, Quote, QuoteCategory } from '#models'
import Logger from '#logger'
import closeDatabaseConnection from '#utils/database/close-database-connection'

const RARE_CATEGORY_MAX_QUOTES = 2

async function removeRareCategories() {
  try {
    const rareCategories = await QuoteCategory.findAll({
      attributes: ['CategoryId'],
      group: ['CategoryId'],
      having: sequelize.where(
        sequelize.fn('COUNT', sequelize.col('CategoryId')),
        Op.lte,
        RARE_CATEGORY_MAX_QUOTES,
      ),
      raw: true,
    })

    const rareCategoryIds = rareCategories.map(({ CategoryId }) => CategoryId)

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

    const quotesWithoutCategoriesIds = quotesWithoutCategories.map(({ id }) => id)

    if (quotesWithoutCategoriesIds.length) {
      await Quote.destroy({ where: { id: quotesWithoutCategoriesIds } })
      Logger.success('Quotes without categories removed successfully')
    } else {
      Logger.info('No quotes without categories found')
    }
  } catch (error) {
    Logger.error('Error removing rare categories', error)
    process.exitCode = 1
  } finally {
    await closeDatabaseConnection()
  }
}

removeRareCategories()
