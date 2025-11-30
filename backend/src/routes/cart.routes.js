const { Router } = require("express");
const { CartController } = require("../controllers/cart.controller");
const { addToCartSchema, updateCartItemSchema } = require("../validators/cart.validator");
const validate = require("../middlewares/validate.middleware");
const authorize = require("../middlewares/auth.middleware");
const requiredRoles = require("../middlewares/role.middleware");

const router = Router();

router.use(authorize, requiredRoles("TRAVELER"));

router.get("/", CartController.getCart);
router.post("/", validate(addToCartSchema), CartController.addToCart);
router.put("/:id", validate(updateCartItemSchema), CartController.updateCartItem);
router.delete("/:id", CartController.removeFromCart);
router.delete("/", CartController.clearCart);

module.exports = router;
