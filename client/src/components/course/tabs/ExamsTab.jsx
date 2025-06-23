import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { getExamsByUnitId } from "../../../service/examService";

const ExamsTab = ({unitId }) => {
  const [exams, setExams] = useState([]);
  const [expandedExamId, setExpandedExamId] = useState(null);
  const [editingExam, setEditingExam] = useState(null);
  const [isAddingExam, setIsAddingExam] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    date: "",
    description: "",
    time: "",
    location: "",
    duration: "",
    lessons: ["Lesson 1", "Lesson 2", "Lesson 3"],
  });
  const [daysRemaining, setDaysRemaining] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch exams by unitId
  useEffect(() => {
    if (!unitId) {
      setLoading(false);
      setError("Unit ID is required");
      return;
    }

    const fetchExams = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedExams = await getExamsByUnitId(unitId);
        setExams(fetchedExams);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [unitId]);

  // Calculate days remaining for each exam
  useEffect(() => {
    const calculateDaysRemaining = () => {
      const newDaysRemaining = {};
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      exams.forEach((exam) => {
        const examDate = new Date(exam.date);
        examDate.setHours(0, 0, 0, 0);
        const diffTime = examDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        newDaysRemaining[exam.id] = diffDays > 0 ? diffDays : 0;
      });

      setDaysRemaining(newDaysRemaining);
    };

    calculateDaysRemaining();
    const interval = setInterval(calculateDaysRemaining, 86400000);
    return () => clearInterval(interval);
  }, [exams]);

  const toggleExamDetails = (examId) => {
    setExpandedExamId(expandedExamId === examId ? null : examId);
  };

  const handleEditClick = (exam) => {
    setEditingExam(exam.id);
    setEditFormData({
      title: exam.title,
      date: exam.date,
      description: exam.description,
      time: exam.time,
      location: exam.location,
      duration: exam.duration,
      lessons: exam.lessons,
    });
  };

  const handleAddClick = () => {
    setIsAddingExam(true);
    setEditFormData({
      title: "",
      date: "",
      description: "",
      time: "",
      location: "",
      duration: "",
      lessons: ["Lesson 1", "Lesson 2", "Lesson 3"],
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleLessonChange = (index, value) => {
    const newLessons = [...editFormData.lessons];
    newLessons[index] = value;
    setEditFormData({
      ...editFormData,
      lessons: newLessons,
    });
  };

  const addLessonField = () => {
    setEditFormData({
      ...editFormData,
      lessons: [...editFormData.lessons, ""],
    });
  };

  const removeLessonField = (index) => {
    const newLessons = editFormData.lessons.filter((_, i) => i !== index);
    setEditFormData({
      ...editFormData,
      lessons: newLessons,
    });
  };

  const handleEditSubmit = (examId) => {
    const updatedExams = exams.map((exam) =>
      exam.id === examId ? { ...exam, ...editFormData } : exam
    );
    setExams(updatedExams);
    setEditingExam(null);
  };

  const handleAddSubmit = () => {
    const newExam = {
      id: exams.length > 0 ? Math.max(...exams.map((exam) => exam.id)) + 1 : 1,
      ...editFormData,
    };
    setExams([...exams, newExam]);
    setIsAddingExam(false);
  };

  const handleCancelEdit = () => {
    setEditingExam(null);
  };

  const handleCancelAdd = () => {
    setIsAddingExam(false);
  };

  const getDaysRemainingText = (days) => {
    if (days === 0) return "Today is the exam day!";
    if (days === 1) return "1 day remaining";
    return `${days} days remaining`;
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-gray-700 text-center"
      >
        Loading exams...
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-600 text-center"
      >
        {error}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >


      <div className="space-y-4">
        {/* Add Exam Form */}
        {isAddingExam && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-gray-300/50 bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg"
          >
            <h3 className="font-medium text-gray-900 mb-4">Add New Exam</h3>
            <div className="grid gap-4">
              <div>
                <label className="text-sm text-gray-600">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditFormChange}
                  className="w-full p-2 border-2 border-gray-300/30 rounded-md bg-white/20 backdrop-blur-sm"
                  placeholder="Exam title"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={editFormData.date}
                    onChange={handleEditFormChange}
                    className="w-full p-2 border-2 border-gray-300/30 rounded-md bg-white/20 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Time</label>
                  <input
                    type="text"
                    name="time"
                    value={editFormData.time}
                    onChange={handleEditFormChange}
                    className="w-full p-2 border-2 border-gray-300/30 rounded-md bg-white/20 backdrop-blur-sm"
                    placeholder="e.g. 09:00 AM - 11:00 AM"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Description</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                  className="w-full p-2 border-2 border-gray-300/30 rounded-md bg-white/20 backdrop-blur-sm"
                  placeholder="Exam description"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={editFormData.location}
                    onChange={handleEditFormChange}
                    className="w-full p-2 border-2 border-gray-300/30 rounded-md bg-white/20 backdrop-blur-sm"
                    placeholder="Exam location"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={editFormData.duration}
                    onChange={handleEditFormChange}
                    className="w-full p-2 border-2 border-gray-300/30 rounded-md bg-white/20 backdrop-blur-sm"
                    placeholder="e.g. 2 hours"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Covered Lessons</label>
                <div className="space-y-2 mt-2">
                  {editFormData.lessons.map((lesson, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={lesson}
                        onChange={(e) => handleLessonChange(index, e.target.value)}
                        className="flex-1 p-2 border-2 border-gray-300/30 rounded-md bg-white/20 backdrop-blur-sm"
                        placeholder={`Lesson ${index + 1}`}
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeLessonField(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                        type="button"
                      >
                        ×
                      </motion.button>
                    </div>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={addLessonField}
                    className="text-sm text-blue-600 hover:text-blue-800"
                    type="button"
                  >
                    + Add another lesson
                  </motion.button>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancelAdd}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 border border-gray-300/50"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 border border-blue-600/50"
              >
                Add Exam
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Exams List */}
        {exams.map((exam) => (
          <motion.div
            key={exam.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border-2 border-gray-300/50 bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg"
          >
            {editingExam === exam.id ? (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 mb-4">Edit Exam</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border-2 border-gray-300/30 rounded-md bg-white/20 backdrop-blur-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-600">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={editFormData.date}
                        onChange={handleEditFormChange}
                        className="w-full p-2 border-2 border-gray-300/30 rounded-md bg-white/20 backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Time</label>
                      <input
                        type="text"
                        name="time"
                        value={editFormData.time}
                        onChange={handleEditFormChange}
                        className="w-full p-2 border-2 border-gray-300/30 rounded-md bg-white/20 backdrop-blur-sm"
                        placeholder="e.g. 09:00 AM - 11:00 AM"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Description</label>
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border-2 border-gray-300/30 rounded-md bg-white/20 backdrop-blur-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-600">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={editFormData.location}
                        onChange={handleEditFormChange}
                        className="w-full p-2 border-2 border-gray-300/30 rounded-md bg-white/20 backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Duration</label>
                      <input
                        type="text"
                        name="duration"
                        value={editFormData.duration}
                        onChange={handleEditFormChange}
                        className="w-full p-2 border-2 border-gray-300/30 rounded-md bg-white/20 backdrop-blur-sm"
                        placeholder="e.g. 2 hours"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Covered Lessons</label>
                    <div className="space-y-2 mt-2">
                      {editFormData.lessons.map((lesson, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={lesson}
                            onChange={(e) => handleLessonChange(index, e.target.value)}
                            className="flex-1 p-2 border-2 border-gray-300/30 rounded-md bg-white/20 backdrop-blur-sm"
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeLessonField(index)}
                            className="p-2 text-red-500 hover:text-red-700"
                            type="button"
                          >
                            ×
                          </motion.button>
                        </div>
                      ))}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={addLessonField}
                        className="text-sm text-blue-600 hover:text-blue-800"
                        type="button"
                      >
                        + Add another lesson
                      </motion.button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 border border-gray-300/50"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEditSubmit(exam.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 border border-blue-600/50"
                  >
                    Save
                  </motion.button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{exam.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">Date: {exam.date}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      daysRemaining[exam.id] <= 7
                        ? "bg-red-100/80 text-red-800 border border-red-200/50"
                        : "bg-blue-100/80 text-blue-800 border border-blue-200/50"
                    } backdrop-blur-sm`}
                  >
                    {getDaysRemainingText(daysRemaining[exam.id] || 0)}
                  </span>
                </div>

                {expandedExamId === exam.id ? (
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Covered Lessons:</h4>
                      <ul className="text-sm text-gray-600 pl-5 list-disc">
                        {exam.lessons.map((lesson, index) => (
                          <li key={index}>{lesson}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Exam Details:</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Time: {exam.time}</p>
                        <p>Location: {exam.location}</p>
                        <p>Duration: {exam.duration}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-3">{exam.description}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleExamDetails(exam.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 border border-blue-600/50"
                    >
                      Study Guide
                    </motion.button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

ExamsTab.propTypes = {
  isLecturer: PropTypes.bool,
  unitId: PropTypes.string.isRequired,
};

export default ExamsTab;