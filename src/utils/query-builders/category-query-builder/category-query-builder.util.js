import { buildLikeFilters } from '#utils/query-builders/query-filter-builder'
import { ORDER_BY_ID_ASC, PUBLIC_MODEL_ATTRIBUTES } from '#constants'

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
