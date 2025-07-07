import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LecSidebar from "./lecsidebar";
import { FiUser, FiLock } from "react-icons/fi";

const Lsettings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Simulated API call (replace with actual API call)
        const mockData = { name: "John Doe", email: "john.doe@university.com" };
        setTimeout(() => {
          setProfile(mockData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to load profile. Please try again.");
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = () => {
    setSuccess("Profile updated successfully!");
    setError(null);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handlePasswordSubmit = () => {
    if (password.new !== password.confirm) {
      setError("New passwords don't match");
      return;
    }
    setSuccess("Password changed successfully!");
    setError(null);
    setPassword({ current: "", new: "", confirm: "" });
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="font-sans min-h-screen bg-neutral-100 flex flex-col md:flex-row">
        <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-10 md:block">
          <LecSidebar onLogout={handleLogout} />
        </div>
        <main className="flex-1 p-4 sm:p-6 md:p-8 md:ml-64 overflow-y-auto">
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen bg-neutral-100 flex flex-col md:flex-row">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-10 md:block">
        <LecSidebar onLogout={handleLogout} />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 md:ml-64 overflow-y-auto">
        {/* Header */}
        <div className="mb-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sm:p-6 rounded-lg shadow-lg">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Account Settings</h2>
          <p className="text-xs sm:text-sm mt-2">Manage your profile and security settings</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
            <FiAlertCircle className="text-lg" />
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
            <FiAlertCircle className="text-lg" />
            {success}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-2 px-4 font-medium text-sm border-b-2 ${activeTab === "profile" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`py-2 px-4 font-medium text-sm border-b-2 ${activeTab === "password" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              Password
            </button>
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Profile Information</h3>
            <p className="text-sm text-gray-600 mb-6">Update your personal details.</p>
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleProfileSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Change Password</h3>
            <p className="text-sm text-gray-600 mb-6">Ensure your account is using a strong password.</p>
            <div className="space-y-6">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  id="current-password"
                  name="current"
                  value={password.current}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  name="new"
                  value={password.new}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  name="confirm"
                  value={password.confirm}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handlePasswordSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Lsettings;