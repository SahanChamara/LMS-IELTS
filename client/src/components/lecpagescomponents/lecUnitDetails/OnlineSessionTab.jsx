import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X } from "lucide-react";

const OnlineSessionTab = ({ unit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  // Retrieve tableId from navigation state or unit prop
  const tableId = location.state?.tableId || unit?.tableId || unit?.id || "";

  // Initial form state with provided data
  const [formData, setFormData] = useState({
    title: unit?.title || "Introduction to React",
    dateTime: unit?.dateTime || "2025-07-01 | 03:30 PM",
    zoomLink: unit?.zoomLink || "",
    instructor: unit?.instructor || "Sahan",
    description: unit?.description || "Learn the fundamentals of React including components, state, and props. Build your first React application in this comprehensive introductory unit.",
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.dateTime.trim() || !formData.instructor.trim() || !formData.description.trim()) {
      setToast({
        message: "All fields except Zoom link are required",
        type: "error",
        visible: true,
      });
      return;
    }

    const submission = {
      id: Date.now(),
      tableId,
      ...formData,
      timestamp: new Date().toISOString(),
    };

    setToast({
      message: "Session details updated successfully",
      type: "success",
      visible: true,
    });
    console.log("Submitted:", submission);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Auto-hide toast
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const closeToast = () => setToast((prev) => ({ ...prev, visible: false }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">
          Online Session Update {tableId && `(Table ID: ${tableId})`}
        </h1>
        <button
          onClick={() => navigate(`/unit/lecture/${tableId || unit?.id || "default"}`, { state: { tableId } })}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm font-semibold"
          aria-label="Back to Lectures"
        >
          Back to Lectures
        </button>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div
          role="alert"
          aria-live="polite"
          className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg bg-green-100 text-green-800 flex items-center justify-between max-w-md"
        >
          <span className="text-sm">{toast.message}</span>
          <button
            onClick={closeToast}
            className="ml-4 text-green-600 hover:text-green-800 focus:outline-none"
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Update Form */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-lg font-semibold text-neutral-900 mb-2">
              Session Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 text-neutral-900 placeholder-neutral-400 text-base"
              placeholder="Enter session title"
              aria-label="Session title"
              required
            />
          </div>

          <div>
            <label htmlFor="dateTime" className="block text-lg font-semibold text-neutral-900 mb-2">
              Date & Time
            </label>
            <input
              type="text"
              id="dateTime"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 text-neutral-900 placeholder-neutral-400 text-base"
              placeholder="Enter date and time (e.g., 2025-07-01 | 03:30 PM)"
              aria-label="Date and time"
              required
            />
          </div>

          <div>
            <label htmlFor="zoomLink" className="block text-lg font-semibold text-neutral-900 mb-2">
              Zoom Link
            </label>
            <input
              type="url"
              id="zoomLink"
              name="zoomLink"
              value={formData.zoomLink}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 text-neutral-900 placeholder-neutral-400 text-base"
              placeholder="Enter Zoom link (optional)"
              aria-label="Zoom link"
            />
          </div>

          <div>
            <label htmlFor="instructor" className="block text-lg font-semibold text-neutral-900 mb-2">
              Instructor
            </label>
            <input
              type="text"
              id="instructor"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 text-neutral-900 placeholder-neutral-400 text-base"
              placeholder="Enter instructor name"
              aria-label="Instructor name"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-lg font-semibold text-neutral-900 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 text-neutral-900 placeholder-neutral-400 text-base resize-vertical"
              placeholder="Enter session description"
              aria-label="Session description"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              aria-label="Submit session update"
            >
              Submit Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnlineSessionTab;