import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiLayers, FiSearch } from "react-icons/fi";
import Adminsidebar from "../Adminpages/Adminsidebars";
import { useAppDispatch } from "../../redux/store-config/store";
import { getAllLectursAPI } from "../../redux/features/adminSlice";
import { getAllCourses } from "../../service/courseService";
import { getAllunitsForAdmin } from "../../service/unitsService";
import { addUnit, updateUnit } from "../../service/adminService";


const SuperAdminUnitControl = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [units, setUnits] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Pagination + Search
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  // Form State (for add + edit)
  const [newUnit, setNewUnit] = useState({
    title: "",
    course: "",
    image: "",
    credits: "",
    timePeriod: "",
    description: "",
    instructor: "",
    order: 1,
    unitCode: "",
  });
  const [editingUnitId, setEditingUnitId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch Units
        const unitRes = await getAllunitsForAdmin();
        setUnits(unitRes.data || []);

        // Fetch Instructors
        const instructorRes = await dispatch(getAllLectursAPI()).unwrap();
        setInstructors(instructorRes.data || []);

        // Fetch Courses
        const courseRes = await getAllCourses();
        setCourses(courseRes.data || []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching:", err);
        setError("Failed to load unit data.");
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleInputChange = (e) => {
    newUnit.order = 1;
    setNewUnit({ ...newUnit, [e.target.name]: e.target.value });
  };

  const handleSaveUnit = async (e) => {
    e.preventDefault();
    try {
      if (editingUnitId) {
        const res = await updateUnit(editingUnitId, newUnit);
        const updated = res.data;

        setUnits((prev) =>
          prev.map((u) => (u._id === editingUnitId ? updated : u))
        );
      } else {
        const res = await addUnit(newUnit);
        const created = res.data;
        setUnits((prev) => [...prev, created]);
      }

      setShowForm(false);
      setEditingUnitId(null);
      setNewUnit({
        title: "",
        course: "",
        image: "",
        credits: "",
        timePeriod: "",
        description: "",
        instructor: "",
        unitCode: "",
      });
    } catch (err) {
      console.error("Error saving unit:", err);
      setError("Failed to save unit.");
    }
  };

  const handleEditUnit = (unit) => {
    setNewUnit({
      title: unit.title || "",
      course: unit.course?._id || unit.course || "",
      image: unit.image || "",
      credits: unit.credits || "",
      timePeriod: unit.timePeriod || "",
      description: unit.description || "",
      unitCode: unit.unitCode || "",
      instructor: unit.instructor?._id || unit.instructor || "",
    });
    setEditingUnitId(unit._id);
    setShowForm(true);
  };

  // Search Filter
  const filteredUnits = units.filter((unit) =>
    unit.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUnits.length / rowsPerPage);
  const paginatedUnits = filteredUnits.slice(
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
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Unit Management</h2>
            <p className="text-xs sm:text-sm mt-2">
              Manage course units. Today is{" "}
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
              onClick={() => {
                setShowForm(!showForm);
                if (!showForm) {
                  setEditingUnitId(null);
                  setNewUnit({
                    title: "",
                    course: "",
                    image: "",
                    credits: "",
                    timePeriod: "",
                    description: "",
                    instructor: "",
                  });
                }
              }}
              className="inline-block bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              {showForm ? "Cancel" : "Add Unit"}
            </button>

            {!showForm && (
              <div className="relative w-full sm:w-auto">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search units..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 w-full sm:w-64"
                />
              </div>
            )}
          </div>

          {/* Add/Edit Unit Form */}
          {showForm && (
            <form onSubmit={handleSaveUnit} className="mb-6 bg-white p-6 rounded-lg shadow-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newUnit.title}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Course</label>
                <select
                  name="course"
                  value={newUnit.course}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course._id || course.id} value={course._id || course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Instructor</label>
                <select
                  name="instructor"
                  value={newUnit.instructor}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select Instructor</option>
                  {instructors.map((inst) => (
                    <option key={inst._id || inst.id} value={inst._id || inst.id}>
                      {inst.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={newUnit.image}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Credits</label>
                  <input
                    type="number"
                    name="credits"
                    value={newUnit.credits}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Time Period (weeks)</label>
                  <input
                    type="number"
                    name="timePeriod"
                    value={newUnit.timePeriod}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit Code</label>
                  <input
                    type="text"
                    name="unitCode"
                    value={newUnit.unitCode}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={newUnit.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                {editingUnitId ? "Update Unit" : "Save Unit"}
              </button>
            </form>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
              <FiAlertCircle className="text-lg" />
              {error}
            </div>
          )}

          {/* Unit List */}
          {!showForm && loading ? (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            </div>
          ) : (
            !showForm && (
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiLayers className="text-2xl text-purple-600" />
                  Registered Units ({units.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-700">
                    <thead className="text-xs uppercase bg-gray-100">
                      <tr>
                        <th className="px-4 py-3">Title</th>
                        <th className="px-4 py-3">Course</th>
                        <th className="px-4 py-3">Instructor</th>
                        <th className="px-4 py-3">Credits</th>
                        <th className="px-4 py-3">Time Period</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUnits.length > 0 ? (
                        paginatedUnits.map((unit) => (
                          <tr key={unit._id || unit.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">{unit.title}</td>
                            <td className="px-4 py-3">{unit.course?.title || "N/A"}</td>
                            <td className="px-4 py-3">{unit.instructor?.name || "N/A"}</td>
                            <td className="px-4 py-3">{unit.credits}</td>
                            <td className="px-4 py-3">{unit.timePeriod} weeks</td>
                            <td className="px-4 py-3 flex gap-3">
                              <button
                                onClick={() => handleEditUnit(unit)}
                                className="text-teal-600 hover:text-teal-800 text-sm mr-4"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                            No units found
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
                          : "bg-purple-600 text-white hover:bg-purple-700"
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
                            ? "bg-purple-600 text-white"
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
                          : "bg-purple-600 text-white hover:bg-purple-700"
                      } transition-colors`}
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

export default SuperAdminUnitControl;
