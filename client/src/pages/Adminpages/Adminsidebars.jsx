import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiHome,
  FiUsers,
  FiBook,
  FiBell,
  FiGlobe,
  FiLogOut,
} from "react-icons/fi";
import PropTypes from "prop-types";

// Sidebar component for admin navigation
const Adminsidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Navigation items with icons and routes
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard/admin",
      icon: <FiHome className="text-lg" />,
    },
    {
      name: "Students",
      path: "/students/admin",
      icon: <FiUsers className="text-lg" />,
    },
    {
      name: "Lectures",
      path: "/lectures/admin",
      icon: <FiBook className="text-lg" />,
    },
    {
      name: "Notifications",
      path: "/notifications/admin",
      icon: <FiBell className="text-lg" />,
    },
    {
      name: "Feed Management",
      path: "/feed/admin",
      icon: <FiGlobe className="text-lg" />,
    },
  ];

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 text-green-600 hover:text-green-800 transition"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-neutral-800 text-white flex flex-col transition-transform duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:w-64 min-h-screen
          w-64 sm:w-72`}
      >
        <div className="p-4 sm:p-6 border-b border-teal-700">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Admin Panel</h2>
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
                    ? "bg-teal-600 text-white"
                    : "text-gray-200 hover:bg-teal-700"
                }`}
              aria-current={location.pathname === item.path ? "page" : undefined}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 sm:p-6 border-t border-teal-700">
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false); // Close sidebar on logout
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:bg-teal-700 rounded-lg w-full transition"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};

// PropTypes for type checking
Adminsidebar.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default Adminsidebar;