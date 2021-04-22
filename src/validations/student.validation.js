import Joi from 'joi'

const list = {
  query: Joi.object({
    page: Joi.number().integer()
  })
}

module.exports = {
  list,
}