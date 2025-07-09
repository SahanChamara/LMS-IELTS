import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiUsers, FiFilter, FiSearch } from "react-icons/fi";
import Adminsidebar from "../Adminpages/Adminsidebars";
import RegisterForm from "../../components/Admin/RegisterForm";

const SuperAdminstudentcontrol = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("name");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const rowsPerPage = 10;

  // Simulated API fetch for student data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const mockData = [
          { id: 1, name: "Alice Johnson", email: "alice.johnson@university.com", course: "CS101", registeredDate: "2025-06-01" },
          { id: 2, name: "Bob Williams", email: "bob.williams@university.com", course: "Math201", registeredDate: "2025-06-05" },
          { id: 3, name: "Clara Davis", email: "clara.davis@university.com", course: "CS201", registeredDate: "2025-06-10" },
          { id: 4, name: "David Lee", email: "david.lee@university.com", course: "Phys101", registeredDate: "2025-06-12" },
          { id: 5, name: "Emma Brown", email: "emma.brown@university.com", course: "Chem201", registeredDate: "2025-06-15" },
          { id: 6, name: "Frank Miller", email: "frank.miller@university.com", course: "CS102", registeredDate: "2025-06-18" },
          { id: 7, name: "Grace Wilson", email: "grace.wilson@university.com", course: "Math202", registeredDate: "2025-06-20" },
          { id: 8, name: "Henry Taylor", email: "henry.taylor@university.com", course: "CS301", registeredDate: "2025-06-22" },
          { id: 9, name: "Isabella Moore", email: "isabella.moore@university.com", course: "Bio101", registeredDate: "2025-06-25" },
          { id: 10, name: "James Anderson", email: "james.anderson@university.com", course: "CS401", registeredDate: "2025-06-28" },
          { id: 11, name: "Kelly White", email: "kelly.white@university.com", course: "Eng101", registeredDate: "2025-06-30" },
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

  // Handle adding a new student
  const handleAddStudent = (newStudent) => {
    setStudents((prevStudents) => [
      ...prevStudents,
      { ...newStudent, id: prevStudents.length + 1 },
    ]);
    setShowRegisterForm(false); // Close the form and show table
    setCurrentPage(1); // Reset to first page
    setSearchTerm(""); // Clear search term
    setFilterBy("name"); // Reset filter
  };

  const handleLogout = () => {
    navigate("/login");
  };

  // Filter and search logic
  const filteredStudents = students.filter((student) =>
    student[filterBy].toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="font-sans min-h-screen bg-neutral-100 flex flex-col lg:flex-row overflow-hidden">
      {/* Sidebar */}
      <Adminsidebar onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
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

     {/* Register Student and Filter Buttons */}
<div className="mb-12 flex justify-between items-center gap-4">
  <button
    onClick={() => setShowRegisterForm(!showRegisterForm)}
    className="inline-block bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
  >
    {showRegisterForm ? "Cancel" : "Register Student"}
  </button>

  {/* Filter and Search */}
  {!showRegisterForm && (
    <div className="inline-flex items-center gap-2">
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search by ${filterBy}`}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
        />
      </div>
      <div className="relative inline-flex">
        <button
          onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
        >
          <FiFilter className="text-lg" />
          Filter
        </button>
        {showFilterDropdown && (
          <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg p-4 z-10">
            <div>
              <label className="block text-sm font-medium text-gray-700">Filter by</label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="course">Course</option>
                <option value="registeredDate">Registered Date</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  )}
</div>

        {/* Register Form */}
        {showRegisterForm && (
          <div className="mb-6">
            <RegisterForm onSubmit={handleAddStudent} />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
            <FiAlertCircle className="text-lg" />
            {error}
          </div>
        )}

        {/* Student List (Hidden when form is shown) */}
        {!showRegisterForm && loading ? (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          </div>
        ) : !showRegisterForm && (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiUsers className="text-2xl text-teal-600" />
              Registered Students ({filteredStudents.length})
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
                  {paginatedStudents.map((student) => (
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
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-teal-600 text-white hover:bg-teal-700"
                  } transition-colors`}
                >
                  Back
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === index + 1
                        ? "bg-teal-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-teal-600 text-white hover:bg-teal-700"
                  } transition-colors`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SuperAdminstudentcontrol;