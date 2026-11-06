import { Router } from 'express'
import * as HealthController from '#controllers/health'
import asyncHandler from '#middlewares/async-handler'
import { ROUTER_PATH } from '#constants'

const router = Router()

router.get(ROUTER_PATH.ROOT, asyncHandler(HealthController.getHealth))

export default router
