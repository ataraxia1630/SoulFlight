const Joi = require("joi");

const createTicketSchema = Joi.object({
  name: Joi.string().trim().max(255).required(),
  description: Joi.string().trim().allow("").optional(),
  price: Joi.number().positive().precision(2).required(),
  service_id: Joi.number().integer().required(),
  place_id: Joi.number().integer().required(),
  max_count: Joi.number().integer().optional(),
});

const updateTicketSchema = Joi.object({
  name: Joi.string().trim().max(255).optional(),
  description: Joi.string().trim().allow("").optional(),
  price: Joi.number().positive().precision(2).optional(),
  service_id: Joi.number().integer().optional(),
  place_id: Joi.number().integer().optional(),
  max_count: Joi.number().integer().optional(),
});

module.exports = {
  createTicketSchema,
  updateTicketSchema,
};
