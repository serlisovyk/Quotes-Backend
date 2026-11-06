import { Router } from 'express'
import * as RootController from '#controllers/root'
import { ROUTER_PATH } from '#constants'

const router = Router()

router.get(ROUTER_PATH.ROOT, RootController.getRoot)

export default router
