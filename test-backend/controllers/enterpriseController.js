const Enterprise = require("../models/Enterprise");

exports.createEnterprise = async (req, res) => {
  try {
    const { name, location, contactInfo } = req.body;
    const enterprise = await Enterprise.create({ name, location, contactInfo });
    res.status(201).json(enterprise);
  } catch (err) {
    res.status(500).json({ message: "Failed to create enterprise", error: err.message });
  }
};

exports.getAllEnterprises = async (req, res) => {
  try {
    const enterprises = await Enterprise.find().populate("employees");
    res.json(enterprises);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch enterprises", error: err.message });
  }
};

exports.updateEnterprise = async (req, res) => {
  try {
    const updated = await Enterprise.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update enterprise", error: err.message });
  }
};

exports.deleteEnterprise = async (req, res) => {
  try {
    await Enterprise.findByIdAndDelete(req.params.id);
    res.json({ message: "Enterprise deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete enterprise", error: err.message });
  }
};
