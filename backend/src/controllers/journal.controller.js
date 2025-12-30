const JournalService = require("../services/journal.service");
const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/ApiResponse");

const JournalController = {
  create: catchAsync(async (req, res) => {
    const files = req.files;
    const travelerId = req.user.id;

    const journal = await JournalService.create(req.body, files, travelerId);
    res.status(201).json(success(journal));
  }),

  getMyJournals: catchAsync(async (req, res) => {
    const travelerId = req.user.id;
    const journals = await JournalService.getMyJournals(travelerId);
    res.json(success(journals));
  }),

  getById: catchAsync(async (req, res) => {
    const travelerId = req.user?.id || null;
    const journal = await JournalService.getById(req.params.id, travelerId);
    res.json(success(journal));
  }),

  update: catchAsync(async (req, res) => {
    const files = req.files;
    const travelerId = req.user.id;

    const journal = await JournalService.update(req.params.id, req.body, files, travelerId);
    res.json(success(journal));
  }),

  delete: catchAsync(async (req, res) => {
    const travelerId = req.user.id;
    await JournalService.delete(req.params.id, travelerId);
    res.json(success());
  }),
};

module.exports = JournalController;
