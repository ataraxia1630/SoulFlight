const express = require("express");
const router = express.Router();
const WishlistController = require("../controllers/wishlist.controller");
const authorize = require("../middlewares/auth.middleware");

router.use(authorize);

router.get("/", WishlistController.getWishlist);
router.post("/toggle", WishlistController.toggle);

module.exports = router;
