const Joi = require('joi')

const validateContenido = Joi.string().min(1).max(100).trim().required();

module.exports = { validateContenido }