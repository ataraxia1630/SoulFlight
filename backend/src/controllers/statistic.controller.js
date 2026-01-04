const StatisticService = require("../services/statistic.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");

const StatisticController = {
  getStatistics: catchAsync(async (req, res) => {
    const { year, month } = req.query;
    const filters = {};
    if (year) filters.year = Number(year);
    if (month) filters.month = Number(month);

    const userId = req.user.id;

    const stats = await StatisticService.getStatistics(userId, filters);
    res.json(ApiResponse.success(stats));
  }),
};

module.exports = StatisticController;
