// models/Enterprise.js
const mongoose = require("mongoose");

require("./Employee");

const enterpriseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  contactInfo: String,
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
});

module.exports = mongoose.model("Enterprise", enterpriseSchema);
