const { Router } = require("express");
const StatisticController = require("../controllers/statistic.controller");
const authorize = require("../middlewares/auth.middleware");

const router = Router();

router.use(authorize);

router.get("/", StatisticController.getStatistics);

module.exports = router;
