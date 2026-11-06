import { col, fn, Op, where as sqlWhere } from 'sequelize'
import { Category } from '#models'
import {
  buildAnyLikeFilter,
  buildLikeFilters,
} from '#utils/query-builders/query-filter-builder'
import {
  DEFAULT_QUOTE_SORT,
  DEFAULT_SORT_ORDER,
  PUBLIC_MODEL_ATTRIBUTES,
  QUOTE_SEARCH_FIELDS,
  QUOTE_SORT_FIELDS,
  QUOTE_TIEBREAKER_ORDER,
  SORT_DIRECTION,
} from '#constants'

export const QUOTE_CATEGORY_INCLUDE = {
  model: Category,
  attributes: ['name'],
  through: { attributes: [] },
}

export function buildQuoteWhere({ author, text, search }) {
  return {
    ...buildLikeFilters({ author, text }),
    ...buildAnyLikeFilter(QUOTE_SEARCH_FIELDS, search),
  }
}

export function buildQuoteOrder({
  sort = DEFAULT_QUOTE_SORT,
  order = DEFAULT_SORT_ORDER,
} = {}) {
  const sortOrder = [sort, SORT_DIRECTION[order]]
  const isSortedById = sort === DEFAULT_QUOTE_SORT

  if (isSortedById) return [sortOrder]

  return [sortOrder, QUOTE_TIEBREAKER_ORDER]
}

export function buildQuoteCategoryInclude(category) {
  if (!category) return QUOTE_CATEGORY_INCLUDE

  return {
    ...QUOTE_CATEGORY_INCLUDE,
    where: { name: category },
  }
}

export function buildQuoteListQuery({
  author,
  text,
  search,
  category,
  sort,
  order,
}) {
  return {
    attributes: QUOTE_SORT_FIELDS,
    order: buildQuoteOrder({ sort, order }),
    where: buildQuoteWhere({ author, text, search }),
    include: buildQuoteCategoryInclude(category),
  }
}

export function buildQuotesByIdsQuery(ids, { sort, order } = {}) {
  return {
    attributes: PUBLIC_MODEL_ATTRIBUTES,
    order: buildQuoteOrder({ sort, order }),
    include: QUOTE_CATEGORY_INCLUDE,
    where: { id: ids },
  }
}

export function buildDuplicateQuoteQuery({ text, author, excludeId }) {
  const matchFilter = {
    [Op.and]: [
      sqlWhere(fn('lower', col('text')), text.toLowerCase()),
      sqlWhere(fn('lower', col('author')), (author ?? '').toLowerCase()),
    ],
  }
  const excludeFilter = excludeId ? { id: { [Op.ne]: excludeId } } : {}

  return { attributes: ['id'], where: { ...matchFilter, ...excludeFilter } }
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
