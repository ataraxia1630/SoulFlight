const Joi = require("joi");

const addToCartSchema = Joi.object({
  itemType: Joi.string().valid("ROOM", "TOUR", "TICKET", "MENU_ITEM").required(),
  itemId: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).default(1),
  checkinDate: Joi.date().iso().optional(),
  checkoutDate: Joi.date().iso().optional(),
  visitDate: Joi.date().iso().optional(),
  note: Joi.string().max(500).optional(),
}).custom((value, helpers) => {
  if (value.itemType === "ROOM") {
    if (!value.checkinDate || !value.checkoutDate) {
      return helpers.error("any.custom", {
        message: "checkinDate and checkoutDate are required for ROOM",
      });
    }
  }
  if (["TOUR", "TICKET"].includes(value.itemType) && !value.visitDate) {
    return helpers.error("any.custom", {
      message: "visitDate is required for TOUR and TICKET",
    });
  }
  return value;
});

const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).optional(),
  checkinDate: Joi.date().iso().optional(),
  checkoutDate: Joi.date().iso().optional(),
  visitDate: Joi.date().iso().optional(),
  note: Joi.string().max(500).optional(),
}).min(1);

module.exports = { addToCartSchema, updateCartItemSchema };
