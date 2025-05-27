const mongoose = require('mongoose');

const ModulePermissionSchema = new mongoose.Schema({
  module: String, // e.g., 'Users', 'Products'
  permissions: {
    read: Boolean,
    create: Boolean,
    update: Boolean,
    delete: Boolean
  }
});

const RoleSchema = new mongoose.Schema({
  name: String,
  permissions: [ModulePermissionSchema]
});

module.exports = mongoose.model('Role', RoleSchema);
