import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { BellIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { getAnnouncementsByCourseId } from "../../service/announcementService";
import { useAppSelector } from "../../redux/store-config/store";

function formatDate(dateString) {
  const options = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
  const date = new Date(dateString);
  return date.toLocaleString(undefined, options);
}

const Institution = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { student } = useAppSelector((state) => state.students);
  const courseId = student?.enrolledCourse?._id;

  // Fetch announcements by course ID on mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!courseId) {
        setError("No course ID available");
        setAnnouncements([]); // Ensure announcements is an array
        setLoading(false);
        return;
      }
      try {
        const response = await getAnnouncementsByCourseId(courseId);
        // Ensure response.data.data is an array, default to empty array if undefined
        setAnnouncements(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch announcements");
        setAnnouncements([]); // Ensure announcements is an array
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [courseId]);

  return (
    <div className="flex min-h-screen bg-neutral-50 text-gray-900">
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Sidebar />
      </aside>

      <main className="flex-1 p-6 sm:p-8 pt-12 ml-0 md:ml-64 max-w-full">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Announcements
              </h2>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                Stay updated with the latest course announcements
              </p>
            </div>

          </div>

          {/* Announcements List */}
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border-2 border-gray-300/60">
                <p className="text-center text-gray-600 text-lg">
                  Loading announcements...
                </p>
              </div>
            ) : error ? (
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border-2 border-gray-300/60">
                <p className="text-center text-red-600 text-lg">{error}</p>
              </div>
            ) : announcements.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border-2 border-gray-300/60">
                <p className="text-center text-gray-600 text-lg">
                  No announcements available
                </p>
              </div>
            ) : (
              announcements.map(({ _id, title, description, date, Instructor, course }) => (
                <motion.div
                  key={_id}
                  className="bg-white/10 backdrop-blur-lg border-2 border-gray-300/50 rounded-lg shadow-sm p-4 flex flex-col hover:shadow-md transition-shadow duration-300"
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                      {title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3 line-clamp-2">
                      {description}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-600">
                      <div className="mb-2 sm:mb-0">
                        <span className="font-medium text-gray-700">
                          Instructor: {Instructor?.name || "Unknown"}
                        </span>
                        <span className="mx-2">•</span>
                        <span>Course: {course?.title || "N/A"}</span>
                      </div>
                      <span>{formatDate(date)}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Institution;