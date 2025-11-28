const Joi = require("joi");

const updateProviderProfileSchema = Joi.object({
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .pattern(/^[0-9]{9,11}$/)
    .optional(),
  name: Joi.string().min(3).max(100).optional(),
  description: Joi.string().min(0).max(500).optional(),
  province: Joi.string().min(1).max(200).optional(),
  country: Joi.string().min(2).max(100).optional(),
  address: Joi.string().min(10).max(200).optional(),
  website_link: Joi.string().uri().min(0).optional(),
  id_card: Joi.string().min(6).max(20).optional(),
  establish_year: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
});

module.exports = { updateProviderProfileSchema };
