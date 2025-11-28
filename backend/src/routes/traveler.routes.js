const express = require("express");
const TravelerController = require("../controllers/traveler.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");
const validate = require("../middlewares/validate.middleware");
const { updateTravelerProfileSchema } = require("../validators/traveler.validator");

const router = express.Router();

router.get("/me", authMiddleware, TravelerController.getMyProfile);

router.put(
  "/me",
  authMiddleware,
  upload.single("avatar"),
  validate(updateTravelerProfileSchema),
  TravelerController.updateProfile,
);

router.put(
  "/:id",
  authMiddleware,
  upload.single("avatar"),
  validate(updateTravelerProfileSchema),
  TravelerController.adminUpdateProfile,
);

router.get("/", authMiddleware, TravelerController.getAll);

module.exports = router;
