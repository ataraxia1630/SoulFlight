const { Router } = require("express");
const { ServiceTagController } = require("../controllers/serviceTag.controller");
const validate = require("../middlewares/validate.middleware");
const { createSchema, updateSchema } = require("../validators/serviceTag.validator");

const router = Router();

router.get("/", ServiceTagController.getAll);
router.get("/:id", ServiceTagController.getById);
router.post("/", validate(createSchema), ServiceTagController.create);
router.put("/:id", validate(updateSchema), ServiceTagController.update);
router.delete("/:id", ServiceTagController.delete);

module.exports = router;
