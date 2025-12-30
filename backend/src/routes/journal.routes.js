const express = require("express");
const router = express.Router();
const JournalController = require("../controllers/journal.controller");
const upload = require("../middlewares/multer.middleware");
const authorize = require("../middlewares/auth.middleware");

router.use(authorize);

router.get("/", JournalController.getMyJournals);
router.get("/:id", JournalController.getById);
router.post("/", upload.array("images", 10), JournalController.create);
router.put("/:id", upload.array("images", 10), JournalController.update);
router.delete("/:id", JournalController.delete);

module.exports = router;
