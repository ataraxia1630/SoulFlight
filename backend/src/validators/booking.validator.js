const Joi = require("joi");

const createBookingSchema = Joi.object({
  vouchers: Joi.object()
    .pattern(Joi.number(), Joi.string().allow("").trim())
    .optional()
    .default({}),
  voucherCode: Joi.string().optional().allow("").trim(),
});

const updateBookingInfoSchema = Joi.object({
  notes: Joi.object().optional(),
  voucherCode: Joi.string().optional().allow("").trim(),
}).or("notes", "voucherCode");

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid("PENDING", "PAID", "IN_PROGRESS", "COMPLETED", "CANCELLED", "REFUNDED")
    .required(),
  note: Joi.string().max(500).optional(),
});

const cancelBookingSchema = Joi.object({
  reason: Joi.string().max(500).required(),
});

const directRoomBookingSchema = Joi.object({
  roomId: Joi.number().required(),
  checkinDate: Joi.date().iso().required(),
  checkoutDate: Joi.date().iso().greater(Joi.ref("checkinDate")).required(),
  quantity: Joi.number().min(1).required(),
  voucherCode: Joi.string().optional(),
  guestInfo: Joi.object({
    fullName: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().optional(),
    specialRequest: Joi.string().optional(),
  }).optional(),
});

const directTourBookingSchema = Joi.object({
  tourId: Joi.number().required(),
  quantity: Joi.number().min(1).required(),
  voucherCode: Joi.string().optional(),
  guestInfo: Joi.object({
    fullName: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().optional(),
    emergencyContact: Joi.string().optional(),
  }).optional(),
});

const directTicketBookingSchema = Joi.object({
  ticketId: Joi.number().required(),
  visitDate: Joi.date().iso().required(),
  quantity: Joi.number().min(1).required(),
  voucherCode: Joi.string().optional(),
  guestInfo: Joi.object({
    fullName: Joi.string().required(),
    phone: Joi.string().required(),
  }).optional(),
});

const directMenuBookingSchema = Joi.object({
  serviceId: Joi.number().required(),
  items: Joi.array()
    .items(
      Joi.object({
        menuItemId: Joi.number().required(),
        quantity: Joi.number().min(1).required(),
      }),
    )
    .min(1)
    .required(),
  visitDate: Joi.date().iso().optional(),
  voucherCode: Joi.string().optional(),
  guestInfo: Joi.object({
    fullName: Joi.string().required(),
    phone: Joi.string().required(),
    tableNumber: Joi.string().optional(),
    specialRequest: Joi.string().optional(),
  }).optional(),
});

module.exports = {
  createBookingSchema,
  updateBookingInfoSchema,
  updateStatusSchema,
  cancelBookingSchema,
  directRoomBookingSchema,
  directTourBookingSchema,
  directTicketBookingSchema,
  directMenuBookingSchema,
};
