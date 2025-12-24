const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/notification.controller");
const authorize = require("../middlewares/auth.middleware");

router.use(authorize);

router.get("/", NotificationController.getAll);
router.get("/unread-count", NotificationController.countUnread);
router.get("/:id", NotificationController.getById);

router.patch("/read-all", NotificationController.markAllAsRead);
router.patch("/:id/read", NotificationController.markAsRead);

router.delete("/", NotificationController.deleteAll);
router.delete("/:id", NotificationController.delete);

module.exports = router;
