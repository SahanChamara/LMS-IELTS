import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LecSidebar from "../../pages/lecturepages/lecsidebar";

const StudandTabel = () => {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data with 60 unique students (10 students per unit, 6 units: CS101 to CS106)
  const mockData = Array.from({ length: 60 }, (_, index) => {
    const unitIndex = Math.floor(index / 10) + 1;
    const unitId = `CS${100 + unitIndex}`;
    const studentId = index + 1;
    return {
      id: studentId,
      stdId: `STD${String(studentId).padStart(3, "0")}`, // e.g., STD001
      name: `Student ${studentId}`,
      email: `student${studentId}@university.com`,
      unitId: unitId,
      lastLogin: `2025-07-${String((index % 3) + 1).padStart(2, "0")}`,
      status: index % 2 === 0 ? "active" : "inactive",
      enrolled: index % 3 !== 0,
      grades: ["A", "A-", "B+", "B", "B-"][index % 5],
      access: index % 2 === 0 ? "allowed" : "denied",
    };
  });

  // Simulated data fetch
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          let filteredStudents = mockData.filter(
            (student) => student.unitId === unitId
          );
          // Apply search filter
          if (searchTerm) {
            filteredStudents = filteredStudents.filter(
              (student) =>
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.stdId.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          // Apply status filter
          if (filterStatus !== "all") {
            filteredStudents = filteredStudents.filter(
              (student) => student.status === filterStatus
            );
          }
          // Limit to 10 rows
          setStudents(filteredStudents.slice(0, 10));
          setLoading(false);
        }, 1000);
      } catch {
        setError("Failed to load student records. Please try again.");
        setLoading(false);
      }
    };
    fetchStudents();
  }, [unitId, searchTerm, filterStatus]);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleToggleAccess = (studentId) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId
          ? {
              ...student,
              access: student.access === "allowed" ? "denied" : "allowed",
            }
          : student
      )
    );
  };

  const handleAllowAll = () => {
    setStudents((prevStudents) =>
      prevStudents.map((student) => ({ ...student, access: "allowed" }))
    );
  };

  const handleDenyAll = () => {
    setStudents((prevStudents) =>
      prevStudents.map((student) => ({ ...student, access: "denied" }))
    );
  };

  const handleBack = () => {
    navigate(-1); // Navigates back to the previous page in history
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50" style={{ overflow: "hidden" }}>
        <LecSidebar onLogout={handleLogout} />
        <div className="flex-1 p-6 md:p-8 overflow-y-auto" style={{ height: "calc(100vh - 20px)" }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Student Records for {unitId}
            </h2>
            <button
              onClick={handleBack}
              className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              aria-label="Go back to previous page"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-center mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
            <div className="overflow-hidden">
              <table className="w-full text-center" role="grid">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-4">StdID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Last Login</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Enrolled</th>
                    <th className="p-4">Grades</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(2)].map((_, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50" style={{ overflow: "hidden" }}>
        <LecSidebar onLogout={handleLogout} />
        <div className="flex-1 p-6 md:p-8 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50" style={{ overflow: "hidden" }}>
      <LecSidebar onLogout={handleLogout} />
      <div className="flex-1 p-6 md:p-8 overflow-y-auto" style={{ height: "calc(100vh - 20px)" }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Student Records for {unitId}
          </h2>
          <button
            onClick={handleBack}
            className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            aria-label="Go back to previous page"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6">
            <div className="relative flex-1 mb-4 sm:mb-0">
              <input
                type="text"
                placeholder="Search by StdID, name, or email..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search students by StdID, name, or email"
              />
              <svg
                className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="relative mb-4 sm:mb-0">
              <select
                className="w-full sm:w-48 pl-4 pr-8 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                aria-label="Filter students by status"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <svg
                className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleAllowAll}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                aria-label="Allow access for all students"
              >
                Allow All
              </button>
              <button
                onClick={handleDenyAll}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                aria-label="Deny access for all students"
              >
                Deny All
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-center" role="grid">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-4">StdID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Last Login</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Enrolled</th>
                  <th className="p-4">Grades</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-gray-500">
                      No students found for this unit
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr
                      key={student.id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">{student.stdId}</td>
                      <td className="p-4">{student.name || "N/A"}</td>
                      <td className="p-4">{student.email || "N/A"}</td>
                      <td className="p-4">{student.lastLogin || "N/A"}</td>
                      <td className="p-4 capitalize">{student.status || "N/A"}</td>
                      <td className="p-4">{student.enrolled ? "Yes" : "No"}</td>
                      <td className="p-4">{student.grades || "N/A"}</td>
                      <td className="p-4 flex justify-center space-x-2">
                        <button
                          onClick={() => handleToggleAccess(student.id)}
                          className={`px-3 py-1 text-sm rounded-lg text-white font-medium min-w-[100px] text-center transition-colors ${
                            student.access === "allowed"
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                          aria-label={`Toggle access for ${student.name || "student"}`}
                        >
                          {student.access === "allowed" ? "Allow" : "Deny"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudandTabel;