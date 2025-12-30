const express = require("express");
const router = express.Router();
const SearchController = require("../controllers/search.controller");
const upload = require("../middlewares/multer.middleware");
const authorize = require("../middlewares/auth.middleware");

router.use(authorize);

router.post("/services", upload.single("file"), SearchController.searchServices);
// router.post("/vouchers", upload.single("file"), SearchController.searchVouchers);
// router.post("/rooms", upload.single("file"), SearchController.searchRooms);
// router.post("/menus", upload.single("file"), SearchController.searchMenus);
// router.post("/tickets", upload.single("file"), SearchController.searchTickets);
// router.post("/places", upload.single("file"), SearchController.searchPlaces);
// router.post("/tours", upload.single("file"), SearchController.searchTours);
// router.post("/providers", upload.single("file"), SearchController.searchProviders);

module.exports = router;
