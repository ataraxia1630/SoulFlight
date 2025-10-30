const { Router } = require("express");
const { PlaceController } = require("../controllers/place.controller");
const { createSchema, updateSchema } = require("../validators/place.validator");
const validate = require("../middlewares/validate.middleware");

const router = Router();

router.get("/", PlaceController.getAll);
router.get("/:id", PlaceController.getById);
router.post("/", validate(createSchema), PlaceController.create);
router.put("/:id", validate(updateSchema), PlaceController.update);
router.delete("/:id", PlaceController.delete);

module.exports = router;
