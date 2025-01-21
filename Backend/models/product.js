const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    batch: {
      type: Number,
      required: true,
    },
    ExpDate: {
      type: Date,
      required: true,
    },
    quantity: {
      type: Number
    },
    stockThreshold: {
      type: Number,
      required: false
    }, // Threshold for low stock

    expiryThreshold: {
      type: Date,
      required: false
    },
    size: {
      type: String,
      required:true
    },
    price: {
      type: Number,
      required:true
    },
    supplierId: {
      type: String,
      required:true
    },
    supplierName: {
      type: String,
      required:true
    },
    category: {
      type:String,
      required:true
    },


    description: String,
  },
  { timestamps: true }
);


module.exports = mongoose.models.product || mongoose.model('product', ProductSchema);

