const Joi = require('joi');

const createSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  service_id: Joi.number().integer().required(),
});

const updateSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(500).optional(),
});

module.exports = {
  createSchema,
  updateSchema,
};
