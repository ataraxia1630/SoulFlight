const ReviewService = require("../services/review.service");
const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/ApiResponse");

const ReviewController = {
  create: catchAsync(async (req, res) => {
    const review = await ReviewService.create(req.body, req.user.id);
    res.status(201).json(success(review));
  }),

  update: catchAsync(async (req, res) => {
    const review = await ReviewService.update(req.params.id, req.body, req.user.id);
    res.json(success(review));
  }),

  delete: catchAsync(async (req, res) => {
    await ReviewService.delete(req.params.id, req.user.id);
    res.json(success());
  }),

  getByService: catchAsync(async (req, res) => {
    const reviews = await ReviewService.getByService(req.params.serviceId);
    res.json(success(reviews));
  }),

  getByDetail: catchAsync(async (req, res) => {
    const reviews = await ReviewService.getByDetailService(req.query);
    res.json(success(reviews));
  }),
};

module.exports = ReviewController;
