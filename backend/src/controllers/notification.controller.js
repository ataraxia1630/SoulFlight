const NotificationService = require("../services/notification.service");
const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/ApiResponse");

const NotificationController = {
  getAll: catchAsync(async (req, res) => {
    const notifications = await NotificationService.getAll(req.user.id);
    res.json(success(notifications));
  }),

  getById: catchAsync(async (req, res) => {
    const notification = await NotificationService.getById(req.params.id, req.user.id);
    res.json(success(notification));
  }),

  countUnread: catchAsync(async (req, res) => {
    const result = await NotificationService.countUnread(req.user.id);
    res.json(success(result));
  }),

  markAsRead: catchAsync(async (req, res) => {
    await NotificationService.markAsRead(req.params.id, req.user.id);
    res.json(success());
  }),

  markAllAsRead: catchAsync(async (req, res) => {
    await NotificationService.markAllAsRead(req.user.id);
    res.json(success());
  }),

  delete: catchAsync(async (req, res) => {
    await NotificationService.delete(req.params.id, req.user.id);
    res.json(success());
  }),

  deleteAll: catchAsync(async (req, res) => {
    await NotificationService.deleteAll(req.user.id);
    res.json(success());
  }),
};

module.exports = NotificationController;
