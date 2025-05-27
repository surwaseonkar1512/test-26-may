const Employee = require("../models/Employee");
const Enterprise = require("../models/Enterprise");

exports.createEmployee = async (req, res) => {
  try {
    const { name, department, role, salary, status, enterprise } = req.body;

    // 1. Create employee
    const employee = await Employee.create({
      name,
      department,
      role,
      salary,
      status,
      enterprise: enterprise,
    });

    // 2. Add employee to the enterprise
    await Enterprise.findByIdAndUpdate(enterprise, {
      $push: { employees: employee._id },
    });

    res.status(201).json(employee);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create employee", error: err.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate("enterprise");
    res.json(employees);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch employees", error: err.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update employee", error: err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    // Remove from enterprise
    await Enterprise.findByIdAndUpdate(employee.enterprise, {
      $pull: { employees: employee._id },
    });

    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete employee", error: err.message });
  }
};
