import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaUser } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [enterprises, setEnterprises] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    role: "",
    salary: "",
    status: "Active",
    enterprise: "",
  });

  const token = localStorage.getItem("token");

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [empRes, entRes] = await Promise.all([
        axios.get("https://test-26-may.onrender.com/api/employees", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://test-26-may.onrender.com/api/enterprises", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setEmployees(empRes.data);
      setEnterprises(entRes.data);
    } catch (err) {
      toast.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        await axios.put(
          `https://test-26-may.onrender.com/api/employees/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Employee updated successfully!");
      } else {
        await axios.post(
          "https://test-26-may.onrender.com/api/employees",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Employee created successfully!");
      }
      setFormData({
        name: "",
        department: "",
        role: "",
        salary: "",
        status: "Active",
        enterprise: "",
      });
      setEditingId(null);
      fetchAll();
    } catch (err) {
      toast.error("Error submitting form.");
    } finally {
      setLoading(false);
    }
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
    try {
      setLoading(true);
      await axios.delete(
        `https://test-26-may.onrender.com/api/employees/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Employee deleted successfully!");
      fetchAll();
    } catch (err) {
      toast.error("Failed to delete employee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-6 text-black flex items-center gap-2">
        <FaUser className="text-[#912891]" /> Employee Management
      </h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-10"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          {editingId ? "Edit Employee" : "Create Employee"}
        </h3>

        {["name", "department", "role", "salary"].map((field) => (
          <div className="mb-4" key={field}>
            <label className="block mb-1 font-medium text-gray-600 capitalize">
              {field}
            </label>
            <input
              type="text"
              value={formData[field]}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#912891]"
              required
            />
          </div>
        ))}

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-600">Status</label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#912891]"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-600">
            Enterprise
          </label>
          <select
            value={formData.enterprise}
            onChange={(e) =>
              setFormData({ ...formData, enterprise: e.target.value })
            }
            required
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#912891]"
          >
            <option value="">Select Enterprise</option>
            {enterprises.map((ent) => (
              <option key={ent._id} value={ent._id}>
                {ent.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-[#912891] text-white px-6 py-2 rounded-md font-medium"
          disabled={loading}
        >
          {loading ? "Processing..." : editingId ? "Update" : "Create"}
        </button>
      </form>

      {/* LIST */}
      {loading ? (
        <p className="text-center text-gray-600">Loading employees...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((emp) => (
            <div key={emp._id} className="bg-white p-4 rounded-lg shadow-md">
              <h4 className="font-bold text-lg text-gray-800 mb-1">
                {emp.name}
              </h4>
              <p className="text-gray-600 mb-1">
                {emp.role} - {emp.department}
              </p>
              <p className="text-gray-600 mb-1">Salary: ₹{emp.salary}</p>
              <p className="text-gray-600 mb-1">Status: {emp.status}</p>
              <p className="text-gray-600 mb-2">
                Enterprise: {emp.enterprise?.name || "—"}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(emp)}
                  className="flex items-center gap-1 bg-[#912891] text-white px-3 py-1 rounded-md"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(emp._id)}
                  className="flex items-center gap-1 bg-[#912891] text-white px-3 py-1 rounded-md"
                >
                  <FaTrashAlt /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Employees;
