import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Card, { CardContent } from "../components/Card";

const Settings = () => {
  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "1234 Elm Street, Springfield, USA",
  });

  // Image upload state
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Preferences State
  const [preferences, setPreferences] = useState({
    language: "English",
    notifications: true,
    theme: "dark",
  });

  // Security State
  const [security, setSecurity] = useState({
    password: "********",
    twoFactorAuth: true,
    lastPasswordChange: "2025-04-01",
  });

  // Handlers for personal info inputs
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Cancel image selection
  const handleCancelImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Simulate image upload
  const handleUpload = () => {
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }
    alert(`Uploading ${selectedImage.name}...`);
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Handlers for preferences and security forms
  const handlePreferencesChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecurity((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle personal info form submit
  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault();
    alert("Personal Information saved!");
  };

  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-800">
      {/* Sidebar - Hidden on small screens */}
      <aside className="fixed top-0 left-0 z-10 w-64 h-full hidden md:block">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 pt-10 md:ml-64  overflow-auto">
        <Card>
          <div className="space-y-6 md:space-y-10  rounded-xl md:rounded-2xl border border-gray-300 p-4 md:p-6 shadow-sm mx-auto">
            {/* Header */}
            <header className="mb-2 md:mb-4 px-2 ">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                Settings
              </h1>
              <p className="text-gray-600 text-xs md:text-sm">
                Manage your account settings below.
              </p>
            </header>

            {/* Personal Information */}
            <Card
              variant="institution"
              className="p-4 md:p-6 h-auto min-h-[500px] lg:min-h-[600px]"
            >
              <div className="flex flex-col lg:flex-row gap-4 md:gap-8 h-full">
                {/* Left: Personal Info Form */}
                <div className="flex-1 h-full">
                  <h2 className="mb-4 md:mb-6 text-lg md:text-xl font-semibold text-gray-900">
                    Personal Information
                  </h2>
                  <form onSubmit={handlePersonalInfoSubmit} className="h-full">
                    <div className="space-y-3 md:space-y-5 h-full flex flex-col">
                      <div className="flex-1">
                        {[
                          {
                            label: "Name",
                            name: "name",
                            type: "text",
                            value: personalInfo.name,
                          },
                          {
                            label: "Email",
                            name: "email",
                            type: "email",
                            value: personalInfo.email,
                          },
                          {
                            label: "Phone",
                            name: "phone",
                            type: "tel",
                            value: personalInfo.phone,
                          },
                          {
                            label: "Address",
                            name: "address",
                            type: "text",
                            value: personalInfo.address,
                          },
                        ].map(({ label, name, type, value }) => (
                          <label key={name} className="block mb-3 md:mb-5">
                            <span className="text-xs md:text-sm font-medium text-gray-700">
                              {label}
                            </span>
                            <input
                              type={type}
                              name={name}
                              value={value}
                              onChange={handlePersonalChange}
                              className="mt-1 block w-full rounded-md border border-gray-300 px-2 h-10 md:h-12 md:px-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              placeholder={`Enter your ${label.toLowerCase()}`}
                            />
                          </label>
                        ))}
                      </div>

                      {/* Save / Cancel buttons */}
                      <div className="flex space-x-2 md:space-x-3 pt-2 md:pt-4">
                        <button
                          type="submit"
                          className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => alert("Cancelled")}
                          className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Right: Image Upload Card */}
                <div className="w-full lg:w-72 xl:w-80 mt-4 lg:mt-0 h-full">
                  <div className="rounded-lg border border-gray-300 bg-white p-3 md:p-4 shadow-sm h-full flex flex-col">
                    <h2 className="mb-3 md:mb-4 text-lg md:text-xl font-semibold text-gray-900">
                      Profile Picture
                    </h2>
                    <div className="flex-1 flex flex-col items-center justify-between">
                      <div className="w-full aspect-square max-w-[400px] rounded-md border border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden mb-3 md:mb-4">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs md:text-sm">
                            No image selected
                          </span>
                        )}
                      </div>
                      <div className="w-full">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="block w-full text-xs md:text-sm text-gray-700
                border border-gray-300 rounded-md p-1 md:p-2
                cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <div className="flex space-x-2 md:space-x-3 w-full mt-3 md:mt-4">
                          <button
                            type="button"
                            onClick={handleUpload}
                            className="flex-1 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                          >
                            Upload
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelImage}
                            className="flex-1 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Preferences */}
            <Card variant="institution" className="p-4 md:p-6">
              <h2 className="mb-3 md:mb-5 text-lg md:text-xl font-semibold text-gray-900">
                Preferences
              </h2>
              <CardContent>
                <form className="space-y-3 md:space-y-5 max-w-md">
                  <label className="block">
                    <span className="text-xs md:text-sm font-medium text-gray-700">
                      Language
                    </span>
                    <select
                      name="language"
                      value={preferences.language}
                      onChange={handlePreferencesChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 md:px-3 md:py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </label>

                  <label className="flex items-center space-x-2 md:space-x-3">
                    <input
                      type="checkbox"
                      name="notifications"
                      checked={preferences.notifications}
                      onChange={handlePreferencesChange}
                      className="h-3 w-3 md:h-4 md:w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs md:text-sm text-gray-700">
                      Enable Notifications
                    </span>
                  </label>

                  <label className="block">
                    <span className="text-xs md:text-sm font-medium text-gray-700">
                      Theme
                    </span>
                    <select
                      name="theme"
                      value={preferences.theme}
                      onChange={handlePreferencesChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 md:px-3 md:py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="light">Light Mode</option>
                      <option value="dark">Dark Mode</option>
                    </select>
                  </label>
                </form>
              </CardContent>
            </Card>

            {/* Security & Password */}
            <Card variant="institution" className="p-4 md:p-6">
              <h2 className="mb-3 md:mb-5 text-lg md:text-xl font-semibold text-gray-900">
                Security & Password
              </h2>
              <CardContent>
                <form className="space-y-3 md:space-y-5 max-w-md">
                  <label className="block">
                    <span className="text-xs md:text-sm font-medium text-gray-700">
                      Password
                    </span>
                    <input
                      type="password"
                      name="password"
                      value={security.password}
                      onChange={handleSecurityChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 md:px-3 md:py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Enter new password"
                    />
                  </label>

                  <label className="flex items-center space-x-2 md:space-x-3">
                    <input
                      type="checkbox"
                      name="twoFactorAuth"
                      checked={security.twoFactorAuth}
                      onChange={handleSecurityChange}
                      className="h-3 w-3 md:h-4 md:w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs md:text-sm text-gray-700">
                      Enable Two-Factor Authentication
                    </span>
                  </label>

                  <p className="text-xs md:text-sm text-gray-600">
                    <strong>Last Password Change:</strong>{" "}
                    {security.lastPasswordChange}
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Settings;
