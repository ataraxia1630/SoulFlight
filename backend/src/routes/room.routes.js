const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");
const validate = require("../middlewares/validate.middleware");
const { createRoomSchema, updateRoomSchema } = require("../validators/room.validator");
const RoomController = require("../controllers/room.controller");

router
  .route("/")
  .post(upload.array("images", 10), validate(createRoomSchema), RoomController.create)
  .get(RoomController.getAll);

router
  .route("/:id")
  .get(RoomController.getOne)
  .put(upload.array("images", 10), validate(updateRoomSchema), RoomController.update)
  .delete(RoomController.delete);

router.get("/:roomId/availability", RoomController.checkAvailability);

router.get("/available", RoomController.getAvailable);

module.exports = router;
