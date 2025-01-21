const express = require("express");
const router = express.Router();
const product = require("../controller/product");
const path = require("path");
const upload = require("../middleware/multer");
const DeleteLog = require("../models/DeleteLog");
const Product = require("../models/product");
const Cart = require("../models/CartModel");

// -------------------- Product Routes -------------------- //

// Add a new product
router.post("/add", product.addProduct);

// Get all products
router.get("/get", product.getAllProducts);

// Get all products by user
router.get("/get/:userId", product.getAllProductsbyUser);

// Search products by name, category, etc.
router.get("/search", product.searchProduct);

// Bulk file upload for products
router.post("/bulk-upload", upload.single("file"), product.bulkUploadProducts);

// -------------------- Update & Delete -------------------- //

// Update selected product
router.post("/update", product.updateSelectedProduct);

// Delete selected product and log the reason
router.delete("/delete/:id", product.deleteSelectedProduct);

// -------------------- Logs and Alerts -------------------- //

// Get all delete logs
router.get("/deleteLogs", async (req, res) => {
  try {
    const logs = await DeleteLog.find();
    res.json(logs);
  } catch (err) {
    console.error("Error fetching delete logs:", err);
    res.status(500).json({ error: "Error fetching delete logs" });
  }
});

// Get alerts for products (e.g., low stock or nearing expiry)
router.get("/alerts", product.getAlertProducts);

// -------------------- Threshold and Categories -------------------- //

// Set threshold value for a product
router.post("/setThreshold", product.setThreshold);

// Get all unique product categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Server error while fetching categories" });
  }
});

// Middleware to verify if the user is authenticated
const verifyUser = (req, res, next) => {
  // Assuming you have a method to verify the user, like JWT authentication
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  next();
};

router.post("/add-to-cart", verifyUser, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.userId;

  try {
    const cart = await Cart.findOne({ userId });

    if (cart) {
      const existingProduct = cart.items.find((item) => item.productId.toString() === productId);
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
      await cart.save();
      return res.status(200).json(cart);
    } else {
      const newCart = new Cart({ userId, items: [{ productId, quantity }] });
      await newCart.save();
      return res.status(201).json(newCart);
    }
  } catch (err) {
    return res.status(500).json({ message: "Failed to add to cart", error: err });
  }
});


// -------------------- Exports -------------------- //

module.exports = router;
