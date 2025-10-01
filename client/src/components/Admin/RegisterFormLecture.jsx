import React, { useState, useEffect } from "react";
import { registerUser, sendRegisterDetail, updateUser } from "../../service/adminService";

/**
 * RegisterFormLecture
 *
 * Props:
 * - onSubmit(resultLecturer)  // called with normalized lecturer returned from backend/local add
 * - lecturer (optional)       // if provided, component acts as "edit" form
 * - departments (array)       // list of departments for the select
 * - courses (array)           // list of available course codes
 *
 * Notes:
 * - When creating a lecturer we use registerUser({ name, email, password, role: "Instructor", ... })
 * - When updating, we call updateUser(id, payload)
 * - After successful creation we call sendRegisterDetail({ name, email, password })
 */
const RegisterFormLecture = ({ onSubmit, lecturer, departments = [], courses = [] }) => {
  const isEditMode = !!lecturer;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    coursesString: "", // comma separated string for UI
    password: generatePassword(),
    id: "",
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function generatePassword() {
    // simple 8-char password (not crypto secure) — same pattern as student flow
    return Math.random().toString(36).slice(-8);
  }

  // Prefill when editing
  useEffect(() => {
    if (isEditMode && lecturer) {
      setFormData({
        name: lecturer.name || "",
        email: lecturer.email || "",
        department: lecturer.department || "",
        coursesString: Array.isArray(lecturer.courses) ? lecturer.courses.join(", ") : lecturer.courses || "",
        password: lecturer.password || "********",
        id: lecturer.id || lecturer._id || "",
      });
    } else {
      setFormData((prev) => ({ ...prev, password: generatePassword() }));
    }
  }, [isEditMode, lecturer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const normalizeLecturer = (l) => ({
    ...l,
    id: l.id || l._id || (l._id && String(l._id)),
    courses:
      Array.isArray(l.courses) ? l.courses : typeof l.courses === "string" && l.courses.length
        ? l.courses.split(",").map((c) => c.trim()).filter(Boolean)
        : l.courses || [],
  });

  const validate = () => {
    if (!formData.name || !formData.email) {
      setError("Please fill out the required fields (name and email).");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setError(null);
    setIsSubmitting(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      department: formData.department,
      // back-end might expect courses array or string — we send array
      courses: formData.coursesString
        ? formData.coursesString.split(",").map((c) => c.trim()).filter(Boolean)
        : [],
    };

    try {
      if (isEditMode) {
        // Update lecturer (use updateUser as your existing update API)
        const res = await updateUser(formData.id, payload);
        const updated = normalizeLecturer(res.data);
        onSubmit(updated);
      } else {
        // Register lecturer as user with role "Instructor"
        const registerRes = await registerUser({
          ...payload,
          password: formData.password,
          role: "Instructor",
        });

        const created = normalizeLecturer(registerRes.data);

        // send registration details email
        try {
          await sendRegisterDetail({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          });
        } catch (mailErr) {
          console.warn("Failed to send registration email:", mailErr);
          // not fatal — created lecturer is returned anyway
        }

        onSubmit(created);
      }

      // reset form
      setFormData({
        name: "",
        email: "",
        department: "",
        coursesString: "",
        password: generatePassword(),
        id: "",
      });
    } catch (err) {
      console.error("Error saving lecturer:", err);
      setError("Failed to save lecturer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
        {isEditMode ? "Update Lecturer" : "Register New Lecturer"}
      </h3>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            placeholder="Full name"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            placeholder="Email address"
            required
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Courses (comma separated) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Courses (comma separated)</label>
          <input
            type="text"
            name="coursesString"
            value={formData.coursesString}
            onChange={handleChange}
            placeholder="e.g., CS101, CS201"
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
          />
          <p className="text-xs text-gray-500 mt-1">You can also type course codes separated by commas.</p>
        </div>

        {/* Password only when creating */}
        {!isEditMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="text"
              name="password"
              value={formData.password}
              readOnly
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
            />
            <p className="text-xs text-gray-500">Password will be emailed to the lecturer</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors ${
              isSubmitting ? "opacity-70 cursor-wait" : ""
            }`}
          >
            {isEditMode ? (isSubmitting ? "Updating..." : "Update Lecturer") : (isSubmitting ? "Creating..." : "Create Lecturer")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterFormLecture;
