const { TourService } = require("../services/tour.service");
const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/ApiResponse");

const TourController = {
  getAll: catchAsync(async (req, res) => {
    const travelerId = req.user?.id || null;
    const tours = await TourService.getAll(travelerId);
    res.json(success(tours));
  }),

  getById: catchAsync(async (req, res) => {
    const travelerId = req.user?.id || null;
    const tour = await TourService.getById(req.params.id, travelerId);
    res.json(success(tour));
  }),

  getMine: catchAsync(async (req, res, _next) => {
    const tours = await TourService.getMine(req);
    res.status(200).json(ApiResponse.success(TourDTO.fromList(tours)));
  }),

  create: catchAsync(async (req, res) => {
    const tour = await TourService.create(req.body);
    res.status(201).json(success(tour));
  }),

  update: catchAsync(async (req, res) => {
    const tour = await TourService.update(req.params.id, req.body);
    res.json(success(tour));
  }),

  delete: catchAsync(async (req, res) => {
    await TourService.delete(req.params.id);
    res.json(success());
  }),

  getByService: catchAsync(async (req, res) => {
    const travelerId = req.user?.id || null;
    const tours = await TourService.getByService(req.params.serviceId, travelerId);
    res.json(success(tours));
  }),

  getByProvider: catchAsync(async (req, res) => {
    const travelerId = req.user?.id || null;
    const tours = await TourService.getByProvider(req.params.providerId, travelerId);
    res.json(success(tours));
  }),

  checkAvailability: catchAsync(async (req, res) => {
    const travelerId = req.user?.id || null;
    const { quantity = 1 } = req.query;
    const result = await TourService.checkAvailability(
      req.params.tourId,
      travelerId,
      parseInt(quantity, 10),
    );
    res.json(success(result));
  }),

  getAvailable: catchAsync(async (req, res) => {
    const travelerId = req.user?.id || null;
    const { participants = 1, startDate, endDate } = req.query;

    const tours = await TourService.getAvailable(
      req.params.serviceId,
      travelerId,
      startDate,
      endDate,
      parseInt(participants, 10),
    );

    res.json(success(tours));
  }),
};

module.exports = { TourController };
