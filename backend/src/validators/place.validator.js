const Joi = require('joi');
const { openingHoursSchema } = require('./opening_hours.validator');

const createSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  address: Joi.string().max(255).optional(),
  opening_hours: openingHoursSchema.optional(),
  entry_fee: Joi.number().min(0).optional(),
  image_url: Joi.string().uri().optional(),
});

const updateSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(500).optional(),
  address: Joi.string().max(255).optional(),
  opening_hours: openingHoursSchema.optional(),
  entry_fee: Joi.number().min(0).optional(),
  image_url: Joi.string().uri().optional(),
});

module.exports = {
  createSchema,
  updateSchema,
};
