// src/pages/Enterprises.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Enterprises = () => {
  const [enterprises, setEnterprises] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contactInfo: "",
  });
  const token = localStorage.getItem("token");

  const fetchEnterprises = async () => {
    const res = await axios.get(
      "https://test-26-may.onrender.com/api/enterprises",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setEnterprises(res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await axios.post(
      "https://test-26-may.onrender.com/api/enterprises",
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setFormData({ name: "", location: "", contactInfo: "" });
    fetchEnterprises();
  };

  useEffect(() => {
    fetchEnterprises();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Enterprises</h2>

      <form
        onSubmit={handleCreate}
        className="bg-white p-4 rounded shadow mb-6 max-w-lg"
      >
        <h3 className="text-lg font-semibold mb-3">Create Enterprise</h3>
        {["name", "location", "contactInfo"].map((field) => (
          <div className="mb-2" key={field}>
            <label className="block font-medium capitalize">{field}</label>
            <input
              value={formData[field]}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
              required={field === "name"}
              className="w-full border p-2 rounded"
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-3">Enterprise List</h3>
      <div className="grid gap-4">
        {enterprises.map((ent) => (
          <div key={ent._id} className="bg-white p-4 rounded shadow">
            <h4 className="text-lg font-bold">{ent.name}</h4>
            <p>
              <strong>Location:</strong> {ent.location}
            </p>
            <p>
              <strong>Contact:</strong> {ent.contactInfo}
            </p>
            <p>
              <strong>Employees:</strong>
            </p>
            <ul className="list-disc ml-5">
              {ent.employees?.map((emp) => (
                <li key={emp._id}>
                  {emp.name} - {emp.role}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Enterprises;
