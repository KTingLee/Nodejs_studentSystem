import Joi from 'joi'

const list = {
  query: Joi.object({
    page: Joi.number().integer()
  })
}

const add = {
  body: Joi.object({
    id: Joi.number().integer().required(),
    name: Joi.number().integer().required(),
    age: Joi.number().integer().optional(),
    sex: Joi.string().valid('男', '女').required(),
    provice: Joi.string().optional()
  })
}

const set = {
  body: Joi.object({
    name: Joi.number().integer().required(),
    age: Joi.number().integer().optional(),
    sex: Joi.string().valid('男', '女').optional(),
    provice: Joi.string().optional()
  })
}

module.exports = {
  list,
  add,
  set,
}