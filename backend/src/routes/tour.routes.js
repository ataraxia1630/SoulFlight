const { Router } = require("express");
const { TourController } = require("../controllers/tour.controller");
const { createSchema, updateSchema } = require("../validators/tour.validator");
const router = Router();
const validate = require("../middlewares/validate.middleware");
const authorize = require("../middlewares/auth.middleware");

router.use(authorize);

router.get("/", TourController.getAll);
router.get("/me", TourController.getMine);
router.get("/:id", TourController.getById);
router.post("/", validate(createSchema), TourController.create);
router.put("/:id", validate(updateSchema), TourController.update);
router.delete("/:id", TourController.delete);
router.get("/service/:serviceId", TourController.getByService);
router.get("/provider/:providerId", TourController.getByProvider);
router.get("/:tourId/availability", TourController.checkAvailability);
router.get("/available/:serviceId", TourController.getAvailable);

module.exports = router;
