const Joi = require('joi');

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

const openingHourRange = Joi.object({
  open: Joi.string()
    .pattern(timePattern)
    .required()
    .messages({ 'string.pattern.base': 'Open time must be in HH:mm format' }),
  close: Joi.string()
    .pattern(timePattern)
    .required()
    .messages({ 'string.pattern.base': 'Close time must be in HH:mm format' }),
});

const openingHoursSchema = Joi.object({
  monday: Joi.array().items(openingHourRange).default([]),
  tuesday: Joi.array().items(openingHourRange).default([]),
  wednesday: Joi.array().items(openingHourRange).default([]),
  thursday: Joi.array().items(openingHourRange).default([]),
  friday: Joi.array().items(openingHourRange).default([]),
  saturday: Joi.array().items(openingHourRange).default([]),
  sunday: Joi.array().items(openingHourRange).default([]),
});

module.exports = {
  openingHoursSchema,
};

// sample data
// {
//   "monday": [
//     { "open": "08:00", "close": "11:30" },
//     { "open": "13:30", "close": "17:00" }
//   ],
//   "tuesday": [],
//   "wednesday": [
//     { "open": "09:00", "close": "18:00" }
//   ],
//   "thursday": null,
//   "friday": null,
//   "saturday": [
//     { "open": "08:00", "close": "17:30" }
//   ],
//   "sunday": [
//     { "open": "08:00", "close": "17:30" }
//   ]
// }
