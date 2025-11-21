const Joi = require("joi");

const createBookingSchema = Joi.object({
  voucherCode: Joi.string().optional().allow("").trim(),
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid("PENDING", "PAID", "IN_PROGRESS", "COMPLETED", "CANCELLED", "REFUNDED")
    .required(),
  note: Joi.string().max(500).optional(),
});

const cancelBookingSchema = Joi.object({
  reason: Joi.string().max(500).required(),
});

module.exports = {
  createBookingSchema,
  updateStatusSchema,
  cancelBookingSchema,
};
