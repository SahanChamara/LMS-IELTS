import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiBook,
  FiFileText,
  FiUsers,
  FiLogOut,
  FiHome,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar, // Added for calendar
  FiSettings, // Added for settings
} from "react-icons/fi";
import PropTypes from "prop-types";
import { GlobeIcon,FilePenLine  } from "lucide-react";

// Sidebar component for lecturer navigation
const Lecsidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Navigation items with icons and routes
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard/lecture",
      icon: <FiHome className="text-lg" />,
    },
    {
      name: "Units",
      path: "/courses/lecture",
      icon: <FiBook className="text-lg" />,
    },
    {
      name: "Exam",
      path: "/exam/lecture",
      icon: <FilePenLine size={20} className="text-lg" />,
    },
    {
      name: "Students",
      path: "/students/lecture",
      icon: <FiUsers className="text-lg" />,
    },
    
    {
      name: "Calendar", // Fixed typo "calender" to "Calendar"
      path: "/calendar/lecture", // Fixed path to "/calendar/lecture"
      icon: <FiCalendar className="text-lg" />, // Proper calendar icon
    },
        {
      name: "Feed", // Fixed typo "calender" to "Calendar"
      path: "/feed/lecture", // Fixed path to "/calendar/lecture"
      icon: <GlobeIcon size={20} className="text-lg" />, // Proper calendar icon
    },
    {
      name: "Settings",
      path: "/settings/lecture", // Fixed path to "/settings/lecture"
      icon: <FiSettings className="text-lg" />, // Proper settings icon
    },
  ];

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button with Arrow */}
      <button
        className="md:hidden fixed top-1/2 -translate-y-1/2 left-0.5 sm:left-6 z-50 py-6 px-1 bg-transparent text-black hover:text-black rounded-md shadow-lg transition"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? (
          <FiChevronLeft className="text-xl" />
        ) : (
          <FiChevronRight className="text-xl" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-neutral-800 text-white flex flex-col transition-transform duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:w-64 min-h-screen
          w-64 sm:w-72`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-neutral-700">
          <h1 className="text-2xl font-bold tracking-tight">
            Lecturer Dashboard
          </h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false); // Close sidebar on mobile after navigation
              }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg w-full text-left transition
                ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white"
                    : "text-gray-200 hover:bg-neutral-700"
                }`}
              aria-current={
                location.pathname === item.path ? "page" : undefined
              }
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-neutral-700">
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false); // Close sidebar on logout
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:bg-neutral-700 rounded-lg w-full transition"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};

// PropTypes for type checking
Lecsidebar.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default Lecsidebar;