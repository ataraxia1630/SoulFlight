const { Router } = require("express");
const { MenuController } = require("../controllers/menu.controller");
const { createSchema, updateSchema } = require("../validators/menu.validator");
const validate = require("../middlewares/validate.middleware");
const upload = require("../middlewares/multer.middleware");

const router = Router();

router.get("/", MenuController.getAll);
router.get("/:id", MenuController.getById);
router.post("/", upload.single("cover"), validate(createSchema), MenuController.create);
router.put("/:id", upload.single("cover"), validate(updateSchema), MenuController.update);
router.get("/service/:serviceId", MenuController.getByService);
router.get("/provider/:providerId", MenuController.getByProvider);
router.delete("/:id", MenuController.delete);

module.exports = router;
