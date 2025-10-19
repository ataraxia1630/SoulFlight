const { Router } = require("express");
const { ServiceTypeController } = require("../controllers/serviceType.controller");
const validate = require("../middlewares/validate.middleware");
const { createSchema, updateSchema } = require("../validators/serviceType.validator");

const router = Router();

router.get("/", ServiceTypeController.getAll);
router.get("/:id", ServiceTypeController.getById);
router.post("/", validate(createSchema), ServiceTypeController.create);
router.put("/:id", validate(updateSchema), ServiceTypeController.update);
router.delete("/:id", ServiceTypeController.delete);

module.exports = router;
