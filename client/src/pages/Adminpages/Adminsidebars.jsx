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

const Adminsidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard/admin", icon: <FiHome className="text-lg" /> },
    { name: "Students", path: "/students/admin", icon: <FiUsers className="text-lg" /> },
    { name: "Lectures", path: "/lectures/admin", icon: <FiBook className="text-lg" /> },
    { name: "Notifications", path: "/notifications/admin", icon: <FiBell className="text-lg" /> },
    { name: "Feed Management", path: "/feed/admin", icon: <FiGlobe className="text-lg" /> },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-black text-white hover:bg-gray-900 transition-all duration-200 shadow"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full bg-black text-white flex flex-col transition-all duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"} 
          md:translate-x-0 md:static md:w-64 min-h-screen w-64 sm:w-72`}
      >
        <div className="p-4 sm:p-6 border-b border-gray-800">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Admin Panel</h2>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md w-full text-left transition-all duration-200
                ${
                  location.pathname === item.path
                    ? "bg-teal-700 text-white"
                    : "text-gray-200 hover:bg-gray-600 hover:text-white"
                }`}
              aria-current={location.pathname === item.path ? "page" : undefined}
            >
              <span className={location.pathname === item.path ? "text-white" : "text-gray-500"}>
                {item.icon}
              </span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 sm:p-6 border-t border-gray-800">
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:text-red hover:text-red-500 rounded-md w-full transition-all duration-200"
          >
            <FiLogOut className="text-lg text-red-500" />
            Logout
          </button>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-30 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

Adminsidebar.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default Adminsidebar;