import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [editUserId, setEditUserId] = useState(null); // Track user being edited

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(res.data);
    } catch (err) {
      console.error("Failed to fetch roles", err);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/users",
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData({ name: "", email: "", password: "", role: "" });
      fetchUsers();
    } catch (err) {
      console.error("User creation failed", err.response?.data || err);
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
    try {
      await axios.put(
        `http://localhost:5000/api/users/${editUserId}`,
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditUserId(null);
      setFormData({ name: "", email: "", password: "", role: "" });
      fetchUsers();
    } catch (err) {
      console.error("User update failed", err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  return (
    <div className="p-6 text-black">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>

      {/* Create User Form */}
      <form
        onSubmit={handleCreateUser}
        className="bg-white p-4 rounded shadow mb-6 max-w-md"
      >
        <h3 className="text-lg font-bold mb-4">Create New User</h3>

        <div className="mb-3">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Role</label>
          <select
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create User
        </button>
      </form>

      {/* User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white shadow p-4 rounded border border-gray-200"
          >
            {editUserId === user._id ? (
              <form onSubmit={handleUpdateUser}>
                <h4 className="font-bold mb-2">Edit User</h4>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border p-2 rounded mb-2"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border p-2 rounded mb-2"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full border p-2 rounded mb-2"
                />
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full border p-2 rounded mb-2"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditUserId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h4 className="text-lg font-semibold">{user.name}</h4>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-800 mt-1">
                  Role: <strong>{user.role?.name || "—"}</strong>
                </p>
                <button
                  onClick={() => handleEdit(user)}
                  className="mt-3 inline-block bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
