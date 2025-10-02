const Joi = require('joi');

const UnitType = [
  'PORTION',
  'SERVING',
  'PIECE',
  'SLICE',
  'SET',
  'BOX',
  'TRAY',
  'PACK',
  'CUP',
  'BOTTLE',
  'CAN',
  'DISH',
  'BOWL',
  'GLASS',
  'JAR',
];

const createSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  price: Joi.number().positive().required(),
  menu_id: Joi.number().integer().required(),
  unit: Joi.string()
    .valid(...UnitType)
    .required(),
  status: Joi.string()
    .valid('AVAILABLE', 'UNAVAILABLE', 'NO_LONGER_PROVIDED')
    .optional(),
});

const updateSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(500).optional(),
  price: Joi.number().positive().optional(),
  unit: Joi.string()
    .valid(...Object.values(UnitType))
    .optional(),
  status: Joi.string()
    .valid('AVAILABLE', 'UNAVAILABLE', 'NO_LONGER_PROVIDED')
    .optional(),
});

module.exports = {
  createSchema,
  updateSchema,
};
