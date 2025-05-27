import React, { useEffect, useState } from "react";
import axios from "axios";

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
      const res = await axios.get("http://localhost:5000/api/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
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

        // If unchecking read, reset all other permissions
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
        "http://localhost:5000/api/roles",
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
      <h2 className="text-2xl font-semibold mb-4">Role Management</h2>

      {/* Create Role Form */}
      <form
        onSubmit={handleCreateRole}
        className="bg-white p-4 rounded shadow mb-6 max-w-3xl"
      >
        <h3 className="text-lg font-bold mb-4">Create New Role</h3>

        <div className="mb-4">
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

        <table className="min-w-full text-sm border mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Module</th>
              <th className="border p-2">Access</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((p) => (
              <tr key={p.module}>
                <td className="border p-2">{p.module}</td>

                {/* Read checkbox always visible */}
                <td className="border p-2 text-center">
                  <input
                    type="checkbox"
                    checked={p.permissions.read}
                    onChange={() => handleCheckboxChange(p.module, "read")}
                  />
                </td>

                {/* Conditionally render other checkboxes based on read permission */}
                {["create", "update", "delete"].map((perm) => (
                  <td className="border p-2 text-center hidden" key={perm}>
                    {p.permissions.read ? (
                      <input
                        type="checkbox"
                        checked={p.permissions[perm]}
                        onChange={() => handleCheckboxChange(p.module, perm)}
                      />
                    ) : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create Role
        </button>
      </form>

      {/* Role List */}
      <div className="max-w-3xl">
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
                <td className="border p-2 whitespace-pre-wrap">
                  {role.permissions.map((perm) => perm.module).join(", ")}
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
