const { Router } = require("express");
const {
  BookingController,
  ProviderBookingController,
  AdminBookingController,
} = require("../controllers/booking.controller");
const {
  createBookingSchema,
  updateBookingInfoSchema,
  cancelBookingSchema,
  updateStatusSchema,
  directMenuBookingSchema,
  directRoomBookingSchema,
  directTicketBookingSchema,
  directTourBookingSchema,
} = require("../validators/booking.validator");
const validate = require("../middlewares/validate.middleware");
const authorize = require("../middlewares/auth.middleware");
const requiredRoles = require("../middlewares/role.middleware");

const router = Router();

router.use(authorize);

// === TRAVELER ROUTES ===
router.get("/my", requiredRoles("TRAVELER"), BookingController.getMyBookings);
router.get("/my/:bookingId", requiredRoles("TRAVELER"), BookingController.getBookingDetail);
router.patch(
  "/my/:bookingId",
  requiredRoles("TRAVELER"),
  validate(updateBookingInfoSchema),
  BookingController.updateBookingInfo,
);
router.post(
  "/",
  requiredRoles("TRAVELER"),
  validate(createBookingSchema),
  BookingController.createFromCart,
);
router.post(
  "/my/:bookingId/cancel",
  requiredRoles("TRAVELER"),
  validate(cancelBookingSchema),
  BookingController.cancelBooking,
);

router.post(
  "/direct/room",
  requiredRoles("TRAVELER"),
  validate(directRoomBookingSchema),
  BookingController.createRoomBooking,
);

router.post(
  "/direct/tour",
  requiredRoles("TRAVELER"),
  validate(directTourBookingSchema),
  BookingController.createTourBooking,
);

router.post(
  "/direct/ticket",
  requiredRoles("TRAVELER"),
  validate(directTicketBookingSchema),
  BookingController.createTicketBooking,
);

router.post(
  "/direct/menu",
  requiredRoles("TRAVELER"),
  validate(directMenuBookingSchema),
  BookingController.createMenuBooking,
);

// === PROVIDER ROUTES ===
router.get("/provider", requiredRoles("PROVIDER"), ProviderBookingController.getProviderBookings);
router.get(
  "/provider/:bookingId",
  requiredRoles("PROVIDER"),
  ProviderBookingController.getProviderBookingDetail,
);
router.patch(
  "/provider/:bookingId/status",
  requiredRoles("PROVIDER"),
  validate(updateStatusSchema),
  ProviderBookingController.updateBookingStatus,
);

// === ADMIN ROUTES ===
router.use(requiredRoles("ADMIN"));

router.get("/admin", AdminBookingController.getAllBookings);
router.get("/admin/:bookingId", AdminBookingController.getBookingDetail);
router.patch(
  "/admin/:bookingId/status",
  validate(updateStatusSchema),
  AdminBookingController.forceUpdateStatus,
);

module.exports = router;
