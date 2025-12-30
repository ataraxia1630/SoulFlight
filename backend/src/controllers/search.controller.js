const SearchService = require("../services/search/search.service");
const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/ApiResponse");

const SearchController = {
  searchServices: catchAsync(async (req, res) => {
    const { keyword, location, priceMin, priceMax, guests, mode = "text", ...filters } = req.body;

    const fileBuffer = mode === "image" && req.file ? req.file.buffer : null;
    const travelerId = req.user?.id || null;

    const result = await SearchService.searchServices(
      keyword,
      location,
      priceMin,
      priceMax,
      guests,
      filters,
      travelerId,
      mode,
      fileBuffer,
    );

    res.json(success({ services: result }));
  }),
};

module.exports = SearchController;
