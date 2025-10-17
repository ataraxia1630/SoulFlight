const express = require("express");
const router = express.Router();
const RoomController = require("../controllers/room.controller");

router.post("/", RoomController.create);
router.get("/", RoomController.getAll);
router.get("/:id", RoomController.getOne);
router.put("/:id", RoomController.update);
router.delete("/:id", RoomController.remove);

module.exports = router;
