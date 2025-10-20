const Joi = require("joi");

const facilityCreateSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  icon_url: Joi.string().uri().optional().allow(""),
});

const facilityUpdateSchema = Joi.object({
  name: Joi.string().trim().min(1).optional(),
  icon_url: Joi.string().uri().optional().allow(""),
});

const facilityIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

module.exports = {
  facilityCreateSchema,
  facilityUpdateSchema,
  facilityIdSchema,
};
