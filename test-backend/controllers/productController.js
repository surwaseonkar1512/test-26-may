const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    let { name, sku, price, category, status, enterprise, employee } = req.body;

    // Reject if neither is selected
    if (!enterprise && !employee) {
      return res.status(400).json({
        message:
          "Product must be associated with either an enterprise or an employee.",
      });
    }

    // Remove empty string values
    if (enterprise === "") enterprise = undefined;
    if (employee === "") employee = undefined;

    const product = new Product({
      name,
      sku,
      price,
      category,
      status,
      enterprise,
      employee,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
};

exports.getAllProducts = async (req, res) => {
  const products = await Product.find()
    .populate("enterprise", "name")
    .populate("employee", "name");

  res.json(products);
};

exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};
