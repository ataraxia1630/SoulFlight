const ReportService = require("../services/report.service");
const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/ApiResponse");

const ReportController = {
  create: catchAsync(async (req, res) => {
    const report = await ReportService.create(req.body, req.user.id);
    res.status(201).json(success(report));
  }),

  getAll: catchAsync(async (_req, res) => {
    const reports = await ReportService.getAll();
    res.json(success(reports));
  }),

  getById: catchAsync(async (req, res) => {
    const report = await ReportService.getById(req.params.id);
    res.json(success(report));
  }),

  update: catchAsync(async (req, res) => {
    const report = await ReportService.update(req.params.id, req.body.status);
    res.json(success(report));
  }),
};

module.exports = ReportController;
