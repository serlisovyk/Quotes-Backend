import { Router } from 'express'
import * as HealthController from '#controllers/health'
import cacheControl from '#middlewares/cache-control'
import asyncHandler from '#middlewares/async-handler'
import { CACHE_CONTROL, ROUTER_PATH } from '#constants'

const router = Router()

router.get(
  ROUTER_PATH.ROOT,
  cacheControl(CACHE_CONTROL.NO_STORE),
  asyncHandler(HealthController.getHealth),
)

export default router
