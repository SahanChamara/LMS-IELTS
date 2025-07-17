import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Lecsidebar from "../lecturepages/lecsidebar";
import { courses } from "../../data/courses";

//=============================================================================================
import { useAppDispatch } from "../../redux/store-config/store";
import { getUnitByInstructorIdAPI } from "../../redux/features/unitsSlice";
import { motion } from "framer-motion";
//=============================================================================================

// Defining the Leccorces component to manage and display course units for instructors
const Leccorces = () => {
  const navigate = useNavigate(); // Initialize navigate hook for routing

  //==========================================================================================
  const dispatch = useAppDispatch();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchUnits = async () => {
        try {
          setLoading(true);
           const response = await dispatch(getUnitByInstructorIdAPI(localStorage.getItem("user"))).unwrap();
          //  console.log(localStorage.getItem("user")).unwrap()
          //  console.log("::: -> Unit Response ",response);
           
  
          let fetchedUnits = [];
          if (Array.isArray(response)) {
            //console.log(response.data._id);
            fetchedUnits = response.map((unit, index) => ({
              title: unit.title || "Untitled",
              unitId: unit.id || `unit-${index}`,
              credits: unit.credits || 0,
              image: unit.image || "default-image.jpg",
            }));
          } else if (response && response.data && Array.isArray(response.data)) {
            fetchedUnits = response.data.map((unit, index) => ({
              title: unit.title || "Untitled",
              unitId: unit.id || `unit-${index}`,
              credits: unit.credits || 0,
              image: unit.image || "default-image.jpg",
            }));
          }else {
            throw new Error("Unexpected response format");
          }
  
          setUnits(fetchedUnits);
  
          const initialProgress = {};
          const initialEnrolled = {};
          fetchedUnits.forEach((unit) => {
            initialProgress[unit.unitId] = Math.floor(Math.random() * 100);
            initialEnrolled[unit.unitId] = Math.random() > 0.3;
          });
          // setProgressData(initialProgress);
          // setEnrolledUnits(initialEnrolled);
          // calculateProgress(initialEnrolled, initialProgress);
        } catch (err) {
          setError(err.message || "Failed to fetch units. Please try again later.");
          console.error("fetchUnits error:", err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUnits();
    }, [dispatch]);
  //==========================================================================================

  // Initializing state for units with sample data
  // const [units, setUnits] = useState([
  //   {
  //     id: 1,
  //     title: "Introduction to React",
  //     code: "CS101",
  //     students: 50,
  //     description:
  //       "Learn the fundamentals of React including components, state, and props. Build your first React application in this comprehensive introductory unit.",
  //     image:
  //       "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  //     state: "enabled",
  //   },
  //   {
  //     id: 2,
  //     title: "Advanced JavaScript",
  //     code: "CS202",
  //     students: 35,
  //     description:
  //       "Dive deep into JavaScript concepts like closures, prototypes, async/await. Master the language that powers modern web development.",
  //     image:
  //       "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  //     state: "disabled",
  //   },
  //   {
  //     id: 3,
  //     title: "Web Development",
  //     code: "CS303",
  //     students: 45,
  //     description:
  //       "Full-stack web development unit covering HTML, CSS, JavaScript, and backend technologies. Build complete web applications from scratch.",
  //     image:
  //       "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
  //     state: "enabled",
  //   },
  // ]);

  // Managing state for modal visibility, form data, and active tab
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUnit, setCurrentUnit] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    students: "",
    description: "",
    image: "",
    state: "enabled",
  });
  const [activeTab, setActiveTab] = useState("both");

  // Handling logout action
  const handleLogout = () => {
    console.log("Logout triggered");
  };

  // Updating form data on input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handling image file upload and converting to base64
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          image: event.target.result,
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Updating form data based on selected course code
  const handleCodeChange = (e) => {
    const selectedCode = e.target.value;
    const selectedCourse = courses.find((course) => course.id === selectedCode);
    setFormData({
      ...formData,
      code: selectedCode,
      title: selectedCourse ? selectedCourse.name : formData.title,
      students: selectedCourse ? selectedCourse.studentsEnrolled : formData.students,
      image: selectedCourse ? selectedCourse.imageUrl : formData.image,
      description: selectedCourse ? selectedCourse.description : formData.description,
    });
  };

  // Toggling unit state between enabled and disabled
  const toggleUnitState = (unitId) => {
    setUnits(
      units.map((unit) =>
        unit.id === unitId
          ? {
              ...unit,
              state: unit.state === "enabled" ? "disabled" : "enabled",
            }
          : unit
      )
    );
  };

  // Opening modal for creating a new unit
  const openCreateModal = () => {
    setCurrentUnit(null);
    setFormData({
      title: "",
      code: "",
      students: "",
      description: "",
      image: "",
      state: "enabled",
    });
    setIsModalOpen(true);
  };

  // Opening modal for editing an existing unit
  const openEditModal = (unit) => {
    setCurrentUnit(unit);
    setFormData({
      title: unit.title,
      code: unit.code,
      students: unit.students,
      description: unit.description,
      image: unit.image,
      state: unit.state,
    });
    setIsModalOpen(true);
  };

  // Navigating to unit details page
  const handleAccessUnit = (unit) => {
    navigate(`/unit/lecture/${unit.unitId}`, { state: { unit } }); // Navigate to unit details page with unit data
  };
  console.log(":::::--->", units)

  // Handling form submission for creating or updating a unit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentUnit) {
      const updatedUnits = units.map((unit) =>
        unit.id === currentUnit.id ? { ...unit, ...formData } : unit
      );
      setUnits(updatedUnits);
    } else {
      const newUnit = {
        id: Date.now(),
        title: formData.title,
        code: formData.code,
        students: parseInt(formData.students),
        description: formData.description,
        image: formData.image,
        state: formData.state,
      };
      setUnits([...units, newUnit]);
    }

    setIsModalOpen(false);
  };

  // Deleting a unit with confirmation
  const handleDelete = (unitId) => {
    if (window.confirm("Are you sure you want to delete this unit?")) {
      setUnits(units.filter((unit) => unit.id !== unitId));
    }
  };

  // Rendering the main component layout
  return (
    <div className="flex min-h-screen">
      {/* Rendering the sidebar */}
      <div className="fixed top-0 left-0 h-full w-64 z-50">
        <Lecsidebar onLogout={handleLogout} />
      </div>

      {/* Rendering the main content area */}
      <div className="flex-1 ml-64 bg-neutral-100 overflow-x-auto">
        <div className="p-4 sm:p-6">
          {/* Displaying header and view toggle buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-800">
              My Courses
            </h2>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setActiveTab("table")}
                  className={`px-3 py-2 text-sm sm:px-4 sm:text-base ${
                    activeTab === "table"
                      ? "bg-blue-600 text-white"
                      : "bg-white"
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setActiveTab("cards")}
                  className={`px-3 py-2 text-sm sm:px-4 sm:text-base ${
                    activeTab === "cards"
                      ? "bg-blue-600 text-white"
                      : "bg-white"
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setActiveTab("both")}
                  className={`px-3 py-2 text-sm sm:px-4 sm:text-base ${
                    activeTab === "both" ? "bg-blue-600 text-white" : "bg-white"
                  }`}
                >
                  Both
                </button>
              </div>
              {/* <button
                onClick={openCreateModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
              >
                + Add New Unit
              </button> */}
            </div>
          </div>

          {/* Rendering table view */}
          {/* {(activeTab === "table" || activeTab === "both") && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base sm:text-lg font-semibold">
                  Table View
                </h3>
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left table-auto">
                  <thead>
                    <tr className="bg-neutral-200 text-neutral-700">
                      <th className="p-3 sm:p-4 text-center text-sm sm:text-base">
                        Image
                      </th>
                      <th className="p-3 sm:p-4 text-center text-sm sm:text-base">
                        Unit Title
                      </th>
                      <th className="p-3 sm:p-4 text-center text-sm sm:text-base">
                        Unit Code
                      </th>
                      <th className="p-3 sm:p-4 text-center text-sm sm:text-base">
                        Students
                      </th>
                      <th className="p-3 sm:p-4 text-center text-sm sm:text-base">
                        Actions
                      </th>
                      <th className="p-3 sm:p-4 text-center text-sm sm:text-base">
                        State Control
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {units.map((unit) => (
                      <tr
                        key={`table-${unit.id}`}
                        className="border-t border-neutral-200 hover:bg-neutral-50 transition-colors"
                      >
                        <td className="p-3 sm:p-4 text-center">
                          {unit.image && (
                            <img
                              src={unit.image}
                              alt={unit.title}
                              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded mx-auto"
                            />
                          )}
                        </td>
                        <td className="p-3 sm:p-4 font-medium text-sm sm:text-base text-center">
                          {unit.title}
                        </td>
                        <td className="p-3 sm:p-4 text-neutral-600 text-sm sm:text-base text-center">
                          {unit.code}
                        </td>
                        <td className="p-3 sm:p-4 text-sm sm:text-base text-center">
                          {unit.students}
                        </td>
                        <td className="p-3 sm:p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openEditModal(unit)}
                              className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                              aria-label={`Edit unit ${unit.title}`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(unit.id)}
                              className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                              aria-label={`Delete unit ${unit.title}`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                        <td className="p-3 sm:p-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={unit.state === "enabled"}
                                onChange={() => toggleUnitState(unit.id)}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                              <div className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full top-0.5 left-0.5 peer-checked:translate-x-4 sm:peer-checked:translate-x-5 transition-transform duration-200"></div>
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )} */}

          {/* Rendering card view */}
          {(activeTab === "cards" || activeTab === "both") && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4">
                Card View
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {units.map((unit) => (
                  <div
                    key={`card-${unit.id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                  >
                    {unit.image && (
                      <div className="h-40 sm:h-48 overflow-hidden">
                        <img
                          src={unit.image}
                          alt={unit.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 sm:p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-neutral-800 mb-1">
                            {unit.title}
                          </h3>
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                            {unit.code}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {unit.students} students
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              unit.state === "enabled"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {unit.state === "enabled"
                              ? "Enabled"
                              : "Disabled"}
                          </span>
                        </div>
                      </div>
                      <div className="mb-4 flex-1">
                        <p className="text-neutral-600 text-sm line-clamp-3">
                          {unit.description}
                        </p>
                      </div>
                      <div className="flex justify-end mt-auto pt-4 border-t border-neutral-100 space-x-2">
                        <button
                          onClick={() => handleAccessUnit(unit)}
                          className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                          Access
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rendering create/edit unit modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md my-8">
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">
                    {currentUnit ? "Edit Unit" : "Create New Unit"}
                  </h3>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-neutral-700 mb-2">
                        Unit Image
                      </label>
                      <div className="flex items-center space-x-4">
                        {formData.image && (
                          <img
                            src={formData.image}
                            alt="Unit preview"
                            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="block w-full text-xs sm:text-sm text-neutral-500
                              file:mr-4 file:py-1 sm:file:py-2 file:px-3 sm:file:px-4
                              file:rounded file:border-0
                              file:text-xs sm:file:text-sm file:font-semibold
                              file:bg-blue-50 file:text-blue-700
                              hover:file:bg-blue-100"
                          />
                          <p className="text-xs text-neutral-500 mt-1">
                            Or enter image URL:
                          </p>
                          <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full p-2 border border-neutral-300 rounded mt-1 text-xs sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-neutral-700 mb-2"
                        htmlFor="title"
                      >
                        Unit Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-neutral-700 mb-2"
                        htmlFor="code"
                      >
                        Unit Code
                      </label>
                      <select
                        id="code"
                        name="code"
                        value={formData.code}
                        onChange={handleCodeChange}
                        className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        required
                      >
                        <option value="">Select a course code</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.id} - {course.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-neutral-700 mb-2"
                        htmlFor="students"
                      >
                        Students Enrolled
                      </label>
                      <input
                        type="number"
                        id="students"
                        name="students"
                        value={formData.students}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-neutral-700 mb-2"
                        htmlFor="state"
                      >
                        State Control
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        required
                      >
                        <option value="enabled">Enabled</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-neutral-700 mb-2"
                        htmlFor="description"
                      >
                        Unit Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-3 py-1 sm:px-4 sm:py-2 text-neutral-700 border border-neutral-300 rounded hover:bg-neutral-100 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                      >
                        {currentUnit ? "Update" : "Create"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leccorces;