const Joi = require("joi");

const MAX_IMAGES = 10;

const createRoomSchema = Joi.object({
  service_id: Joi.number().integer().required(),
  name: Joi.string().trim().required(),
  description: Joi.string().trim().allow(null, "").optional(),
  price_per_night: Joi.number().positive().precision(2).required(),
  max_children_number: Joi.number().integer().min(0).allow(null).optional(),
  max_adult_number: Joi.number().integer().min(1).required(),
  pet_allowed: Joi.boolean().default(false),
  bed_number: Joi.number().integer().min(1).required(),
  connectFacilities: Joi.array().items(Joi.number().integer()).optional(),
  images: Joi.array().max(MAX_IMAGES),
}).unknown(true);

const updateRoomSchema = createRoomSchema
  .fork(Object.keys(createRoomSchema.describe().keys), (s) => s.optional())
  .append({
    disconnectFacilities: Joi.array().items(Joi.number().integer()).optional(),
    imageActions: Joi.string()
      .custom((value, helpers) => {
        try {
          const parsed = JSON.parse(value);
          if (!Array.isArray(parsed)) throw new Error();
          return parsed;
        } catch {
          return helpers.error("any.invalid");
        }
      }, "JSON array")
      .optional(),
  })
  .unknown(true);

module.exports = { createRoomSchema, updateRoomSchema };
