import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserPlus, FaEdit, FaTimes, FaSave } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [editUserId, setEditUserId] = useState(null);

  // Loading states
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get(
        "https://test-26-may.onrender.com/api/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
      toast.error(
        `Failed to fetch users: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchRoles = async () => {
    setLoadingRoles(true);
    try {
      const res = await axios.get(
        "https://test-26-may.onrender.com/api/roles",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRoles(res.data);
    } catch (err) {
      console.error("Failed to fetch roles", err);
      toast.error(
        `Failed to fetch roles: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoadingCreate(true);
    try {
      const res = await axios.post(
        "https://test-26-may.onrender.com/api/users",
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "User created successfully!");
      setFormData({ name: "", email: "", password: "", role: "" });
      fetchUsers();
    } catch (err) {
      console.error("User creation failed", err.response?.data || err);
      toast.error(
        `User creation failed: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role?._id || "",
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    try {
      const res = await axios.put(
        `https://test-26-may.onrender.com/api/users/${editUserId}`,
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "User updated successfully!");
      setEditUserId(null);
      setFormData({ name: "", email: "", password: "", role: "" });
      fetchUsers();
    } catch (err) {
      console.error("User update failed", err.response?.data || err);
      toast.error(
        `User update failed: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoadingUpdate(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  return (
    <div className="p-6 text-black max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={4000} />
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaUserPlus className="text-[#912891]" /> User Management
      </h2>

      {/* Create User Form */}
      <form
        onSubmit={handleCreateUser}
        className="bg-white p-6 rounded-xl shadow-md mb-8 max-w-2xl w-full"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Create New User
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              required
              disabled={loadingCreate}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border p-2 rounded focus:outline-[#912891]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              disabled={loadingCreate}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border p-2 rounded focus:outline-[#912891]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              disabled={loadingCreate}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full border p-2 rounded focus:outline-[#912891]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              required
              disabled={loadingCreate || loadingRoles}
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full border p-2 rounded focus:outline-[#912891]"
            >
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loadingCreate}
          className={`mt-5 bg-[#912891] text-white px-5 py-2 rounded cursor-pointer flex items-center gap-2 ${
            loadingCreate ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <FaUserPlus />
          {loadingCreate ? "Creating..." : "Create User"}
        </button>
      </form>

      {/* Loading state for users */}
      {loadingUsers ? (
        <p className="text-center text-gray-500">Loading users...</p>
      ) : (
        /* User Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...users].reverse().map((user) => (
            <div
              key={user._id}
              className="bg-white shadow rounded-lg p-5 border border-gray-200"
            >
              {editUserId === user._id ? (
                <form onSubmit={handleUpdateUser}>
                  <h4 className="font-semibold mb-3 text-gray-800">
                    Edit User
                  </h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Name"
                      disabled={loadingUpdate}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      disabled={loadingUpdate}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      disabled={loadingUpdate}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                    />
                    <select
                      disabled={loadingUpdate || loadingRoles}
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Select a role</option>
                      {roles.map((role) => (
                        <option key={role._id} value={role._id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      type="submit"
                      disabled={loadingUpdate}
                      className={`bg-[#912891] text-white px-4 py-2 rounded flex items-center gap-1 ${
                        loadingUpdate ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      <FaSave />
                      {loadingUpdate ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      disabled={loadingUpdate}
                      onClick={() => setEditUserId(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-1"
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h4 className="text-xl font-bold text-gray-800">
                    {user.name}
                  </h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-700 mt-1">
                    Role:{" "}
                    <span className="font-medium">
                      {user.role?.name || "—"}
                    </span>
                  </p>
                  <button
                    onClick={() => handleEdit(user)}
                    className="mt-4 bg-[#912891] text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"
                  >
                    <FaEdit /> Edit
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
