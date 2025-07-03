import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuizPreview from "./QuizPreview";
import { User , Edit, Trash2 } from 'lucide-react';

const QuizzesTab = ({ unit }) => {
  const [quizzes, setQuizzes] = useState(unit.quizzes || []);
  const [formMode, setFormMode] = useState(null);
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
  });
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [questionPage, setQuestionPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const [showErrorTooltip, setShowErrorTooltip] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [marksDistribution, setMarksDistribution] = useState("individual");
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [showQuizModel, setShowQuizModel] = useState(false);
  const navigate = useNavigate();
  const quizzesPerPage = 5;

  // Validate if all questions are complete
  const checkQuizCompletion = () => {
    const questionCount = parseInt(formData.questionCount) || 1; // Default to 1 if questionCount is empty
    if (questionCount <= 0) {
      console.log("Quiz not complete: Invalid question count", questionCount);
      setIsQuizComplete(false);
      return false;
    }

    const allQuestionsComplete = formData.questions
      .slice(0, questionCount)
      .every((q, index) => {
        const isComplete = q.text.trim() !== "" && q.options.every((o) => o.trim() !== "");
        console.log(`Question ${index + 1} complete:`, isComplete, q);
        return isComplete;
      });

    console.log("All questions complete:", allQuestionsComplete, "Question count:", questionCount);
    setIsQuizComplete(allQuestionsComplete);
    return allQuestionsComplete;
  };

  // Update quiz completion status when formData or questionPage changes
  useEffect(() => {
    console.log("FormData updated:", formData);
    checkQuizCompletion();
  }, [formData, questionPage]);

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
          setQuestionPage(1);
        } else {
          updatedFormData.questions = [{ text: "", options: ["", "", "", ""], correctOption: 0, marks: "" }];
        }
      }
      return updatedFormData;
    });
    setShowErrorTooltip(false);
  };

  // Handle question field changes
  const handleQuestionChange = (field, value, index = null) => {
    const newQuestions = [...formData.questions];
    const currentQ = newQuestions[questionPage - 1] || {
      text: "",
      options: ["", "", "", ""],
      correctOption: 0,
      marks: "",
    };
    if (field === "options") {
      const newOptions = [...currentQ.options];
      newOptions[index] = value;
      currentQ.options = newOptions;
    } else if (field === "correctOption") {
      currentQ.correctOption = parseInt(value);
    } else {
      currentQ[field] = value;
    }
    newQuestions[questionPage - 1] = currentQ;
    setFormData((prev) => ({ ...prev, questions: newQuestions }));
    setShowErrorTooltip(false);
  };

  // Handle student selection
  const handleSelectAllStudents = () => {
    setSelectedStudents(["Student1", "Student2", "Student3"]);
  };

  const handleSearchStudent = (e) => {
    const searchTerm = e.target.value;
    setSelectedStudents([`Student_${searchTerm}`]);
  };

  // Calculate total marks from questions
  const calculateTotalQuestionMarks = () => {
    return formData.questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
  };

  // Handle adding a new quiz
  const handleAddQuiz = () => {
    if (
      !formData.title ||
      !formData.instructions ||
      !formData.passingScore ||
      !formData.dueDate ||
      !formData.totalMarks ||
      !formData.caMarksPercentage ||
      !formData.timePeriod ||
      !formData.questionCount ||
      formData.questions.some((q) => !q.text || q.options.some((o) => !o) || (marksDistribution === "individual" && !q.marks))
    ) {
      setShowErrorTooltip(true);
      setToast({ message: "All fields and questions are required", type: "error", visible: true });
      return;
    }

    if (
      isNaN(formData.passingScore) ||
      formData.passingScore < 0 ||
      formData.passingScore > 100 ||
      isNaN(formData.totalMarks) ||
      formData.totalMarks <= 0 ||
      isNaN(formData.caMarksPercentage) ||
      formData.caMarksPercentage < 0 ||
      formData.caMarksPercentage > 100
    ) {
      setShowErrorTooltip(true);
      setToast({ message: "Invalid numerical values", type: "error", visible: true });
      return;
    }

    if (marksDistribution === "individual") {
      const totalQuestionMarks = calculateTotalQuestionMarks();
      if (totalQuestionMarks > Number(formData.totalMarks)) {
        setShowErrorTooltip(true);
        setToast({
          message: `Total question marks (${totalQuestionMarks}) exceed quiz total marks (${formData.totalMarks})`,
          type: "error",
          visible: true,
        });
        return;
      }
    }

    setIsLoading(true);
    const newQuiz = {
      id: Date.now(),
      ...formData,
      passingScore: Number(formData.passingScore),
      totalMarks: Number(formData.totalMarks),
      caMarksPercentage: Number(formData.caMarksPercentage),
      questionCount: Number(formData.questionCount),
      questions: formData.questions.slice(0, Number(formData.questionCount)).map((q) => ({
        ...q,
        correctOption: Number(q.correctOption),
        marks: marksDistribution === "total" ? Number(formData.totalMarks) / Number(formData.questionCount) : Number(q.marks),
      })),
      answeredStudents: Math.floor(Math.random() * 20),
    };

    const data = new FormData();
    data.append("unitId", unit.id || unit.code);
    Object.entries(newQuiz).forEach(([key, value]) => {
      if (key === "questions") {
        data.append("questions", JSON.stringify(value));
      } else {
        data.append(key, value);
      }
    });

    setTimeout(() => {
      setQuizzes([...quizzes, newQuiz]);
      setFormMode(null);
      setIsQuizComplete(false);
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
      });
      setSelectedStudents([]);
      setToast({ message: "Quiz added successfully", type: "success", visible: true });
    }, 1000);
  };

  // Handle editing an existing quiz
  const handleEditQuiz = (quiz) => {
    setFormMode(quiz.id);
    setFormData({
      ...quiz,
      questions: quiz.questions || [{ text: "", options: ["", "", "", ""], correctOption: 0, marks: "" }],
    });
    setQuestionPage(1);
    checkQuizCompletion(); // Check completion for edited quiz
  };

  // Handle saving an edited quiz
  const handleSaveQuiz = () => {
    if (
      !formData.title ||
      !formData.instructions ||
      !formData.passingScore ||
      !formData.dueDate ||
      !formData.totalMarks ||
      !formData.caMarksPercentage ||
      !formData.timePeriod ||
      !formData.questionCount ||
      formData.questions.some((q) => !q.text || q.options.some((o) => !o) || (marksDistribution === "individual" && !q.marks))
    ) {
      setShowErrorTooltip(true);
      setToast({ message: "All fields and questions are required", type: "error", visible: true });
      return;
    }

    if (
      isNaN(formData.passingScore) ||
      formData.passingScore < 0 ||
      formData.passingScore > 100 ||
      isNaN(formData.totalMarks) ||
      formData.totalMarks <= 0 ||
      isNaN(formData.caMarksPercentage) ||
      formData.caMarksPercentage < 0 ||
      formData.caMarksPercentage > 100
    ) {
      setShowErrorTooltip(true);
      setToast({ message: "Invalid numerical values", type: "error", visible: true });
      return;
    }

    if (marksDistribution === "individual") {
      const totalQuestionMarks = calculateTotalQuestionMarks();
      if (totalQuestionMarks > Number(formData.totalMarks)) {
        setShowErrorTooltip(true);
        setToast({
          message: `Total question marks (${totalQuestionMarks}) exceed quiz total marks (${formData.totalMarks})`,
          type: "error",
          visible: true,
        });
        return;
      }
    }

    setIsLoading(true);
    const updatedQuiz = {
      id: formMode,
      ...formData,
      passingScore: Number(formData.passingScore),
      totalMarks: Number(formData.totalMarks),
      caMarksPercentage: Number(formData.caMarksPercentage),
      questionCount: Number(formData.questionCount),
      questions: formData.questions.slice(0, Number(formData.questionCount)).map((q) => ({
        ...q,
        correctOption: Number(q.correctOption),
        marks: marksDistribution === "total" ? Number(formData.totalMarks) / Number(formData.questionCount) : Number(q.marks),
      })),
      answeredStudents: formData.answeredStudents || Math.floor(Math.random() * 20),
    };

    const data = new FormData();
    data.append("unitId", unit.id || unit.code);
    Object.entries(updatedQuiz).forEach(([key, value]) => {
      if (key === "questions") {
        data.append("questions", JSON.stringify(value));
      } else {
        data.append(key, value);
      }
    });

    setTimeout(() => {
      setQuizzes(quizzes.map((q) => (q.id === formMode ? updatedQuiz : q)));
      setFormMode(null);
      setIsQuizComplete(false);
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
      });
      setSelectedStudents([]);
      setToast({ message: "Quiz updated successfully", type: "success", visible: true });
    }, 1000);
  };

  // Handle deleting a quiz
  const handleDeleteQuiz = (quizId) => {
    setIsLoading(true);
    setTimeout(() => {
      setQuizzes(quizzes.filter((q) => q.id !== quizId));
      setIsLoading(false);
      setToast({ message: "Quiz deleted successfully", type: "success", visible: true });
    }, 1000);
  };

  // Handle cancel
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
    });
    setSelectedStudents([]);
    setShowErrorTooltip(false);
    setIsQuizComplete(false);
    setShowQuizModel(false);
    setMarksDistribution("individual");
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
    const filteredQuizzes = (unit.quizzes || []).filter((quiz) =>
      quiz.title.toLowerCase().includes(term)
    );
    setQuizzes(filteredQuizzes);
    setCurrentPage(1);
  };

  // Navigate to StudentAllHistory page
  const handleViewHistory = (quizId) => {
    navigate(`/student-history/${quizId}`);
  };

  // Question pagination logic
  const totalQuestionPages = parseInt(formData.questionCount) || 1;
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

  // Auto-hide toast
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

      {/* Add/Edit Quiz Form */}
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Marks Distribution</label>
                <select
                  value={marksDistribution}
                  onChange={(e) => setMarksDistribution(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 p-2"
                  aria-label="Marks distribution type"
                >
                  <option value="individual">Individual Question Marks</option>
                  <option value="total">Total Marks for All Questions</option>
                </select>
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
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleQuestionChange("options", e.target.value, index)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2"
                        placeholder={`Option ${index + 1}`}
                        aria-label={`Option ${index + 1} text`}
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
                  />
                </div>
                {marksDistribution === "individual" && (
                  <div>
                    <label htmlFor="questionMarks" className="block text-sm font-medium text-neutral-700 mb-1">
                      Marks
                    </label>
                    <input
                      id="questionMarks"
                      type="number"
                      min="0"
                      value={currentQuestion.marks}
                      onChange={(e) => handleQuestionChange("marks", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2"
                      placeholder="e.g., 20"
                      aria-label={`Question ${questionPage} marks`}
                    />
                  </div>
                )}
              </div>
              {/* Question Pagination */}
              {totalQuestionPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                  <button
                    onClick={handlePreviousQuestionPage}
                    disabled={questionPage === 1}
                    className="px-3 py-1 bg-gray-200 text-neutral-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous question"
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
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={handleNextQuestionPage}
                    disabled={questionPage === totalQuestionPages}
                    className="px-3 py-1 bg-gray-200 text-neutral-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next question"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* Preview Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h5 className="text-md font-medium text-neutral-900 mb-4">
                Question {questionPage} Preview
              </h5>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-base text-neutral-900 mb-3">
                  <strong>Question:</strong> {currentQuestion.text || "Question text not provided"}
                </p>
                {currentQuestion.options.map((option, index) => (
                  <label key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="radio"
                      name="quiz"
                      value={index}
                      checked={selectedOption === index}
                      onChange={() => setSelectedOption(index)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      aria-label={`Option ${index + 1}`}
                    />
                    <span className="text-base text-neutral-600">
                      {option || "Option not provided"}
                      {currentQuestion.correctOption === index && (
                        <span className="text-green-600 ml-2">✔</span>
                      )}
                    </span>
                  </label>
                ))}
                {marksDistribution === "individual" && (
                  <p className="text-base text-neutral-600">
                    <strong>Marks:</strong> {currentQuestion.marks || "Not assigned"}
                  </p>
                )}
              </div>
            </div>

            {/* Quiz Preview Component */}
            <QuizPreview
              quizData={formData}
              marksDistribution={marksDistribution}
              isOpen={showQuizModel}
              onClose={() => setShowQuizModel(false)}
            />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              {isQuizComplete && (
                <button
                  onClick={() => {
                    console.log("Opening QuizPreview with formData:", formData);
                    setShowQuizModel(true);
                  }}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 text-sm font-medium ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                  aria-label="Live Preview Quiz"
                >
                  Live Preview
                </button>
              )}
              <button
                onClick={formMode === "add" ? handleAddQuiz : handleSaveQuiz}
                className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-200 text-sm font-medium ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
                aria-label={formMode === "add" ? "Save new quiz" : "Save quiz changes"}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 hover:scale-105 transition-all duration-200 text-sm font-medium"
                disabled={isLoading}
                aria-label="Cancel"
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

      {/* Quizzes Table */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by title..."
          className="p-2 border rounded-md w-full md:w-1/3 mb-4 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400"
          aria-label="Search quizzes"
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
                >
                  Title {sortConfig.key === "title" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th
                  className="py-3 px-4 text-center text-sm font-medium text-neutral-700 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("dueDate")}
                  aria-label="Sort by due date"
                >
                  Due Date {sortConfig.key === "dueDate" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th
                  className="py-3 px-4 text-center text-sm font-medium text-neutral-700 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("passingScore")}
                  aria-label="Sort by passing score"
                >
                  Pass Score (%) {sortConfig.key === "passingScore" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th
                  className="py-3 px-4 text-center text-sm font-medium text-neutral-700 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("totalMarks")}
                  aria-label="Sort by total marks"
                >
                  Total Marks {sortConfig.key === "totalMarks" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th
                  className="py-3 px-4 text-center text-sm font-medium text-neutral-700 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("answeredStudents")}
                  aria-label="Sort by answered students"
                >
                  Answered Students {sortConfig.key === "answeredStudents" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th className="py-3 px-4 text-center text-sm font-medium text-neutral-700">Actions</th>
              </tr>
            </thead>
           <tbody>
  {quizzes
    .slice((currentPage - 1) * quizzesPerPage, currentPage * quizzesPerPage)
    .map((quiz) => (
      <tr
        key={quiz.id}
        className="border-t hover:bg-gray-50 transition-all duration-200"
      >
        <td className="py-4 px-4 text-center align-middle text-sm text-neutral-900">
          {quiz.title}
        </td>
        <td className="py-4 px-4 text-center align-middle text-sm text-neutral-600">
          {quiz.dueDate}
        </td>
        <td className="py-4 px-4 text-center align-middle text-sm text-neutral-600">
          {quiz.passingScore}%
        </td>
        <td className="py-4 px-4 text-center align-middle text-sm text-neutral-600">
          {quiz.totalMarks}
        </td>
        <td className="py-4 px-4 text-sm text-neutral-600">
          <div className="flex items-center justify-center space-x-2">
            <span>{quiz.answeredStudents}</span>
            <button
              onClick={() => handleViewHistory(quiz.id)}
              className="h-8 w-8 flex items-center justify-center hover:bg-green-200 text-green-600 bg-green-100 rounded-full focus:outline-none transition-all duration-200"
              aria-label={`View history for quiz ${quiz.title}`}
            >
              <User className="w-5 h-5 text-green-700" />
            </button>
          </div>
        </td>
        <td className="py-4 px-4 text-sm">
          <div className="flex justify-center items-center space-x-2">
            {/* Edit Icon Button */}
            <button
              onClick={() => handleEditQuiz(quiz)}
              disabled={isLoading}
              className={`p-2 rounded-full hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition duration-200 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label={`Edit quiz ${quiz.title}`}
              title="Edit"
            >
              <Edit className="w-5 h-5" />
            </button>

            {/* Delete Icon Button */}
            <button
              onClick={() => handleDeleteQuiz(quiz.id)}
              disabled={isLoading}
              className={`p-2 rounded-full hover:bg-red-100 text-red-600 hover:text-red-800 transition duration-200 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label={`Delete quiz ${quiz.title}`}
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
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
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === Math.ceil(quizzes.length / quizzesPerPage)}
            className="px-3 py-1 bg-gray-200 text-neutral-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizzesTab;