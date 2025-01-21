const Cart = require("../models/CartModel");

exports.addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Check if product already exists in the cart
      const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (productIndex > -1) {
        cart.items[productIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    } else {
      // If no cart exists for the user, create a new one
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (err) {
    res.status(500).json({ error: "Failed to add to cart", details: err.message });
  }
};

exports.getCartByUserId = async (req, res) => {
    try {
      const { userId } = req.params;  // Get userId from the route parameter
      const cart = await Cart.findOne({ userId }).populate('items.productId');  // Assuming Cart has a field "items" with a reference to products
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      res.status(200).json({ cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

exports.updateQuantity = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (productIndex > -1) {
      cart.items[productIndex].quantity = quantity;
      await cart.save();
      res.status(200).json({ message: "Quantity updated", cart });
    } else {
      res.status(404).json({ error: "Product not found in cart" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update quantity", details: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  const { userId } = req.body;
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove product", details: err.message });
  }
};

exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart", details: err.message });
  }
};
