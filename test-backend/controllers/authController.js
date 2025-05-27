const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email and populate their role
    const user = await User.findOne({ email }).populate("role");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2. Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Structure permissions into a simplified object
    const permissions = {};
    if (user.role && user.role.permissions) {
      user.role.permissions.forEach((perm) => {
        permissions[perm.module] = perm.permissions;
      });
    }

    // 4. Create JWT with role and permissions
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role?.name,
        permissions,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. Respond with token and user data
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role?.name,
        permissions,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
