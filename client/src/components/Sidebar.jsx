import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  Package,
  Calendar,
  MessageSquare,
  ClipboardList,
  Settings,
  LogOut,
  ShieldCheck,
  ScrollText,
  Accessibility,
  Landmark,
  User,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-1/2 left-0 transform -translate-y-1/2 z-50 bg-gradient-to-b from-blue-700 to-blue-900 dark:from-gray-800 dark:to-gray-700 text-white h-[2cm] w-[14px] flex items-center justify-center rounded-r-md shadow-lg md:hidden"
      >
        {isOpen ? (
          <span className="rotate-180 text-xs font-bold">&#10148;</span>
        ) : (
          <span className="text-xs font-bold">&#10148;</span>
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-[260px] 
          bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 
          text-gray-800 dark:text-white 
          border-r border-gray-300 dark:border-gray-600 
          overflow-y-auto p-7 transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:block`}
      >
        {/* Heading */}
        <h2 className="text-lg font-semibold mb-10 mt-16">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-white border shadow-md rounded px-3 py-2 transition"
          >
            Dashboard
          </Link>
        </h2>

        {/* Nav Links */}
        <ul className="space-y-6 text-sm font-semibold">
          {[
            {
              icon: <Landmark size={20} />,
              label: "Home",
              to: "/institution",
            },
            {
              icon: <Globe size={20} />,
              label: "Activity",
              to: "/activity",
            },
            {
              icon: <Package size={20} />,
              label: "Units",
              to: "/units",
            },
            {
              icon: <ClipboardList size={20} />,
              label: "Marks",
              to: "/marks",
            },
            {
              icon: <Calendar size={20} />,
              label: "Calendar",
              to: "/calendar",
            },
            {
              icon: <MessageSquare size={20} />,
              label: "Notifications",
              to: "/messages",
            },
            {
              icon: <Settings size={20} />,
              label: "Settings",
              to: "/tools",
            },
            {
              icon: <User size={20} />,
              label: "profile",
              to: "/profile",
            },
            {
              icon: <LogOut size={20} />,
              label: "Logout",
              to: "/logout",
            },
            
          ].map((item, idx) => (
            <li key={idx}>
              <Link
                to={item.to}
                className="flex items-center gap-3 hover:text-blue-500 dark:hover:text-blue-200 transition-all duration-200"
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Footer Links */}
        <div className="mt-10 text-sm space-y-3 text-gray-600 dark:text-white/70">
          <Link
            to="/privacy"
            className="flex items-center gap-2 hover:text-blue-400 dark:hover:text-blue-200 transition"
          >
            <ShieldCheck size={16} />
            Privacy
          </Link>
          <Link
            to="/terms"
            className="flex items-center gap-2 hover:text-blue-400 dark:hover:text-blue-200 transition"
          >
            <ScrollText size={16} />
            Terms
          </Link>
          <Link
            to="/accessibility"
            className="flex items-center gap-2 hover:text-blue-400 dark:hover:text-blue-200 transition"
          >
            <Accessibility size={16} />
            Accessibility
          </Link>
        </div>
      
      </aside>
    </>
  );
};

export default Sidebar;
