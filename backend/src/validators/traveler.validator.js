const Joi = require("joi");

const updateTravelerProfileSchema = Joi.object({
  name: Joi.string().trim().optional(),
  username: Joi.string().min(3).max(30).optional(),
  phone: Joi.string()
    .pattern(/^[0-9]{9,11}$/)
    .optional(),
  gender: Joi.string().valid("MALE", "FEMALE", "OTHER").optional(),
  dob: Joi.date().less("now").max("2006-01-01").optional(),
  location: Joi.string().trim().max(100).optional(),
  avatar_url: Joi.when("$fileExists", {
    is: false,
    then: Joi.string().uri().optional(),
    otherwise: Joi.forbidden(),
  }),
}).min(1);

module.exports = { updateTravelerProfileSchema };
