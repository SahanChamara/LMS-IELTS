import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiUsers } from "react-icons/fi";
import Adminsidebar from "../Adminpages/Adminsidebars";

const SuperAdminstudentcontrol = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);

  // Simulated API fetch for student data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const mockData = [
          { id: 1, name: "Alice Johnson", email: "alice.johnson@university.com", course: "CS101", registeredDate: "2025-06-01" },
          { id: 2, name: "Bob Williams", email: "bob.williams@university.com", course: "Math201", registeredDate: "2025-06-05" },
          { id: 3, name: "Clara Davis", email: "clara.davis@university.com", course: "CS201", registeredDate: "2025-06-10" },
        ];
        setTimeout(() => {
          setStudents(mockData);
          setLoading(false);
        }, 1000);
      } catch {
        setError("Failed to load student data. Please try again.");
        setLoading(false);
      }
    };
    fetchStudents();
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
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Student Management</h2>
          <p className="text-xs sm:text-sm mt-2">
            View and manage registered students. Today is{" "}
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
          /* Student List */
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiUsers className="text-2xl text-teal-600" />
              Registered Students ({students.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs uppercase bg-gray-100">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Registered Date</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{student.name}</td>
                      <td className="px-4 py-3">{student.email}</td>
                      <td className="px-4 py-3">{student.course}</td>
                      <td className="px-4 py-3">{student.registeredDate}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/admin/students/${student.id}`)}
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

export default SuperAdminstudentcontrol;