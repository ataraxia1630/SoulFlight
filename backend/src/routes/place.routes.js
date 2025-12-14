const { Router } = require("express");
const { PlaceController } = require("../controllers/place.controller");
const { createSchema, updateSchema } = require("../validators/place.validator");
const upload = require("../middlewares/multer.middleware");
const validate = require("../middlewares/validate.middleware");
const parseJsonFields = require("../middlewares/parseFields.middleware");

const router = Router();

router.get("/", PlaceController.getAll);
router.get("/:id", PlaceController.getById);
router.post(
  "/",
  upload.array("images", 10),
  parseJsonFields(["opening_hours"]),
  validate(createSchema),
  PlaceController.create,
);
router.put(
  "/:id",
  upload.array("images", 10),
  parseJsonFields(["opening_hours"]),
  validate(updateSchema),
  PlaceController.update,
);
router.delete("/:id", PlaceController.delete);

module.exports = router;
