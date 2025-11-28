const { Router } = require("express");
const {
  BookingController,
  ProviderBookingController,
  AdminBookingController,
} = require("../controllers/booking.controller");
const {
  createBookingSchema,
  cancelBookingSchema,
  updateStatusSchema,
} = require("../validators/booking.validator");
const validate = require("../middlewares/validate.middleware");
const authorize = require("../middlewares/auth.middleware");
const requiredRoles = require("../middlewares/role.middleware");

const router = Router();

router.use(authorize);

// === TRAVELER ROUTES ===
router.get("/my", requiredRoles(["TRAVELER"]), BookingController.getMyBookings);
router.get("/my/:bookingId", requiredRoles(["TRAVELER"]), BookingController.getBookingDetail);
router.post(
  "/",
  requiredRoles(["TRAVELER"]),
  validate(createBookingSchema),
  BookingController.createFromCart,
);
router.post(
  "/my/:bookingId/cancel",
  requiredRoles(["TRAVELER"]),
  validate(cancelBookingSchema),
  BookingController.cancelBooking,
);

// === PROVIDER ROUTES ===
router.get("/provider", requiredRoles(["PROVIDER"]), ProviderBookingController.getProviderBookings);
router.get(
  "/provider/:bookingId",
  requiredRoles(["PROVIDER"]),
  ProviderBookingController.getProviderBookingDetail,
);
router.patch(
  "/provider/:bookingId/status",
  requiredRoles(["PROVIDER"]),
  validate(updateStatusSchema),
  ProviderBookingController.updateBookingStatus,
);

// === ADMIN ROUTES ===
router.use(requiredRoles(["ADMIN"]));

router.get("/admin", AdminBookingController.getAllBookings);
router.get("/admin/:bookingId", AdminBookingController.getBookingDetail);
router.patch(
  "/admin/:bookingId/status",
  validate(updateStatusSchema),
  AdminBookingController.forceUpdateStatus,
);

module.exports = router;
