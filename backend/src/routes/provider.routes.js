const express = require("express");
const ProviderController = require("../controllers/provider.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");
const validate = require("../middlewares/validate.middleware");
const { updateProviderProfileSchema } = require("../validators/provider.validator");

const router = express.Router();

router.get("/me", authMiddleware, ProviderController.getMyProfile);

router.put(
  "/me",
  authMiddleware,
  upload.single("logo"),
  validate(updateProviderProfileSchema),
  ProviderController.updateProfile,
);

router.put(
  "/:id",
  authMiddleware,
  upload.single("logo"),
  validate(updateProviderProfileSchema),
  ProviderController.adminUpdateProfile,
);

router.get("/", authMiddleware, ProviderController.getAll);

module.exports = router;
