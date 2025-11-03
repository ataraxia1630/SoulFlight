const express = require("express");
const router = express.Router();
const SearchController = require("../controllers/search.controller");
const upload = require("../middlewares/multer.middleware");

const createRoute = (path, handler) => {
  router.get(path, upload.single("file"), handler);
  router.post(path, upload.single("file"), handler);
};

createRoute("/services", SearchController.searchServices);
createRoute("/vouchers", SearchController.searchVouchers);
createRoute("/rooms", SearchController.searchRooms);
createRoute("/menus", SearchController.searchMenus);
createRoute("/tickets", SearchController.searchTickets);
createRoute("/places", SearchController.searchPlaces);
createRoute("/tours", SearchController.searchTours);
createRoute("/providers", SearchController.searchProviders);

module.exports = router;
