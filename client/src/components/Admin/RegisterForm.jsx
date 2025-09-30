import React, { useState, useEffect } from "react";
import { registerUser, sendRegisterDetail, updateUser } from "../../service/adminService";

/**
 * Props:
 * - onSubmit(resultStudent)  // called with normalized student object returned from backend or local add
 * - student (optional)       // if provided, component acts as "edit" form
 *
 * Note: this component does not manage global list refresh — parent handles that.
 */

const RegisterForm = ({ onSubmit, student }) => {
  const isEditMode = !!student;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: generatePassword(),
    registeredDate: new Date().toISOString().split("T")[0],
    id: "",
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function generatePassword() {
    // stronger random password — not cryptographically secure but fine for this usecase
    return Math.random().toString(36).slice(-8);
  }

  // Prefill when editing
  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: student.name || "",
        email: student.email || "",
        // do not overwrite actual password from backend; display placeholder
        password: student.password || "********",
        registeredDate: student.registeredDate || student.createdAt?.split?.("T")?.[0] || new Date().toISOString().split("T")[0],
        id: student.id || student._id || "",
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const normalizeStudent = (s) => ({ ...s, id: s.id || s._id || (s._id && String(s._id)) });

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
      setIsSubmitting(true);
      setError(null);

      if (isEditMode) {
        // updateUser should call your backend PUT /students/:id
        const res = await updateUser(formData.id, {
          name: formData.name,
          email: formData.email,
          registeredDate: formData.registeredDate,
        });

        const updated = normalizeStudent(res.data);
        onSubmit(updated);
      } else {
        // registerUser should call your backend POST /students/register and return created student
        const registerRes = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "Student",
        });

        // if registerRes contains created student, normalize it
        const created = normalizeStudent(registerRes.data);

        // send email only after registration success
        await sendRegisterDetail({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        onSubmit(created);
      }

      // reset form
      setFormData({
        name: "",
        email: "",
        password: generatePassword(),
        registeredDate: new Date().toISOString().split("T")[0],
        id: "",
      });
    } catch (err) {
      console.error("Error saving student:", err);
      setError("Failed to save student. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
        {isEditMode ? "Update Student" : "Register New Student"}
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
            placeholder="Enter student name"
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
            placeholder="Enter student email"
            required
          />
        </div>

        {/* Password only when adding */}
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
            <p className="text-xs text-gray-500">Password will be emailed to the student</p>
          </div>
        )}

        {/* Registered Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Register Date</label>
          <input
            type="date"
            name="registeredDate"
            value={formData.registeredDate}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors ${
              isSubmitting ? "opacity-70 cursor-wait" : ""
            }`}
          >
            {isEditMode ? "Update Student" : isSubmitting ? "Adding..." : "Add Student"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
