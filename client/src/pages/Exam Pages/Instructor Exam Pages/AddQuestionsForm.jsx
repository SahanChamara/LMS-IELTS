import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit3, Trash2, Save } from 'lucide-react';
import Lecsidebar from "../../lecturepages/Lecsidebar";

const AddQuestionsForm = ({ 
  section, 
  examType, 
  onBack, 
  onComplete 
}) => {
  const [questions, setQuestions] = useState(section.questions || []);
  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'mcq',
    question: '',
    points: 1,
    options: ['', '', '', ''],
    correctAnswer: '',
    rubric: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Custom toast function as a replacement for useToast
  const showToast = (title, description, variant) => {
    const toastElement = document.createElement("div");
    toastElement.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
      variant === "destructive" ? "bg-red-500 text-white" : "bg-green-500 text-white"
    }`;
    toastElement.innerHTML = `<strong>${title}</strong><br>${description}`;
    document.body.appendChild(toastElement);
    setTimeout(() => document.body.removeChild(toastElement), 3000);
  };

  const questionTypes = {
    Reading: ['mcq', 'typing', 'reading', 'matching'],
    Writing: ['essay', 'typing'],
    Listening: ['mcq', 'typing', 'matching'],
    Speaking: ['oral', 'typing']
  };

  const availableTypes = questionTypes[examType] || ['mcq', 'essay', 'typing'];

  const handleAddQuestion = () => {
    if (!currentQuestion.question.trim()) {
      showToast("Validation Error", "Question text is required.", "destructive");
      return;
    }

    if (currentQuestion.type === 'mcq') {
      const validOptions = currentQuestion.options?.filter(opt => opt.trim()) || [];
      if (validOptions.length < 2) {
        showToast("Validation Error", "MCQ questions need at least 2 options.", "destructive");
        return;
      }
      if (!currentQuestion.correctAnswer?.trim()) {
        showToast("Validation Error", "Please select the correct answer.", "destructive");
        return;
      }
    }

    const question = {
      ...currentQuestion,
      id: `question_${Date.now()}`,
      options: currentQuestion.type === 'mcq' ? currentQuestion.options?.filter(opt => opt.trim()) : undefined
    };

    setQuestions([...questions, question]);
    
    // Reset form
    setCurrentQuestion({
      type: 'mcq',
      question: '',
      points: 1,
      options: ['', '', '', ''],
      correctAnswer: '',
      rubric: ''
    });

    showToast("Question Added", "Question has been added successfully.");
  };

  const handleDeleteQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
    showToast("Question Deleted", "Question has been removed.");
  };

  const handleComplete = async () => {
    if (questions.length === 0) {
      showToast("Validation Error", "Please add at least one question.", "destructive");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedSection = {
        ...section,
        questions: questions
      };

      onComplete(updatedSection);
    } catch (error) {
      showToast("Error", "Failed to save questions. Please try again.", "destructive");
    } finally {
      setIsLoading(false);
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...(currentQuestion.options || ['', '', '', ''])];
    newOptions[index] = value;
    setCurrentQuestion({...currentQuestion, options: newOptions});
  };

  const getQuestionTypeLabel = (type) => {
    const labels = {
      mcq: 'Multiple Choice',
      essay: 'Essay',
      typing: 'Short Answer',
      reading: 'Reading Comprehension',
      matching: 'Matching',
      oral: 'Speaking Task'
    };
    return labels[type] || type;
  };

  const getQuestionTypeBadge = (type) => {
    const colors = {
      mcq: 'bg-blue-100 text-blue-800',
      essay: 'bg-purple-100 text-purple-800',
      typing: 'bg-green-100 text-green-800',
      reading: 'bg-orange-100 text-orange-800',
      matching: 'bg-pink-100 text-pink-800',
      oral: 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-800 overflow-hidden">
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Lecsidebar />
      </aside>
      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg mr-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sections
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add Questions</h1>
            <p className="text-gray-600">Step 3 of 4: Add questions to "{section.title}"</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span className="text-blue-600 font-medium">Basic Info</span>
            <span className="text-blue-600 font-medium">Add Sections</span>
            <span className="text-blue-600 font-medium">Add Questions</span>
            <span>Review & Publish</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full w-3/4 transition-all duration-300"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add New Question */}
          <div>
            <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg shadow-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900">Add New Question</h2>
                <p className="text-gray-600 text-sm mt-1">Create a new question for this section</p>
              </div>
              <div className="p-6 pt-0 space-y-4">
                <div>
                  <label htmlFor="question-type" className="block text-sm font-medium text-gray-700">Question Type *</label>
                  <select
                    id="question-type"
                    value={currentQuestion.type}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, type: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                  >
                    {availableTypes.map(type => (
                      <option key={type} value={type}>
                        {getQuestionTypeLabel(type)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="question-text" className="block text-sm font-medium text-gray-700">Question *</label>
                  <textarea
                    id="question-text"
                    value={currentQuestion.question}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                    placeholder="Enter your question here..."
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                  />
                </div>

                {/* Reading Passage */}
                {(currentQuestion.type === 'reading' || examType === 'Reading') && (
                  <div>
                    <label htmlFor="passage" className="block text-sm font-medium text-gray-700">Reading Passage</label>
                    <textarea
                      id="passage"
                      value={currentQuestion.passage || ''}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, passage: e.target.value})}
                      placeholder="Enter the reading passage here..."
                      rows={4}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                    />
                  </div>
                )}

                {/* MCQ Options */}
                {currentQuestion.type === 'mcq' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Answer Options *</label>
                    <div className="space-y-2">
                      {currentQuestion.options?.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-sm font-medium w-6">{String.fromCharCode(65 + index)}.</span>
                          <input
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">Correct Answer *</label>
                      <select
                        value={currentQuestion.correctAnswer}
                        onChange={(e) => setCurrentQuestion({...currentQuestion, correctAnswer: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                      >
                        <option value="">Select correct answer</option>
                        {currentQuestion.options?.map((option, index) => (
                          option.trim() && (
                            <option key={index} value={option}>
                              {String.fromCharCode(65 + index)}. {option}
                            </option>
                          )
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="points" className="block text-sm font-medium text-gray-700">Points *</label>
                    <input
                      id="points"
                      type="number"
                      value={currentQuestion.points}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, points: parseInt(e.target.value) || 1})}
                      min="1"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="rubric" className="block text-sm font-medium text-gray-700">Grading Rubric</label>
                    <input
                      id="rubric"
                      value={currentQuestion.rubric || ''}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, rubric: e.target.value})}
                      placeholder="Brief grading criteria"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddQuestion}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Question
                </button>
              </div>
            </div>
          </div>

          {/* Existing Questions */}
          <div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900">Questions ({questions.length})</h2>
              </div>
              <div className="p-6 pt-0">
                {questions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No questions added yet. Add your first question to get started.
                  </p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {questions.map((question, index) => (
                      <div key={question.id} className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Question {index + 1}</h4>
                          <div className="flex items-center space-x-2">
                            <span className={getQuestionTypeBadge(question.type)}>
                              {getQuestionTypeLabel(question.type)}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-gray-300">
                              {question.points} {question.points === 1 ? 'point' : 'points'}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {question.question}
                        </p>
                        
                        {question.type === 'mcq' && question.options && (
                          <div className="text-xs text-gray-500 mb-2">
                            {question.options.length} options • Correct: {question.correctAnswer}
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              showToast("Edit Question", "Edit functionality coming soon!");
                            }}
                            className="px-2 py-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-sm flex items-center gap-1 transition-colors"
                          >
                            <Edit3 className="h-3 w-3" />
                            Edit
                          </button>
                          
                          <button
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Complete Button */}
        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors"
          >
            Back to Sections
          </button>
          <button
            onClick={handleComplete}
            disabled={isLoading || questions.length === 0}
            className={`px-4 py-2 flex items-center gap-2 ${
              isLoading || questions.length === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } rounded-lg transition-colors`}
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Questions'}
          </button>
        </div>
      </div>
      </main>
    </div>
  );
};

export default AddQuestionsForm;