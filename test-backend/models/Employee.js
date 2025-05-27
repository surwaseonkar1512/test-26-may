// models/Employee.js
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: String,
  role: String,
  salary: Number,
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  enterprise: { type: mongoose.Schema.Types.ObjectId, ref: "Enterprise" }, 
});

module.exports = mongoose.model("Employee", employeeSchema);
