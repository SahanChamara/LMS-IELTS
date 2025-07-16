import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiFileText, FiUsers, FiBell, FiArrowRight } from "react-icons/fi";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Adminsidebar from "../Adminpages/Adminsidebars";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Admindashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    studentCount: 0,
    lecturerCount: 0,
    notificationCount: 0,
    recentNotifications: [],
    loginStats: [],
  });

  // Function to generate last 7 days dates
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString("en-US", { month: 'short', day: 'numeric' }));
    }
    return dates;
  };

  // Simulated API fetch for dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Generate random login data for the last 7 days
        const generateRandomLogins = () => {
          return Array.from({ length: 7 }, () => ({
            students: Math.floor(Math.random() * 200) + 50,
            lecturers: Math.floor(Math.random() * 30) + 5,
          }));
        };
        
        const mockData = {
          studentCount: 1245,
          lecturerCount: 48,
          notificationCount: 12,
          recentNotifications: [
            { id: 1, title: "Course Access Request", type: "course", date: "2025-06-10" },
            { id: 2, title: "Grade Review Request", type: "grade", date: "2025-06-11" },
            { id: 3, title: "System Maintenance", type: "system", date: "2025-06-12" },
             { id: 1, title: "Student Access Request", type: "course", date: "2025-06-10" },
            { id: 2, title: "password reset", type: "grade", date: "2025-06-11" },
            { id: 3, title: " Maintenance", type: "system", date: "2025-06-12" },
          ],
          loginStats: generateRandomLogins(),
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

  const getBadgeColor = (type) => {
    switch(type) {
      case 'course': return 'bg-blue-100 text-blue-800';
      case 'grade': return 'bg-purple-100 text-purple-800';
      case 'system': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="font-sans h-screen bg-neutral-100 flex flex-col lg:flex-row overflow-hidden">
      {/* Sidebar */}
      <Adminsidebar onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Welcome Banner */}
        <div className="mb-8 bg-gradient-to-r from-teal-600 to-teal-800 text-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Welcome, Super Admin!</h2>
              <p className="text-xs sm:text-sm mt-2">
                Manage students, lecturers, and facilities with ease. Today is{" "}
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                .
              </p>
            </div>
            <div className="text-xs sm:text-sm bg-white bg-opacity-20 px-3 py-1 rounded-lg">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
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
          <div className="space-y-6 mt-16">
            {/* Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Students Card */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-teal-500 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Registered Students
                    </h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {dashboardData.studentCount.toLocaleString()}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      <span className="text-green-600 font-semibold">+12.5%</span> from last month
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-teal-100 text-teal-600">
                    <FiUsers className="text-2xl" />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => navigate("/students/admin")}
                    className="flex items-center text-sm font-medium text-teal-600 hover:text-teal-800"
                  >
                    View all students <FiArrowRight className="ml-1" />
                  </button>
                </div>
              </div>

              {/* Lecturers Card */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Registered Lecturers
                    </h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {dashboardData.lecturerCount}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      <span className="text-green-600 font-semibold">+2</span> new this month
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <FiFileText className="text-2xl" />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => navigate("/lectures/admin")}
                    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View all lecturers <FiArrowRight className="ml-1" />
                  </button>
                </div>
              </div>

              {/* Notifications Card */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-purple-500 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Pending Notifications
                    </h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {dashboardData.notificationCount}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      <span className="text-red-600 font-semibold">3</span> require attention
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <FiBell className="text-2xl" />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => navigate("/notifications/admin")}
                    className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-800"
                  >
                    View all notifications <FiArrowRight className="ml-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Charts and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
              {/* Usage Chart - Made taller */}
              <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-12">
                  System Login Activity (Last 7 Days)
                </h3>
                <div className="h-80"> {/* Increased height */}
                  <Bar
                    data={{
                      labels: getLast7Days(),
                      datasets: [
                        {
                          label: "Student Logins",
                          data: dashboardData.loginStats.map(stat => stat.students),
                          backgroundColor: "#14B8A6",
                          borderRadius: 4,
                        },
                        {
                          label: "Lecturer Logins",
                          data: dashboardData.loginStats.map(stat => stat.lecturers),
                          backgroundColor: "#3B82F6",
                          borderRadius: 4,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: "top" },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `${context.dataset.label}: ${context.raw}`;
                            }
                          }
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0
                          }
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Recent Notifications - Made taller */}
              <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Recent Notifications
                </h3>
                <ul className="space-y-3 flex-1">
                  {dashboardData.recentNotifications.map((notification) => (
                    <li key={notification.id} className="text-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(notification.type)}`}>
                          {notification.type}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate("/notifications/admin")}
                  className="mt-4 w-full text-center py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admindashboard;