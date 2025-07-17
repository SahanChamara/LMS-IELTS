import React, { useState } from "react";

const RegisterForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    registeredDate: new Date().toISOString().split("T")[0], // Auto-set to today's date
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.email || !formData.course) {
      setError("Please fill out all required fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Submit the form data
    onSubmit(formData);
    setError(null);
    // Reset form
    setFormData({
      name: "",
      email: "",
      course: "",
      registeredDate: new Date().toISOString().split("T")[0],
    });
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
        <div>
          <label className="block text-sm font-medium text-gray-700">Course</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            placeholder="Enter course code (e.g., CS101)"
            required
          />
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