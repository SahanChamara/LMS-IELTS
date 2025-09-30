import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiUsers, FiFilter, FiSearch } from "react-icons/fi";
import Adminsidebar from "../Adminpages/Adminsidebars";
import RegisterForm from "../../components/Admin/RegisterForm";
import { getAllStudentsAPI } from "../../redux/features/studentSlice";
import { useAppDispatch } from "../../redux/store-config/store";

const SuperAdminstudentcontrol = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("name");
  const [selectedUnit, setSelectedUnit] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const rowsPerPage = 10;

  const units = ["All", "CS101", "CS201", "Math201", "Phys101", "Chem201", "Bio101", "Eng101"];
  const dispatch = useAppDispatch();

  // helper: normalize a single student object to always have .id
  const normalizeStudent = (s) => {
    if (!s) return s;
    return {
      ...s,
      id: s.id || s._id || (s._id && String(s._id)) || s.id,
    };
  };

  // fetch and normalize
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const result = await dispatch(getAllStudentsAPI()).unwrap();
        const raw = result.data || [];
        const normalized = raw.map(normalizeStudent);
        setStudents(normalized);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load students:", err);
        setError("Failed to load student data. Please try again.");
        setLoading(false);
      }
    };
    fetchStudents();
  }, [dispatch]);

  // Add (local update) — keep consistent id strategy if backend returns created student in future
  const handleAddStudent = (newStudent) => {
    const norm = normalizeStudent(newStudent);
    setStudents((prev) => [...prev, norm]);
    setShowRegisterForm(false);
    setEditingStudent(null);
    setCurrentPage(1);
    setSearchTerm("");
    setFilterBy("name");
    setSelectedUnit("All");
  };

  // Update single student in-state
  const handleUpdateStudent = (updatedStudent) => {
    const norm = normalizeStudent(updatedStudent);

    setStudents((prev) =>
      prev.map((s) => (s.id === norm.id ? norm : s))
    );

    setShowRegisterForm(false);
    setEditingStudent(null);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const filteredStudents = students
    .filter((student) => {
      const value = (student[filterBy] || "").toString().toLowerCase();
      return value.includes(searchTerm.toLowerCase());
    })
    .filter((student) => (selectedUnit === "All" ? true : student.unit === selectedUnit));

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const paginatedStudents = filteredStudents.slice(
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
      <Adminsidebar onLogout={handleLogout} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-screen">
        <div className="max-w-8xl mx-auto">
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

          {/* Actions row */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button
              onClick={() => {
                // toggling form should reset editing state when starting a new registration
                const willShow = !showRegisterForm;
                setShowRegisterForm(willShow);
                if (willShow === false) {
                  setEditingStudent(null);
                } else {
                  setEditingStudent(null);
                }
              }}
              className="inline-block bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              {showRegisterForm ? "Cancel" : "Register Student"}
            </button>
            {/* search + unit filter */}
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
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 w-full sm:w-auto"
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
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
                    <label className="block text-sm font-medium text-gray-700">Filter by</label>
                    <select
                      value={filterBy}
                      onChange={(e) => handleFilterChange(e.target.value)}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="name">Name</option>
                      <option value="email">Email</option>
                      <option value="unit">Unit</option>
                      <option value="registeredDate">Registered Date</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Register / Edit Form */}
          {showRegisterForm && (
            <div className="mb-6">
              <RegisterForm
                onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
                student={editingStudent}
                // optional: you could also pass a callback to refresh list from backend after submission
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
              <FiAlertCircle className="text-lg" />
              {error}
            </div>
          )}

          {/* List */}
          {!showRegisterForm && loading ? (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            </div>
          ) : (
            !showRegisterForm && (
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiUsers className="text-2xl text-purple-600" />
                  Registered Students ({selectedUnit === "All" ? students.length : filteredStudents.length})
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-700">
                    <thead className="text-xs uppercase bg-gray-100">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Unit</th>
                        <th className="px-4 py-3">Registered Date</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedStudents.length > 0 ? (
                        paginatedStudents.map((student) => (
                          <tr key={student.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">{student.name}</td>
                            <td className="px-4 py-3">{student.email}</td>
                            <td className="px-4 py-3">{student.unit || "—"}</td>
                            <td className="px-4 py-3">{student.registeredDate || student.createdAt || "—"}</td>
                            <td className="px-4 py-3 flex gap-3">
                              <button
                                onClick={() => {
                                  setEditingStudent(student);
                                  setShowRegisterForm(true);
                                }}
                                className="text-teal-600 hover:text-teal-800 text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => navigate(`/admin/students/${student.id}`)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                            No students found matching your criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* pagination */}
                {totalPages > 1 && (
                  <div className="mt-4 flex justify-center items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-teal-600 text-white hover:bg-teal-700"
                      }`}
                    >
                      Back
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-1 rounded-lg ${
                          currentPage === index + 1 ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-teal-600 text-white hover:bg-teal-700"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminstudentcontrol;
