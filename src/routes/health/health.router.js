import { Router } from 'express'
import * as HealthController from '../../controllers/health/index.js'
import { ROUTER_PATH } from '../../constants/app.constant.js'

const router = Router()

router.get(ROUTER_PATH.ROOT, HealthController.getHealth)

export default router
