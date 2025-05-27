import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserPlus } from "react-icons/fa";

const MODULES = [
  "Enterprises",
  "Users",
  "Dashboards",
  "Employees",
  "Products",
  "Product Sale",
];

const defaultPermissions = MODULES.map((module) => ({
  module,
  permissions: {
    read: false,
    create: false,
    update: false,
    delete: false,
  },
}));

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState(defaultPermissions);
  const token = localStorage.getItem("token");

  const fetchRoles = async () => {
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
    }
  };

  const handleCheckboxChange = (module, permType) => {
    setPermissions((prev) =>
      prev.map((p) => {
        if (p.module !== module) return p;

        const updatedPerms = {
          ...p.permissions,
          [permType]: !p.permissions[permType],
        };

        if (permType === "read" && !updatedPerms.read) {
          updatedPerms.create = false;
          updatedPerms.update = false;
          updatedPerms.delete = false;
        }

        return { ...p, permissions: updatedPerms };
      })
    );
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://test-26-may.onrender.com/api/roles",
        { name, permissions },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setName("");
      setPermissions(defaultPermissions);
      fetchRoles();
    } catch (err) {
      console.error("Role creation failed", err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="p-6 text-black">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaUserPlus className="text-[#912891]" /> Role Management
      </h2>

      {/* Create Role Form */}
      <form
        onSubmit={handleCreateRole}
        className="bg-white p-6 rounded shadow mb-6 max-w-4xl"
      >
        <h3 className="text-lg font-bold mb-4">Create New Role</h3>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Role Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="e.g., Manager"
          />
        </div>

        {/* Permissions UI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {permissions.map((p) => (
            <div
              key={p.module}
              className="border rounded p-4 shadow-sm bg-gray-50"
            >
              <div className="flex flex-row items-center justify-between">
                <h4 className="font-semibold text-gray-700 mb-3">{p.module}</h4>

                {/* Read Checkbox */}
                <label className="flex items-center space-x-2 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={p.permissions.read}
                    onChange={() => handleCheckboxChange(p.module, "read")}
                    className="cursor-pointer"
                  />
                </label>
              </div>

              {/* Sub-permissions shown only if Read is checked */}
              {p.permissions.read && (
                <div className="ml-4 space-y-2">
                  {["create", "update", "delete"].map((perm) => (
                    <label key={perm} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={p.permissions[perm]}
                        onChange={() => handleCheckboxChange(p.module, perm)}
                      />
                      <span className="capitalize">{perm}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-[#912891] text-white px-4 py-2 rounded hover:bg-green--700 transition"
        >
          Create Role
        </button>
      </form>

      {/* Existing Roles */}
      <div className="max-w-4xl">
        <h3 className="text-lg font-semibold mb-3">Existing Roles</h3>
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Role</th>
              <th className="border p-2">Permissions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role._id}>
                <td className="border p-2 font-medium">{role.name}</td>
                <td className="border p-2 whitespace-pre-wrap text-gray-700">
                  {role.permissions
                    .filter((perm) => perm.permissions.read)
                    .map((perm) => perm.module)
                    .join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Roles;
