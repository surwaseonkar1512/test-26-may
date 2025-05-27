const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const auth = require("../middleware/auth");
const authorize = require("../middleware/permissions");

router.post("/", auth, authorize("Products", "create"), createProduct);
router.get("/", auth, authorize("Products", "read"), getAllProducts);
router.put("/:id", auth, authorize("Products", "update"), updateProduct);
router.delete("/:id", auth, authorize("Products", "delete"), deleteProduct);

module.exports = router;
