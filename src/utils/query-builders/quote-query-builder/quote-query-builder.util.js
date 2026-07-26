import {
  ORDER_BY_ID_ASC,
  PUBLIC_MODEL_ATTRIBUTES,
  QUOTE_CATEGORY_INCLUDE,
} from '../../../constants/query-options.constant.js'
import { buildLikeFilters } from '../query-filter-builder/index.js'

export function buildQuoteWhere({ author, text }) {
  return buildLikeFilters({ author, text })
}

export function buildQuoteCategoryInclude(category) {
  if (!category) return QUOTE_CATEGORY_INCLUDE

  return {
    ...QUOTE_CATEGORY_INCLUDE,
    where: { name: category },
  }
}

export function buildQuoteListQuery({ author, text, category }) {
  return {
    attributes: PUBLIC_MODEL_ATTRIBUTES,
    order: ORDER_BY_ID_ASC,
    where: buildQuoteWhere({ author, text }),
    include: buildQuoteCategoryInclude(category),
  }
}

export function buildQuotesByIdsQuery(ids) {
  return {
    attributes: PUBLIC_MODEL_ATTRIBUTES,
    order: ORDER_BY_ID_ASC,
    include: QUOTE_CATEGORY_INCLUDE,
    where: { id: ids },
  }
}

export function buildQuoteDetailsQuery() {
  return {
    attributes: PUBLIC_MODEL_ATTRIBUTES,
    include: QUOTE_CATEGORY_INCLUDE,
  }
}

export function buildRandomQuotesQuery(randomOrder, limit) {
  return {
    attributes: PUBLIC_MODEL_ATTRIBUTES,
    limit,
    order: randomOrder,
    include: QUOTE_CATEGORY_INCLUDE,
  }
}
