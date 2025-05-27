import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBuilding, FaEdit, FaTrashAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setFetching(true);
    try {
      await Promise.all([
        fetchProducts(),
        fetchEnterprises(),
        fetchEmployees(),
      ]);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setFetching(false);
    }
  };

  const fetchProducts = async () => {
    const res = await axios.get(
      "https://test-26-may.onrender.com/api/products",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setProducts(res.data);
  };

  const fetchEnterprises = async () => {
    const res = await axios.get(
      "https://test-26-may.onrender.com/api/enterprises",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setEnterprises(res.data);
  };

  const fetchEmployees = async () => {
    const res = await axios.get(
      "https://test-26-may.onrender.com/api/employees",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setEmployees(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "enterprise") {
      setFormData((prev) => ({ ...prev, enterprise: value, employee: "" }));
    } else if (name === "employee") {
      setFormData((prev) => ({ ...prev, employee: value, enterprise: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.enterprise && !formData.employee) {
      toast.warning(
        "Please associate with either an enterprise or an employee."
      );
      return;
    }

    const payload = { ...formData };
    setLoading(true);

    try {
      if (editingId) {
        await axios.put(
          `https://test-26-may.onrender.com/api/products/${editingId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Product updated successfully");
      } else {
        await axios.post(
          "https://test-26-may.onrender.com/api/products",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Product created successfully");
      }
      setFormData(initialFormState);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Product operation failed");
    } finally {
      setLoading(false);
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
      enterprise: product.enterprise?._id || "",
      employee: product.employee?._id || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    setLoading(true);
    try {
      await axios.delete(
        `https://test-26-may.onrender.com/api/products/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 mx-auto">
      <ToastContainer position="top-right" />
      <h2 className="text-3xl font-bold mb-6 text-black flex items-center gap-2">
        <FaBuilding className="text-[#912891]" /> Product Management
      </h2>

      {fetching ? (
        <p className="text-center text-gray-600 py-6">Loading data...</p>
      ) : (
        <>
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow mb-8"
          >
            <h3 className="text-lg font-bold mb-4">
              {editingId ? "Edit Product" : "Create New Product"}
            </h3>

            {/* Inputs */}
            {["name", "sku", "price", "category"].map((field) => (
              <div className="mb-3" key={field}>
                <label className="block font-medium mb-1 capitalize">
                  {field}
                </label>
                <input
                  type={field === "price" ? "number" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required={["name", "sku", "price"].includes(field)}
                  className="w-full border p-2 rounded"
                  step={field === "price" ? "0.01" : undefined}
                />
              </div>
            ))}

            <div className="mb-3">
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

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`bg-[#912891] text-white px-4 py-2 rounded ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {editingId
                  ? loading
                    ? "Updating..."
                    : "Update Product"
                  : loading
                  ? "Creating..."
                  : "Create Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData(initialFormState);
                  }}
                  className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Product Table */}
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
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
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="p-3 border">{product.name}</td>
                    <td className="p-3 border">{product.sku}</td>
                    <td className="p-3 border">₹{product.price}</td>
                    <td className="p-3 border">{product.category}</td>
                    <td className="p-3 border capitalize">{product.status}</td>
                    <td className="p-3 border">
                      {product.enterprise?.name ||
                        product.employee?.name ||
                        "-"}
                    </td>
                    <td className="p-3 border flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-[#912891] hover:text-green-700"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-[#912891] hover:text-red-700"
                      >
                        <FaTrashAlt size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ProductManagement;
