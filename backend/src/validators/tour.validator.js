const Joi = require('joi');

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

const placeSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  start_time: Joi.string().pattern(timePattern).optional(),
  end_time: Joi.string().pattern(timePattern).optional(),
  description: Joi.string().allow(null, '').optional(),
});

const dayInWeekSchema = Joi.string().valid(
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
);

const createSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow(null, '').optional(),
  service_price: Joi.number().min(0).required(),
  duration: Joi.number().integer().min(1).required(),
  service_id: Joi.number().integer().positive().required(),
  tourguide_id: Joi.number().integer().positive().optional(),
  places: Joi.array().items(placeSchema).min(1).required(),
  is_recurring: Joi.boolean().optional(),
  repeat_rule: Joi.string()
    .when('is_recurring', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .valid('daily', 'weekly', 'monthly', 'yearly'),
  repeat_days: Joi.array().items(dayInWeekSchema).when('repeat_rule', {
    is: 'weekly',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  start_date: Joi.date().iso().when('is_recurring', {
    is: false,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  end_date: Joi.date().iso().greater(Joi.ref('start_date')).optional(),
  status: Joi.string()
    .valid('AVAILABLE', 'UNAVAILABLE', 'NO_LONGER_PROVIDED')
    .optional(),
});

const updateSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  description: Joi.string().allow(null, '').optional(),
  service_price: Joi.number().min(0).optional(),
  duration: Joi.number().integer().min(1).optional(),
  service_id: Joi.number().integer().positive().optional(),
  tourguide_id: Joi.number().integer().positive().optional(),
  places: Joi.array().items(placeSchema).min(1).optional(),
  is_recurring: Joi.boolean().optional(),
  repeat_rule: Joi.string()
    .when('is_recurring', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .valid('daily', 'weekly', 'monthly', 'yearly'),
  repeat_days: Joi.array().items(dayInWeekSchema).when('repeat_rule', {
    is: 'weekly',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  start_date: Joi.date().iso().when('is_recurring', {
    is: false,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  end_date: Joi.date().iso().greater(Joi.ref('start_date')).optional(),
  status: Joi.string()
    .valid('AVAILABLE', 'UNAVAILABLE', 'NO_LONGER_PROVIDED')
    .optional(),
});

module.exports = {
  createSchema,
  updateSchema,
};
