import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiBell } from "react-icons/fi";
import Adminsidebar from "../Adminpages/Adminsidebars";

const SuperAdminnotifications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Simulated API fetch for notification data
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const mockData = [
          { id: 1, title: "Course Access Request", message: "Student Alice Johnson requests access to CS101.", date: "2025-06-10" },
          { id: 2, title: "Grade Review Request", message: "Student Bob Williams requests a review of Math201 grades.", date: "2025-06-11" },
          { id: 3, title: "System Update", message: "Scheduled maintenance on 2025-06-15.", date: "2025-06-12" },
        ];
        setTimeout(() => {
          setNotifications(mockData);
          setLoading(false);
        }, 1000);
      } catch {
        setError("Failed to load notifications. Please try again.");
        setLoading(false);
      }
    };
    fetchNotifications();
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
        {/* Header */}
        <div className="mb-6 bg-gradient-to-r from-teal-600 to-teal-800 text-white p-4 sm:p-6 rounded-lg shadow-lg">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Notifications</h2>
          <p className="text-xs sm:text-sm mt-2">
            Manage system notifications. Today is{" "}
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
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          </div>
        ) : (
          /* Notification List */
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiBell className="text-2xl text-teal-600" />
              Notifications ({notifications.length})
            </h3>
            <ul className="space-y-4">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className="border-b pb-4 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">{notification.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-500">Posted: {notification.date}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/admin/notifications/${notification.id}`)}
                      className="text-teal-600 hover:text-teal-800 text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default SuperAdminnotifications;