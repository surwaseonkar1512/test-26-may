const express = require("express");
const router = express.Router();
const {
  createUser,
  assignRole,
  getAllUsers,
  updateUser,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const authorize = require("../middleware/permissions");

router.post("/", auth, authorize("Users", "create"), createUser);
router.put("/:id/role", auth, authorize("Users", "update"), assignRole);
router.get("/", auth, authorize("Users", "read"), getAllUsers);
router.put("/:id", auth, authorize("Users", "update"), updateUser);

module.exports = router;
