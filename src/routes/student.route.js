import express from 'express'
import {validate} from 'express-validation'
import paramValidation from '../validations/student.validation'
import ctrl from '../controllers/student.controller'

const router = express.Router()

router.route('/')
  .get(validate(paramValidation.list), ctrl.list)
  .post(validate(paramValidation.add), ctrl.add)

router.route('/:id')
  .get(ctrl.get)
  .delete(ctrl.del)
  .put(validate(paramValidation.set), ctrl.set)

router.route('/:id/show')
  .get(ctrl.show)

router.param('id', ctrl.load)

export default router
