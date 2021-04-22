import express from 'express'
import {validate} from 'express-validation'
import paramValidation from '../validations/student.validation'
import ctrl from '../controllers/student.controller'

const router = express.Router()

router.route('/')
  .get(ctrl.list)
//   .post(validate(paramValidation.add), acl.checkAdmin, ctrl.add)

router.route('/:id')
  .get(ctrl.get)
//   .put(validate(paramValidation.set), ctrl.set)
//   .delete(ctrl.del)

router.param('id', ctrl.load)

export default router
