const Joi = require('joi')

const authSchema = Joi.object({
  contenido: Joi.string().min(3).max(70).trim().required(),
  fecha: Joi.date().iso().required(),
})

module.exports = { authSchema }