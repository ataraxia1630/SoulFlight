const { TourService } = require("../services/tour.service");
const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/ApiResponse");

const TourController = {
  getAll: catchAsync(async (_req, res) => {
    const tours = await TourService.getAll();
    res.json(success(tours));
  }),

  getById: catchAsync(async (req, res) => {
    const tour = await TourService.getById(req.params.id);
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
    const tours = await TourService.getByService(req.params.serviceId);
    res.json(success(tours));
  }),

  getByProvider: catchAsync(async (req, res) => {
    const tours = await TourService.getByProvider(req.params.providerId);
    res.json(success(tours));
  }),

  checkAvailability: catchAsync(async (req, res) => {
    const { checkIn, checkOut, quantity = 1 } = req.query;
    const result = await TourService.checkAvailability(
      req.params.tourId,
      checkIn,
      checkOut,
      parseInt(quantity, 10),
    );
    res.json(success(result));
  }),

  getAvailable: catchAsync(async (req, res) => {
    const { checkIn, checkOut, participants = 1 } = req.query;
    const tours = await TourService.getAvailable(
      req.params.serviceId,
      checkIn,
      checkOut,
      parseInt(participants, 10),
    );
    res.json(success(tours));
  }),
};

module.exports = { TourController };
