const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("../test-backend/models/User");
const Role = require("../test-backend/models/Role");

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    // Clear existing admin
    await User.deleteOne({ email: "surwaseonkar8999@gmail.com" });

    // Create role if not exists
    let role = await Role.findOne({ name: "Admin" });
    if (!role) {
      role = await new Role({
        name: "Admin",
        permissions: [
          {
            module: "Users",
            permissions: {
              read: true,
              create: true,
              update: true,
              delete: true,
            },
          },
          {
            module: "Roles",
            permissions: {
              read: true,
              create: true,
              update: true,
              delete: true,
            },
          },
          {
            module: "Enterprises",
            permissions: {
              read: true,
              create: true,
              update: true,
              delete: true,
            },
          },
          {
            module: "Dashboards",
            permissions: {
              read: true,
              create: true,
              update: true,
              delete: true,
            },
          },
          {
            module: "Employees",
            permissions: {
              read: true,
              create: true,
              update: true,
              delete: true,
            },
          },
          {
            module: "Products",
            permissions: {
              read: true,
              create: true,
              update: true,
              delete: true,
            },
          },
          {
            module: "Product Sale",
            permissions: {
              read: true,
              create: true,
              update: true,
              delete: true,
            },
          },
        ],
      }).save();
    }
    // Create hashed password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create admin user
    const admin = await new User({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: role._id,
    }).save();

    console.log("✅ Admin user created:", admin.email);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.disconnect();
  }
});
