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
  const [editingStudent, setEditingStudent] = useState(null); // <-- NEW
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("name");
  const [selectedUnit, setSelectedUnit] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const rowsPerPage = 10;

  const units = ["All", "CS101", "CS201", "Math201", "Phys101", "Chem201", "Bio101", "Eng101"];
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const result = await dispatch(getAllStudentsAPI()).unwrap();
        setStudents(result.data || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load student data. Please try again.");
        setLoading(false);
      }
    };
    fetchStudents();
  }, [dispatch]);

  const handleAddStudent = (newStudent) => {
    setStudents((prevStudents) => [
      ...prevStudents,
      { ...newStudent, id: prevStudents.length + 1 },
    ]);
    setShowRegisterForm(false);
    setEditingStudent(null);
    setCurrentPage(1);
    setSearchTerm("");
    setFilterBy("name");
    setSelectedUnit("All");
  };

  const handleUpdateStudent = (updatedStudent) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    setShowRegisterForm(false);
    setEditingStudent(null);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const filteredStudents = students
    .filter((student) =>
      student[filterBy]?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((student) =>
      selectedUnit === "All" ? true : student.unit === selectedUnit
    );

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

          {/* Register Student and Filter Buttons */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button
              onClick={() => {
                setShowRegisterForm(!showRegisterForm);
                setEditingStudent(null); // reset editing
              }}
              className="inline-block bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              {showRegisterForm
                ? "Cancel"
                : editingStudent
                ? "Cancel Edit"
                : "Register Student"}
            </button>
          </div>

          {/* Register Form */}
          {showRegisterForm && (
            <div className="mb-6">
              <RegisterForm
                onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
                student={editingStudent} // <-- pass student for edit
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

          {/* Student List */}
          {!showRegisterForm && loading ? (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            </div>
          ) : !showRegisterForm && (
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
                          <td className="px-4 py-3">{student.unit}</td>
                          <td className="px-4 py-3">{student.createdAt}</td>
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
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminstudentcontrol;
