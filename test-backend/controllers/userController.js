const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const user = new User({
      name,
      email,
      password,
      role: role || null,
    });

    await user.save();

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const updateData = { name, email };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }
    if (role) {
      updateData.role = role;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).populate("role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

exports.assignRole = async (req, res) => {
  const { roleId } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: roleId },
    { new: true }
  );
  res.json(user);
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find().populate("role");
  res.json(users);
};
