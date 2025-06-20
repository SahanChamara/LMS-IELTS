import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiUsers } from "react-icons/fi";
import Adminsidebar from "../Adminpages/Adminsidebars";

const SuperAdminlecturercontrol = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lecturers, setLecturers] = useState([]);

  // Simulated API fetch for lecturer data
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setLoading(true);
        const mockData = [
          { id: 1, name: "Dr. John Smith", email: "john.smith@university.com", department: "Computer Science", courses: ["CS101", "CS201"] },
          { id: 2, name: "Prof. Jane Doe", email: "jane.doe@university.com", department: "Mathematics", courses: ["MATH201"] },
          { id: 3, name: "Dr. Alex Brown", email: "alex.brown@university.com", department: "Computer Science", courses: ["CS201"] },
        ];
        setTimeout(() => {
          setLecturers(mockData);
          setLoading(false);
        }, 1000);
      } catch {
        setError("Failed to load lecturer data. Please try again.");
        setLoading(false);
      }
    };
    fetchLecturers();
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="font-sans min-h-screen bg-neutral-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Adminsidebar onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64 overflow-y-auto">
        {/* Header */}
        <div className="mb-6 bg-gradient-to-r from-teal-600 to-teal-800 text-white p-4 sm:p-6 rounded-lg shadow-lg">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Lecturer Management</h2>
          <p className="text-xs sm:text-sm mt-2">
            View and manage registered lecturers. Today is{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
            <FiAlertCircle className="text-lg" />
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          </div>
        ) : (
          /* Lecturer List */
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiUsers className="text-2xl text-teal-600" />
              Registered Lecturers ({lecturers.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs uppercase bg-gray-100">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Courses</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lecturers.map((lecturer) => (
                    <tr key={lecturer.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{lecturer.name}</td>
                      <td className="px-4 py-3">{lecturer.email}</td>
                      <td className="px-4 py-3">{lecturer.department}</td>
                      <td className="px-4 py-3">{lecturer.courses.join(", ")}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/admin/lectures/${lecturer.id}`)}
                          className="text-teal-600 hover:text-teal-800 text-sm"
                        >
                          View/Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SuperAdminlecturercontrol;