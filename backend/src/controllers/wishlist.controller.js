const WishlistService = require("../services/wishlist.service");
const { SearchServiceDTO } = require("../dtos/search.dto");
const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/ApiResponse");

const WishlistController = {
  toggle: catchAsync(async (req, res) => {
    const { service_id } = req.body;
    const result = await WishlistService.toggle(req.user.id, service_id);
    res.json(success(result));
  }),

  getWishlist: catchAsync(async (req, res) => {
    const travelerId = req.user.id;
    const rawServices = await WishlistService.getWishlist(travelerId);
    const formattedServices = await SearchServiceDTO(rawServices, travelerId);
    return res.json(success(formattedServices));
  }),
};

module.exports = WishlistController;
