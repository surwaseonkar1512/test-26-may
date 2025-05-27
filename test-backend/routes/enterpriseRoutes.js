const express = require("express");
const router = express.Router();
const {
  createEnterprise,
  getAllEnterprises,
  updateEnterprise,
  deleteEnterprise,
} = require("../controllers/enterpriseController");

router.post("/", createEnterprise);
router.get("/", getAllEnterprises);
router.put("/:id", updateEnterprise);
router.delete("/:id", deleteEnterprise);

module.exports = router;
