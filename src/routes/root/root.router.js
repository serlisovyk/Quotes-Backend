import { Router } from 'express'
import * as RootController from '#controllers/root'
import cacheControl from '#middlewares/cache-control'
import { CACHE_CONTROL, ROUTER_PATH } from '#constants'

const router = Router()

router.get(
  ROUTER_PATH.ROOT,
  cacheControl(CACHE_CONTROL.PUBLIC_SHORT),
  RootController.getRoot,
)

export default router
