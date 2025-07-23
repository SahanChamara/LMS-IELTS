import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuizPreview from "./QuizPreview";
import { User, Edit, Trash2, CircleFadingPlus, Eye } from 'lucide-react';
import QuestionDetailsModal from "../Models/QuestionDetailsModal";
import { addAssessments } from '../../../service/assessments';
import { useSelector } from "react-redux";

const QuizzesTab = ({ unit }) => {
  const navigate = useNavigate();
  const unitsByInstructor = useSelector((state) => state.units.units.byInstructor.data);
  const unitIdToFilter = unit.unitId;
  const filteredUnit = unitsByInstructor?.find((unit) => unit.id === unitIdToFilter);
  const assessments = filteredUnit?.assessments || [];
  console.log('assessments:', assessments);

  const initialQuizzes = [];
  const [quizzes, setQuizzes] = useState(unit?.quizzes || initialQuizzes);
  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState({
    unit: unit.unitId,
    title: '',
    description: '',
    duration: 23,
    instructions: '',
    passPercentage: '',
    dueDate: '',
    totalMarks: '',
    caMarksPercetage: '',
    timePeriod: '',
    questionsCount: '',
    questions: [{ text: '', options: ['', '', '', ''], correctOption: 0, marks: '' }]
  });
  const [formErrors, setFormErrors] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [questionPage, setQuestionPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const [showErrorTooltip, setShowErrorTooltip] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [marksDistribution, setMarksDistribution] = useState('individual');
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [showQuizModel, setShowQuizModel] = useState(false);
  const [allowpassPercentage, setAllowpassPercentage] = useState('yes');
  const [showQuestionDetailsModal, setShowQuestionDetailsModal] = useState(false);
  const [showQuestionPreviewModal, setShowQuestionPreviewModal] = useState(false);
  const quizzesPerPage = 5;

  const checkQuizCompletion = () => {
    const questionsCount = parseInt(formData.questionsCount) || 1;
    if (questionsCount <= 0) {
      setIsQuizComplete(false);
      return false;
    }
    const allQuestionsComplete = formData.questions
      .slice(0, questionsCount)
      .every((q, index) => {
        const isComplete = q.text.trim() !== "" && q.options.every((o) => o.trim() !== "");
        console.log(`Question ${index + 1} complete:`, isComplete, q);
        return isComplete;
      });
    console.log("All questions complete:", allQuestionsComplete, "Question count:", questionsCount);
    setIsQuizComplete(allQuestionsComplete);
    return allQuestionsComplete;
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title) errors.title = "Quiz Title is required";
    if (!formData.instructions) errors.instructions = "Instructions is required";
    if (allowpassPercentage === "yes" && !formData.passPercentage) errors.passPercentage = "Passing Score is required";
    if (!formData.dueDate) errors.dueDate = "Due Date is required";
    if (!formData.totalMarks) errors.totalMarks = "Total Marks is required";
    if (!formData.caMarksPercetage) errors.caMarksPercetage = "CA Marks Percentage is required";
    if (!formData.timePeriod) errors.timePeriod = "Time Period is required";
    if (!formData.questionsCount) errors.questionsCount = "Question Count is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateTotalQuestionMarks = () => {
    const validquestionsCount = Math.min(Number(formData.questionsCount) || 0, formData.questions.length);
    return formData.questions
      .slice(0, validquestionsCount)
      .reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };
      if (name === "questionsCount" && value !== "") {
        const count = parseInt(value);
        if (!isNaN(count) && count > 0) {
          updatedFormData.questions = Array.from({ length: count }, (_, i) => ({
            text: prev.questions[i]?.text || '',
            options: prev.questions[i]?.options || ['', '', '', ''],
            correctOption: prev.questions[i]?.correctOption || 0,
            marks: prev.questions[i]?.marks || ''
          }));
          setQuestionPage(prevPage => Math.min(prevPage, count));
        } else {
          updatedFormData.questions = [{ text: '', options: ['', '', '', ''], correctOption: 0, marks: '' }];
          setQuestionPage(1);
        }
      }
      return updatedFormData;
    });
    setFormErrors(prev => ({ ...prev, [name]: '' }));
    setShowErrorTooltip(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setShowErrorTooltip(true);
      setToast({ message: 'Please fill all required fields', type: 'error', visible: true });
      return;
    }
    try {
      console.log('Submitting:', formData);
      const response = await addAssessments(formData);
      console.log('API Response:', response);
      setQuizzes(prev => [...prev, { ...formData, id: response.id || Date.now().toString(), answeredStudents: 0 }]);
      setToast({ message: 'Quiz added successfully', type: 'success', visible: true });
      handleCancel();
    } catch (error) {
      console.error('API Error:', error);
      setToast({ message: 'Failed to add quiz', type: 'error', visible: true });
    }
  };

  const handleQuestionChange = (field, value, index = null) => {
    const newQuestions = [...formData.questions];
    const validquestionsCount = Math.min(Number(formData.questionsCount) || 1, newQuestions.length); // Default to 1 if questionsCount is invalid
    const currentIndex = questionPage - 1;

    console.log('handleQuestionChange:', { field, value, index, validquestionsCount, currentIndex, questionsCount: formData.questionsCount });

    if (currentIndex >= validquestionsCount) {
      setToast({ message: 'Invalid question page selected', type: 'error', visible: true });
      return;
    }

    const currentQ = newQuestions[currentIndex] || {
      text: '', options: ['', '', '', ''], correctOption: 0, marks: ''
    };

    if (field === 'options') {
      const newOptions = [...currentQ.options];
      newOptions[index] = value;
      currentQ.options = newOptions;
      setFormErrors(prev => ({ ...prev, [`question${currentIndex}Option${index}`]: '' }));
    } else if (field === 'correctOption') {
      currentQ.correctOption = parseInt(value);
    } else {
      currentQ[field] = value;
      setFormErrors(prev => ({ ...prev, [`${field}${currentIndex}`]: '' }));
    }
    newQuestions[currentIndex] = currentQ;
    setFormData(prev => ({ ...prev, questions: newQuestions }));
    setShowErrorTooltip(false);
  };

  const handleSaveQuiz = () => {
    if (!validateForm()) {
      setShowErrorTooltip(true);
      setToast({ message: 'Please fill all required fields', type: 'error', visible: true });
      return;
    }

    if (allowpassPercentage === 'yes' && (isNaN(formData.passPercentage) || formData.passPercentage < 0 || formData.passPercentage > 100)) {
      setShowErrorTooltip(true);
      setToast({ message: 'Invalid Passing Score', type: 'error', visible: true });
      return;
    }
    if (isNaN(formData.totalMarks) || formData.totalMarks <= 0 || isNaN(formData.caMarksPercetage) || formData.caMarksPercetage < 0 || formData.caMarksPercetage > 100) {
      setShowErrorTooltip(true);
      setToast({ message: 'Invalid numerical values', type: 'error', visible: true });
      return;
    }

    if (marksDistribution === 'individual') {
      const totalQuestionMarks = calculateTotalQuestionMarks();
      if (totalQuestionMarks > Number(formData.totalMarks)) {
        setShowErrorTooltip(true);
        setToast({ message: `Total question marks (${totalQuestionMarks}) exceed quiz total marks (${formData.totalMarks})`, type: 'error', visible: true });
        return;
      }
    }

    setIsLoading(true);
    const updatedQuiz = {
      id: formMode,
      ...formData,
      passPercentage: allowpassPercentage === 'yes' ? Number(formData.passPercentage) : null,
      totalMarks: Number(formData.totalMarks),
      caMarksPercetage: Number(formData.caMarksPercetage),
      questionsCount: Number(formData.questionsCount),
      questions: formData.questions
        .slice(0, Number(formData.questionsCount))
        .map(q => ({
          ...q,
          correctOption: Number(q.correctOption),
          marks: marksDistribution === 'total' ? Number(formData.totalMarks) / Number(formData.questionsCount) : Number(q.marks)
        })),
      answeredStudents: formData.answeredStudents || 0
    };
    setQuizzes(prev => prev.map(q => (q.id === formMode ? updatedQuiz : q)));
    handleCancel();
    setToast({ message: 'Quiz updated successfully', type: 'success', visible: true });
    setIsLoading(false);
  };

  const handleEditQuiz = quiz => {
    console.log('handleEditQuiz called with quiz:', quiz);
    setFormMode(quiz.id);
    setFormData({
      ...quiz,
      questionsCount: quiz.questionsCount || quiz.questions?.length || '1', // Ensure questionsCount is set
      questions: quiz.questions || [{ text: '', options: ['', '', '', ''], correctOption: 0, marks: '' }]
    });
    setAllowpassPercentage(quiz.passPercentage !== null ? 'yes' : 'no');
    setQuestionPage(1);
    setShowQuestionDetailsModal(true);
    checkQuizCompletion();
  };

  const handleAddQuestions = quiz => {
    console.log('handleAddQuestions called with quiz:', quiz);
    setFormMode(quiz.id);
    setFormData({
      ...formData, // Preserve existing form data for 'Add Your Question' button
      ...quiz,
      questionsCount: quiz.questionsCount || quiz.questions?.length || '1', // Default to 1 if not set
      questions: quiz.questions || [{ text: '', options: ['', '', '', ''], correctOption: 0, marks: '' }]
    });
    setAllowpassPercentage(quiz.passPercentage !== null ? 'yes' : 'no');
    setQuestionPage(1);
    setShowQuestionDetailsModal(true);
    checkQuizCompletion();
  };

  const handlePreviewQuestions = quiz => {
    console.log('handlePreviewQuestions called with quiz:', quiz);
    setFormData({
      ...quiz,
      questionsCount: quiz.questionsCount || quiz.questions?.length || '1', // Ensure questionsCount is set
      questions: quiz.questions || [{ text: '', options: ['', '', '', ''], correctOption: 0, marks: '' }]
    });
    setQuestionPage(1);
    setShowQuestionPreviewModal(true);
  };

  const handleDeleteQuiz = quizId => {
    setIsLoading(true);
    setQuizzes(prev => prev.filter(q => q.id !== quizId));
    setToast({ message: 'Quiz deleted successfully', type: 'success', visible: true });
    setIsLoading(false);
  };

  const handleViewHistory = quizId => {
    navigate(`/student-history/${quizId}`);
  };

  const handleCancel = () => {
    setFormMode(null);
    setFormData({
      unit: unit.unitId,
      title: '',
      description: '',
      duration: 23,
      instructions: '',
      passPercentage: '',
      dueDate: '',
      totalMarks: '',
      caMarksPercetage: '',
      timePeriod: '',
      questionsCount: '',
      questions: [{ text: '', options: ['', '', '', ''], correctOption: 0, marks: '' }]
    });
    setFormErrors({});
    setShowErrorTooltip(false);
    setIsQuizComplete(false);
    setShowQuizModel(false);
    setShowQuestionDetailsModal(false);
    setShowQuestionPreviewModal(false);
    setMarksDistribution('individual');
    setAllowpassPercentage('yes');
  };

  const totalQuestionPages = parseInt(formData.questionsCount) || 1;
  const currentQuestion = formData.questions[questionPage - 1] || {
    text: '', options: ['', '', '', ''], correctOption: 0, marks: ''
  };

  const handleQuestionPageChange = page => setQuestionPage(page);
  const handleNextQuestionPage = () => questionPage < totalQuestionPages ? setQuestionPage(questionPage + 1) : null;
  const handlePreviousQuestionPage = () => questionPage > 1 ? setQuestionPage(questionPage - 1) : null;

  const updateFormData = updatedData => {
    setFormData(prev => ({ ...prev, ...updatedData }));
  };

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  useEffect(() => {
    console.log('showQuestionDetailsModal:', showQuestionDetailsModal);
    console.log('formMode:', formMode);
    console.log('formData:', formData);
  }, [showQuestionDetailsModal, formMode, formData]);

  return (
    <div className='bg-gray-50 p-6 rounded-lg w-full'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-xl font-semibold text-neutral-900'>
          Quizzes for {unit?.title || 'Unit'}
        </h3>
        {!formMode && (
          <button
            onClick={() => setFormMode('add')}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 text-sm font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
            aria-label='Add new quiz'
          >
            Add Assessment
          </button>
        )}
      </div>

      {toast.visible && (
        <div
          role='alert'
          aria-live='polite'
          className={`fixed bottom-12 right-4 p-4 rounded-lg shadow-lg ${toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-600'} animate-fade-in-out`}
        >
          {toast.message}
        </div>
      )}

      {formMode && (
        <div className='bg-white p-6 rounded-lg shadow-md mb-6 max-w-7xl mx-auto w-full'>
          <h4 className='text-lg font-medium text-neutral-900 mb-4'>
            {formMode === 'add' ? 'Add New Quiz' : 'Edit Quiz'}
          </h4>
          <div className='space-y-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <div>
                <label htmlFor='title' className='block text-sm font-medium text-neutral-700 mb-1'>Quiz Title</label>
                <input
                  id='title'
                  name='title'
                  type='text'
                  value={formData.title}
                  onChange={handleInputChange}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2'
                  placeholder='e.g., What is Node.js'
                  aria-label='Quiz Title'
                />
                {formErrors.title && <p className='mt-1 text-sm text-red-600'>{formErrors.title}</p>}
              </div>
              <div>
                <label htmlFor='description' className='block text-sm font-medium text-neutral-700 mb-1'>Description</label>
                <textarea
                  id='description'
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2'
                  placeholder='e.g., Test your Node.js knowledge'
                  aria-label='Quiz Description'
                />
                {formErrors.description && <p className='mt-1 text-sm text-red-600'>{formErrors.description}</p>}
              </div>
              <div>
                <label htmlFor='instructions' className='block text-sm font-medium text-neutral-700 mb-1'>Instructions</label>
                <textarea
                  id='instructions'
                  name='instructions'
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows={3}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2'
                  placeholder="e.g., You can't go back after submitting"
                  aria-label='Quiz Instructions'
                />
                {formErrors.instructions && <p className='mt-1 text-sm text-red-600'>{formErrors.instructions}</p>}
              </div>
              <div>
                <label className='block text-sm font-medium text-neutral-700 mb-1'>Allow Passing Score</label>
                <select
                  value={allowpassPercentage}
                  onChange={e => {
                    setAllowpassPercentage(e.target.value);
                    if (e.target.value === 'no') {
                      setFormData(prev => ({ ...prev, passPercentage: '' }));
                      setFormErrors(prev => ({ ...prev, passPercentage: '' }));
                    }
                  }}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 p-2'
                  aria-label='Allow Passing Score'
                >
                  <option value='yes'>Allow</option>
                  <option value='no'>Not Allow</option>
                </select>
              </div>
              {allowpassPercentage === 'yes' && (
                <div>
                  <label htmlFor='passPercentage' className='block text-sm font-medium text-neutral-700 mb-1'>Passing Score (%)</label>
                  <input
                    id='passPercentage'
                    name='passPercentage'
                    type='number'
                    min='0'
                    max='100'
                    value={formData.passPercentage}
                    onChange={handleInputChange}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2'
                    placeholder='e.g., 75'
                    aria-label='Passing Score'
                  />
                  {formErrors.passPercentage && <p className='mt-1 text-sm text-red-600'>{formErrors.passPercentage}</p>}
                </div>
              )}
              <div>
                <label htmlFor='dueDate' className='block text-sm font-medium text-neutral-700 mb-1'>Due Date</label>
                <input
                  id='dueDate'
                  name='dueDate'
                  type='date'
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 p-2'
                  aria-label='Due Date'
                />
                {formErrors.dueDate && <p className='mt-1 text-sm text-red-600'>{formErrors.dueDate}</p>}
              </div>
              <div>
                <label htmlFor='totalMarks' className='block text-sm font-medium text-neutral-700 mb-1'>Total Marks</label>
                <input
                  id='totalMarks'
                  name='totalMarks'
                  type='number'
                  min='0'
                  value={formData.totalMarks}
                  onChange={handleInputChange}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2'
                  placeholder='e.g., 100'
                  aria-label='Total Marks'
                />
                {formErrors.totalMarks && <p className='mt-1 text-sm text-red-600'>{formErrors.totalMarks}</p>}
              </div>
              <div>
                <label htmlFor='caMarksPercetage' className='block text-sm font-medium text-neutral-700 mb-1'>CA Marks Percentage (%)</label>
                <input
                  id='caMarksPercetage'
                  name='caMarksPercetage'
                  type='number'
                  min='0'
                  max='100'
                  value={formData.caMarksPercetage}
                  onChange={handleInputChange}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2'
                  placeholder='e.g., 20'
                  aria-label='CA Marks Percentage'
                />
                {formErrors.caMarksPercetage && <p className='mt-1 text-sm text-red-600'>{formErrors.caMarksPercetage}</p>}
              </div>
              <div>
                <label htmlFor='timePeriod' className='block text-sm font-medium text-neutral-700 mb-1'>Time Period</label>
                <input
                  id='timePeriod'
                  name='timePeriod'
                  type='text'
                  value={formData.timePeriod}
                  onChange={handleInputChange}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2'
                  placeholder='e.g., 30 minutes'
                  aria-label='Time Period'
                />
                {formErrors.timePeriod && <p className='mt-1 text-sm text-red-600'>{formErrors.timePeriod}</p>}
              </div>
              <div>
                <label htmlFor='questionsCount' className='block text-sm font-medium text-neutral-700 mb-1'>Question Count</label>
                <input
                  id='questionsCount'
                  name='questionsCount'
                  type='number'
                  min='1'
                  value={formData.questionsCount}
                  onChange={handleInputChange}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2'
                  placeholder='e.g., 5'
                  aria-label='Question Count'
                />
                {formErrors.questionsCount && <p className='mt-1 text-sm text-red-600'>{formErrors.questionsCount}</p>}
              </div>
              <div>
                <label className='block text-sm font-medium text-neutral-700 mb-1'>Marks Distribution</label>
                <select
                  value={marksDistribution}
                  onChange={e => setMarksDistribution(e.target.value)}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 p-2'
                  aria-label='Marks distribution type'
                >
                  <option value='individual'>Individual Question Marks</option>
                  <option value='total'>Total Marks for All Questions</option>
                </select>
              </div>
            </div>

            <QuestionDetailsModal
              isOpen={showQuestionDetailsModal}
              onClose={() => setShowQuestionDetailsModal(false)}
              questionPage={questionPage}
              totalQuestionPages={totalQuestionPages}
              currentQuestion={currentQuestion}
              handleQuestionChange={handleQuestionChange}
              formErrors={formErrors}
              marksDistribution={marksDistribution}
              handlePreviousQuestionPage={handlePreviousQuestionPage}
              handleNextQuestionPage={handleNextQuestionPage}
              handleQuestionPageChange={handleQuestionPageChange}
              formData={formData}
              updateFormData={updateFormData}
            />

            {isQuizComplete && (
              <QuizPreview
                quizData={formData}
                marksDistribution={marksDistribution}
                isOpen={showQuizModel}
                onClose={() => setShowQuizModel(false)}
              />
            )}

            <div className='flex justify-end space-x-4 mt-6'>
              <button
                onClick={() => handleAddQuestions(formData)} // Use current formData
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 text-sm font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
                aria-label='Edit Questions'
              >
                Add Your Question
              </button>
              {isQuizComplete && (
                <button
                  onClick={() => setShowQuizModel(true)}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 text-sm font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                  aria-label='Live Preview Quiz'
                >
                  Live Preview
                </button>
              )}
              <button
                onClick={formMode === 'add' ? handleSubmit : handleSaveQuiz}
                className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-200 text-sm font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
                aria-label={formMode === 'add' ? 'Save new quiz' : 'Save quiz changes'}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className='px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 hover:scale-105 transition-all duration-200 text-sm font-medium'
                disabled={isLoading}
                aria-label='Cancel'
              >
                Cancel
              </button>
            </div>
            {showErrorTooltip && (
              <div className='mt-2 text-red-600 text-xs italic'>
                Please fill all fields correctly
              </div>
            )}
          </div>
        </div>
      )}

      {!formMode && (
        <>
          <div className='mb-6'>
            <input
              type='text'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder='Search by title...'
              className='p-2 border rounded-md w-full md:w-1/3 mb-4 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400'
              aria-label='Search quizzes'
            />
          </div>
          {assessments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className='py-3 px-4 text-center text-sm font-medium text-neutral-700'>Title</th>
                    <th className='py-3 px-4 text-center text-sm font-medium text-neutral-700'>Due Date</th>
                    <th className='py-3 px-4 text-center text-sm font-medium text-neutral-700'>Pass Score (%)</th>
                    <th className='py-3 px-4 text-center text-sm font-medium text-neutral-700'>Total Marks</th>
                    <th className='py-3 px-4 text-center text-sm font-medium text-neutral-700'>Answered Students</th>
                    <th className='py-3 px-4 text-center text-sm font-medium text-neutral-700'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments
                    .slice((currentPage - 1) * quizzesPerPage, currentPage * quizzesPerPage)
                    .map((quiz) => (
                      <tr key={quiz.id} className="border-t hover:bg-gray-50 transition-all duration-200">
                        <td className='py-4 px-4 text-center align-middle text-sm text-neutral-900'>{quiz.title}</td>
                        <td className='py-4 px-4 text-center align-middle text-sm text-neutral-600'>
                          {quiz.dueDate && !isNaN(new Date(quiz.dueDate).getTime())
                            ? new Date(quiz.dueDate).toISOString().split('T')[0]
                            : 'No Due Date'}
                        </td>
                        <td className="py-4 px-4 text-center align-middle text-sm text-neutral-600">
                          {quiz.passPercentage !== null ? `${quiz.passPercentage}%` : 'N/A'}
                        </td>
                        <td className='py-4 px-4 text-center align-middle text-sm text-neutral-600'>{quiz.totalMarks}</td>
                        <td className='py-4 px-4 text-sm text-neutral-600'>
                          <div className='flex items-center justify-center space-x-2'>
                            <span>{quiz.answeredStudents}</span>
                            <button
                              onClick={() => handleViewHistory(quiz.id)}
                              className='h-8 w-8 flex items-center justify-center hover:bg-green-200 text-green-600 bg-green-100 rounded-full focus:outline-none transition-all duration-200'
                              aria-label={`View history for quiz ${quiz.title}`}
                            >
                              <User className='w-5 h-5 text-green-700' />
                            </button>
                          </div>
                        </td>
                        <td className='py-4 px-4 text-sm'>
                          <div className='flex justify-center items-center space-x-2'>
                            <button
                              onClick={() => handleAddQuestions(quiz)}
                              disabled={isLoading}
                              className={`p-2 rounded-full hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                              aria-label={`Add questions to quiz ${quiz?.title || 'unknown'}`}
                              title='Add Questions'
                            >
                              <CircleFadingPlus className='w-5 h-5' />
                            </button>
                            <button
                              onClick={() => handleEditQuiz(quiz)}
                              disabled={isLoading}
                              className={`p-2 rounded-full hover:bg-yellow-100 text-yellow-600 hover:text-yellow-800 transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                              aria-label={`Edit quiz ${quiz?.title || 'unknown'}`}
                              title='Edit Assessment'
                            >
                              <Edit className='w-5 h-5' />
                            </button>
                            <button
                              onClick={() => handlePreviewQuestions(quiz)}
                              disabled={isLoading}
                              className={`p-2 rounded-full hover:bg-purple-100 text-purple-600 hover:text-purple-800 transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                              aria-label={`Preview questions for quiz ${quiz?.title || 'unknown'}`}
                              title='Preview Questions'
                            >
                              <Eye className='w-5 h-5' />
                            </button>
                            <button
                              onClick={() => handleDeleteQuiz(quiz.id)}
                              disabled={isLoading}
                              className={`p-2 rounded-full hover:bg-red-100 text-red-600 hover:text-red-800 transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                              aria-label={`Delete quiz ${quiz?.title || 'unknown'}`}
                              title='Delete'
                            >
                              <Trash2 className='w-5 h-5' />
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

          {quizzes.length > quizzesPerPage && (
            <div className='mt-6 flex justify-center items-center space-x-2'>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className='px-3 py-1 bg-gray-200 text-neutral-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed'
                aria-label='Previous page'
              >
                Back
              </button>
              {Array.from({ length: Math.ceil(quizzes.length / quizzesPerPage) }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg transition-all duration-200 text-sm ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-neutral-700 hover:bg-gray-300'}`}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === Math.ceil(quizzes.length / quizzesPerPage)}
                className='px-3 py-1 bg-gray-200 text-neutral-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed'
                aria-label='Next page'
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <QuizPreview
        isOpen={showQuestionPreviewModal}
        onClose={() => {
          setShowQuestionPreviewModal(false);
          setSelectedOption(null);
        }}
        questionPage={questionPage}
        currentQuestion={currentQuestion}
        marksDistribution={marksDistribution}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        formData={formData}
      />
    </div>
  );
};

export default QuizzesTab;