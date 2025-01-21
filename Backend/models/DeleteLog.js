const mongoose = require("mongoose");

const deleteLogSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  reason: { type: String, required: true },
  deletedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DeleteLog", deleteLogSchema);
