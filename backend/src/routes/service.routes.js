const { ServiceController } = require("../controllers/service.controller");
const { Router } = require("express");

const router = Router();

router.get("/", ServiceController.getAll);
router.get("/:id", ServiceController.getById);
router.get("/provider/:providerId", ServiceController.getByProvider);
router.post("/", ServiceController.create);
router.put("/:id", ServiceController.update);
router.delete("/:id", ServiceController.delete);

module.exports = router;
