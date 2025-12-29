const Joi = require("joi");

const createVoucherSchema = Joi.object({
  serviceId: Joi.number().optional().allow(null),
  title: Joi.string().required().min(3).max(200),
  code: Joi.string()
    .required()
    .uppercase()
    .pattern(/^[A-Z0-9_-]+$/)
    .min(4)
    .max(20)
    .messages({
      "string.pattern.base": "Code chỉ chứa chữ hoa, số, gạch dưới và gạch ngang",
    }),
  discountPercent: Joi.number().required().min(0).max(100),
  description: Joi.string().required().min(10).max(1000),
  validFrom: Joi.date().iso().optional().allow(null),
  validTo: Joi.date().iso().greater(Joi.ref("validFrom")).optional().allow(null),
  isGlobal: Joi.boolean().default(false),
  maxUses: Joi.number().min(1).optional().allow(null),
});

const updateVoucherSchema = Joi.object({
  title: Joi.string().optional().min(3).max(200),
  code: Joi.string()
    .optional()
    .uppercase()
    .pattern(/^[A-Z0-9_-]+$/)
    .min(4)
    .max(20),
  discountPercent: Joi.number().optional().min(0).max(100),
  description: Joi.string().optional().min(10).max(1000),
  validFrom: Joi.date().iso().optional().allow(null),
  validTo: Joi.date().iso().optional().allow(null),
  maxUses: Joi.number().min(1).optional().allow(null),
});

const checkVoucherSchema = Joi.object({
  code: Joi.string().required(),
  serviceId: Joi.number().optional(),
  totalAmount: Joi.number().min(0).optional().default(0),
});

module.exports = {
  createVoucherSchema,
  updateVoucherSchema,
  checkVoucherSchema,
};
