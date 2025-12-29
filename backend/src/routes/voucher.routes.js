const { Router } = require("express");
const {
  VoucherController,
  ProviderVoucherController,
  AdminVoucherController,
} = require("../controllers/voucher.controller");
const {
  createVoucherSchema,
  updateVoucherSchema,
  checkVoucherSchema,
} = require("../validators/voucher.validator");
const validate = require("../middlewares/validate.middleware");
const authorize = require("../middlewares/auth.middleware");
const requiredRoles = require("../middlewares/role.middleware");

const router = Router();

// ========== PUBLIC ROUTES (Traveler) ==========
router.get("/", VoucherController.getAvailableVouchers);
router.get("/:id", VoucherController.getVoucher);
router.post("/check", validate(checkVoucherSchema), VoucherController.checkVoucher);

// ========== PROVIDER ROUTES ==========
router.use(authorize);

router.get("/provider/my", requiredRoles("PROVIDER"), ProviderVoucherController.getMyVouchers);

router.post(
  "/provider",
  requiredRoles("PROVIDER"),
  validate(createVoucherSchema),
  ProviderVoucherController.createVoucher,
);

router.patch(
  "/provider/:id",
  requiredRoles("PROVIDER"),
  validate(updateVoucherSchema),
  ProviderVoucherController.updateVoucher,
);

router.delete("/provider/:id", requiredRoles("PROVIDER"), ProviderVoucherController.deleteVoucher);

router.get(
  "/provider/:id/stats",
  requiredRoles("PROVIDER"),
  ProviderVoucherController.getVoucherStats,
);

// ========== ADMIN ROUTES ==========
router.get("/admin/all", requiredRoles("ADMIN"), AdminVoucherController.getAllVouchers);

router.post(
  "/admin",
  requiredRoles("ADMIN"),
  validate(createVoucherSchema),
  AdminVoucherController.createVoucher,
);

router.patch(
  "/admin/:id",
  requiredRoles("ADMIN"),
  validate(updateVoucherSchema),
  AdminVoucherController.updateVoucher,
);

router.delete("/admin/:id", requiredRoles("ADMIN"), AdminVoucherController.deleteVoucher);

router.get("/admin/:id/stats", requiredRoles("ADMIN"), AdminVoucherController.getVoucherStats);

module.exports = router;
