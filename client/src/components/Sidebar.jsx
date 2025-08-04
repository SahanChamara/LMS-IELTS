import React, { useState } from "react";
import { NavLink } from "react-router-dom";
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
  LayoutDashboard,
  BookText,
  Folders,
  BellRing,
  Percent,
  FileText,
  FilePen,
  Globe2,
  GlobeIcon,
  Megaphone,
  MessageCircleWarningIcon,
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
        <h1 className="text-3xl font-bold mb-8 mt-2">IELTS PRO</h1>
        <ul className="space-y-6 text-sm font-semibold">
          {[
            {
              icon: <LayoutDashboard size={20} />,
              label: "Dashboard",
              to: "/dashboard",
            },
            {
              icon: <Folders size={20} />,
              label: "Units",
              to: "/units",
            },
            {
              icon: <FilePen size={20} />,
              label: "Exams",
              to: "/exams",
            },
            {
              icon: <GlobeIcon size={20} />,
              label: "Study Feed",
              to: "/feed",
            },
            {
              icon: <ClipboardList size={20} />,
              label: "Marks",
              to: "/marks",
            },
            {
              icon: <MessageCircleWarningIcon size={20} />,
              label: "Announcements",
              to: "/messages",
            },
            {
              icon: <User size={20} />,
              label: "Profile",
              to: "/profile",
            },
            {
              icon: <LogOut size={20} />,
              label: "Logout",
              to: "/logout",
            },
          ].map((item, idx) => (
            <li key={idx}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-md transition-all duration-200 ${
                    isActive
                      ? "bg-blue-500 text-white dark:bg-blue-600 dark:text-white"
                      : "text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-200"
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;