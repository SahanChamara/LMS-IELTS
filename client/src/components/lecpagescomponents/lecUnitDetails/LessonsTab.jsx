import React, { useState, useEffect } from "react";

// Component to manage lessons with a modern admin panel UI
const LessonsTab = ({ unit }) => {
  // State for lessons list (default to unit.lessons or empty array)
  const [lessons, setLessons] = useState(unit.lessons || []);
  // State for form visibility (null = hidden, "add" or lesson ID = visible)
  const [formMode, setFormMode] = useState(null);
  // State for form data (new or edited lesson)
  const [formData, setFormData] = useState({ title: "", description: "", duration: "" });
  // State for loading during save/delete
  const [isLoading, setIsLoading] = useState(false);
  // State for toast notifications (error or success)
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  // State for error tooltip visibility
  const [showErrorTooltip, setShowErrorTooltip] = useState(false);

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setShowErrorTooltip(false); // Hide tooltip on input
  };

  // Handle adding a new lesson
  const handleAddLesson = () => {
    if (!formData.title || !formData.description || !formData.duration) {
      setShowErrorTooltip(true);
      setToast({ message: "All fields are required", type: "error", visible: true });
      return;
    }

    setIsLoading(true);
    const newLesson = {
      id: Date.now(), // Simulate unique ID (replace with backend-generated ID)
      title: formData.title,
      description: formData.description,
      duration: formData.duration,
    };

    const data = new FormData();
    data.append("unitId", unit.id || unit.code);
    data.append("title", newLesson.title);
    data.append("description", newLesson.description);
    data.append("duration", newLesson.duration);

    // Simulate API call
    setTimeout(() => {
      setLessons([...lessons, newLesson]);
      setFormMode(null);
      setIsLoading(false);
      setFormData({ title: "", description: "", duration: "" });
      setToast({ message: "Lesson added successfully", type: "success", visible: true });
    }, 1000);

    // Backend integration: POST /api/lessons
    /*
    fetch("/api/lessons", { method: "POST", body: data })
      .then((response) => response.json())
      .then((data) => {
        setLessons([...lessons, data]);
        setFormMode(null);
        setIsLoading(false);
        setToast({ message: "Lesson added successfully", type: "success", visible: true });
      })
      .catch((error) => {
        console.error("Error adding lesson:", error);
        setToast({ message: "Failed to add lesson", type: "error", visible: true });
        setIsLoading(false);
      });
    */
  };

  // Handle editing an existing lesson
  const handleEditLesson = (lesson) => {
    setFormMode(lesson.id);
    setFormData({
      title: lesson.title,
      description: lesson.description,
      duration: lesson.duration,
    });
  };

  // Handle saving an edited lesson
  const handleSaveLesson = () => {
    if (!formData.title || !formData.description || !formData.duration) {
      setShowErrorTooltip(true);
      setToast({ message: "All fields are required", type: "error", visible: true });
      return;
    }

    setIsLoading(true);
    const updatedLesson = {
      id: formMode,
      title: formData.title,
      description: formData.description,
      duration: formData.duration,
    };

    const data = new FormData();
    data.append("unitId", unit.id || unit.code);
    data.append("title", updatedLesson.title);
    data.append("description", updatedLesson.description);
    data.append("duration", updatedLesson.duration);

    // Simulate API call
    setTimeout(() => {
      setLessons(lessons.map((l) => (l.id === formMode ? updatedLesson : l)));
      setFormMode(null);
      setIsLoading(false);
      setFormData({ title: "", description: "", duration: "" });
      setToast({ message: "Lesson updated successfully", type: "success", visible: true });
    }, 1000);

    // Backend integration: PUT /api/lessons/:id
    /*
    fetch(`/api/lessons/${formMode}`, { method: "PUT", body: data })
      .then((response) => response.json())
      .then((data) => {
        setLessons(lessons.map((l) => (l.id === formMode ? data : l)));
        setFormMode(null);
        setIsLoading(false);
        setToast({ message: "Lesson updated successfully", type: "success", visible: true });
      })
      .catch((error) => {
        console.error("Error updating lesson:", error);
        setToast({ message: "Failed to update lesson", type: "error", visible: true });
        setIsLoading(false);
      });
    */
  };

  // Handle deleting a lesson
  const handleDeleteLesson = (lessonId) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLessons(lessons.filter((l) => l.id !== lessonId));
      setIsLoading(false);
      setToast({ message: "Lesson deleted successfully", type: "success", visible: true });
    }, 1000);

    // Backend integration: DELETE /api/lessons/:id
    /*
    fetch(`/api/lessons/${lessonId}`, { method: "DELETE" })
      .then((response) => response.json())
      .then(() => {
        setLessons(lessons.filter((l) => l.id !== lessonId));
        setIsLoading(false);
        setToast({ message: "Lesson deleted successfully", type: "success", visible: true });
      })
      .catch((error) => {
        console.error("Error deleting lesson:", error);
        setToast({ message: "Failed to delete lesson", type: "error", visible: true });
        setIsLoading(false);
      });
    */
  };

  // Handle cancel for add/edit form
  const handleCancel = () => {
    setFormMode(null);
    setFormData({ title: "", description: "", duration: "" });
    setShowErrorTooltip(false);
  };

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  return (
    <div className="bg-gray-50 p-6 rounded-lg w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-neutral-900">
          Lessons for {unit.title || "Unit"}
        </h3>
        {!formMode && (
          <button
            onClick={() => setFormMode("add")}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 text-sm font-medium ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
            aria-label="Add new lesson"
          >
            Add Lesson
          </button>
        )}
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div
          role="alert"
          aria-live="polite"
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
            toast.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-600"
          } animate-fade-in-out`}
        >
          {toast.message}
        </div>
      )}

      {/* Add/Edit Lesson Form */}
      {formMode && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 transition-all duration-300 ease-in-out">
          <h4 className="text-lg font-medium text-neutral-900 mb-4">
            {formMode === "add" ? "Add New Lesson" : "Edit Lesson"}
          </h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-neutral-700">
                Lesson Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400"
                placeholder="e.g., Introduction to React"
                aria-label="Lesson Title"
                tabIndex={0}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400"
                placeholder="e.g., Learn the basics of React components"
                aria-label="Lesson Description"
                tabIndex={0}
              />
            </div>
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400"
                placeholder="e.g., 1 Hour"
                aria-label="Lesson Duration"
                tabIndex={0}
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={formMode === "add" ? handleAddLesson : handleSaveLesson}
                className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-200 text-sm font-medium ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
                aria-label={formMode === "add" ? "Save new lesson" : "Save lesson changes"}
                tabIndex={0}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 hover:scale-105 transition-all duration-200 text-sm font-medium"
                disabled={isLoading}
                aria-label="Cancel"
                tabIndex={0}
              >
                Cancel
              </button>
            </div>
          </div>
          {showErrorTooltip && (
            <div className="mt-2 text-red-600 text-xs italic">Please fill all fields</div>
          )}
        </div>
      )}

      {/* Lessons Grid */}
      {lessons.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <h4 className="text-md font-medium text-neutral-900">{lesson.title}</h4>
              <p className="text-neutral-600 text-sm line-clamp-2">{lesson.description}</p>
              <p className="text-neutral-500 text-xs mt-1">Duration: {lesson.duration}</p>
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => handleEditLesson(lesson)}
                  className={`px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 text-sm ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                  aria-label={`Edit lesson ${lesson.title}`}
                  tabIndex={0}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteLesson(lesson.id)}
                  className={`px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:scale-105 transition-all duration-200 text-sm ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                  aria-label={`Delete lesson ${lesson.title}`}
                  tabIndex={0}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-neutral-600 text-sm">No lessons available. Add a lesson to get started.</p>
      )}

      {/* Placeholder for Pagination/Load More */}
      {lessons.length > 6 && (
        <div className="mt-6 text-center">
          <button
            className="px-4 py-2 bg-gray-200 text-neutral-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm"
            disabled
          >
            Load More
          </button>
          {/* Backend integration: Add pagination logic with API call (e.g., /api/lessons?page=2) */}
        </div>
      )}
    </div>
  );
};

export default LessonsTab;