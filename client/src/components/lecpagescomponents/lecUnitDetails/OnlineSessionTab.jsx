import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import Datetime from "react-datetime";
import moment from "moment";
import "react-datetime/css/react-datetime.css";
import { createOnlineSession, getOnlineSessionsByUnitId } from "../../../service/onlineSessionService";

const OnlineSessionTab = ({ unit }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // IDs
  const tableId = location.state?.tableId || unit?.tableId || unit?.id || "";
  const unitId = unit?.unitId || unit?.id || "";
  const storedUser = localStorage.getItem("user") || "{}";
  const instructorName = localStorage.getItem("userName") || storedUser?.name || "";
  const instructorId = storedUser|| storedUser?.id || "";

  // Toast
  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  // Form Data
  const [formData, setFormData] = useState({
    title: "",
    dateTime: null,
    zoomLink: "",
    instructor: instructorName || "",
    description: "",
  });

  // Sessions
  const [sessions, setSessions] = useState([]);

  // Fetch Sessions by Unit
  const fetchSessions = async () => {
    try {
      if (!unitId) return;
      const response = await getOnlineSessionsByUnitId(unitId);
      setSessions(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [unitId]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Date Change
  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, dateTime: date }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.dateTime ||
      !formData.instructor.trim() ||
      !formData.description.trim()
    ) {
      setToast({
        message: "All fields except Zoom link are required",
        type: "error",
        visible: true,
      });
      return;
    }

    try {
      // Convert moment/Date to ISO date for backend
      const isoDate = moment(formData.dateTime).toISOString();

      const onlineSession = {
        unit: unitId,
        instructor: instructorId,
        title: formData.title,
        date: isoDate, // ✅ Send ISO format date
        link: formData.zoomLink || "https://zoom.us/",
        description: formData.description,
      };

      const res = await createOnlineSession(onlineSession);
      setToast({
        message: "Online session created successfully",
        type: "success",
        visible: true,
      });

      setFormData({
        title: "",
        dateTime: null,
        zoomLink: "",
        instructor: instructorName,
        description: "",
      });

      await fetchSessions();
      console.log("Created Session:", res);
    } catch (error) {
      console.error("Create session failed:", error);
      setToast({
        message: "Failed to create online session",
        type: "error",
        visible: true,
      });
    }
  };

  // Auto-hide Toast
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const closeToast = () => setToast((prev) => ({ ...prev, visible: false }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">
          Online Session Update {tableId && `(Table ID: ${tableId})`}
        </h1>
        <button
          onClick={() =>
            navigate(`/unit/lecture/${tableId || unit?.id || "default"}`, { state: { tableId } })
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Lectures
        </button>
      </div>

      {/* Toast */}
      {toast.visible && (
        <div
          role="alert"
          aria-live="polite"
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center justify-between max-w-md ${
            toast.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}
        >
          <span className="text-sm">{toast.message}</span>
          <button onClick={closeToast} className="ml-4 hover:text-black focus:outline-none">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-lg font-semibold mb-2">Session Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter session title"
            />
          </div>

          {/* DateTime Picker */}
          <div>
            <label className="block text-lg font-semibold mb-2">Date & Time</label>
            <Datetime
              value={formData.dateTime}
              onChange={handleDateChange}
              dateFormat="YYYY-MM-DD"
              timeFormat="hh:mm A"
              inputProps={{
                placeholder: "Select date and time",
                className: "w-full p-3 border border-gray-300 rounded-lg cursor-pointer",
              }}
            />
          </div>

          {/* Zoom Link */}
          <div>
            <label className="block text-lg font-semibold mb-2">Zoom Link</label>
            <input
              type="url"
              name="zoomLink"
              value={formData.zoomLink}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter Zoom link (optional)"
            />
          </div>

          {/* Instructor */}
          <div>
            <label className="block text-lg font-semibold mb-2">Instructor</label>
            <input
              type="text"
              name="instructor"
              value={formData.instructor}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-lg font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg"
              placeholder="Enter session description"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Update
            </button>
          </div>
        </form>
      </div>

      {/* Display Created Sessions */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-neutral-900">Created Online Sessions</h2>
        {sessions.length === 0 ? (
          <p className="text-gray-600">No sessions created yet for this unit.</p>
        ) : (
          <ul className="space-y-4">
            {sessions.map((session) => (
              <li key={session._id} className="p-4 border border-gray-200 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg">{session.title}</h3>
                <p className="text-sm text-gray-600">
                  📅 {moment(session.date).format("YYYY-MM-DD | hh:mm A")}
                </p>
                <p className="text-sm text-gray-600">👨‍🏫 {session.instructor?.name || "Instructor"}</p>
                {session.link && (
                  <a
                    href={session.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Join Zoom
                  </a>
                )}
                <p className="text-sm text-gray-700 mt-2">{session.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OnlineSessionTab;