// components/LessonsTab.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  addLesson,
  deleteLesson,
  getAllLesson,
  updateLesson,
} from "../../../service/lessonService";

const LessonsTab = ({ unit }) => {
  // robust unit id detection
  const unitId =
    unit?.unitId ||
    unit?.id ||
    unit?._id ||
    (unit?.unit && (unit.unit._id || unit.unit.id)) ||
    "";

  const [lessons, setLessons] = useState([]);
  const [formMode, setFormMode] = useState(null); // null | "add" | lessonId
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    doc: "",
    lectureLink: "",
    completed: false,
    duration: "",
    order: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [showErrorTooltip, setShowErrorTooltip] = useState(false);

  // fetch and filter lessons by unit on mount / unit change
  useEffect(() => {
    const fetchAndFilter = async () => {
      setIsLoading(true);
      try {
        const res = await getAllLesson();
        // support multiple shapes: res.data, res.data.data, res
        const maybe = res?.data ?? res;
        const arr = Array.isArray(maybe)
          ? maybe
          : Array.isArray(maybe?.data)
          ? maybe.data
          : [];
        if (!unitId) {
          setLessons([]);
        } else {
          const filtered = arr.filter((l) => {
            const lessonUnitId =
              (l.unit && (l.unit._id || l.unit.id)) ||
              l.unit ||
              l.unitId ||
              l.unit?._id;
            return String(lessonUnitId) === String(unitId);
          });
          setLessons(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch lessons:", err);
        showToast("Failed to fetch lessons", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndFilter();
  }, [unitId]);

  // helpers
  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      doc: "",
      lectureLink: "",
      completed: false,
      duration: "",
      order: "",
    });
    setShowErrorTooltip(false);
  };

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  };

  // validation
  const validateForm = () => {
    if (!formData.title?.trim() || !formData.content?.trim()) return false;
    if (formData.duration === "" || Number.isNaN(Number(formData.duration))) return false;
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setShowErrorTooltip(false);
  };

  // ADD lesson
  const handleAddLesson = async () => {
    if (!validateForm()) {
      setShowErrorTooltip(true);
      showToast("Please fill required fields (title, content, duration).", "error");
      return;
    }
    if (!unitId) {
      showToast("Missing unit id. Cannot add lesson.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        unit: unitId,
        content: formData.content.trim(),
        doc: formData.doc?.trim() || "",
        lectureLink: formData.lectureLink?.trim() || "",
        completed: !!formData.completed,
        duration: Number(formData.duration),
        order: formData.order !== "" ? Number(formData.order) : 1,
      };

      const res = await addLesson(payload);
      // Normalize created lesson (support res.data or res)
      const created = res?.data ?? res;
      // Ensure created has unit populated minimally for UI
      if (!created.unit) created.unit = { _id: unitId, title: unit?.title || unit?.name || "" };

      setLessons((prev) => [...prev, created]);
      resetForm();
      setFormMode(null);
      showToast("Lesson added successfully", "success");
    } catch (err) {
      console.error("Error adding lesson:", err);
      showToast("Failed to add lesson. See console for details.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // PREFILL edit form
  const handleEditLesson = (lesson) => {
    const id = lesson._id || lesson.id;
    setFormMode(id);
    setFormData({
      title: lesson.title || "",
      content: lesson.content || "",
      doc: lesson.doc || "",
      lectureLink: lesson.lectureLink || "",
      completed: !!lesson.completed,
      duration: lesson.duration != null ? String(lesson.duration) : "",
      order: lesson.order != null ? String(lesson.order) : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // SAVE edited lesson (calls editLesson)
  const handleSaveLesson = async () => {
    if (!validateForm()) {
      setShowErrorTooltip(true);
      showToast("Please fill required fields (title, content, duration).", "error");
      return;
    }
    if (!formMode) {
      showToast("No lesson selected for update", "error");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        doc: formData.doc?.trim() || "",
        lectureLink: formData.lectureLink?.trim() || "",
        completed: !!formData.completed,
        duration: Number(formData.duration),
        order: formData.order !== "" ? Number(formData.order) : 1,
        unit: unitId,
      };

      // call the update API: editLesson(lessonPayload, lessonId)
      const res = await updateLesson(payload, formMode);
      const saved = res?.data ?? res;

      // Update UI with returned saved object (or merge if minimal response)
      setLessons((prev) =>
        prev.map((l) => {
          const lid = l._id || l.id;
          if (String(lid) === String(formMode)) {
            // Use server-sent saved if available, otherwise merge
            return saved && (saved._id || saved.id)
              ? { ...saved }
              : { ...l, ...payload, _id: lid, id: lid };
          }
          return l;
        })
      );

      setFormMode(null);
      resetForm();
      showToast("Lesson updated", "success");
    } catch (err) {
      console.error("Error updating lesson:", err);
      showToast("Failed to update lesson. See console for details.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // DELETE lesson
  const handleDeleteLesson = async (lessonId) => {
    // lessonId may be _id or id value
    if (!lessonId) return;
    const confirmDel = window.confirm("Are you sure you want to delete this lesson?");
    if (!confirmDel) return;

    setIsLoading(true);
    try {
      await deleteLesson(lessonId);
      // Remove from UI
      setLessons((prev) => prev.filter((l) => (l._id || l.id) !== lessonId));
      // if currently editing this lesson, reset form
      if (formMode && String(formMode) === String(lessonId)) {
        setFormMode(null);
        resetForm();
      }
      showToast("Lesson deleted", "success");
    } catch (err) {
      console.error("Failed to delete lesson:", err);
      showToast("Failed to delete lesson. See console for details.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormMode(null);
    resetForm();
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-neutral-900">
          Lessons for {unit?.title || unit?.name || "Unit"}
        </h3>

        {!formMode && (
          <button
            onClick={() => {
              setFormMode("add");
              resetForm();
            }}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
            aria-label="Add new lesson"
          >
            Add Lesson
          </button>
        )}
      </div>

      {/* Toast */}
      {toast.visible && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-4 right-4 p-3 rounded-lg shadow-md ${
            toast.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Add/Edit Form */}
      {formMode && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h4 className="text-lg font-medium text-neutral-900 mb-4">
            {formMode === "add" ? "Add New Lesson" : "Edit Lesson"}
          </h4>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">Title *</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 p-2"
                placeholder="Lesson title"
                required
                aria-required="true"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700">Content *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 p-2"
                placeholder="Full content or summary of the lesson"
                required
                aria-required="true"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">Document URL</label>
                <input
                  name="doc"
                  value={formData.doc}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 p-2"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">Lecture Link</label>
                <input
                  name="lectureLink"
                  value={formData.lectureLink}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 p-2"
                  placeholder="https://youtu.be/..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">Duration (minutes) *</label>
                <input
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  type="number"
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 p-2"
                  placeholder="e.g., 60"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">Order</label>
                <input
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  type="number"
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 p-2"
                  placeholder="Lesson order (optional)"
                />
              </div>

              <div className="flex items-end">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="completed"
                    checked={formData.completed}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-neutral-700">Completed</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={formMode === "add" ? handleAddLesson : handleSaveLesson}
                disabled={isLoading}
                className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>

              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>

            {showErrorTooltip && <div className="mt-2 text-sm text-red-600">Please fill required fields.</div>}
          </div>
        </div>
      )}

      {/* Lessons Grid */}
      {lessons && lessons.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => {
            const lessonId = lesson._id || lesson.id;
            return (
              <div key={lessonId} className="bg-white p-4 rounded-lg shadow-md">
                <h4 className="text-md font-medium text-neutral-900">{lesson.title}</h4>
                <p className="text-neutral-600 text-sm line-clamp-3">{lesson.content}</p>
                <p className="text-neutral-500 text-xs mt-2">
                  Duration: {lesson.duration ?? "—"} | Order: {lesson.order ?? "—"}
                </p>
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => handleEditLesson(lesson)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    aria-label={`Edit lesson ${lesson.title}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLesson(lessonId)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    aria-label={`Delete lesson ${lesson.title}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-neutral-600 text-sm">No lessons available. Add a lesson to get started.</p>
      )}
    </div>
  );
};

LessonsTab.propTypes = {
  unit: PropTypes.object.isRequired,
};

export default LessonsTab;
