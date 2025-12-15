const { ItineraryService } = require("../services/itinerary.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");

const ItineraryController = {
  generate: catchAsync(async (req, res, _next) => {
    const traveler_id = req.user.id;
    const itinerary = await ItineraryService.generate(traveler_id, req.body);
    res.status(201).json(ApiResponse.success(itinerary));
  }),

  getAll: catchAsync(async (req, res, _next) => {
    const traveler_id = req.user.id;
    const { status, limit = 20, offset = 0 } = req.query;
    const data = await ItineraryService.getAll(traveler_id, status, limit, offset);
    res.status(200).json(ApiResponse.success(data));
  }),

  getById: catchAsync(async (req, res, _next) => {
    const { id } = req.params;
    const traveler_id = req.user.id;
    const itinerary = await ItineraryService.getById(id, traveler_id);
    res.status(200).json(ApiResponse.success(itinerary));
  }),

  update: catchAsync(async (req, res, _next) => {
    const { id } = req.params;
    const traveler_id = req.user.travelerId;
    const itinerary = await ItineraryService.update(id, traveler_id, req.body);
    res.status(200).json(ApiResponse.success(itinerary));
  }),

  delete: catchAsync(async (req, res, _next) => {
    const { id } = req.params;
    const traveler_id = req.user.travelerId;
    await ItineraryService.delete(id, traveler_id);
    res.status(204).json(ApiResponse.success());
  }),

  addActivity: catchAsync(async (req, res, _next) => {
    const traveler_id = req.user.id;
    const { dayId } = req.body;
    const activity = await ItineraryService.addActivity(dayId, traveler_id);
    res.status(201).json(ApiResponse.success(activity));
  }),

  editActivity: catchAsync(async (req, res, _next) => {
    const { activityId } = req.params;
    const traveler_id = req.user.id;
    const updates = req.body;
    const updated = await ItineraryService.editActivity(activityId, traveler_id, updates);
    res.status(200).json(ApiResponse.success(updated));
  }),

  deleteActivity: catchAsync(async (req, res, _next) => {
    const { activityId } = req.params;
    const traveler_id = req.user.id;
    await ItineraryService.deleteActivity(activityId, traveler_id);
    res.status(204).json(ApiResponse.success());
  }),

  alterActivity: catchAsync(async (req, res, _next) => {
    const { activityId } = req.params;
    const traveler_id = req.user.id;
    const alternatives = await ItineraryService.alterActivity(activityId, traveler_id);
    res.status(200).json(ApiResponse.success(alternatives));
  }),

  replaceActivity: catchAsync(async (req, res, _next) => {
    const { activityId } = req.params;
    const traveler_id = req.user.id;
    const newData = req.body;
    const updated = await ItineraryService.replaceActivity(activityId, traveler_id, newData);
    res.status(200).json(ApiResponse.success(updated));
  }),

  getReviews: catchAsync(async (req, res, _next) => {
    const { activityId } = req.params;
    const reviews = await ItineraryService.getReviews(activityId);
    res.status(200).json(ApiResponse.success(reviews));
  }),

  share: catchAsync(async (req, res, _next) => {
    const { id } = req.params;
    const traveler_id = req.user.id;
    const { share_with_traveler_id, can_edit } = req.body;
    const shared = await ItineraryService.share(id, traveler_id, share_with_traveler_id, can_edit);
    res.status(200).json(ApiResponse.success(shared));
  }),
};

module.exports = { ItineraryController };
