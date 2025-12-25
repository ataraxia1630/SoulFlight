const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/review.controller");
const authorize = require("../middlewares/auth.middleware");

router.use(authorize);

router.get("/service/:serviceId", ReviewController.getByService);
router.get("/detail", ReviewController.getByDetail);
router.post("/", ReviewController.create);
router.put("/:id", ReviewController.update);
router.delete("/:id", ReviewController.delete);

module.exports = router;
