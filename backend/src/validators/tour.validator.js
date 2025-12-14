const Joi = require("joi");

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

const placeSchema = Joi.object({
  place_id: Joi.number().integer().positive().required(),
  start_time: Joi.string().pattern(timePattern).optional(),
  end_time: Joi.string().pattern(timePattern).optional(),
  description: Joi.string().allow(null, "").optional(),
});

const createSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow(null, "").optional(),
  service_price: Joi.number().min(0).required(),
  service_id: Joi.number().integer().positive().required(),
  start_time: Joi.string().optional(),
  end_time: Joi.string().optional(),
  tourguide_id: Joi.number().integer().positive().optional(),
  places: Joi.array().items(placeSchema).min(1).required(),
  max_participants: Joi.number().min(0).required(),
  status: Joi.string().valid("AVAILABLE", "UNAVAILABLE", "NO_LONGER_PROVIDED").optional(),
});

const updateSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  description: Joi.string().allow(null, "").optional(),
  service_price: Joi.number().min(0).optional(),
  service_id: Joi.number().integer().positive().optional(),
  start_time: Joi.string().optional(),
  end_time: Joi.string().optional(),
  tourguide_id: Joi.number().integer().positive().optional(),
  places: Joi.array().items(placeSchema).min(1).optional(),
  max_participants: Joi.number().min(0).optional(),
  status: Joi.string().valid("AVAILABLE", "UNAVAILABLE", "NO_LONGER_PROVIDED").optional(),
});

module.exports = {
  createSchema,
  updateSchema,
};
