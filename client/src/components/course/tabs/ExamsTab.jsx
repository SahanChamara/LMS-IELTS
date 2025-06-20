import React, { useState, useEffect } from "react";

const ExamsTab = ({ isLecturer = false }) => {
  // Sample exam data with future dates
  const sampleExams = [
    {
      id: 1,
      title: "Midterm Exam",
      date: "2025-10-15", // Future date
      description: "Exam will cover all materials from weeks 1-6",
      lessons: ["Introduction to React", "State Management", "React Hooks"],
      time: "09:00 AM - 11:00 AM",
      location: "Main Hall A",
      duration: "2 hours"
    },
    {
      id: 2,
      title: "Final Exam",
      date: "2025-12-30", // Future date
      description: "Comprehensive final examination",
      lessons: ["Advanced React", "Performance Optimization", "Testing"],
      time: "01:00 PM - 04:00 PM",
      location: "Building B - Room 203",
      duration: "3 hours"
    }
  ];

  const [expandedExamId, setExpandedExamId] = useState(null);
  const [exams, setExams] = useState(sampleExams);
  const [editingExam, setEditingExam] = useState(null);
  const [isAddingExam, setIsAddingExam] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    date: "",
    description: "",
    time: "",
    location: "",
    duration: "",
    lessons: ["Lesson 1", "Lesson 2", "Lesson 3"] // Default lessons
  });
  const [daysRemaining, setDaysRemaining] = useState({});

  // Calculate days remaining for each exam
  useEffect(() => {
    const calculateDaysRemaining = () => {
      const newDaysRemaining = {};
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      exams.forEach(exam => {
        const examDate = new Date(exam.date);
        examDate.setHours(0, 0, 0, 0);
        const diffTime = examDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        newDaysRemaining[exam.id] = diffDays > 0 ? diffDays : 0;
      });

      setDaysRemaining(newDaysRemaining);
    };

    calculateDaysRemaining();
    // Update the countdown every day (86400000 ms = 1 day)
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
      lessons: exam.lessons
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
      lessons: ["Lesson 1", "Lesson 2", "Lesson 3"]
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleLessonChange = (index, value) => {
    const newLessons = [...editFormData.lessons];
    newLessons[index] = value;
    setEditFormData({
      ...editFormData,
      lessons: newLessons
    });
  };

  const addLessonField = () => {
    setEditFormData({
      ...editFormData,
      lessons: [...editFormData.lessons, ""]
    });
  };

  const removeLessonField = (index) => {
    const newLessons = editFormData.lessons.filter((_, i) => i !== index);
    setEditFormData({
      ...editFormData,
      lessons: newLessons
    });
  };

  const handleEditSubmit = (examId) => {
    const updatedExams = exams.map(exam => {
      if (exam.id === examId) {
        return { 
          ...exam,
          ...editFormData
        };
      }
      return exam;
    });

    setExams(updatedExams);
    setEditingExam(null);
  };

  const handleAddSubmit = () => {
    const newExam = {
      id: exams.length > 0 ? Math.max(...exams.map(exam => exam.id)) + 1 : 1,
      ...editFormData
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Exams</h2>
        {isLecturer && !isAddingExam && (
          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
          >
            Add New Exam
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Add Exam Form */}
        {isAddingExam && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-2">Add New Exam</h3>
            <div className="grid gap-3">
              <div>
                <label className="text-sm text-gray-600">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Exam title"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm text-gray-600">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={editFormData.date}
                    onChange={handleEditFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Time</label>
                  <input
                    type="text"
                    name="time"
                    value={editFormData.time}
                    onChange={handleEditFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
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
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Exam description"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm text-gray-600">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={editFormData.location}
                    onChange={handleEditFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
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
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. 2 hours"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Covered Lessons</label>
                <div className="space-y-2">
                  {editFormData.lessons.map((lesson, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={lesson}
                        onChange={(e) => handleLessonChange(index, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                        placeholder={`Lesson ${index + 1}`}
                      />
                      <button
                        onClick={() => removeLessonField(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addLessonField}
                    className="text-sm text-blue-600 hover:text-blue-800"
                    type="button"
                  >
                    + Add another lesson
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleCancelAdd}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubmit}
                className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
              >
                Add Exam
              </button>
            </div>
          </div>
        )}

        {/* Exams List */}
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            {editingExam === exam.id ? (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 mb-2">Edit Exam</h3>
                <div className="grid gap-2">
                  <div>
                    <label className="text-sm text-gray-600">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm text-gray-600">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={editFormData.date}
                        onChange={handleEditFormChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Time</label>
                      <input
                        type="text"
                        name="time"
                        value={editFormData.time}
                        onChange={handleEditFormChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
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
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm text-gray-600">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={editFormData.location}
                        onChange={handleEditFormChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Duration</label>
                      <input
                        type="text"
                        name="duration"
                        value={editFormData.duration}
                        onChange={handleEditFormChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g. 2 hours"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Covered Lessons</label>
                    <div className="space-y-2">
                      {editFormData.lessons.map((lesson, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={lesson}
                            onChange={(e) => handleLessonChange(index, e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-md"
                          />
                          <button
                            onClick={() => removeLessonField(index)}
                            className="p-2 text-red-500 hover:text-red-700"
                            type="button"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addLessonField}
                        className="text-sm text-blue-600 hover:text-blue-800"
                        type="button"
                      >
                        + Add another lesson
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleEditSubmit(exam.id)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{exam.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Date: {exam.date}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    daysRemaining[exam.id] <= 7 
                      ? "bg-red-100 text-red-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {getDaysRemainingText(daysRemaining[exam.id] || 0)}
                  </span>
                </div>

                {expandedExamId === exam.id ? (
                  <div className="mt-4">
                    {/* Lessons List Section */}
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-1">Covered Lessons:</h4>
                      <ul className="text-sm text-gray-600 pl-5 list-disc">
                        {exam.lessons.map((lesson, index) => (
                          <li key={index}>{lesson}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Exam Schedule Section */}
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-1">Exam Details:</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Time: {exam.time}</p>
                        <p>Location: {exam.location}</p>
                        <p>Duration: {exam.duration}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center">
                      {isLecturer && (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleEditClick(exam)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                          >
                            Edit Exam
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => toggleExamDetails(exam.id)}
                        className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300"
                      >
                        Hide Details
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      {exam.description}
                    </p>
                    <button
                      onClick={() => toggleExamDetails(exam.id)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                    >
                      Study Guide
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamsTab;