import { Router } from 'express'
import httpStatus from 'http-status'

import studentRoutes from './student.route'

const debug = require('debug')('app:route:index')

const router = Router()

router.use('/students', studentRoutes)

export default router
