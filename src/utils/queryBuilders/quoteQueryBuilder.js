import {
  ORDER_BY_ID_ASC,
  PUBLIC_MODEL_ATTRIBUTES,
  QUOTE_CATEGORY_INCLUDE,
} from '../../constants/queryOptions.js'
import { buildLikeFilters } from './queryFilterBuilder.js'

export const buildQuoteWhere = ({ author, text }) =>
  buildLikeFilters({ author, text })

export const buildQuoteCategoryInclude = (category) => {
  if (!category) return QUOTE_CATEGORY_INCLUDE

  return {
    ...QUOTE_CATEGORY_INCLUDE,
    where: { name: category },
  }
}

export const buildQuoteListQuery = ({ author, text, category }) => ({
  attributes: PUBLIC_MODEL_ATTRIBUTES,
  order: ORDER_BY_ID_ASC,
  where: buildQuoteWhere({ author, text }),
  include: buildQuoteCategoryInclude(category),
})

export const buildQuotesByIdsQuery = (ids) => ({
  attributes: PUBLIC_MODEL_ATTRIBUTES,
  order: ORDER_BY_ID_ASC,
  include: QUOTE_CATEGORY_INCLUDE,
  where: { id: ids },
})

export const buildQuoteDetailsQuery = () => ({
  attributes: PUBLIC_MODEL_ATTRIBUTES,
  include: QUOTE_CATEGORY_INCLUDE,
})

export const buildRandomQuotesQuery = (randomOrder, limit) => ({
  attributes: PUBLIC_MODEL_ATTRIBUTES,
  limit,
  order: randomOrder,
  include: QUOTE_CATEGORY_INCLUDE,
})
