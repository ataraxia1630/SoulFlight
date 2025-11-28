const express = require("express");
const TravelerController = require("../controllers/traveler.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

const router = express.Router();

router.get("/me", authMiddleware, TravelerController.getMyProfile);

router.put("/me", authMiddleware, upload.single("avatar"), TravelerController.updateProfile);

router.put("/:id", authMiddleware, upload.single("avatar"), TravelerController.adminUpdateProfile);

router.get("/", authMiddleware, TravelerController.getAll);

module.exports = router;
