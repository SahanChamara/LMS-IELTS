import React, { useState } from "react";
import { createPortal } from "react-dom";

const QuizPreview = ({ quizData, marksDistribution, isOpen, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  const questions = quizData?.questions || [];
  const totalQuestions = parseInt(quizData?.questionCount) || questions.length;

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
    }
  };

  const handleQuestionPageChange = (index) => {
    setCurrentQuestionIndex(index);
    setSelectedOption(null);
  };

  const currentQuestion = questions[currentQuestionIndex] || {
    text: "",
    options: ["", "", "", ""],
    correctOption: 0,
    marks: "",
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen bg-gray-600 bg-opacity-40 z-[9999] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <h4 className="text-lg font-medium text-neutral-900 mb-4">Quiz Preview</h4>
        <div className="space-y-6">
          {/* Current Question */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <p className="text-base text-neutral-900 mb-3">
              <strong>Question {currentQuestionIndex + 1}:</strong>{" "}
              {currentQuestion.text || "Question text not provided"}
            </p>
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="radio"
                  name={`quiz-preview-${currentQuestionIndex}`}
                  value={index}
                  checked={selectedOption === index}
                  onChange={() => setSelectedOption(index)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  aria-label={`Option ${index + 1} for question ${currentQuestionIndex + 1}`}
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
              <p className="text-base text-neutral-600 mt-2">
                <strong>Marks:</strong> {currentQuestion.marks || "Not assigned"}
              </p>
            )}
          </div>

          {/* Pagination */}
          {totalQuestions > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-3 py-1 bg-gray-200 text-neutral-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handleQuestionPageChange(page - 1)}
                  className={`px-3 py-1 rounded-lg transition-all duration-200 text-sm ${
                    currentQuestionIndex + 1 === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-neutral-700 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === totalQuestions - 1}
                className="px-3 py-1 bg-gray-200 text-neutral-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 hover:scale-105 transition-all duration-200 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default QuizPreview;
