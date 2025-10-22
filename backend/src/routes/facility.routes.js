const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  facilityCreateSchema,
  facilityUpdateSchema,
  facilityIdSchema,
} = require("../validators/facility.validator");
const FacilityController = require("../controllers/facility.controller");

router.post(
  "/",
  upload.single("icon_url"),
  validate(facilityCreateSchema),
  FacilityController.create,
);

router.get("/", FacilityController.getAll);

router.get("/:id", validate(facilityIdSchema), FacilityController.getOne);

router.put(
  "/:id",
  upload.single("icon_url"),
  validate(facilityUpdateSchema),
  FacilityController.update,
);

router.delete("/:id", validate(facilityIdSchema), FacilityController.delete);

module.exports = router;
