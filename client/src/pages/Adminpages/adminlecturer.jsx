import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiUsers, FiFilter, FiSearch } from "react-icons/fi";
import Adminsidebar from "../Adminpages/Adminsidebars";
import RegisterForm from "../../components/Admin/RegisterForm";

const SuperAdminlecturercontrol = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lecturers, setLecturers] = useState([]);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("name");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const rowsPerPage = 10;

  const departments = ["All", "Computer Science", "Mathematics", "Physics", "Chemistry", "Biology", "Engineering"];
  const courses = ["CS101", "CS201", "MATH201", "PHYS101", "CHEM201", "BIO101", "ENG101"];

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setLoading(true);
        const mockData = [
          { id: 1, name: "Dr. John Smith", email: "john.smith@university.com", department: "Computer Science", courses: ["CS101", "CS201"] },
          { id: 2, name: "Prof. Jane Doe", email: "jane.doe@university.com", department: "Mathematics", courses: ["MATH201"] },
          { id: 3, name: "Dr. Alex Brown", email: "alex.brown@university.com", department: "Computer Science", courses: ["CS201"] },
          { id: 4, name: "Prof. Sarah Wilson", email: "sarah.wilson@university.com", department: "Physics", courses: ["PHYS101"] },
          { id: 5, name: "Dr. Michael Johnson", email: "michael.johnson@university.com", department: "Chemistry", courses: ["CHEM201"] },
          { id: 6, name: "Prof. Emily Davis", email: "emily.davis@university.com", department: "Biology", courses: ["BIO101"] },
          { id: 7, name: "Dr. Robert Taylor", email: "robert.taylor@university.com", department: "Engineering", courses: ["ENG101"] },
          { id: 8, name: "Prof. Olivia Martinez", email: "olivia.martinez@university.com", department: "Computer Science", courses: ["CS101"] },
          { id: 9, name: "Dr. William Anderson", email: "william.anderson@university.com", department: "Mathematics", courses: ["MATH201"] },
          { id: 10, name: "Prof. Sophia Thomas", email: "sophia.thomas@university.com", department: "Physics", courses: ["PHYS101"] },
          { id: 11, name: "Dr. James White", email: "james.white@university.com", department: "Computer Science", courses: ["CS201"] },
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

  const handleAddLecturer = (newLecturer) => {
    setLecturers((prevLecturers) => [
      ...prevLecturers,
      { ...newLecturer, id: prevLecturers.length + 1, courses: newLecturer.courses.split(",").map(c => c.trim()) }
    ]);
    setShowRegisterForm(false);
    setCurrentPage(1);
    setSearchTerm("");
    setFilterBy("name");
    setSelectedDepartment("All");
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const filteredLecturers = lecturers
    .filter((lecturer) =>
      lecturer[filterBy].toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((lecturer) => 
      selectedDepartment === "All" ? true : lecturer.department === selectedDepartment
    );

  const totalPages = Math.ceil(filteredLecturers.length / rowsPerPage);
  const paginatedLecturers = filteredLecturers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (value) => {
    setFilterBy(value);
    setShowFilterDropdown(false);
  };

  return (
    <div className="font-sans min-h-screen bg-neutral-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Adminsidebar onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-screen">
        <div className="max-w-8xl mx-auto">
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

          {/* Register Lecturer and Filter Buttons */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button
              onClick={() => setShowRegisterForm(!showRegisterForm)}
              className="inline-block bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              {showRegisterForm ? "Cancel" : "Register Lecturer"}
            </button>

            {!showRegisterForm && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Search by ${filterBy}`}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 w-full sm:w-64"
                  />
                </div>
                
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 w-full sm:w-auto"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>

                <div className="relative inline-flex w-full sm:w-auto">
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors w-full sm:w-auto justify-center"
                  >
                    <FiFilter className="text-lg" />
                    Filter By
                  </button>
                  {showFilterDropdown && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg p-4 z-10 border border-gray-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Filter by</label>
                        <select
                          value={filterBy}
                          onChange={(e) => handleFilterChange(e.target.value)}
                          className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        >
                          <option value="name">Name</option>
                          <option value="email">Email</option>
                          <option value="department">Department</option>
                          <option value="courses">Courses</option>
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
              <RegisterForm 
                onSubmit={handleAddLecturer} 
                departments={departments.filter(d => d !== "All")}
                courses={courses}
                isLecturer={true}
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
              <FiAlertCircle className="text-lg" />
              {error}
            </div>
          )}

          {/* Lecturer List */}
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
                Registered Lecturers ({selectedDepartment === "All" ? lecturers.length : filteredLecturers.length})
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
                    {paginatedLecturers.length > 0 ? (
                      paginatedLecturers.map((lecturer) => (
                        <tr key={lecturer.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{lecturer.name}</td>
                          <td className="px-4 py-3">{lecturer.email}</td>
                          <td className="px-4 py-3">{lecturer.department}</td>
                          <td className="px-4 py-3">{lecturer.courses.join(", ")}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => navigate(`/admin/lecturers/${lecturer.id}`)}
                              className="text-teal-600 hover:text-teal-800 text-sm"
                            >
                              View/Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                          No lecturers found matching your criteria
                        </td>
                      </tr>
                    )}
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
        </div>
      </main>
    </div>
  );
};

export default SuperAdminlecturercontrol;