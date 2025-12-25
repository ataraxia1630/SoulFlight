const Joi = require("joi");

const createPaymentSchema = Joi.object({
  bookingIds: Joi.array().items(Joi.string().required()).min(1).required().messages({
    "array.min": "Phải có ít nhất 1 booking",
    "any.required": "bookingIds là bắt buộc",
  }),
  method: Joi.string().valid("VNPAY", "MOMO", "BLOCKCHAIN").required().messages({
    "any.only": "Phương thức thanh toán không hợp lệ",
    "any.required": "method là bắt buộc",
  }),
});

module.exports = { createPaymentSchema };
