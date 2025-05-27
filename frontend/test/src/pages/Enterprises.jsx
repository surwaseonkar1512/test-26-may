import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUsers,
} from "react-icons/fa";
import { toast } from "react-toastify";

const Enterprises = () => {
  const [enterprises, setEnterprises] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contactInfo: "",
  });
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const token = localStorage.getItem("token");

  const fetchEnterprises = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://test-26-may.onrender.com/api/enterprises",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEnterprises(res.data);
    } catch (err) {
      toast.error("Failed to fetch enterprises.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await axios.post(
        "https://test-26-may.onrender.com/api/enterprises",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Enterprise created successfully!");
      setFormData({ name: "", location: "", contactInfo: "" });
      fetchEnterprises();
    } catch (err) {
      toast.error("Failed to create enterprise.");
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchEnterprises();
  }, []);

  return (
    <div className="p-6 text-gray-800">
      <h2 className="text-3xl font-bold mb-6 text-black flex items-center gap-2">
        <FaBuilding className="text-[#912891]" /> Enterprise Management
      </h2>

      {/* Create Form */}
      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded-xl shadow-md mb-10 max-w-xl"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Create New Enterprise
        </h3>
        <div className="grid gap-4">
          {["name", "location", "contactInfo"].map((field) => (
            <div key={field}>
              <label className="block font-medium capitalize text-gray-600 mb-1">
                {field}
              </label>
              <input
                type="text"
                value={formData[field]}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
                required={field === "name"}
                placeholder={`Enter ${field}`}
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#912891]"
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          disabled={creating}
          className="mt-4 bg-[#912891] text-white px-5 py-2 rounded-md hover:bg-[#7e247b] transition disabled:opacity-50"
        >
          {creating ? "Creating..." : "Create Enterprise"}
        </button>
      </form>

      {/* Enterprise List */}
      <h3 className="text-xl font-semibold mb-4 text-gray-700">
        Existing Enterprises
      </h3>

      {loading ? (
        <p className="text-gray-600">Loading enterprises...</p>
      ) : enterprises.length === 0 ? (
        <p className="text-gray-600">No enterprises found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enterprises.map((ent) => (
            <div
              key={ent._id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              <h4 className="text-xl font-bold text-black mb-2 flex items-center gap-2">
                <FaBuilding /> {ent.name}
              </h4>
              <p className="text-gray-600 flex items-center gap-2">
                <FaMapMarkerAlt /> <span>{ent.location}</span>
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <FaPhoneAlt /> <span>{ent.contactInfo}</span>
              </p>
              <p className="mt-3 font-medium text-gray-700 flex items-center gap-2">
                <FaUsers /> Employees:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-1 pl-2">
                {ent.employees?.length > 0 ? (
                  ent.employees.map((emp) => (
                    <li key={emp._id}>
                      {emp.name} – <span className="italic">{emp.role}</span>
                    </li>
                  ))
                ) : (
                  <li>No employees listed</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Enterprises;
