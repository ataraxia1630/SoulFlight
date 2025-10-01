const Joi = require('joi');

const sendOtpSchema = Joi.object({
  email: Joi.string().email().required(),
});

const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(5).required(),
});

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string()
    .pattern(/^[0-9]{9,11}$/)
    .optional(),
  role: Joi.string().valid('TRAVELER', 'PROVIDER').required(),
  verify_token: Joi.string().required(),
});

const createTravelerSchema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9]{9,11}$/)
    .optional(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
  dob: Joi.date().less('now').optional(),
});

const createProviderSchema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9]{9,11}$/)
    .optional(),
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  province: Joi.string().min(10).max(200).required(),
  country: Joi.string().min(2).max(100).required(),
  address: Joi.string().min(10).max(200).required(),
  website_link: Joi.string().uri().optional(),
  id_card: Joi.string().min(6).max(20).required(),
  establish_year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required(),
});

const loginSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  sendOtpSchema,
  verifyOtpSchema,
  createUserSchema,
  createTravelerSchema,
  createProviderSchema,
  loginSchema,
};
