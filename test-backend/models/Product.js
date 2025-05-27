const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  category: String,
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  enterprise: { type: mongoose.Schema.Types.ObjectId, ref: "Enterprise" },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
