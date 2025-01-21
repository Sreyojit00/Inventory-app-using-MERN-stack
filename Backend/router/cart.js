const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart");

// Routes for cart operations
router.get('/cart/:userId', cartController.getCartByUserId); 
router.post("/cart/add", cartController.addToCart);
router.put("/cart/update", cartController.updateQuantity);
router.delete("/cart/remove/:productId", cartController.removeFromCart);
router.get("/cart/:userId", cartController.getCart);


module.exports = router;
