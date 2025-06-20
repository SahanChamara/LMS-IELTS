import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-900 py-10 mx-1 mt-1">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Column 1 - About */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-gray-900">About</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-gray-600 transition">Our Story</a></li>
            <li><a href="#" className="hover:text-gray-600 transition">Team</a></li>
            <li><a href="#" className="hover:text-gray-600 transition">Careers</a></li>
          </ul>
        </div>

        {/* Column 2 - Courses */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-gray-900">Courses</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-gray-600 transition">All Courses</a></li>
            <li><a href="#" className="hover:text-gray-600 transition">Popular Courses</a></li>
            <li><a href="#" className="hover:text-gray-600 transition">Categories</a></li>
          </ul>
        </div>

        {/* Column 3 - Support */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-gray-900">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-gray-600 transition">Help Center</a></li>
            <li><a href="#" className="hover:text-gray-600 transition">Contact Us</a></li>
            <li><a href="#" className="hover:text-gray-600 transition">Terms of Service</a></li>
          </ul>
        </div>

        {/* Column 4 - Social + Newsletter */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-gray-900">Follow Us</h4>
          <div className="flex space-x-4 text-lg mb-6">
            <a href="#" className="bg-white text-blue-600 hover:bg-blue-600 hover:text-white p-2 rounded-full transition shadow">
              <FaFacebookF />
            </a>
            <a href="#" className="bg-white text-sky-400 hover:bg-sky-400 hover:text-white p-2 rounded-full transition shadow">
              <FaTwitter />
            </a>
            <a href="#" className="bg-white text-blue-800 hover:bg-blue-800 hover:text-white p-2 rounded-full transition shadow">
              <FaLinkedin />
            </a>
            <a href="#" className="bg-white text-pink-600 hover:bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 hover:text-white p-2 rounded-full transition shadow">
              <FaInstagram />
            </a>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-900">Our Newsletter</h4>
            <p className="text-sm mb-3 text-gray-500">Enter your email to receive updates and special offers.</p>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                Submit
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">By clicking “Subscribe”, you agree to our <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.</p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className=" pt-2 text-center text-sm text-gray-500 space-y-1">
        <div>&copy; 2025 Learning Management System. All rights reserved.</div>
        <div className="space-x-4">
          <a href="#" className="hover:text-gray-700">Terms & Conditions</a>
          <a href="#" className="hover:text-gray-700">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
