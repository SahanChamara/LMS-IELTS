import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Component to manage quizzes with a table-based lecturer interface
const QuizzesTab = ({ unit }) => {
  // State for quizzes list (default to unit.quizzes or empty array)
  const [quizzes, setQuizzes] = useState(unit.quizzes || []);
  // State for form visibility and mode (null = hidden, "add" or quiz ID = visible)
  const [formMode, setFormMode] = useState(null);
  // State for form data including quiz details and current question page
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    passingScore: "",
    dueDate: "",
    totalMarks: "",
    caMarksPercentage: "",
    timePeriod: "",
    questionCount: "",
    questions: [{ text: "", options: ["", "", "", ""], correctOption: 0, marks: "" }],
    marksMode: "separate", // "total" or "separate" for marks distribution
  });
  // State for student selection
  const [selectedStudents, setSelectedStudents] = useState([]);
  // State for table sorting, filtering, and pagination
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const quizzesPerPage = 5; // Adjust as needed
  // State for question pagination
  const [questionPage, setQuestionPage] = useState(1);
  // State for loading and toast notifications
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const [showErrorTooltip, setShowErrorTooltip] = useState(false);
  // State for live preview modal visibility
  const [showLivePreview, setShowLivePreview] = useState(false);
  const navigate = useNavigate();

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };
      if (name === "questionCount" && value !== "") {
        const count = parseInt(value);
        if (!isNaN(count) && count > 0) {
          updatedFormData.questions = Array.from({ length: count }, (_, i) => ({
            text: prev.questions[i]?.text || "",
            options: prev.questions[i]?.options || ["", "", "", ""],
            correctOption: prev.questions[i]?.correctOption || 0,
            marks: prev.questions[i]?.marks || "",
          }));
          setQuestionPage(1); // Reset to first question page
        }
      } else if (name === "totalMarks" && value !== "") {
        // Recalculate marks if totalMarks changes
        const total = parseInt(value) || 0;
        updatedFormData.questions = updatedFormData.questions.map((q, i) => ({
          ...q,
          marks: formData.marksMode === "total" && i === 0 ? total : q.marks,
        }));
      }
      return updatedFormData;
    });
    setShowErrorTooltip(false);
  };

  // Handle question field changes
  const handleQuestionChange = (field, value, index = null) => {
    const newQuestions = [...formData.questions];
    const currentQ = newQuestions[questionPage - 1];
    if (field === "options") {
      const newOptions = [...currentQ.options];
      newOptions[index] = value;
      currentQ.options = newOptions;
    } else if (field === "correctOption") {
      currentQ.correctOption = value;
    } else if (field === "marks") {
      currentQ.marks = value;
      if (formData.marksMode === "total" && questionPage === 1) {
        // Distribute total marks to all questions if in total mode
        const total = parseInt(value) || 0;
        newQuestions.forEach((q, i) => {
          if (i > 0) q.marks = (total / formData.questionCount).toFixed(2);
        });
      }
    } else {
      currentQ[field] = value;
    }
    setFormData((prev) => ({ ...prev, questions: newQuestions }));
    setShowErrorTooltip(false);
  };

  // Handle marks mode change
  const handleMarksModeChange = (e) => {
    const mode = e.target.value;
    setFormData((prev) => {
      const updatedFormData = { ...prev, marksMode: mode };
      if (mode === "total" && prev.totalMarks && questionPage === 1) {
        const total = parseInt(prev.totalMarks) || 0;
        updatedFormData.questions = updatedFormData.questions.map((q, i) => ({
          ...q,
          marks: i === 0 ? total : (total / prev.questionCount).toFixed(2),
        }));
      } else if (mode === "separate") {
        updatedFormData.questions = updatedFormData.questions.map((q) => ({
          ...q,
          marks: q.marks || "",
        }));
      }
      return updatedFormData;
    });
  };

  // Handle student selection
  const handleSelectAllStudents = () => {
    setSelectedStudents(["Student1", "Student2", "Student3"]); // Simulated
  };
  const handleSearchStudent = (e) => {
    const searchTerm = e.target.value;
    setSelectedStudents([`Student_${searchTerm}`]); // Simulated
  };

  // Handle adding a new quiz (API simulation)
  const handleAddQuiz = async () => {
    if (!formData.title || !formData.instructions || !formData.passingScore || !formData.dueDate ||
        !formData.totalMarks || !formData.caMarksPercentage || !formData.timePeriod ||
        !formData.questionCount || formData.questions.some(q => !q.text || q.options.some(o => !o) || !q.marks)) {
      setShowErrorTooltip(true);
      setToast({ message: "All fields and questions are required", type: "error", visible: true });
      return;
    }
    if (isNaN(formData.passingScore) || formData.passingScore < 0 || formData.passingScore > 100 ||
        isNaN(formData.totalMarks) || formData.totalMarks <= 0 ||
        isNaN(formData.caMarksPercentage) || formData.caMarksPercentage < 0 || formData.caMarksPercentage > 100) {
      setShowErrorTooltip(true);
      setToast({ message: "Invalid numerical values", type: "error", visible: true });
      return;
    }

    setIsLoading(true);
    const newQuiz = {
      id: Date.now(),
      ...formData,
      passingScore: Number(formData.passingScore),
      totalMarks: Number(formData.totalMarks),
      caMarksPercentage: Number(formData.caMarksPercentage),
      questionCount: Number(formData.questionCount),
      questions: formData.questions.map(q => ({
        ...q,
        correctOption: Number(q.correctOption),
        marks: Number(q.marks),
      })),
      answeredStudents: Math.floor(Math.random() * 20), // Simulated data
    };

    try {
      // Simulate API call to add quiz
      const response = await fetch("/api/quizzes", {
        method: "POST",
        body: JSON.stringify(newQuiz),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to add quiz");
      const savedQuiz = await response.json();
      setQuizzes([...quizzes, savedQuiz]);
      setFormMode(null);
      setIsLoading(false);
      setFormData({
        title: "",
        description: "",
        instructions: "",
        passingScore: "",
        dueDate: "",
        totalMarks: "",
        caMarksPercentage: "",
        timePeriod: "",
        questionCount: "",
        questions: [{ text: "", options: ["", "", "", ""], correctOption: 0, marks: "" }],
        marksMode: "separate",
      });
      setSelectedStudents([]);
      setToast({ message: "Quiz added successfully", type: "success", visible: true });
    } catch (error) {
      setIsLoading(false);
      setToast({ message: "Error adding quiz", type: "error", visible: true });
    }
  };

  // Handle editing an existing quiz (API simulation)
  const handleEditQuiz = (quiz) => {
    setFormMode(quiz.id);
    setFormData({
      ...quiz,
      questions: quiz.questions || [{ text: "", options: ["", "", "", ""], correctOption: 0, marks: "" }],
    });
    setQuestionPage(1); // Reset to first question page
  };

  // Handle saving an edited quiz (API simulation)
  const handleSaveQuiz = async () => {
    if (!formData.title || !formData.instructions || !formData.passingScore || !formData.dueDate ||
        !formData.totalMarks || !formData.caMarksPercentage || !formData.timePeriod ||
        !formData.questionCount || formData.questions.some(q => !q.text || q.options.some(o => !o) || !q.marks)) {
      setShowErrorTooltip(true);
      setToast({ message: "All fields and questions are required", type: "error", visible: true });
      return;
    }
    if (isNaN(formData.passingScore) || formData.passingScore < 0 || formData.passingScore > 100 ||
        isNaN(formData.totalMarks) || formData.totalMarks <= 0 ||
        isNaN(formData.caMarksPercentage) || formData.caMarksPercentage < 0 || formData.caMarksPercentage > 100) {
      setShowErrorTooltip(true);
      setToast({ message: "Invalid numerical values", type: "error", visible: true });
      return;
    }

    setIsLoading(true);
    const updatedQuiz = {
      id: formMode,
      ...formData,
      passingScore: Number(formData.passingScore),
      totalMarks: Number(formData.totalMarks),
      caMarksPercentage: Number(formData.caMarksPercentage),
      questionCount: Number(formData.questionCount),
      questions: formData.questions.map(q => ({
        ...q,
        correctOption: Number(q.correctOption),
        marks: Number(q.marks),
      })),
      answeredStudents: formData.answeredStudents || Math.floor(Math.random() * 20), // Simulated data
    };

    try {
      // Simulate API call to update quiz
      const response = await fetch(`/api/quizzes/${formMode}`, {
        method: "PUT",
        body: JSON.stringify(updatedQuiz),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update quiz");
      const savedQuiz = await response.json();
      setQuizzes(quizzes.map((q) => (q.id === formMode ? savedQuiz : q)));
      setFormMode(null);
      setIsLoading(false);
      setFormData({
        title: "",
        description: "",
        instructions: "",
        passingScore: "",
        dueDate: "",
        totalMarks: "",
        caMarksPercentage: "",
        timePeriod: "",
        questionCount: "",
        questions: [{ text: "", options: ["", "", "", ""], correctOption: 0, marks: "" }],
        marksMode: "separate",
      });
      setSelectedStudents([]);
      setToast({ message: "Quiz updated successfully", type: "success", visible: true });
    } catch (error) {
      setIsLoading(false);
      setToast({ message: "Error updating quiz", type: "error", visible: true });
    }
  };

  // Handle deleting a quiz (API simulation)
  const handleDeleteQuiz = async (quizId) => {
    setIsLoading(true);
    try {
      // Simulate API call to delete quiz
      const response = await fetch(`/api/quizzes/${quizId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete quiz");
      setQuizzes(quizzes.filter((q) => q.id !== quizId));
      setIsLoading(false);
      setToast({ message: "Quiz deleted successfully", type: "success", visible: true });
    } catch (error) {
      setIsLoading(false);
      setToast({ message: "Error deleting quiz", type: "error", visible: true });
    }
  };

  // Handle cancel for add/edit form
  const handleCancel = () => {
    setFormMode(null);
    setFormData({
      title: "",
      description: "",
      instructions: "",
      passingScore: "",
      dueDate: "",
      totalMarks: "",
      caMarksPercentage: "",
      timePeriod: "",
      questionCount: "",
      questions: [{ text: "", options: ["", "", "", ""], correctOption: 0, marks: "" }],
      marksMode: "separate",
    });
    setSelectedStudents([]);
    setShowErrorTooltip(false);
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    const sortedQuizzes = [...quizzes].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setQuizzes(sortedQuizzes);
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredQuizzes = (unit.quizzes || []).filter(quiz =>
      quiz.title.toLowerCase().includes(term)
    );
    setQuizzes(filteredQuizzes);
    setCurrentPage(1); // Reset to first page on search
  };

  // Navigate to StudentAllHistory page
  const handleViewHistory = (quizId) => {
    navigate(`/student-history/${quizId}`);
  };

  // Question pagination logic
  const totalQuestionPages = formData.questionCount ? parseInt(formData.questionCount) : 1;
  const currentQuestion = formData.questions[questionPage - 1] || {
    text: "",
    options: ["", "", "", ""],
    correctOption: 0,
    marks: "",
  };

  const handleQuestionPageChange = (page) => {
    setQuestionPage(page);
  };

  const handleNextQuestionPage = () => {
    if (questionPage < totalQuestionPages) setQuestionPage(questionPage + 1);
  };

  const handlePreviousQuestionPage = () => {
    if (questionPage > 1) setQuestionPage(questionPage - 1);
  };

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  // Calculate total marks dynamically
  const calculateTotalMarks = () => {
    return formData.questions.reduce((sum, q) => sum + (parseInt(q.marks) || 0), 0);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-neutral-900">
          Quizzes for {unit.title || "Unit"}
        </h3>
        {!formMode && (
          <button
            onClick={() => setFormMode("add")}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 text-sm font-medium ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
            aria-label="Add new quiz"
          >
            Add Quiz
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

      {/* Add/Edit Quiz Form within Full-Width Card */}
      {formMode && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 transition-all duration-300 ease-in-out max-w-7xl mx-auto w-full">
          <h4 className="text-lg font-medium text-neutral-900 mb-4">
            {formMode === "add" ? "Add New Quiz" : "Edit Quiz"}
          </h4>
          <div className="space-y-6">
            {/* Quiz Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
                  Quiz Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2"
                  placeholder="e.g., What is Node.js"
                  aria-label="Quiz Title"
                  tabIndex={0}
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2"
                  placeholder="e.g., Test your Node.js knowledge"
                  aria-label="Quiz Description"
                  tabIndex={0}
                />
              </div>
              <div>
                <label htmlFor="instructions" className="block text-sm font-medium text-neutral-700 mb-1">
                  Instructions
                </label>
                <textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2"
                  placeholder="e.g., You can't go back after submitting"
                  aria-label="Quiz Instructions"
                  tabIndex={0}
                />
              </div>
              <div>
                <label htmlFor="passingScore" className="block text-sm font-medium text-neutral-700 mb-1">
                  Passing Score (%)
                </label>
                <input
                  id="passingScore"
                  name="passingScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.passingScore}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2"
                  placeholder="e.g., 75"
                  aria-label="Passing Score"
                  tabIndex={0}
                />
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-700 mb-1">
                  Due Date
                </label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 p-2"
                  aria-label="Due Date"
                  tabIndex={0}
                />
              </div>
              <div>
                <label htmlFor="totalMarks" className="block text-sm font-medium text-neutral-700 mb-1">
                  Total Marks
                </label>
                <input
                  id="totalMarks"
                  name="totalMarks"
                  type="number"
                  min="0"
                  value={formData.totalMarks}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2"
                  placeholder="e.g., 100"
                  aria-label="Total Marks"
                  tabIndex={0}
                />
              </div>
              <div>
                <label htmlFor="caMarksPercentage" className="block text-sm font-medium text-neutral-700 mb-1">
                  CA Marks Percentage (%)
                </label>
                <input
                  id="caMarksPercentage"
                  name="caMarksPercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.caMarksPercentage}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2"
                  placeholder="e.g., 20"
                  aria-label="CA Marks Percentage"
                  tabIndex={0}
                />
              </div>
              <div>
                <label htmlFor="timePeriod" className="block text-sm font-medium text-neutral-700 mb-1">
                  Time Period
                </label>
                <input
                  id="timePeriod"
                  name="timePeriod"
                  type="text"
                  value={formData.timePeriod}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2"
                  placeholder="e.g., 30 minutes"
                  aria-label="Time Period"
                  tabIndex={0}
                />
              </div>
              <div>
                <label htmlFor="questionCount" className="block text-sm font-medium text-neutral-700 mb-1">
                  Question Count
                </label>
                <input
                  id="questionCount"
                  name="questionCount"
                  type="number"
                  min="1"
                  value={formData.questionCount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2"
                  placeholder="e.g., 5"
                  aria-label="Question Count"
                  tabIndex={0}
                />
              </div>
            </div>

            {/* Question Edit Section */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <h5 className="text-md font-medium text-neutral-900 mb-4">Question {questionPage} Details</h5>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="questionText" className="block text-sm font-medium text-neutral-700 mb-1">
                    Question Text
                  </label>
                  <textarea
                    id="questionText"
                    name="text"
                    value={currentQuestion.text}
                    onChange={(e) => handleQuestionChange("text", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2"
                    placeholder="e.g., What is GitHub used for?"
                    aria-label={`Question ${questionPage} text`}
                    tabIndex={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Options</label>
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="radio"
                        name={`correctOption-${questionPage}`}
                        checked={currentQuestion.correctOption === index}
                        onChange={() => handleQuestionChange("correctOption", index)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        aria-label={`Select option ${index + 1} as correct answer`}
                        tabIndex={0}
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleQuestionChange("options", e.target.value, index)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2"
                        placeholder={`Option ${index + 1}`}
                        aria-label={`Option ${index + 1} text`}
                        tabIndex={0}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label htmlFor="correctAnswer" className="block text-sm font-medium text-neutral-700 mb-1">
                    Correct Answer
                  </label>
                  <input
                    id="correctAnswer"
                    type="text"
                    value={currentQuestion.options[currentQuestion.correctOption] || ""}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm text-neutral-900 p-2"
                    aria-label={`Correct answer for question ${questionPage}`}
                    tabIndex={0}
                  />
                </div>
                <div>
                  <label htmlFor="questionMarks" className="block text-sm font-medium text-neutral-700 mb-1">
                    Marks
                  </label>
                  <input
                    id="questionMarks"
                    type="number"
                    min="0"
                    max={formData.marksMode === "separate" ? formData.totalMarks : undefined}
                    value={currentQuestion.marks}
                    onChange={(e) => handleQuestionChange("marks", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2"
                    placeholder="e.g., 20"
                    aria-label={`Question ${questionPage} marks`}
                    tabIndex={0}
                  />
                </div>
              </div>
              {/* Question Pagination */}
              {formData.questionCount && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                  <button
                    onClick={handlePreviousQuestionPage}
                    disabled={questionPage === 1}
                    className="px-3 py-1 bg-gray-200 text-neutral-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous question"
                    tabIndex={0}
                  >
                    Back
                  </button>
                  {Array.from({ length: totalQuestionPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handleQuestionPageChange(page)}
                      className={`px-3 py-1 rounded-lg transition-all duration-200 text-sm ${
                        questionPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-neutral-700 hover:bg-gray-300"
                      }`}
                      aria-label={`Question page ${page}`}
                      aria-current={questionPage === page ? "page" : undefined}
                      tabIndex={0}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={handleNextQuestionPage}
                    disabled={questionPage === totalQuestionPages}
                    className="px-3 py-1 bg-gray-200 text-neutral-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next question"
                    tabIndex={0}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* Marks Mode Selection */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <label htmlFor="marksMode" className="block text-sm font-medium text-neutral-700 mb-1">
                Marks Distribution
              </label>
              <select
                id="marksMode"
                name="marksMode"
                value={formData.marksMode}
                onChange={handleMarksModeChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 p-2"
                aria-label="Select marks distribution mode"
                tabIndex={0}
              >
                <option value="separate">Separate marks per question</option>
                <option value="total">Total marks for all questions</option>
              </select>
              <p className="text-sm text-neutral-600 mt-2">
                Maximum Marks Limit: {formData.totalMarks || 0} (Total marks across all questions)
              </p>
              <p className="text-sm text-neutral-600">
                Current Total Marks: {calculateTotalMarks()}
              </p>
            </div>

            {/* Live Preview Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowLivePreview(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 hover:scale-105 transition-all duration-200 text-sm font-medium"
                disabled={isLoading || !formData.questionCount}
                aria-label="Show live preview"
                tabIndex={0}
              >
                Live Preview
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={formMode === "add" ? handleAddQuiz : handleSaveQuiz}
                className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-200 text-sm font-medium ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
                aria-label={formMode === "add" ? "Save new quiz" : "Save quiz changes"}
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
            {showErrorTooltip && (
              <div className="mt-2 text-red-600 text-xs italic">Please fill all fields correctly</div>
            )}
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {showLivePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h4 className="text-lg font-medium text-neutral-900 mb-4">Live Preview</h4>
            <div className="space-y-4">
              {formData.questions.map((q, idx) => (
                idx + 1 === questionPage && (
                  <div key={idx}>
                    <p className="text-base text-neutral-900 mb-2"><strong>Question {idx + 1}:</strong> {q.text || "N/A"}</p>
                    {q.options.map((option, i) => (
                      <label key={i} className="flex items-center space-x-2 mb-2">
                        <input
                          type="radio"
                          name={`preview-${idx}`}
                          checked={q.correctOption === i}
                          disabled
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-base text-neutral-600">{option || "N/A"}</span>
                      </label>
                    ))}
                    <p className="text-base text-neutral-600"><strong>Marks:</strong> {q.marks || "N/A"}</p>
                  </div>
                )
              ))}
              {/* Pagination inside modal */}
              {totalQuestionPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-4">
                  <button
                    onClick={handlePreviousQuestionPage}
                    disabled={questionPage === 1}
                    className="px-3 py-1 bg-gray-200 text-neutral-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous question"
                    tabIndex={0}
                  >
                    Back
                  </button>
                  {Array.from({ length: totalQuestionPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handleQuestionPageChange(page)}
                      className={`px-3 py-1 rounded-lg transition-all duration-200 text-sm ${
                        questionPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-neutral-700 hover:bg-gray-300"
                      }`}
                      aria-label={`Question page ${page}`}
                      aria-current={questionPage === page ? "page" : undefined}
                      tabIndex={0}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={handleNextQuestionPage}
                    disabled={questionPage === totalQuestionPages}
                    className="px-3 py-1 bg-gray-200 text-neutral-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next question"
                    tabIndex={0}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowLivePreview(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 hover:scale-105 transition-all duration-200 text-sm font-medium"
                aria-label="Close live preview"
                tabIndex={0}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quizzes Table */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by title..."
          className="p-2 border rounded-md w-full md:w-1/3 mb-4 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400"
          aria-label="Search quizzes"
          tabIndex={0}
        />
      </div>
      {quizzes.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th
                  className="py-3 px-4 text-center text-sm font-medium text-neutral-700 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("title")}
                  aria-label="Sort by title"
                  tabIndex={0}
                >
                  Title {sortConfig.key === "title" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th
                  className="py-3 px-4 text-center text-sm font-medium text-neutral-700 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("dueDate")}
                  aria-label="Sort by due date"
                  tabIndex={0}
                >
                  Due Date {sortConfig.key === "dueDate" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th
                  className="py-3 px-4 text-center text-sm font-medium text-neutral-700 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("passingScore")}
                  aria-label="Sort by passing score"
                  tabIndex={0}
                >
                  Pass Score (%) {sortConfig.key === "passingScore" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th
                  className="py-3 px-4 text-center text-sm font-medium text-neutral-700 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("totalMarks")}
                  aria-label="Sort by total marks"
                  tabIndex={0}
                >
                  Total Marks {sortConfig.key === "totalMarks" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th
                  className="py-3 px-4 text-center text-sm font-medium text-neutral-700 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("answeredStudents")}
                  aria-label="Sort by answered students"
                  tabIndex={0}
                >
                  Answered Students {sortConfig.key === "answeredStudents" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th className="py-3 px-4 text-center text-sm font-medium text-neutral-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.slice((currentPage - 1) * quizzesPerPage, currentPage * quizzesPerPage).map((quiz) => (
                <tr
                  key={quiz.id}
                  className="border-t hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="py-3 px-4 text-center text-sm text-neutral-900">{quiz.title}</td>
                  <td className="py-3 px-4 text-center text-sm text-neutral-600">{quiz.dueDate}</td>
                  <td className="py-3 px-4 text-center text-sm text-neutral-600">{quiz.passingScore}%</td>
                  <td className="py-3 px-4 text-center text-sm text-neutral-600">{quiz.totalMarks}</td>
                  <td className="py-3 px-4 text-center text-sm text-neutral-600 flex items-center justify-center">
                    {quiz.answeredStudents}
                    <button
                      onClick={() => handleViewHistory(quiz.id)}
                      className="ml-2 text-green-600 hover:bg-green-100 rounded-full p-1 focus:outline-none transition-all duration-200"
                      aria-label={`View history for quiz ${quiz.title}`}
                      tabIndex={0}
                    >
                      👤
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center text-sm">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEditQuiz(quiz)}
                        className={`px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 text-sm ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isLoading}
                        aria-label={`Edit quiz ${quiz.title}`}
                        tabIndex={0}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className={`px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:scale-105 transition-all duration-200 text-sm ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isLoading}
                        aria-label={`Delete quiz ${quiz.title}`}
                        tabIndex={0}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-neutral-600 text-sm text-center">No quizzes available. Add a quiz to get started.</p>
      )}

      {/* Quiz Pagination */}
      {quizzes.length > quizzesPerPage && (
        <div className="mt-6 flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 text-neutral-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
            tabIndex={0}
          >
            Back
          </button>
          {Array.from({ length: Math.ceil(quizzes.length / quizzesPerPage) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-lg transition-all duration-200 text-sm ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-neutral-700 hover:bg-gray-300"
              }`}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              tabIndex={0}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === Math.ceil(quizzes.length / quizzesPerPage)}
            className="px-3 py-1 bg-gray-200 text-neutral-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
            tabIndex={0}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizzesTab;