import { useState } from "react";
import { Link } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import { FaSearch } from "react-icons/fa";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white border border-gray-200 rounded-l shadow-md px-1 py-4 fixed left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Top Row: Logo and Search */}
        <div className="flex justify-between items-center w-full">
          {/* Logo */}
          <HashLink smooth to="/#home" className="text-gray-800 text-2xl font-bold ml-4">
            EDUCATE
          </HashLink>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-800" onClick={toggleMobileMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Search Bar - Centered in Navbar */}
        <div className="hidden md:flex justify-center w-full mr-40">
          <div className="flex items-center bg-gray-100 border border-gray-300 text-gray-800 rounded-full px-4 py-2 w-full max-w-md transition duration-200 focus-within:ring-2 focus-within:ring-blue-500 hover:border-blue-400">
            <FaSearch className="text-gray-500 mr-2" />
            <input type="text" placeholder="Search..." className="bg-transparent outline-none placeholder-gray-400 w-full text-sm" />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-10">
          <HashLink smooth to="/#home" className="text-gray-700 hover:text-blue-600">
            Home
          </HashLink>
          {/* Keep Link for Courses */}
          <Link to="/courses" className="text-gray-700 hover:text-blue-600">
            Courses
          </Link>
          <HashLink smooth to="/#about" className="text-gray-700 hover:text-blue-600">
            About
          </HashLink>
          <HashLink smooth to="/#team" className="text-gray-700 hover:text-blue-600">
            Team
          </HashLink>
          <HashLink smooth to="/#blog" className="text-gray-700 hover:text-blue-600">
            Blog
          </HashLink>
          <HashLink smooth to="/#contact" className="text-gray-700 hover:text-blue-600">
            Contact
          </HashLink>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden bg-gray-100 text-gray-800 mt-4 rounded-lg p-4 space-y-2`}>
        <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2">
          <FaSearch className="text-gray-500 mr-2" />
          <input type="text" placeholder="Search..." className="bg-transparent outline-none placeholder-gray-400 w-full text-sm" />
        </div>
        <HashLink smooth to="/#home" onClick={toggleMobileMenu} className="block hover:text-blue-600">
          Home
        </HashLink>
        {/* Keep Link for Courses */}
        <Link to="/courses" onClick={toggleMobileMenu} className="block hover:text-blue-600">
          Courses
        </Link>
        <HashLink smooth to="/#about" onClick={toggleMobileMenu} className="block hover:text-blue-600">
          About
        </HashLink>
        <HashLink smooth to="/#team" onClick={toggleMobileMenu} className="block hover:text-blue-600">
          Team
        </HashLink>
        <HashLink smooth to="/#blog" onClick={toggleMobileMenu} className="block hover:text-blue-600">
          Blog
        </HashLink>
        <HashLink smooth to="/#contact" onClick={toggleMobileMenu} className="block hover:text-blue-600">
          Contact
        </HashLink>
      </div>
    </nav>
  );
};

export default Navbar;
