const SearchService = require("../services/search/search.service");
const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/ApiResponse");

const handleSearch = (searchFn) =>
  catchAsync(async (req, res) => {
    const travelerId = req.user?.id || null;

    const mode = req.body.mode || "text";
    let result = [];

    if (mode === "text") {
      const { keyword, location, priceMin, priceMax, guests, ...filters } = req.body;

      result = await searchFn(keyword, location, priceMin, priceMax, guests, filters, travelerId);
    } else if (mode === "voice" || mode === "image") {
      const buffer = req.file?.buffer;
      const keyword = req.body.keyword;

      result = await SearchService.handleMediaSearch(mode, buffer, searchFn, keyword, travelerId);
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
