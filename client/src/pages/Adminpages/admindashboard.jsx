import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiFileText, FiUsers, FiBell } from "react-icons/fi";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Adminsidebar from "../Adminpages/Adminsidebars";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Admindashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    registeredStudents: [],
    lectures: [],
    requestMessages: [],
  });

  // Simulated API fetch for dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const mockData = {
          registeredStudents: [
            { id: 1, name: "Alice Johnson", course: "CS101", registeredDate: "2025-06-01" },
            { id: 2, name: "Bob Williams", course: "Math201", registeredDate: "2025-06-05" },
            { id: 3, name: "Clara Davis", course: "CS201", registeredDate: "2025-06-10" },
          ],
          lectures: [
            { id: 1, title: "Introduction to Algorithms", course: "CS101", date: "2025-06-15" },
            { id: 2, title: "Calculus I", course: "MATH201", date: "2025-06-16" },
            { id: 3, title: "Data Structures", course: "CS201", date: "2025-06-17" },
          ],
          requestMessages: [
            { id: 1, title: "Course Access Request", date: "2025-06-10" },
            { id: 2, title: "Grade Review Request", date: "2025-06-11" },
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
    navigate("/login");
  };

  return (
    <div className="font-sans min-h-screen bg-neutral-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Adminsidebar onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64 overflow-y-auto">
        {/* Welcome Banner */}
        <div className="mb-6 bg-gradient-to-r from-teal-600 to-teal-800 text-white p-4 sm:p-6 rounded-lg shadow-lg">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Welcome, Super Admin!</h2>
          <p className="text-xs sm:text-sm mt-2">
            Manage students, lectures, and facilities with ease. Today is{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            .
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(3)].map((_, index) => (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg flex items-center gap-4 transition-transform hover:scale-105">
                <FiFileText className="text-2xl sm:text-3xl text-teal-600" />
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    Registered Students
                  </h3>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {dashboardData.registeredStudents.length}
                  </p>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg flex items-center gap-4 transition-transform hover:scale-105">
                <FiUsers className="text-2xl sm:text-3xl text-teal-600" />
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    Lectures
                  </h3>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {dashboardData.lectures.length}
                  </p>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg flex items-center gap-4 transition-transform hover:scale-105">
                <FiBell className="text-2xl sm:text-3xl text-teal-600" />
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    Notifications
                  </h3>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {dashboardData.requestMessages.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Registered Students */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                  Registered Students
                </h3>
                <ul className="space-y-2 mb-4">
                  {dashboardData.registeredStudents.slice(0, 3).map((student) => (
                    <li
                      key={student.id}
                      className="text-xs sm:text-sm text-gray-700 hover:text-teal-600 cursor-pointer"
                      onClick={() => navigate(`/admin/students/${student.id}`)}
                    >
                      {student.name} (Course: {student.course}, Registered: {student.registeredDate})
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate("/admin/students")}
                  className="px-3 sm:px-4 py-1 sm:py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm"
                  aria-label="View all students"
                >
                  View All Students
                </button>
              </div>

              {/* Registered Lectures */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                  Registered Lectures
                </h3>
                <ul className="space-y-2 mb-4">
                  {dashboardData.lectures.slice(0, 3).map((lecture) => (
                    <li
                      key={lecture.id}
                      className="text-xs sm:text-sm text-gray-700 hover:text-teal-600 cursor-pointer"
                      onClick={() => navigate(`/admin/lectures/${lecture.id}`)}
                    >
                      {lecture.title} (Course: {lecture.course}, Date: {lecture.date})
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate("/admin/lectures")}
                  className="px-3 sm:px-4 py-1 sm:py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm"
                  aria-label="View all lectures"
                >
                  View All Lectures
                </button>
              </div>

              {/* VLE Usage Chart */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                  VLE Usage Chart
                </h3>
                <div className="h-64">
                  <Line
                    data={{
                      labels: ["June 1", "June 5", "June 10", "June 15"],
                      datasets: [
                        {
                          label: "Registered Students",
                          data: [2, 1, 2.5, 2],
                          borderColor: "#14B8A6",
                          backgroundColor: "#14B8A6",
                          fill: false,
                          tension: 0.4,
                        },
                        {
                          label: "Lectures",
                          data: [1, 2, 3, 3.5],
                          borderColor: "#3B82F6",
                          backgroundColor: "#3B82F6",
                          fill: false,
                          tension: 0.4,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: "top" },
                        title: { display: true, text: "VLE Usage Over Time" },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: { display: true, text: "Count" },
                        },
                        x: {
                          title: { display: true, text: "Date" },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admindashboard;