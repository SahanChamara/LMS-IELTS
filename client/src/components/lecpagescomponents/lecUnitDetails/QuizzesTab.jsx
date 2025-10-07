import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, X, Trash  } from 'lucide-react';
import { addAssessments, updateAssessment, getAssessmentsByUnitId, deleteAssessment } from "../../../service/assessments";
import { getQuestionsByAssessmentId, addQuestion, updateQuestion, deleteQuestionById } from "../../../service/quizService";

const QuizzesTab = ({ unit }) => {
  // State management
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const [formMode, setFormMode] = useState(null); // 'add' or 'edit'
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    unit: unit.unitId,
    title: '',
    description: '',
    duration: '',
    passPercentage: '',
    dueDate: '',
    totalMarks: '',
    questionsCount: '',
  });

  // Question form
  const [questionForm, setQuestionForm] = useState({
    question: '',
    options: ['', ''],
    answer: 0,
    mark: '',
    assessment: ''
  });

  // Fetch assessments on mount and when unit changes
  useEffect(() => {
    const fetchAssessments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAssessmentsByUnitId(unit.unitId);
        // Extract the data array from the response, default to empty array if undefined
        const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
        // console.log("AAA ::: ", data)
        setAssessments(data);
      } catch (error) {
        console.error('Failed to load assessments:', error);
        setError(error.message || 'Failed to load assessments');
        showToast(error.message || 'Failed to load assessments', 'error');
        setAssessments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, [unit.unitId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle question input changes
  const handleQuestionInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle option changes
  const handleOptionChange = (index, value) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm(prev => ({ ...prev, options: newOptions }));
  };

  // Save assessment
  const handleSaveAssessment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = formMode === 'add' 
        ? await addAssessments(formData)
        : await updateAssessment(selectedAssessment._id, formData);
      
      // Refresh assessments after save
      const updatedAssessmentsResponse = await getAssessmentsByUnitId(unit.unitId);
      // Extract the data array from the response, default to empty array if undefined
      const updatedAssessments = Array.isArray(updatedAssessmentsResponse.data) 
        ? updatedAssessmentsResponse.data 
        : updatedAssessmentsResponse.data?.data || [];
      setAssessments(updatedAssessments);
      
      showToast(`Assessment ${formMode === 'add' ? 'added' : 'updated'} successfully`, 'success');
      resetForms();
    } catch (error) {
      console.error('Failed to save assessment:', error);
      showToast(error.message || 'Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Add or update question
  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    
    // Validate question form
    if (!questionForm.question.trim()) {
      showToast('Question text is required', 'error');
      return;
    }
    
    if (questionForm.options.filter(opt => opt.trim()).length < 2) {
      showToast('At least 2 options are required', 'error');
      return;
    }
    
    if (!questionForm.mark || questionForm.mark <= 0) {
      showToast('Mark must be a positive number', 'error');
      return;
    }

    setLoading(true);
    try {
      // Fetch current questions to check count
      const currentQuestionsResponse = await getQuestionsByAssessmentId(selectedAssessment._id);
      // console.log('API response for questions:', currentQuestionsResponse); // Debug log
      
      // Ensure currentQuestions is an array
      const currentQuestions = Array.isArray(currentQuestionsResponse) 
        ? currentQuestionsResponse 
        : currentQuestionsResponse.data && Array.isArray(currentQuestionsResponse.data) 
          ? currentQuestionsResponse.data 
          : [];
      
      // Log for debugging
      // console.log('Current questions count:', currentQuestions.length, 'Questions count limit:', selectedAssessment.questionsCount);
      
      // If not editing a question, check if adding a new question exceeds questionsCount
      if (!editingQuestion && currentQuestions.length >= selectedAssessment.questionsCount) {
        showToast(`Cannot add more questions. Maximum ${selectedAssessment.questionsCount} questions allowed.`, 'error');
        return;
      }

      const questionData = {
        question: questionForm.question,
        options: questionForm.options,
        correctOption: questionForm.answer,
        mark: questionForm.mark,
        answer: questionForm.answer,
        assessment: selectedAssessment._id
      };

      if (editingQuestion) {
        await updateQuestion(editingQuestion._id, questionData);
        showToast('Question updated successfully', 'success');
      } else {
        await addQuestion(questionData);
        showToast('Question added successfully', 'success');
      }
      
      // Refresh questions after save
      const updatedQuestionsResponse = await getQuestionsByAssessmentId(selectedAssessment._id);
      const updatedQuestions = Array.isArray(updatedQuestionsResponse) 
        ? updatedQuestionsResponse 
        : updatedQuestionsResponse.data && Array.isArray(updatedQuestionsResponse.data) 
          ? updatedQuestionsResponse.data 
          : [];
      setQuestions(updatedQuestions);
      
      resetQuestionForm();
      setEditingQuestion(null);
      setShowQuestionModal(false);
    } catch (error) {
      console.error('Failed to save question:', error);
      showToast(error.message || 'Failed to save question', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete assessment
  const handleDeleteAssessment = async (assessmentId) => {
    if (window.confirm('Are you sure you want to delete this assessment and all its questions?')) {
      setLoading(true);
      try {
        const response = await deleteAssessment(assessmentId);
        console.log('Delete API response:', response);

        if (response?.success) {
          const updatedAssessmentsResponse = await getAssessmentsByUnitId(unit.unitId);
          const updatedAssessments = Array.isArray(updatedAssessmentsResponse.data) 
            ? updatedAssessmentsResponse.data 
            : updatedAssessmentsResponse.data?.data || [];
          setAssessments(updatedAssessments);
          showToast(response.message || 'Deleted successfully', 'success');
        } else {
          throw new Error(response?.message || 'Delete failed');
        }
      } catch (error) {
        console.error('Delete failed:', error);
        showToast(
          error.response?.data?.message || error.message || 'Delete failed',
          'error'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // Preview questions for an assessment
  const handlePreviewQuestions = async (assessment) => {
    setLoading(true);
    try {
      const questions = await getQuestionsByAssessmentId(assessment._id);
      const currentQuestions = Array.isArray(questions) 
        ? questions 
        : questions.data && Array.isArray(questions.data) 
          ? questions.data 
          : [];
      setQuestions(currentQuestions);
      setSelectedAssessment(assessment);
      setShowPreviewModal(true);
    } catch (error) {
      console.error('Failed to load questions:', error);
      showToast(error.message || 'Failed to load questions', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Open add question modal with validation
  const handleOpenAddQuestion = async (assessment) => {
    setLoading(true);
    try {
      // Fetch current questions to check count
      const questionsResponse = await getQuestionsByAssessmentId(assessment._id);
      // console.log('API response for questions in handleOpenAddQuestion:', questionsResponse); // Debug log
      
      // Ensure questions is an array
      const questions = Array.isArray(questionsResponse) 
        ? questionsResponse 
        : questionsResponse.data && Array.isArray(questionsResponse.data) 
          ? questionsResponse.data 
          : [];
      
      // Log for debugging
      // console.log('Current questions count:', questions.length, 'Questions count limit:', assessment.questionsCount, 'Assessment ID:', assessment._id);
      
      // Validate questionsCount
      if (!assessment.questionsCount || assessment.questionsCount <= 0) {
        showToast('Cannot add questions: Question count is set to 0 or invalid.', 'warning');
        return;
      }
      
      if (questions.length >= assessment.questionsCount) {
        showToast(`Cannot add more questions: Maximum ${assessment.questionsCount} questions reached.`, 'warning');
        return;
      }
      
      // Only open modal if validation passes
      setSelectedAssessment(assessment);
      resetQuestionForm();
      setEditingQuestion(null);
      setShowQuestionModal(true);
    } catch (error) {
      console.error('Failed to check question limit:', error);
      showToast(error.message || 'Failed to check question limit', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Edit existing question
  const handleEditQuestion = (question) => {
    setQuestionForm({
      question: question.question,
      options: [...question.options],
      answer: question.correctOption,
      mark: question.mark,
      assessment: question.assessment
    });
    setEditingQuestion(question);
    setShowQuestionModal(true);
    setShowPreviewModal(false);
  };

  // Delete question
  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setLoading(true);
      try {
        const response = await deleteQuestionById(questionId);
        
        // Check for success in response
        if (response.data?.success || response.success) {
          setShowPreviewModal(false);
          // Refresh questions after successful deletion
          // const updatedQuestions = await getQuestionsByAssessmentId(selectedAssessment._id);
          // setQuestions(updatedQuestions.data || updatedQuestions);
          
          showToast('Question deleted successfully', 'success');
        } else {
          throw new Error(response.data?.message || response.message || 'Delete failed');
        }
      } catch (error) {
        console.error('Failed to delete question:', error);
        showToast(
          error.response?.data?.message || 
          error.message || 
          'Failed to delete question', 
          'error'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // Reset forms
  const resetForms = () => {
    setFormMode(null);
    setSelectedAssessment(null);
    setFormData({
      unit: unit.unitId,
      title: '',
      description: '',
      duration: '',
      passPercentage: '',
      dueDate: '',
      totalMarks: '',
      questionsCount: '',
    });
  };

  // Reset question form
  const resetQuestionForm = () => {
    setQuestionForm({
      question: '',
      options: ['', ''],
      answer: 0,
      mark: '',
      assessment: ''
    });
  };

  // Show toast message
  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: '', type: '', visible: false }), 3000);
  };

  return (
    <div className="p-4">
      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md ${
          toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Error Message */}
      {error && !formMode && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Assessment Form */}
      {formMode && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {formMode === 'add' ? 'Add New Assessment' : 'Edit Assessment'}
          </h2>
          <form onSubmit={handleSaveAssessment}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1">Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Description</label>
                <textarea 
                  rows="3"
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Duration (minutes)*</label>
                <input
                  type="number"
                  name="duration"
                  min="1"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Pass Percentage</label>
                <input
                  type="number"
                  name="passPercentage"
                  min="0"
                  max="100"
                  value={formData.passPercentage}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    // Convert the date string to ISO format with time set to 23:59:00
                    const dateValue = e.target.value;
                    const isoString = dateValue ? `${dateValue}T23:59:00.000Z` : '';
                    handleInputChange({
                      target: {
                        name: 'dueDate',
                        value: isoString
                      }
                    });
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Total Marks*</label>
                <input
                  type="number"
                  name="totalMarks"
                  min="1"
                  value={formData.totalMarks}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Question Count*</label>
                <input
                  type="number"
                  name="questionsCount"
                  min="1"
                  value={formData.questionsCount}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={resetForms}
                className="px-4 py-2 bg-gray-300 rounded"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assessments List */}
      {!formMode && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Assessments</h2>
            <button
              onClick={() => {
                setFormMode('add');
                setFormData({
                  unit: unit.unitId,
                  title: '',
                  description: '',
                  duration: '',
                  passPercentage: '',
                  dueDate: '',
                  totalMarks: '',
                  questionsCount: '',
                });
              }}
              className="px-4 py-2 bg-green-600 text-white rounded flex items-center"
            >
              <Plus size={18} className="mr-1" /> Add Assessment
            </button>
          </div>

          {loading && assessments.length === 0 ? (
            <div className="text-center py-8">Loading assessments...</div>
          ) : assessments.length === 0 ? (
            <p className="text-gray-600">No assessments available</p>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Due Date</th>
                    <th className="px-4 py-2 text-left">Total Marks</th>
                    <th className="px-4 py-2 text-left">Questions</th>
                    <th className="px-4 py-2 text-left">Percentage</th>
                    <th className="px-4 py-2 text-left">Duration</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map((assessment) => (
                    <tr key={assessment._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{assessment.title}</td>
                      <td className="px-4 py-2">
                        {assessment.dueDate ? new Date(assessment.dueDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-2">{assessment.totalMarks}</td>
                      <td className="px-4 py-2">
                        {assessment.questionsCount} (max)
                      </td>
                      <td className="px-4 py-2">
                        {assessment.passPercentage ? `${assessment.passPercentage}%` : 'N/A'}
                      </td>
                      <td className="px-4 py-2">
                        {assessment.duration ? `${assessment.duration} minutes` : 'N/A'}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setFormMode('edit');
                              setSelectedAssessment(assessment);
                              setFormData({
                                ...assessment,
                                unit: unit.unitId
                              });
                            }}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleOpenAddQuestion(assessment)}
                            className="p-1 text-green-600 hover:text-green-800"
                            title="Add Question"
                          >
                            <Plus size={18} />
                          </button>
                          <button
                            onClick={() => handlePreviewQuestions(assessment)}
                            className="p-1 text-purple-600 hover:text-purple-800"
                            title="Preview Questions"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteAssessment(assessment._id)}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Question Modal */}
      {showQuestionModal && selectedAssessment && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={() => {
              setShowQuestionModal(false);
              resetQuestionForm();
              setEditingQuestion(null);
            }}
          />

          {/* Modal */}
          <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-scaleIn">
            
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingQuestion ? 'Edit Question' : 'Create New Question'}
              </h2>
              <button
                onClick={() => {
                  setShowQuestionModal(false);
                  resetQuestionForm();
                  setEditingQuestion(null);
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <X size={22} className="text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form id="questionForm" onSubmit={handleSaveQuestion} className="px-6 py-5 space-y-6">

              {/* Question */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Question <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="question"
                  value={questionForm.question}
                  onChange={handleQuestionInputChange}
                  placeholder="Type your question here..."
                  className="w-full p-4 rounded-xl border border-gray-300 bg-white/70 focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
                  rows={3}
                  required
                />
              </div>

              {/* Options */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Options <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {questionForm.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 p-3 rounded-xl border border-gray-300 bg-white/70 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                        required
                      />
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="answer"
                          checked={questionForm.answer === index}
                          onChange={() =>
                            setQuestionForm(prev => ({ ...prev, answer: index }))
                          }
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-600 text-sm">Correct</span>
                      </label>
                      {questionForm.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() =>
                            setQuestionForm(prev => ({
                              ...prev,
                              options: prev.options.filter((_, i) => i !== index)
                            }))
                          }
                          className="p-2 text-red-500 hover:bg-red-100 rounded-full transition"
                        >
                          <Trash size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Option Button */}
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() =>
                      setQuestionForm(prev => ({
                        ...prev,
                        options: [...prev.options, ""]
                      }))
                    }
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                  >
                    <Plus size={16} /> Add Option
                  </button>
                </div>
              </div>

              {/* Mark */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Mark <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="mark"
                  min="1"
                  value={questionForm.mark}
                  onChange={handleQuestionInputChange}
                  placeholder="Enter marks"
                  className="w-full p-3 rounded-xl border border-gray-300 bg-white/70 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  required
                />
              </div>
            </form>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50/50">
              <button
                onClick={() => {
                  setShowQuestionModal(false);
                  resetQuestionForm();
                  setEditingQuestion(null);
                }}
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="questionForm"
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Question'}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Questions Preview Modal */}
      {showPreviewModal && selectedAssessment && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={() => setShowPreviewModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scaleIn">
            
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                Questions for <span className="text-blue-600">{selectedAssessment.title}</span> ({selectedAssessment.questionsCount})
              </h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <X size={22} className="text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {questions.length === 0 || selectedAssessment.questionsCount <= 0 ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-gray-500 text-lg">
                    {selectedAssessment.questionsCount <= 0
                      ? "Question count is set to 0"
                      : "No questions added yet"}
                  </p>
                </div>
              ) : (
                questions.map((question, qIndex) => (
                  <div
                    key={qIndex}
                    className="relative border border-gray-200 rounded-xl p-5 bg-white/70 hover:shadow-md transition"
                  >
                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <button
                        onClick={() => handleEditQuestion(question)}
                        className="p-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question._id)}
                        className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition"
                        title="Delete"
                        disabled={loading}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Question Text */}
                    <p className="font-medium text-gray-800 mb-1">
                      Q{qIndex + 1}: {question.question}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      Marks: <span className="font-semibold">{question.mark}</span>
                    </p>

                    {/* Options */}
                    <ul className="space-y-1">
                      {question.options.map((option, oIndex) => (
                        <li
                          key={oIndex}
                          className={`p-2 rounded-lg ${
                            oIndex === question.answer
                              ? "bg-green-100 text-green-700 font-medium"
                              : "bg-gray-50 text-gray-700"
                          }`}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50/50">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default QuizzesTab;