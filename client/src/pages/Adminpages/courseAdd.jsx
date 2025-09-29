import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiBook, FiFilter, FiSearch } from "react-icons/fi";
import Adminsidebar from "../Adminpages/Adminsidebars";
import { useAppDispatch } from "../../redux/store-config/store";
import { getAllLectursAPI } from "../../redux/features/adminSlice";
import { get } from "lodash";
import { getAllCourses } from "../../service/courseService";
// import { getAllCoursesAPI, addCourseAPI, getAllLectursAPI } from "../../redux/features/adminSlice";

const SuperAdminCourseControl = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Pagination + Filters
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  // New Course State
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    instructor: "",
    status: "active",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch courses
        const courseRes = await getAllCourses();
        setCourses(courseRes.data || []);

        // Fetch instructors
        const instructorRes = await dispatch(getAllLectursAPI()).unwrap();
        setInstructors(instructorRes.data || []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching:", err);
        setError("Failed to load course or instructor data.");
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleInputChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
    //   const result = await dispatch(addCourseAPI(newCourse)).unwrap();
    //   setCourses((prev) => [...prev, result.data]);
      setShowForm(false);
      setNewCourse({ title: "", description: "", instructor: "", status: "active" });
    } catch (err) {
      console.error("Error adding course:", err);
      setError("Failed to add new course.");
    }
  };

  // Search Filter
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCourses.length / rowsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Course Management</h2>
            <p className="text-xs sm:text-sm mt-2">
              View and manage registered courses. Today is{" "}
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}.
            </p>
          </div>

          {/* Actions */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-block  bg-teal-600 text-white px-4 py-2 rounded-lg  hover:bg-teal-700 transition-colors"
            >
              {showForm ? "Cancel" : "Add Course"}
            </button>

            {!showForm && (
              <div className="relative w-full sm:w-auto">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search courses..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
                />
              </div>
            )}
          </div>

          {/* Add Course Form */}
          {showForm && (
            <form onSubmit={handleAddCourse} className="mb-6 bg-white p-6 rounded-lg shadow-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newCourse.title}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={newCourse.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Instructor</label>
                <select
                  name="instructor"
                  value={newCourse.instructor}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Instructor</option>
                  {instructors.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={newCourse.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <button
                type="submit"
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Save Course
              </button>
            </form>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
              <FiAlertCircle className="text-lg" />
              {error}
            </div>
          )}

          {/* Course List */}
          {!showForm && loading ? (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            </div>
          ) : !showForm && (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiBook className="text-2xl text-indigo-600" />
                Registered Courses ({courses.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-xs uppercase bg-gray-100">
                    <tr>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Instructor</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Created</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCourses.length > 0 ? (
                      paginatedCourses.map((course) => (
                        <tr key={course.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{course.title}</td>
                          <td className="px-4 py-3">{course.instructor?.name || "N/A"}</td>
                          <td className="px-4 py-3 capitalize">{course.status}</td>
                          <td className="px-4 py-3">{new Date(course.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => navigate(`/admin/courses/${course.id}`)}
                              className="text-indigo-600 hover:text-indigo-800 text-sm"
                            >
                              View/Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                          No courses found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
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
                          ? "bg-indigo-600 text-white"
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
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
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

export default SuperAdminCourseControl;
