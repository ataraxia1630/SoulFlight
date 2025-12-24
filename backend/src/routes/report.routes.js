const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/report.controller");
const authorize = require("../middlewares/auth.middleware");

router.use(authorize);

router.post("/", ReportController.create);
router.get("/", ReportController.getAll);
router.get("/:id", ReportController.getById);
router.put("/:id/status", ReportController.update);

module.exports = router;
