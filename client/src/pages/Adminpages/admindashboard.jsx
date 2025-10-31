import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiAlertCircle,
  FiFileText,
  FiUsers,
  FiBook,
  FiArrowRight,
} from "react-icons/fi";
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
import { useAppDispatch } from "../../redux/store-config/store";
import { getAllStudentsAPI } from "../../redux/features/studentSlice";
import { getAllLectures } from "../../service/adminService";
import { getAllunitsForAdmin } from "../../service/unitsService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Admindashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    studentCount: 0,
    lecturerCount: 0,
    unitCount: 0,
    loginStats: [],
  });

  // Generate last 7 days dates
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(
        date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      );
    }
    return dates;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const lecturerRes = await getAllLectures();
        const studentRes = await dispatch(getAllStudentsAPI()).unwrap();
        const unitRes = await getAllunitsForAdmin();

        // Random login stats for fun visualization
        const generateRandomLogins = () => {
          return Array.from({ length: 7 }, () => ({
            students: Math.floor(Math.random() * 200) + 50,
            lecturers: Math.floor(Math.random() * 30) + 5,
          }));
        };

        const mockData = {
          studentCount: studentRes.data.length,
          lecturerCount: lecturerRes.data.length,
          unitCount: unitRes.data.length,
          loginStats: generateRandomLogins(),
        };

        setDashboardData(mockData);
        setLoading(false);
      } catch {
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dispatch]);

  const handleLogout = () => {
    navigate("/login");
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
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                Welcome, Super Admin!
              </h2>
              <p className="text-xs sm:text-sm mt-2">
                Manage students, lecturers, and units efficiently. Today is{" "}
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
                      {dashboardData.studentCount}
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

              {/* Units Card (replaces Notifications) */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-purple-500 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Total Units
                    </h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {dashboardData.unitCount}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <FiBook className="text-2xl" />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => navigate("/units/admin")}
                    className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-800"
                  >
                    View all units <FiArrowRight className="ml-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Login Activity Chart */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  System Login Activity (Last 7 Days)
                </h3>
                <div className="h-72">
                  <Bar
                    data={{
                      labels: getLast7Days(),
                      datasets: [
                        {
                          label: "Student Logins",
                          data: dashboardData.loginStats.map(
                            (s) => s.students
                          ),
                          backgroundColor: "#14B8A6",
                          borderRadius: 4,
                        },
                        {
                          label: "Lecturer Logins",
                          data: dashboardData.loginStats.map(
                            (s) => s.lecturers
                          ),
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
                      },
                      scales: {
                        y: { beginAtZero: true, ticks: { precision: 0 } },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Entity Distribution Chart */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Entity Distribution
                </h3>
                <div className="h-72">
                  <Bar
                    data={{
                      labels: ["Students", "Lecturers", "Units"],
                      datasets: [
                        {
                          label: "Count",
                          data: [
                            dashboardData.studentCount,
                            dashboardData.lecturerCount,
                            dashboardData.unitCount,
                          ],
                          backgroundColor: [
                            "#14B8A6",
                            "#3B82F6",
                            "#A855F7",
                          ],
                          borderRadius: 6,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                      },
                      scales: {
                        y: { beginAtZero: true, ticks: { precision: 0 } },
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
