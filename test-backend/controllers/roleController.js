const Role = require('../models/Role');

exports.createRole = async (req, res) => {
  const role = new Role(req.body);
  await role.save();
  res.status(201).json(role);
};

exports.getRoles = async (req, res) => {
  const roles = await Role.find();
  res.json(roles);
};
