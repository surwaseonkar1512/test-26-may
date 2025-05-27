// src/pages/Employees.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [enterprises, setEnterprises] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "", department: "", role: "", salary: "", status: "Active", enterprise: ""
  });

  const token = localStorage.getItem("token");

  const fetchAll = async () => {
    const [empRes, entRes] = await Promise.all([
      axios.get("http://localhost:5000/api/employees", { headers: { Authorization: `Bearer ${token}` } }),
      axios.get("http://localhost:5000/api/enterprises", { headers: { Authorization: `Bearer ${token}` } }),
    ]);
    setEmployees(empRes.data);
    setEnterprises(entRes.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:5000/api/employees/${editingId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post("http://localhost:5000/api/employees", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    setFormData({ name: "", department: "", role: "", salary: "", status: "Active", enterprise: "" });
    setEditingId(null);
    fetchAll();
  };

  const handleEdit = (emp) => {
    setFormData({
      name: emp.name,
      department: emp.department,
      role: emp.role,
      salary: emp.salary,
      status: emp.status,
      enterprise: emp.enterprise?._id || "",
    });
    setEditingId(emp._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/employees/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAll();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Employee Management</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 max-w-lg">
        <h3 className="text-lg font-semibold mb-3">{editingId ? "Edit" : "Create"} Employee</h3>
        {["name", "department", "role", "salary"].map((field) => (
          <div className="mb-2" key={field}>
            <label className="block font-medium capitalize">{field}</label>
            <input
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        ))}
        <div className="mb-2">
          <label className="block font-medium">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full border p-2 rounded"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium">Enterprise</label>
          <select
            value={formData.enterprise}
            onChange={(e) => setFormData({ ...formData, enterprise: e.target.value })}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select Enterprise</option>
            {enterprises.map((ent) => (
              <option key={ent._id} value={ent._id}>{ent.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          {editingId ? "Update" : "Create"}
        </button>
      </form>

      <div className="grid gap-4">
        {employees.map((emp) => (
          <div key={emp._id} className="bg-white p-4 rounded shadow">
            <h4 className="font-bold text-lg">{emp.name}</h4>
            <p>{emp.role} - {emp.department}</p>
            <p>Salary: ₹{emp.salary}</p>
            <p>Status: {emp.status}</p>
            <p>Enterprise: {emp.enterprise?.name || "—"}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(emp)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(emp._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Employees;
