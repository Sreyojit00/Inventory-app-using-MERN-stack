const { default: mongoose } = require("mongoose");
const Product = require("../models/product");
const Purchase = require("../models/purchase");
const Sales = require("../models/sales");
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const DeleteLog = require('../models/DeleteLog'); // A new model for deletion logs
const User = require("../models/users");
const sendEmail = require("./emailService");
const moment = require('moment');


// Add Post
// Add Post
const addProduct = async (req, res) => {
  try {
    console.log("req: ", req.body.userId);

    const addProduct = new Product({
      userID: new mongoose.Types.ObjectId(req.body.userId),
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      stock: req.body.stock,
      batch: req.body.batch,
      ExpDate: req.body.ExpDate,
      description: req.body.description,
      quantity: req.body.batch * req.body.stock,
      size: req.body.size,
      price: req.body.price,
      supplierId: req.body.supplierId,
      supplierName: req.body.supplierName,
      category: req.body.category,
    });

    const result = await addProduct.save();
    res.status(200).send(result);
  } catch (err) {
    res.status(402).send(err);
  }
};

// Get All Products specific user
const getAllProductsbyUser = async (req, res) => {
  const findAllProducts = await Product.find({
    userID: req.params.userId,
  }).sort({ _id: -1 }); // -1 for descending;
  res.json(findAllProducts);
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {}; 
    const products = await Product.find(filter)
      .sort({ _id: -1 }); // Sort in descending order based on _id to get the latest first

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error while fetching products" });
  }
};


// Delete Selected Product
const deleteSelectedProduct = async (req, res) => {
  const { id } = req.params;
  const { reason, productName, deletionTime } = req.body;

  try {
    // First, delete the product
    await Product.findByIdAndDelete(id);

    // After deletion, log the deletion reason
    const deleteLog = new DeleteLog({
      productName,
      reason,
      deletionTime,
      deletedAt: new Date()
    });

    await deleteLog.save();

    res.json({ message: 'Product deleted and log created' });
  } catch (err) {
    res.status(500).json({ error: 'Error processing the request' });
  }
};


// Update Selected Product
const updateSelectedProduct = async (req, res) => {
  try {
    const updatedResult = await Product.findByIdAndUpdate(
      { _id: req.body.productID },
      {
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        stock: req.body.stock,
        batch: req.body.batch,
        quantity: (req.body.stock) * (req.body.batch),
        ExpDate: req.body.ExpDate,
        size:req.body.size,
        price:req.body.price,
        supplierId:req.body.supplierId,
        supplierName:req.body.supplierName

      },
      { new: true }
    );
    console.log(updatedResult);
    res.json(updatedResult);
  } catch (error) {
    console.log(error);
    res.status(402).send("Error");
  }
};

// Function to parse Excel serial date to JavaScript Date
const parseExcelDate = (excelSerialDate) => {
  try {
    // Parse the Excel date (serial number)
    const date = XLSX.SSF.parse_date_code(excelSerialDate);
    const jsDate = new Date(date.y, date.m - 1, date.d); // Convert to JavaScript Date
    
    console.log('Parsed Date:', jsDate); // Log parsed date for debugging
    
    return jsDate;
  } catch (error) {
    console.error("Error parsing Excel date:", error);
    return null; // Return null if there's an error parsing the date
  }
};

// Function to save product data including date to database
const saveProductsToDatabase = async (data, userID) => {
  try {
    const productPromises = data.map(async (productData) => {
      console.log('Product Data:', productData); // Log product data for debugging

      const {
        "Product Name": name,
        Manufacturer: manufacturer,
        Stock: stock,
        Description: description,
        Batch: batch,
        ExpDate: expDate, // Excel date field
        Quantity: quantity,
        Size: size,
        Price: price,
        SupplierId: supplierId,
        SupplierName: supplierName,
        Category: category
      } = productData;

      // Parse ExpDate if it exists
      const parsedExpDate = expDate ? parseExcelDate(expDate) : null;

      // Log parsed date to verify it's correct
      console.log('Parsed Expiry Date:', parsedExpDate);
      
      const product = new Product({
        name,
        manufacturer,
        stock,
        description,
        userID,
        batch,
        ExpDate: parsedExpDate, // Save the parsed date to the database
        quantity,
        size,
        price,
        supplierId,
        supplierName,
        category
      });

      // Save the product to the database
      await product.save();
    });

    // Wait for all product promises to resolve
    await Promise.all(productPromises);
    console.log("Products saved successfully");
  } catch (error) {
    console.error("Error saving products:", error);
    throw error;
  }
};



const bulkUploadProducts = async (req, res) => {
  const file = req.file; // File uploaded in memory
  const userID = req.body.userID;

  if (!file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  if (!userID) {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  try {
    // Read file content using XLSX
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Save products to the database
    await saveProductsToDatabase(data, userID);

    res.status(200).json({
      success: true,
      message: 'Product saved to the database',
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ success: false, message: 'Error processing the file' });
  }
};

// Search Products
const searchProduct = async (req, res) => {
  const { searchTerm } = req.query;
  const userId = req.user; // Assuming `req.user` contains the authenticated user's information

  try {
    const products = await Product.find({
      userId, // Filter by the authenticated user's ID
      name: { $regex: `^${searchTerm}`, $options: "i" }, // Matches names starting with `searchTerm`, case-insensitive
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error during product search:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAlertProducts = async (req, res) => {
  try {
    // Fetch top 5 products with the least stock
    const lowStockProducts = await Product.find({})
      .sort({ stock: 1 }) // Ascending by stock
      .limit(5)
      .select("name stock stockThreshold");

    console.log(lowStockProducts)

    // Fetch top 5 products nearing expiry
    const expiringProducts = await Product.find({ ExpDate: { $ne: null } })
      .sort({ ExpDate: 1 }) // Ascending by expiry date
      .limit(5)
      .select("name stock ExpDate expiryThreshold");

    console.log("hello", expiringProducts)

    res.status(200).json({
      lowStock: lowStockProducts,
      expiring: expiringProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch alert products.", error });
  }
};
const setThreshold = async (req, res) => {
  const { productId, threshold, thresholdType } = req.body;

  if (!productId || threshold === undefined) {
    return res.status(400).json({ message: "Product ID and threshold are required." });
  }

  try {
    // Find the product and update its threshold value
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Check threshold validity
    if (thresholdType === 'expiryThreshold') {
      const productExpiryDate = product.ExpDate;
      const selectedExpiryDate = moment(threshold, 'YYYY-MM-DD', true);
      if (selectedExpiryDate.isAfter(productExpiryDate)) {
        return res.status(400).json({ message: "Expiry threshold cannot be later than product's expiry date." });
      }
      // Convert selectedExpiryDate to a native Date object
      product.expiryThreshold = selectedExpiryDate.format('YYYY-MM-DD');

    } else {
      if (threshold >= product.stock) {
        return res.status(400).json({ message: "Threshold value must be less than the current stock." });
      }
      product.stockThreshold = threshold;
    }

    // Save updated product
    await product.save();

    // Fetch all users to send email notifications
    const users = await User.find();
    const emailPromises = users.map(user => {
      const subject = `Threshold set for ${product.name}`;
      const text = `Hello ${user.name},\n\nThe threshold for product ${product.name} has been set.\nThreshold Value: ${threshold}\n\nBest regards,\nYour Store.`;
      return sendEmail(user.email, subject, text); // Send email to each user
    });

    // Wait for all emails to be sent
    await Promise.all(emailPromises);

    res.status(200).json({ message: "Threshold value updated and notifications sent." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update threshold value.", error });
  }
};




module.exports = {
  addProduct,
  getAllProductsbyUser,
  deleteSelectedProduct,
  updateSelectedProduct,
  searchProduct,
  bulkUploadProducts,
  getAllProducts,
  getAlertProducts,
  setThreshold
};
