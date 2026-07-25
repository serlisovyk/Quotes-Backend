import {
  ORDER_BY_ID_ASC,
  PUBLIC_MODEL_ATTRIBUTES,
} from '../../constants/queryOptions.js'
import { buildLikeFilters } from './queryFilterBuilder.js'

export const buildCategoryListQuery = ({ name }) => ({
  attributes: PUBLIC_MODEL_ATTRIBUTES,
  order: ORDER_BY_ID_ASC,
  where: buildLikeFilters({ name }),
})

export const buildCategoryDetailsQuery = () => ({
  attributes: PUBLIC_MODEL_ATTRIBUTES,
})
