import React, { useState } from "react";
import Lecsidebar from "../lecturepages/Lecsidebar";

const Leccorces = () => {
  const [courses, setCourses] = useState([
    { id: 1, title: "Introduction to React", code: "CS101", students: 50 },
    { id: 2, title: "Advanced JavaScript", code: "CS202", students: 35 },
    { id: 3, title: "Web Development", code: "CS303", students: 45 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    students: "",
  });

  const handleLogout = () => {
    console.log("Logout triggered");
    // Add actual logout logic here
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const openCreateModal = () => {
    setCurrentCourse(null);
    setFormData({
      title: "",
      code: "",
      students: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setCurrentCourse(course);
    setFormData({
      title: course.title,
      code: course.code,
      students: course.students,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (currentCourse) {
      // Update existing course
      const updatedCourses = courses.map(course =>
        course.id === currentCourse.id ? { ...course, ...formData } : course
      );
      setCourses(updatedCourses);
    } else {
      // Create new course
      const newCourse = {
        id: courses.length + 1,
        ...formData,
        students: parseInt(formData.students),
      };
      setCourses([...courses, newCourse]);
    }
    
    setIsModalOpen(false);
  };

  const handleDelete = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter(course => course.id !== courseId));
    }
  };

  return (
    <div className="flex min-h-screen">
      <Lecsidebar onLogout={handleLogout} />
      <div className="flex-1 p-6 bg-neutral-100">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">My Courses</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-200 text-neutral-700">
                <th className="p-4">Course Title</th>
                <th className="p-4">Course Code</th>
                <th className="p-4">Students Enrolled</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-t border-neutral-200">
                  <td className="p-4">{course.title}</td>
                  <td className="p-4">{course.code}</td>
                  <td className="p-4">{course.students}</td>
                  <td className="p-4 space-x-2">
                    <button 
                      onClick={() => openEditModal(course)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(course.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button 
          onClick={openCreateModal}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add New Course
        </button>

        {/* Modal for Create/Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {currentCourse ? "Edit Course" : "Create New Course"}
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-neutral-700 mb-2" htmlFor="title">
                      Course Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-neutral-300 rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-neutral-700 mb-2" htmlFor="code">
                      Course Code
                    </label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-neutral-300 rounded"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-neutral-700 mb-2" htmlFor="students">
                      Students Enrolled
                    </label>
                    <input
                      type="number"
                      id="students"
                      name="students"
                      value={formData.students}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-neutral-300 rounded"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-neutral-700 border border-neutral-300 rounded hover:bg-neutral-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      {currentCourse ? "Update" : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leccorces;