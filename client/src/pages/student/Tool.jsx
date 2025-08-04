import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/Sidebar";
import Card, { CardContent } from "../../components/Card";
import { ArrowLeft } from "lucide-react";
import { getStudentById, updateStudent } from "../../service/profileService";
import { uploadFileToS3 } from "../../service/s3/s3Service";

const Settings = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch student data on mount
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const studentId = localStorage.getItem("user");
        if (!studentId) {
          throw new Error("No student ID found in local storage");
        }

        const response = await getStudentById(studentId);
        if (!response.success) {
          throw new Error(response.message || "Failed to fetch student data");
        }

        setStudent(response.data);
        setImagePreview(response.data.profile.photo || null);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching student data:", err);
        toast.error(err.message, {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/login");
      }
    };

    fetchStudent();
  }, [navigate]);

  // Handlers for personal info inputs
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    if (["phone", "country", "city", "DOB"].includes(name)) {
      setStudent((prev) => ({
        ...prev,
        profile: { ...prev.profile, [name]: value },
      }));
    } else {
      setStudent((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle image file selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Cancel image selection
  const handleCancelImage = () => {
    setSelectedImage(null);
    setImageUrl(null);
    setImagePreview(student?.profile.photo || null);
  };

  // Handle image upload to S3
  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const url = await uploadFileToS3(selectedImage, setIsUploading, setImagePreview);
      if (url) {
        setImageUrl(url);
        setSelectedImage(null);
        toast.success("Image uploaded to S3 successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error(`Error uploading image: ${err.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Handlers for preferences
  const handlePreferencesChange = (e) => {
    const { name = "language", value } = e.target;
    setStudent((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        preferences: {
          ...prev.profile.preferences,
          [name]: value,
        },
      },
    }));
  };

  // Handle personal info form submission
  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      const studentId = localStorage.getItem("user");
      if (!studentId) {
        throw new Error("Not authenticated. Please log in.");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(student.email)) {
        toast.error("Invalid email format", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // Validate DOB format
      if (student.profile.DOB && !/^\d{4}-\d{2}-\d{2}$/.test(student.profile.DOB)) {
        toast.error("Invalid DOB format (YYYY-MM-DD)", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const updateData = {
        name: student.name,
        email: student.email,
        profile: {
          phone: student.profile.phone || undefined,
          country: student.profile.country,
          city: student.profile.city,
          DOB: student.profile.DOB,
          ...(imageUrl && { photo: imageUrl }), // Include imageUrl if available
        },
      };

      const response = await updateStudent(studentId, updateData);
      if (response.success) {
        setStudent(response.data);
        setImageUrl(null); // Clear imageUrl after successful save
        setImagePreview(response.data.profile.photo || null);
        toast.success("Personal Information saved!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        throw new Error(response.message || "Failed to update student data");
      }
    } catch (err) {
      toast.error(`Error saving personal information: ${err.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading student details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-800">
      {/* Sidebar - Hidden on small screens */}
      <aside className="fixed top-0 left-0 z-10 w-64 h-full hidden md:block">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 pt-10 md:ml-64 overflow-auto">
        <Card>
          <div className="space-y-6 md:space-y-10 rounded-xl md:rounded-2xl border border-gray-300 p-4 md:p-6 shadow-sm mx-auto">
            {/* Header */}
            <header className="mb-2 md:mb-4 px-2 relative">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                Settings
              </h1>
              <p className="text-gray-600 text-xs md:text-sm">
                Manage your account settings below.
              </p>
              <button
                onClick={() => navigate("/profile")}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-blue-100 transition"
                aria-label="Back to Profile"
                title="Back to Profile"
              >
                <ArrowLeft size={25} />
              </button>
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
                            value: student.name,
                          },
                          {
                            label: "Email",
                            name: "email",
                            type: "email",
                            value: student.email,
                          },
                          {
                            label: "Phone",
                            name: "phone",
                            type: "tel",
                            value: student.profile.phone || "",
                          },
                          {
                            label: "Country",
                            name: "country",
                            type: "text",
                            value: student.profile.country,
                          },
                          {
                            label: "City",
                            name: "city",
                            type: "text",
                            value: student.profile.city,
                          },
                          {
                            label: "Date of Birth",
                            name: "DOB",
                            type: "text",
                            value: student.profile.DOB,
                            placeholder: "YYYY-MM-DD",
                          },
                        ].map(({ label, name, type, value, placeholder }) => (
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
                              placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
                            />
                          </label>
                        ))}
                      </div>

                      {/* Save / Cancel buttons */}
                      <div className="flex space-x-2 md:space-x-3 pt-2 md:pt-4">
                        <button
                          type="submit"
                          disabled={isUploading}
                          className={`px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm rounded-md transition ${
                            isUploading
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-indigo-600 text-white hover:bg-indigo-700"
                          }`}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setImageUrl(null);
                            setSelectedImage(null);
                            setImagePreview(student?.profile.photo || null);
                            toast.info("Changes discarded", {
                              position: "top-right",
                              autoClose: 3000,
                            });
                            navigate("/profile");
                          }}
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
                          disabled={isUploading}
                          className="block w-full text-xs md:text-sm text-gray-700 border border-gray-300 rounded-md p-1 md:p-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <div className="flex space-x-2 md:space-x-3 w-full mt-3 md:mt-4">
                          <button
                            type="button"
                            onClick={handleUpload}
                            disabled={isUploading || !selectedImage}
                            className={`flex-1 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm rounded-md transition ${
                              isUploading || !selectedImage
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}
                          >
                            {isUploading ? "Uploading..." : "Upload"}
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelImage}
                            disabled={isUploading}
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

          </div>
        </Card>
      </main>
      <ToastContainer />
    </div>
  );
};

export default Settings;