const express = require("express");
const router = express.Router();
const FacilityController = require("../controllers/facility.controller");

router.post("/", FacilityController.create);
router.get("/", FacilityController.getAll);
router.get("/:id", FacilityController.getOne);
router.put("/:id", FacilityController.update);
router.delete("/:id", FacilityController.remove);

module.exports = router;
