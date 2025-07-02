import React, { useState } from "react";

// Component to display and edit unit details in an admin panel style
const OverviewTab = ({ unit }) => {
  // State for edit mode (true = editing, false = viewing)
  const [isEditing, setIsEditing] = useState(false);
  // State for unit details, with defaults if undefined
  const [formData, setFormData] = useState({
    code: unit.code || "CS101",
    credits: unit.credits || 4.25,
    duration: unit.duration || "8 Weeks",
    description: unit.description || "Learn the fundamentals of React including components, state, and props. Build your first React application in this comprehensive introductory unit.",
    instructorName: unit.instructor?.name || "Sahan",
    profileImage: unit.instructor?.profileImage || null,
  });
  // State for selected image file (for upload)
  const [selectedFile, setSelectedFile] = useState(null);
  // State for loading during save (simulated)
  const [isSaving, setIsSaving] = useState(false);
  // State for error messages
  const [error, setError] = useState(null);

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file selection and create a preview URL
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      // Validate image type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file (e.g., PNG, JPEG)");
        return;
      }
      setError(null);
      setSelectedFile(file);
      setFormData((prev) => ({ ...prev, profileImage: URL.createObjectURL(file) }));
    }
  };

  // Handle edit button click to enter edit mode
  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  // Handle cancel button click to revert changes
  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSelectedFile(null);
    // Revert to original unit data
    setFormData({
      code: unit.code || "CS101",
      credits: unit.credits || 4.25,
      duration: unit.duration || "8 Weeks",
      description: unit.description || "Learn the fundamentals of React including components, state, and props. Build your first React application in this comprehensive introductory unit.",
      instructorName: unit.instructor?.name || "Sahan",
      profileImage: unit.instructor?.profileImage || null,
    });
  };

  // Handle form submission for saving changes
  const handleSave = () => {
    // Validate required fields
    if (!formData.code || !formData.credits || !formData.duration || !formData.description || !formData.instructorName) {
      setError("All fields are required");
      return;
    }
    if (isNaN(formData.credits) || formData.credits <= 0) {
      setError("Credits must be a positive number");
      return;
    }

    setIsSaving(true);
    setError(null);

    // Prepare data for backend
    const data = new FormData();
    data.append("code", formData.code);
    data.append("credits", formData.credits);
    data.append("duration", formData.duration);
    data.append("description", formData.description);
    data.append("instructorName", formData.instructorName);
    if (selectedFile) {
      data.append("profileImage", selectedFile);
    }

      // Placeholder for backend API call
      // Example: POST /api/unit/update
      // /*
      fetch("/api/unit/update", {
        method: "POST",
        body: data,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Unit updated:", data);
          setIsEditing(false);
          setIsSaving(false);
          // Update unit object with new data if needed
          unit.code = data.code;
          unit.credits = data.credits;
          unit.duration = data.duration;
          unit.description = data.description;
          unit.instructor = { name: data.instructorName, profileImage: data.profileImage };
        })
        .catch((error) => {
          console.error("Error updating unit:", error);
          setError("Failed to save changes. Please try again.");
          setIsSaving(false);
        });
     

    // Simulate API call with a delay
    setTimeout(() => {
      console.log("Saving:", Object.fromEntries(data));
      setIsEditing(false);
      setIsSaving(false);
    }, 1000);

    // Backend integration note:
    // - Send `FormData` to  API endpoint (e.g., /api/unit/update).
    // - Include authentication headers (e.g., JWT) for admin access.
    // - Expect response with updated unit data (code, credits, duration, description, instructor).
    // - Handle errors (e.g., invalid image, duplicate course code) with user feedback.
    // - Update the `unit` prop in the parent component if necessary.
  };

  return (
    <div className="space-y-6">
     

      {/* Unit Details */}
      <div className="bg-gray-50 p-4 rounded-lg w-full">
        <h3 className="text-lg font-semibold text-neutral-700 mb-4">Unit Details</h3>
        {isEditing ? (
          <div className="space-y-4">
            {/* Course Code */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-neutral-700">
                Course Code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                value={formData.code}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 text-neutral-600"
                placeholder="e.g., CS101"
                aria-label="Course Code"
              />
            </div>
            {/* Credits */}
            <div>
              <label htmlFor="credits" className="block text-sm font-medium text-neutral-700">
                Credits
              </label>
              <input
                id="credits"
                name="credits"
                type="number"
                step="0.01"
                value={formData.credits}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 text-neutral-600"
                placeholder="e.g., 4.25"
                aria-label="Credits"
              />
            </div>
            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-neutral-700">
                Duration
              </label>
              <input
                id="duration"
                name="duration"
                type="text"
                value={formData.duration}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 text-neutral-600"
                placeholder="e.g., 8 Weeks"
                aria-label="Duration"
              />
            </div>
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
                Unit Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 text-neutral-600"
                placeholder="Enter unit description"
                aria-label="Unit Description"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-neutral-600">
              <span>Code: {formData.code}</span>
              <div className="flex space-x-4">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {formData.credits} Credits
                </span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {formData.duration}
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-neutral-700">Description</h4>
              <p className="text-neutral-600">{formData.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Instructor Section */}
      <div className="bg-gray-50 p-4 rounded-lg w-full">
        <h3 className="text-lg font-semibold text-neutral-700 mb-4">Instructor</h3>
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
              {/* Profile Image */}
              <div>
                <label htmlFor="profileImage" className="block text-sm font-medium text-neutral-700">
                  Profile Image
                </label>
                <div className="flex items-center space-x-4">
                  {formData.profileImage ? (
                    <img
                      src={formData.profileImage}
                      alt="Instructor profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-neutral-600 text-lg">
                      {formData.instructorName.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <input
                    id="profileImage"
                    name="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 text-sm text-neutral-600"
                    aria-label="Upload profile image"
                  />
                </div>
              </div>
              {/* Instructor Name */}
              <div className="flex-1">
                <label htmlFor="instructorName" className="block text-sm font-medium text-neutral-700">
                  Full Name
                </label>
                <input
                  id="instructorName"
                  name="instructorName"
                  type="text"
                  value={formData.instructorName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 text-neutral-600"
                  placeholder="e.g., Sahan Wijetunga"
                  aria-label="Instructor Full Name"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            {formData.profileImage ? (
              <img
                src={formData.profileImage}
                alt="Instructor profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-neutral-600">
                {formData.instructorName.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="text-neutral-600">{formData.instructorName}</span>
          </div>
        )}
      </div>
       {/* Edit/Save Controls */}
      <div className="flex justify-end">
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            disabled={isSaving}
          >
            Edit Details
          </button>
        ) : (
          <div className="flex space-x-4">
            <button
              onClick={handleSave}
              className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium ${
                isSaving ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default OverviewTab;