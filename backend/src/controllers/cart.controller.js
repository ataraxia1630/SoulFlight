const { CartService } = require("../services/cart.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");
const { CartDTO } = require("../dtos/cart.dto");

const CartController = {
  getCart: catchAsync(async (req, res) => {
    const travelerId = req.user.id;
    const cart = await CartService.getCartByTravelerId(travelerId);
    res.status(200).json(ApiResponse.success(CartDTO.fromModel(cart)));
  }),

  addToCart: catchAsync(async (req, res) => {
    const travelerId = req.user.id;
    const item = await CartService.addToCart(travelerId, req.body);
    res.status(201).json(ApiResponse.success(CartDTO.itemFromModel(item)));
  }),

  updateCartItem: catchAsync(async (req, res) => {
    const travelerId = req.user.id;
    const item = await CartService.updateCartItem(travelerId, Number(req.params.id), req.body);
    res.status(200).json(ApiResponse.success(CartDTO.itemFromModel(item)));
  }),

  removeFromCart: catchAsync(async (req, res) => {
    const travelerId = req.user.id;
    await CartService.removeFromCart(travelerId, Number(req.params.id));
    res.status(204).json(ApiResponse.success());
  }),

  clearCart: catchAsync(async (req, res) => {
    const travelerId = req.user.id;
    await CartService.clearCart(travelerId);
    res.status(204).json(ApiResponse.success());
  }),
};

module.exports = { CartController };
