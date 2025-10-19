const Joi = require("joi");

const createSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
});

const updateSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
});

module.exports = {
  createSchema,
  updateSchema,
};
