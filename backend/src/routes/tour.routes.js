const { Router } = require("express");
const { TourController } = require("../controllers/tour.controller");
const { createSchema, updateSchema } = require("../validators/tour.validator");
const validate = require("../middlewares/validate.middleware");

const router = Router();

router.get("/", TourController.getAll);
router.get("/me", TourController.getMine);
router.get("/:id", TourController.getById);
router.post("/", validate(createSchema), TourController.create);
router.put("/:id", validate(updateSchema), TourController.update);
router.delete("/:id", TourController.delete);

module.exports = router;
