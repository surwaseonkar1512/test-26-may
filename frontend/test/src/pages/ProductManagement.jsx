import React, { useEffect, useState } from "react";
import axios from "axios";

const initialFormState = {
  name: "",
  sku: "",
  price: "",
  category: "",
  status: "active",
  enterprise: "",
  employee: "",
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [enterprises, setEnterprises] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
    fetchEnterprises();
    fetchEmployees();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://test-26-may.onrender.com/api/products",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const fetchEnterprises = async () => {
    try {
      const res = await axios.get(
        "https://test-26-may.onrender.com/api/enterprises",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEnterprises(res.data);
    } catch (err) {
      console.error("Failed to fetch enterprises", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        "https://test-26-may.onrender.com/api/employees",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "enterprise" && value) {
      setFormData((prev) => ({ ...prev, enterprise: value, employee: "" }));
    } else if (name === "employee" && value) {
      setFormData((prev) => ({ ...prev, employee: value, enterprise: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.enterprise && !formData.employee) {
      alert("Please select either an enterprise or an employee.");
      return;
    }

    const payload = { ...formData };

    try {
      if (editingId) {
        await axios.put(
          `https://test-26-may.onrender.com/api/products/${editingId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "https://test-26-may.onrender.com/api/products",
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      setFormData(initialFormState);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error("Product save failed", err.response?.data || err);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name || "",
      sku: product.sku || "",
      price: product.price || "",
      category: product.category || "",
      status: product.status || "active",
      enterprise: product.enterprise ? product.enterprise._id : "",
      employee: product.employee ? product.employee._id : "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(
        `https://test-26-may.onrender.com/api/products/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Product Management</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow mb-8"
      >
        <h3 className="text-lg font-bold mb-4">
          {editingId ? "Edit Product" : "Create New Product"}
        </h3>

        <div className="mb-3">
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block font-medium mb-1">SKU</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block font-medium mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block font-medium mb-1">
            Associate with Enterprise
          </label>
          <select
            name="enterprise"
            value={formData.enterprise}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Enterprise</option>
            {enterprises.map((ent) => (
              <option key={ent._id} value={ent._id}>
                {ent.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">
            Associate with Employee
          </label>
          <select
            name="employee"
            value={formData.employee}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Product" : "Create Product"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData(initialFormState);
            }}
            className="ml-4 px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
      </form>

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border">Name</th>
            <th className="p-3 border">SKU</th>
            <th className="p-3 border">Price</th>
            <th className="p-3 border">Category</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Associated With</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center p-4">
                No products found.
              </td>
            </tr>
          )}
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-50">
              <td className="p-3 border">{product.name}</td>
              <td className="p-3 border">{product.sku}</td>
              <td className="p-3 border">${product.price.toFixed(2)}</td>
              <td className="p-3 border">{product.category || "—"}</td>
              <td className="p-3 border capitalize">{product.status}</td>
              <td className="p-3 border">
                {product.enterprise
                  ? `Enterprise: ${product.enterprise.name}`
                  : product.employee
                  ? `Employee: ${product.employee.name}`
                  : "—"}
              </td>
              <td className="p-3 border space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
