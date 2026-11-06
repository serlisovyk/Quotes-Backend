import { ORDER_BY_ID_ASC, PUBLIC_MODEL_ATTRIBUTES } from '#constants'
import { buildLikeFilters } from '#utils/query-builders/query-filter-builder'

export function buildCategoryListQuery({ name }) {
  return {
    attributes: PUBLIC_MODEL_ATTRIBUTES,
    order: ORDER_BY_ID_ASC,
    where: buildLikeFilters({ name }),
  }
}

export function buildCategoryDetailsQuery() {
  return {
    attributes: PUBLIC_MODEL_ATTRIBUTES,
  }
}
