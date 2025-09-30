import React, { useState } from "react";
import axios from "axios";

const RegisterForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: generatePassword(),
    registeredDate: new Date().toISOString().split("T")[0],
  });

  const [error, setError] = useState(null);

  function generatePassword() {
    return Math.random().toString(36).slice(-8); // simple 8-char random password
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError("Please fill out all required fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const registerRes = await axios.post("/api/students/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "Student",
      });

      await axios.post("/api/admin/sendRegisterDetail", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      onSubmit(registerRes.data); // update UI state
      setError(null);
      setFormData({
        name: "",
        email: "",
        password: generatePassword(),
        registeredDate: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      console.error("Error registering student:", err);
      setError("Failed to register student. Please try again.");
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
        Register New Student
      </h3>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            placeholder="Enter student name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            placeholder="Enter student email"
            required
          />
        </div>
        {/* Password is auto-generated and hidden */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="text"
            name="password"
            value={formData.password}
            readOnly
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
          />
          <p className="text-xs text-gray-500">Password will be emailed to the student</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Register Date</label>
          <input
            type="date"
            name="registeredDate"
            value={formData.registeredDate}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            readOnly
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Add Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
