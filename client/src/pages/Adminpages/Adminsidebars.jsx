import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Adminsidebar = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 text-teal-600"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-teal-800 text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 shadow-lg`}
      >
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Admin Panel</h2>
          <nav className="space-y-3 sm:space-y-4">
            <a href="/dashboard/admin" className="block text-sm hover:text-teal-200">
              Dashboard
            </a>
            <a href="/students/admin" className="block text-sm hover:text-teal-200">
              Students
            </a>
            <a href="/lectures/admin" className="block text-sm hover:text-teal-200">
              Lectures
            </a>
            <a href="/notifications/admin" className="block text-sm hover:text-teal-200">
              Notifications
            </a>
            <button
              onClick={onLogout}
              className="w-full text-left text-sm hover:text-teal-200 mt-4"
              aria-label="Logout"
            >
              Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Adminsidebar;