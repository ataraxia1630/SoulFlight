const { Router } = require("express");
const { MenuItemController } = require("../controllers/menuItem.controller");
const { createSchema, updateSchema } = require("../validators/menuItem.validator");
const upload = require("../middlewares/multer.middleware");
const validate = require("../middlewares/validate.middleware");

const router = Router();

router.get("/", MenuItemController.getAll);
router.get("/:id", MenuItemController.getById);
router.post("/", upload.single("image"), validate(createSchema), MenuItemController.create);
router.put("/:id", upload.single("image"), validate(updateSchema), MenuItemController.update);
router.delete("/:id", MenuItemController.delete);
router.get("/menu/:menuId", MenuItemController.getByMenu);

module.exports = router;
