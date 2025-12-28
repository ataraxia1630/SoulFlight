const WishlistService = require("../services/wishlist.service");
const { SearchServiceDTO } = require("../dtos/search.dto");
const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/ApiResponse");

const WishlistController = {
  toggle: catchAsync(async (req, res) => {
    const { serviceId } = req.body;
    const userId = req.user.id;
    const result = await WishlistService.toggle(userId, serviceId);
    return res.json(success(result));
  }),

  getWishlist: catchAsync(async (req, res) => {
    const travelerId = req.user.id;
    const rawServices = await WishlistService.getWishlist(travelerId);
    const formattedServices = await SearchServiceDTO(rawServices, travelerId);
    return res.json(success(formattedServices));
  }),
};

module.exports = WishlistController;
