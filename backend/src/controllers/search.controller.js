const SearchService = require("../services/search/search.service");
const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/ApiResponse");

const handleSearch = (searchFn) =>
  catchAsync(async (req, res) => {
    const mode = req.body.mode || "text";
    let result = [];

    if (mode === "text") {
      const { keyword, location, priceMin, priceMax, guests, ...filters } = req.body;
      result = await searchFn(keyword, location, priceMin, priceMax, guests, filters);
    } else if (mode === "voice" || mode === "image") {
      result = await SearchService.handleMediaSearch(mode, req.file.buffer, searchFn);
    }

    res.json(success(result));
  });

const SearchController = {
  searchServices: handleSearch(SearchService.searchServices),
  searchVouchers: handleSearch(SearchService.searchVouchers),
  searchRooms: handleSearch(SearchService.searchRooms),
  searchMenus: handleSearch(SearchService.searchMenus),
  searchTickets: handleSearch(SearchService.searchTickets),
  searchPlaces: handleSearch(SearchService.searchPlaces),
  searchTours: handleSearch(SearchService.searchTours),
  searchProviders: handleSearch(SearchService.searchProviders),
};

module.exports = SearchController;
