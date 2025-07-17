import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lecsidebar from "./lecsidebar";
import { FiAlertCircle, FiBook, FiFileText, FiUsers, FiBell } from "react-icons/fi";

const Lecdashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    courses: [],
    assignments: [],
    students: [],
    announcements: [],
  });

  // Simulated API fetch for dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call (e.g., await api.get('/lecturer/dashboard'))
        const mockData = {
          courses: [
            { id: 1, name: "Introduction to Computer Science", code: "CS101", students: 50 },
            { id: 2, name: "Advanced Mathematics", code: "MATH201", students: 40 },
            { id: 3, name: "Data Structures", code: "CS201", students: 45 },
          ],
          assignments: [
            { id: 1, title: "Week 1 Quiz", dueDate: "2025-06-20", course: "CS101" },
            { id: 2, title: "Project Proposal", dueDate: "2025-07-01", course: "MATH201" },
            { id: 3, title: "Lab Assignment", dueDate: "2025-06-15", course: "CS201" },
          ],
          students: [
            { id: 1, name: "John Doe", email: "john.doe@university.com", course: "CS101" },
            { id: 2, name: "Jane Smith", email: "jane.smith@university.com", course: "MATH201" },
            { id: 3, name: "Alex Brown", email: "alex.brown@university.com", course: "CS201" },
          ],
          announcements: [
            { id: 1, title: "Class Schedule Update", date: "2025-06-10" },
            { id: 2, title: "Office Hours Change", date: "2025-06-11" },
          ],
        };
        setTimeout(() => {
          setDashboardData(mockData);
          setLoading(false);
        }, 1000);
      } catch {
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    // TODO: Add logout logic (e.g., clear auth tokens)
    navigate("/login");
  };

  return (
    <div className="font-sans min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-10 md:block">
        <Lecsidebar onLogout={handleLogout} />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 md:ml-64 overflow-y-auto">
        {/* Welcome Banner */}
        <div className="mb-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sm:p-6 rounded-lg shadow-lg">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Welcome, Lecturer!</h2>
          <p className="text-xs sm:text-sm mt-2">
            Manage your courses, assignments, and students with ease. Today is{" "}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white p-4 sm:p-6 rounded-lg shadow-lg animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          /* Dashboard Content */
          <div className="space-y-6 sm:space-y-8">
            {/* Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg flex items-center gap-4 transition-transform hover:scale-105">
                <FiBook className="text-2xl sm:text-3xl text-blue-600" />
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Units</h3>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{dashboardData.courses.length}</p>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg flex items-center gap-4 transition-transform hover:scale-105">
                <FiFileText className="text-2xl sm:text-3xl text-blue-600" />
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Assignments</h3>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{dashboardData.assignments.length}</p>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg flex items-center gap-4 transition-transform hover:scale-105">
                <FiUsers className="text-2xl sm:text-3xl text-blue-600" />
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Students</h3>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{dashboardData.students.length}</p>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg flex items-center gap-4 transition-transform hover:scale-105">
                <FiBell className="text-2xl sm:text-3xl text-blue-600" />
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Notifications</h3>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{dashboardData.announcements.length}</p>
                </div>
              </div>
            </div>

            {/* Detailed Sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Recent Courses */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Recent Courses</h3>
                <ul className="space-y-2 mb-4">
                  {dashboardData.courses.slice(0, 3).map((course) => (
                    <li
                      key={course.id}
                      className="text-xs sm:text-sm text-gray-700 hover:text-blue-600 cursor-pointer"
                      onClick={() => navigate(`/lecturer/courses/${course.id}`)}
                    >
                      {course.name} ({course.code}) - {course.students} students
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate("/lecturer/courses")}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  aria-label="View all courses"
                >
                  View All Courses
                </button>
              </div>

              {/* Upcoming Assignments */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Upcoming Assignments</h3>
                <ul className="space-y-2 mb-4">
                  {dashboardData.assignments.slice(0, 3).map((assignment) => (
                    <li
                      key={assignment.id}
                      className="text-xs sm:text-sm text-gray-700 hover:text-blue-600 cursor-pointer"
                      onClick={() => navigate(`/lecturer/assignments/${assignment.id}`)}
                    >
                      {assignment.title} (Due: {assignment.dueDate})
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate("/lecturer/assignments")}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  aria-label="View all assignments"
                >
                  View All Assignments
                </button>
              </div>

              {/* Recent Students */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Recent Students</h3>
                <ul className="space-y-2 mb-4">
                  {dashboardData.students.slice(0, 3).map((student) => (
                    <li
                      key={student.id}
                      className="text-xs sm:text-sm text-gray-700 hover:text-blue-600 cursor-pointer"
                      onClick={() => navigate(`/lecturer/students/${student.id}`)}
                    >
                      {student.name} ({student.email})
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate("/lecturer/students")}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  aria-label="View all students"
                >
                  View All Students
                </button>
              </div>

              {/* Recent Announcements */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Recent Announcements</h3>
                <ul className="space-y-2 mb-4">
                  {dashboardData.announcements.slice(0, 3).map((announcement) => (
                    <li
                      key={announcement.id}
                      className="text-xs sm:text-sm text-gray-700 hover:text-blue-600 cursor-pointer"
                      onClick={() => navigate("/lecturer/announcements")}
                    >
                      {announcement.title} (Posted: {announcement.date})
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate("/lecturer/announcements")}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  aria-label="View all announcements"
                >
                  View All Announcements
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Lecdashboard;