import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiBell, FiFilter, FiSearch, FiCheck, FiTrash2 } from "react-icons/fi";
import Adminsidebar from "../Adminpages/Adminsidebars";

const SuperAdminnotifications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const notificationTypes = [
    { value: "all", label: "All Notifications" },
    { value: "course", label: "Course Requests" },
    { value: "grade", label: "Grade Reviews" },
    { value: "system", label: "System Updates" },
    { value: "other", label: "Other" }
  ];

  // Simulated API fetch for notification data
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const mockData = [
          { 
            id: 1, 
            title: "Course Access Request", 
            message: "Student Alice Johnson requests access to CS101.", 
            date: "2025-06-10", 
            type: "course",
            read: false
          },
          { 
            id: 2, 
            title: "Grade Review Request", 
            message: "Student Bob Williams requests a review of Math201 grades.", 
            date: "2025-06-11", 
            type: "grade",
            read: false
          },
          { 
            id: 3, 
            title: "System Maintenance", 
            message: "Scheduled maintenance on 2025-06-15 from 2AM to 4AM.", 
            date: "2025-06-12", 
            type: "system",
            read: true
          },
          { 
            id: 4, 
            title: "New Student Registration", 
            message: "New student Clara Davis has registered for the semester.", 
            date: "2025-06-13", 
            type: "other",
            read: false
          },
          { 
            id: 5, 
            title: "Course Access Approved", 
            message: "Your request to access CS201 has been approved.", 
            date: "2025-06-14", 
            type: "course",
            read: true
          },
          { 
            id: 6, 
            title: "Grade Review Completed", 
            message: "Grade review for Math201 has been processed.", 
            date: "2025-06-15", 
            type: "grade",
            read: false
          },
          { 
            id: 7, 
            title: "System Update Available", 
            message: "New version 2.5.0 is available for installation.", 
            date: "2025-06-16", 
            type: "system",
            read: false
          },
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

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? {...notification, read: true} : notification
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    if (filteredNotifications.length <= (currentPage - 1) * rowsPerPage && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({...notification, read: true})));
  };

  const filteredNotifications = notifications
    .filter(notification => 
      filterBy === "all" ? true : notification.type === filterBy
    )
    .filter(notification => 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(filteredNotifications.length / rowsPerPage);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="font-sans min-h-screen bg-neutral-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Adminsidebar onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-screen">
        <div className="max-w-8xl mx-auto">
          {/* Header */}
          <div className="mb-6 bg-gradient-to-r from-teal-600 to-teal-800 text-white p-4 sm:p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start">
              <div>
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
              <button 
                onClick={markAllAsRead}
                className="text-xs sm:text-sm bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-lg transition-colors"
              >
                Mark All as Read
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
              <FiAlertCircle className="text-lg" />
              {error}
            </div>
          )}

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search notifications..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 w-full"
                />
              </div>
              
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 w-full sm:w-auto"
              >
                {notificationTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

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
                Notifications ({filterBy === "all" ? notifications.length : filteredNotifications.length})
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredNotifications.filter(n => !n.read).length} unread)
                </span>
              </h3>
              
              {filteredNotifications.length > 0 ? (
                <>
                  <ul className="space-y-4 gap-4">
                    {paginatedNotifications.map((notification) => (
                      <li
                        key={notification.id}
                        className={`border-b pb-4 last:border-b-0 gap-4 ${!notification.read ? 'bg-gray-100' : ''}`}
                      >
                        <div className="flex justify-between items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-4  mt-2 mb-1">
                              <h4 className={`text-sm font-semibold gap-4 px-2 mt-4${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                              </h4>
                              <span className={`text-xs px-2 py-1 rounded-full gap-4 ${getBadgeColor(notification.type)}`}>
                                {notificationTypes.find(t => t.value === notification.type)?.label}
                              </span>
                            </div>
                            <p className={`text-xs sm:text-sm px-2  ${!notification.read ? 'text-gray-800' : 'text-gray-600'}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 px-2 mt-1">Posted: {notification.date}</p>
                          </div>
                          <div className="flex gap-2 mt-6 px-4  ">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-green-600  hover:text-green-800 p-1 rounded-full hover:bg-green-50"
                                title="Mark as read"
                              >
                                <FiCheck className="text-lg" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                              title="Delete"
                            >
                              <FiTrash2 className="text-lg" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="mt-6 flex justify-center items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-lg ${
                          currentPage === 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-teal-600 text-white hover:bg-teal-700"
                        } transition-colors`}
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => handlePageChange(index + 1)}
                          className={`px-3 py-1 rounded-lg ${
                            currentPage === index + 1
                              ? "bg-teal-600 text-white"
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
                            : "bg-teal-600 text-white hover:bg-teal-700"
                        } transition-colors`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No notifications found matching your criteria
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminnotifications;