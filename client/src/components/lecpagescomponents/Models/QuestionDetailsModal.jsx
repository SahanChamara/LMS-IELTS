import React from 'react';

const QuestionDetailsModal = ({
  isOpen,
  onClose,
  questionPage,
  totalQuestionPages,
  currentQuestion,
  handleQuestionChange,
  formErrors,
  marksDistribution,
  handlePreviousQuestionPage,
  handleNextQuestionPage,
  handleQuestionPageChange,
  formData,
  updateFormData,
}) => {
  if (!isOpen) return null;

  const handleSave = () => {
    const newQuestions = [...formData.questions];
    newQuestions[questionPage - 1] = currentQuestion;
    updateFormData({ questions: newQuestions });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-gray-100 p-6 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h5 className="text-md font-medium text-neutral-900 mb-4">Question {questionPage} Details</h5>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label htmlFor={`questionText-${questionPage}`} className="block text-sm font-medium text-neutral-700 mb-1">Question Text</label>
            <textarea
              id={`questionText-${questionPage}`}
              name="text"
              value={currentQuestion.text}
              onChange={(e) => handleQuestionChange("text", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2"
              placeholder="e.g., What is GitHub used for?"
              aria-label={`Question ${questionPage} text`}
              aria-required="true"
            />
            {formErrors[`questionText${questionPage - 1}`] && <p className="mt-1 text-sm text-red-600">{formErrors[`questionText${questionPage - 1}`]}</p>}
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
                  aria-label={`Select option ${index + 1} as correct for question ${questionPage}`}
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleQuestionChange("options", e.target.value, index)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2"
                  placeholder={`Option ${index + 1}`}
                  aria-label={`Option ${index + 1} for question ${questionPage}`}
                  aria-required="true"
                />
                {formErrors[`question${questionPage - 1}Option${index}`] && <p className="mt-1 text-sm text-red-600">{formErrors[`question${questionPage - 1}Option${index}`]}</p>}
              </div>
            ))}
          </div>
          <div>
            <label htmlFor={`correctAnswer-${questionPage}`} className="block text-sm font-medium text-neutral-700 mb-1">Correct Answer</label>
            <input
              id={`correctAnswer-${questionPage}`}
              type="text"
              value={currentQuestion.options[currentQuestion.correctOption] || ""}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm text-neutral-900 p-2"
              aria-label={`Correct answer for question ${questionPage}`}
            />
          </div>
          {marksDistribution === "individual" && (
            <div>
              <label htmlFor={`questionMarks-${questionPage}`} className="block text-sm font-medium text-neutral-700 mb-1">Marks</label>
              <input
                id={`questionMarks-${questionPage}`}
                type="number"
                min="0"
                value={currentQuestion.marks}
                onChange={(e) => handleQuestionChange("marks", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2"
                placeholder="e.g., 20"
                aria-label={`Marks for question ${questionPage}`}
                aria-required="true"
              />
              {formErrors[`questionMarks${questionPage - 1}`] && <p className="mt-1 text-sm text-red-600">{formErrors[`questionMarks${questionPage - 1}`]}</p>}
            </div>
          )}
        </div>
        {totalQuestionPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button onClick={handlePreviousQuestionPage} disabled={questionPage === 1} className="px-3 py-1 bg-gray-200 text-neutral-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed" aria-label={`Previous question, currently on page ${questionPage}`}>Back</button>
            {Array.from({ length: totalQuestionPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => handleQuestionPageChange(page)} className={`px-3 py-1 rounded-lg transition-all duration-200 text-sm ${questionPage === page ? "bg-blue-600 text-white" : "bg-gray-200 text-neutral-700 hover:bg-gray-300"}`} aria-label={`Go to question page ${page}`} aria-current={questionPage === page ? "page" : undefined}>{page}</button>
            ))}
            <button onClick={handleNextQuestionPage} disabled={questionPage === totalQuestionPages} className="px-3 py-1 bg-gray-200 text-neutral-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed" aria-label={`Next question, currently on page ${questionPage}`}>Next</button>
          </div>
        )}
        <div className="flex justify-end mt-6 space-x-4">
          <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-200 text-sm font-medium" aria-label="Save question details">Save</button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 hover:scale-105 transition-all duration-200 text-sm font-medium" aria-label="Close question details modal">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailsModal;