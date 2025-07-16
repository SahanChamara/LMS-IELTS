import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Register = () => {
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsRegistered(true);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
   

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url('src/images/img2.jpg')` }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-10 z-20"></div>

      {/* Main Content */}
      <main className="relative z-30 flex-grow min-h-screen flex items-center justify-end px-4 lg:px-24 pt-20">
        <div className="w-full max-w-md bg-white border border-gray-200 p-10 rounded-2xl shadow-xl backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p className="text-sm text-gray-500 mb-6">
            Register to get started with your learning journey
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                disabled={isRegistered}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                disabled={isRegistered}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                disabled={isRegistered}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isRegistered}
              className={`w-full py-2 rounded-md font-semibold transition ${
                isRegistered
                  ? "bg-green-500 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isRegistered ? "✅ Registered" : "Register"}
            </button>
          </form>

         
        </div>
      </main>
    </div>
  );
};

export default Register;
