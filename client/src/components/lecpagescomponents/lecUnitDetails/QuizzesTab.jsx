import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuizPreview from "./QuizPreview";
import { User, Edit, Trash2, CircleFadingPlus, Eye } from 'lucide-react';
import QuestionDetailsModal from "../Models/QuestionDetailsModal";
import { addAssessments } from '../../../service/assessments';



const QuizzesTab = ({ unit }) => {
  const initialQuizzes = [
    {
      id: '1',
      title: 'Introduction to JavaScript',
      dueDate: '2025-08-01',
      passingScore: 70,
      totalMarks: 100,
      caMarksPercentage: 20,
      timePeriod: '30 minutes',
      questionCount: 5,
      questions: [
        {
          text: 'What is a closure in JavaScript?',
          options: ['A function', 'A loop', 'A variable', 'An object'],
          correctOption: 0,
          marks: 20
        },
        {
          text: "What is the output of 'typeof null'?",
          options: ['object', 'null', 'undefined', 'string'],
          correctOption: 0,
          marks: 20
        },
        {
          text: 'Which method is used to parse JSON?',
          options: [
            'JSON.parse()',
            'JSON.stringify()',
            'JSON.convert()',
            'JSON.toObject()'
          ],
          correctOption: 0,
          marks: 20
        },
        {
          text: 'What does DOM stand for?',
          options: [
            'Document Object Model',
            'Data Object Model',
            'Dynamic Object Model',
            'Document Order Model'
          ],
          correctOption: 0,
          marks: 20
        },
        {
          text: 'Which keyword declares a variable?',
          options: ['var', 'function', 'class', 'object'],
          correctOption: 0,
          marks: 20
        }
      ],
      answeredStudents: 10
    },
    {
      id: '2',
      title: 'React Basics',
      dueDate: '2025-08-15',
      passingScore: null,
      totalMarks: 50,
      caMarksPercentage: 15,
      timePeriod: '20 minutes',
      questionCount: 3,
      questions: [
        {
          text: 'What is a React component?',
          options: ['A function or class', 'A loop', 'A variable', 'An event'],
          correctOption: 0,
          marks: 15
        },
        {
          text: 'What is JSX?',
          options: [
            'A syntax extension',
            'A JavaScript library',
            'A CSS framework',
            'A database'
          ],
          correctOption: 0,
          marks: 15
        },
        {
          text: 'What manages state in React?',
          options: ['useState', 'useEffect', 'useContext', 'useReducer'],
          correctOption: 0,
          marks: 20
        }
      ],
      answeredStudents: 5
    }
  ]

  const [quizzes, setQuizzes] = useState(unit?.quizzes || initialQuizzes)
  const [formMode, setFormMode] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    passingScore: '',
    dueDate: '',
    totalMarks: '',
    caMarksPercentage: '',
    timePeriod: '',
    questionCount: '',
    questions: [
      { text: '', options: ['', '', '', ''], correctOption: 0, marks: '' }
    ]
  })
  const [formErrors, setFormErrors] = useState({})
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [questionPage, setQuestionPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState({ message: '', type: '', visible: false })
  const [showErrorTooltip, setShowErrorTooltip] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [marksDistribution, setMarksDistribution] = useState('individual')
  const [isQuizComplete, setIsQuizComplete] = useState(false)
  const [showQuizModel, setShowQuizModel] = useState(false)
  const [allowPassingScore, setAllowPassingScore] = useState('yes')
  const [showQuestionDetailsModal, setShowQuestionDetailsModal] =
    useState(false)
  const [showQuestionPreviewModal, setShowQuestionPreviewModal] =
    useState(false)
  const navigate = useNavigate()
  const quizzesPerPage = 5

  const checkQuizCompletion = () => {
    const questionCount = parseInt(formData.questionCount) || 1
    if (questionCount <= 0) {
      setIsQuizComplete(false)
      return false
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

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    if (!formData.title) errors.title = "Quiz Title is required";
    if (!formData.instructions) errors.instructions = "Instructions is required";
    if (allowPassingScore === "yes" && !formData.passingScore) errors.passingScore = "Passing Score is required";
    if (!formData.dueDate) errors.dueDate = "Due Date is required";
    if (!formData.totalMarks) errors.totalMarks = "Total Marks is required";
    if (!formData.caMarksPercentage) errors.caMarksPercentage = "CA Marks Percentage is required";
    if (!formData.timePeriod) errors.timePeriod = "Time Period is required";
    if (!formData.questionCount) errors.questionCount = "Question Count is required";

    formData.questions.slice(0, Number(formData.questionCount)).forEach((q, index) => {
      if (!q.text) errors[`questionText${index}`] = `Question ${index + 1} text is required`;
      q.options.forEach((o, optIndex) => {
        if (!o) errors[`question${index}Option${optIndex}`] = `Question ${index + 1} option ${optIndex + 1} is required`;
      });
      if (marksDistribution === "individual" && !q.marks) {
        errors[`questionMarks${index}`] = `Question ${index + 1} marks are required`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Update quiz completion status
  useEffect(() => {
    console.log("FormData updated:", formData);
    checkQuizCompletion();
  }, [formData, questionPage]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };
      if (name === "questionCount" && value !== "") {
        const count = parseInt(value);
        if (!isNaN(count) && count > 0) {
          updatedFormData.questions = Array.from({ length: count }, (_, i) => ({
            text: prev.questions[i]?.text || '',
            options: prev.questions[i]?.options || ['', '', '', ''],
            correctOption: prev.questions[i]?.correctOption || 0,
            marks: prev.questions[i]?.marks || ''
          }))
          setQuestionPage(prevPage => Math.min(prevPage, count))
        } else {
          updatedFormData.questions = [
            { text: '', options: ['', '', '', ''], correctOption: 0, marks: '' }
          ]
          setQuestionPage(1)
        }
      }
      return updatedFormData
    })
    setFormErrors(prev => ({ ...prev, [name]: '' }))
    setShowErrorTooltip(false)
  }

  const handleQuestionChange = (field, value, index = null) => {
    const newQuestions = [...formData.questions]
    const validQuestionCount = Math.min(
      Number(formData.questionCount) || 0,
      newQuestions.length
    )
    const currentIndex = questionPage - 1

    if (currentIndex >= validQuestionCount) {
      setToast({
        message: 'Invalid question page selected',
        type: 'error',
        visible: true
      })
      return
    }

    const currentQ = newQuestions[currentIndex] || {
      text: '',
      options: ['', '', '', ''],
      correctOption: 0,
      marks: ''
    }

    if (field === 'options') {
      const newOptions = [...currentQ.options]
      newOptions[index] = value
      currentQ.options = newOptions
      setFormErrors(prev => ({
        ...prev,
        [`question${currentIndex}Option${index}`]: ''
      }))
    } else if (field === 'correctOption') {
      currentQ.correctOption = parseInt(value)
    } else {
      currentQ[field] = value
      setFormErrors(prev => ({ ...prev, [`${field}${currentIndex}`]: '' }))
    }
    newQuestions[currentIndex] = currentQ
    setFormData(prev => ({ ...prev, questions: newQuestions }))
    setShowErrorTooltip(false)
  }

  const calculateTotalQuestionMarks = () => {
    const validQuestionCount = Math.min(
      Number(formData.questionCount) || 0,
      formData.questions.length
    )
    return formData.questions
      .slice(0, validQuestionCount)
      .reduce((sum, q) => sum + (Number(q.marks) || 0), 0)
  }

  const handleAddQuiz = () => {
    if (!validateForm()) {
      setShowErrorTooltip(true)
      setToast({
        message: 'Please fill all required fields',
        type: 'error',
        visible: true
      })
      return
    }

    if (
      allowPassingScore === 'yes' &&
      (isNaN(formData.passingScore) ||
        formData.passingScore < 0 ||
        formData.passingScore > 100)
    ) {
      setShowErrorTooltip(true)
      setToast({
        message: 'Invalid Passing Score',
        type: 'error',
        visible: true
      })
      return
    }
    if (
      isNaN(formData.totalMarks) ||
      formData.totalMarks <= 0 ||
      isNaN(formData.caMarksPercentage) ||
      formData.caMarksPercentage < 0 ||
      formData.caMarksPercentage > 100
    ) {
      setShowErrorTooltip(true)
      setToast({
        message: 'Invalid numerical values',
        type: 'error',
        visible: true
      })
      return
    }

    if (marksDistribution === 'individual') {
      const totalQuestionMarks = calculateTotalQuestionMarks()
      if (totalQuestionMarks > Number(formData.totalMarks)) {
        setShowErrorTooltip(true)
        setToast({
          message: `Total question marks (${totalQuestionMarks}) exceed quiz total marks (${formData.totalMarks})`,
          type: 'error',
          visible: true
        })
        return
      }
    }

    setIsLoading(true)
    const newQuiz = {
      id: Date.now().toString(),
      ...formData,
      passingScore:
        allowPassingScore === 'yes' ? Number(formData.passingScore) : null,
      totalMarks: Number(formData.totalMarks),
      caMarksPercentage: Number(formData.caMarksPercentage),
      questionCount: Number(formData.questionCount),
      questions: formData.questions
        .slice(0, Number(formData.questionCount))
        .map(q => ({
          ...q,
          correctOption: Number(q.correctOption),
          marks:
            marksDistribution === 'total'
              ? Number(formData.totalMarks) / Number(formData.questionCount)
              : Number(q.marks)
        })),
      answeredStudents: 0
    }
    setQuizzes(prev => [...prev, newQuiz])
    handleCancel()
    setToast({
      message: 'Quiz added successfully',
      type: 'success',
      visible: true
    })
    setIsLoading(false)
  }

  const handleEditQuiz = quiz => {
    setFormMode(quiz.id)
    setFormData({
      ...quiz,
      questions: quiz.questions || [
        { text: '', options: ['', '', '', ''], correctOption: 0, marks: '' }
      ]
    })
    setAllowPassingScore(quiz.passingScore !== null ? 'yes' : 'no')
    setQuestionPage(1)
    checkQuizCompletion()
  }

  const handleAddQuestions = quiz => {
    setFormMode(quiz.id)
    setFormData({
      ...quiz,
      questions: quiz.questions || [
        { text: '', options: ['', '', '', ''], correctOption: 0, marks: '' }
      ]
    })
    setAllowPassingScore(quiz.passingScore !== null ? 'yes' : 'no')
    setQuestionPage(1)
    setShowQuestionDetailsModal(true)
    checkQuizCompletion()
  }

  const handlePreviewQuestions = quiz => {
    setFormData({
      ...quiz,
      questions: quiz.questions || [
        { text: '', options: ['', '', '', ''], correctOption: 0, marks: '' }
      ]
    })
    setQuestionPage(1)
    setShowQuestionPreviewModal(true)
  }

  const handleSaveQuiz = () => {
    if (!validateForm()) {
      setShowErrorTooltip(true)
      setToast({
        message: 'Please fill all required fields',
        type: 'error',
        visible: true
      })
      return
    }

    if (
      allowPassingScore === 'yes' &&
      (isNaN(formData.passingScore) ||
        formData.passingScore < 0 ||
        formData.passingScore > 100)
    ) {
      setShowErrorTooltip(true)
      setToast({
        message: 'Invalid Passing Score',
        type: 'error',
        visible: true
      })
      return
    }
    if (
      isNaN(formData.totalMarks) ||
      formData.totalMarks <= 0 ||
      isNaN(formData.caMarksPercentage) ||
      formData.caMarksPercentage < 0 ||
      formData.caMarksPercentage > 100
    ) {
      setShowErrorTooltip(true)
      setToast({
        message: 'Invalid numerical values',
        type: 'error',
        visible: true
      })
      return
    }

    if (marksDistribution === 'individual') {
      const totalQuestionMarks = calculateTotalQuestionMarks()
      if (totalQuestionMarks > Number(formData.totalMarks)) {
        setShowErrorTooltip(true)
        setToast({
          message: `Total question marks (${totalQuestionMarks}) exceed quiz total marks (${formData.totalMarks})`,
          type: 'error',
          visible: true
        })
        return
      }
    }

    setIsLoading(true)
    const updatedQuiz = {
      id: formMode,
      ...formData,
      passingScore:
        allowPassingScore === 'yes' ? Number(formData.passingScore) : null,
      totalMarks: Number(formData.totalMarks),
      caMarksPercentage: Number(formData.caMarksPercentage),
      questionCount: Number(formData.questionCount),
      questions: formData.questions
        .slice(0, Number(formData.questionCount))
        .map(q => ({
          ...q,
          correctOption: Number(q.correctOption),
          marks:
            marksDistribution === 'total'
              ? Number(formData.totalMarks) / Number(formData.questionCount)
              : Number(q.marks)
        })),
      answeredStudents: formData.answeredStudents || 0
    }
    setQuizzes(prev => prev.map(q => (q.id === formMode ? updatedQuiz : q)))
    handleCancel()
    setToast({
      message: 'Quiz updated successfully',
      type: 'success',
      visible: true
    })
    setIsLoading(false)
  }

  const handleDeleteQuiz = quizId => {
    setIsLoading(true)
    setQuizzes(prev => prev.filter(q => q.id !== quizId))
    setToast({
      message: 'Quiz deleted successfully',
      type: 'success',
      visible: true
    })
    setIsLoading(false)
  }

  const handleCancel = () => {
    setFormMode(null)
    setFormData({
      title: '',
      description: '',
      instructions: '',
      passingScore: '',
      dueDate: '',
      totalMarks: '',
      caMarksPercentage: '',
      timePeriod: '',
      questionCount: '',
      questions: [
        { text: '', options: ['', '', '', ''], correctOption: 0, marks: '' }
      ]
    })
    setFormErrors({})
    setShowErrorTooltip(false)
    setIsQuizComplete(false)
    setShowQuizModel(false)
    setShowQuestionDetailsModal(false)
    setShowQuestionPreviewModal(false)
    setMarksDistribution('individual')
    setAllowPassingScore('yes')
  }

  const handleSort = key => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending')
      direction = 'descending'
    setSortConfig({ key, direction })
    const sortedQuizzes = [...quizzes].sort((a, b) => {
      const aValue = a[key] ?? (key === 'passingScore' ? -1 : '')
      const bValue = b[key] ?? (key === 'passingScore' ? -1 : '')
      return direction === 'ascending'
        ? aValue < bValue
          ? -1
          : aValue > bValue
          ? 1
          : 0
        : aValue > bValue
        ? -1
        : aValue < bValue
        ? 1
        : 0
    })
    setQuizzes(sortedQuizzes)
  }

  const handleSearch = e => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
    const filteredQuizzes = (unit?.quizzes || initialQuizzes).filter(quiz =>
      quiz.title.toLowerCase().includes(term)
    )
    setQuizzes(filteredQuizzes)
    setCurrentPage(1)
  }

  const handleViewHistory = quizId => {
    navigate(`/student-history/${quizId}`)
  }

  const totalQuestionPages = parseInt(formData.questionCount) || 1
  const currentQuestion = formData.questions[questionPage - 1] || {
    text: '',
    options: ['', '', '', ''],
    correctOption: 0,
    marks: ''
  }

  const handleQuestionPageChange = page => setQuestionPage(page)
  const handleNextQuestionPage = () =>
    questionPage < totalQuestionPages ? setQuestionPage(questionPage + 1) : null
  const handlePreviousQuestionPage = () =>
    questionPage > 1 ? setQuestionPage(questionPage - 1) : null

  const updateFormData = updatedData => {
    setFormData(prev => ({ ...prev, ...updatedData }))
  }

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(
        () => setToast(prev => ({ ...prev, visible: false })),
        3000
      )
      return () => clearTimeout(timer)
    }
  }, [toast.visible])

  return (
    <div className='bg-gray-50 p-6 rounded-lg w-full'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-xl font-semibold text-neutral-900'>
          Quizzes for {unit?.title || 'Unit'}
        </h3>
        {!formMode && (
          <button
            onClick={() => setFormMode('add')}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 text-sm font-medium ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
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
          className={`fixed bottom-12 right-4 p-4 rounded-lg shadow-lg ${
            toast.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-600'
          } animate-fade-in-out`}
        >
          {toast.message}
        </div>
      )}

      {/* ADD Form */}
      {formMode && (
        <div className='bg-white p-6 rounded-lg shadow-md mb-6 max-w-7xl mx-auto w-full'>
          <h4 className='text-lg font-medium text-neutral-900 mb-4'>
            {formMode === 'add' ? 'Add New Quiz' : 'Edit Quiz'}
          </h4>
          <div className='space-y-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <div>
                <label
                  htmlFor='title'
                  className='block text-sm font-medium text-neutral-700 mb-1'
                >
                  Quiz Title
                </label>
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
                {formErrors.title && (
                  <p className='mt-1 text-sm text-red-600'>
                    {formErrors.title}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor='description'
                  className='block text-sm font-medium text-neutral-700 mb-1'
                >
                  Description
                </label>
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
                {formErrors.description && (
                  <p className='mt-1 text-sm text-red-600'>
                    {formErrors.description}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor='instructions'
                  className='block text-sm font-medium text-neutral-700 mb-1'
                >
                  Instructions
                </label>
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
                {formErrors.instructions && (
                  <p className='mt-1 text-sm text-red-600'>
                    {formErrors.instructions}
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-neutral-700 mb-1'>
                  Allow Passing Score
                </label>
                <select
                  value={allowPassingScore}
                  onChange={e => {
                    setAllowPassingScore(e.target.value)
                    if (e.target.value === 'no') {
                      setFormData(prev => ({ ...prev, passingScore: '' }))
                      setFormErrors(prev => ({ ...prev, passingScore: '' }))
                    }
                  }}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 p-2'
                  aria-label='Allow Passing Score'
                >
                  <option value='yes'>Allow</option>
                  <option value='no'>Not Allow</option>
                </select>
              </div>
              {allowPassingScore === 'yes' && (
                <div>
                  <label
                    htmlFor='passingScore'
                    className='block text-sm font-medium text-neutral-700 mb-1'
                  >
                    Passing Score (%)
                  </label>
                  <input
                    id='passingScore'
                    name='passingScore'
                    type='number'
                    min='0'
                    max='100'
                    value={formData.passingScore}
                    onChange={handleInputChange}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2'
                    placeholder='e.g., 75'
                    aria-label='Passing Score'
                  />
                  {formErrors.passingScore && (
                    <p className='mt-1 text-sm text-red-600'>
                      {formErrors.passingScore}
                    </p>
                  )}
                </div>
              )}
              <div>
                <label
                  htmlFor='dueDate'
                  className='block text-sm font-medium text-neutral-700 mb-1'
                >
                  Due Date
                </label>
                <input
                  id='dueDate'
                  name='dueDate'
                  type='date'
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 p-2'
                  aria-label='Due Date'
                />
                {formErrors.dueDate && (
                  <p className='mt-1 text-sm text-red-600'>
                    {formErrors.dueDate}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor='totalMarks'
                  className='block text-sm font-medium text-neutral-700 mb-1'
                >
                  Total Marks
                </label>
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
                {formErrors.totalMarks && (
                  <p className='mt-1 text-sm text-red-600'>
                    {formErrors.totalMarks}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor='caMarksPercentage'
                  className='block text-sm font-medium text-neutral-700 mb-1'
                >
                  CA Marks Percentage (%)
                </label>
                <input
                  id='caMarksPercentage'
                  name='caMarksPercentage'
                  type='number'
                  min='0'
                  max='100'
                  value={formData.caMarksPercentage}
                  onChange={handleInputChange}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2'
                  placeholder='e.g., 20'
                  aria-label='CA Marks Percentage'
                />
                {formErrors.caMarksPercentage && (
                  <p className='mt-1 text-sm text-red-600'>
                    {formErrors.caMarksPercentage}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor='timePeriod'
                  className='block text-sm font-medium text-neutral-700 mb-1'
                >
                  Time Period
                </label>
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
                {formErrors.timePeriod && (
                  <p className='mt-1 text-sm text-red-600'>
                    {formErrors.timePeriod}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor='questionCount'
                  className='block text-sm font-medium text-neutral-700 mb-1'
                >
                  Question Count
                </label>
                <input
                  id='questionCount'
                  name='questionCount'
                  type='number'
                  min='1'
                  value={formData.questionCount}
                  onChange={handleInputChange}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400 p-2'
                  placeholder='e.g., 5'
                  aria-label='Question Count'
                />
                {formErrors.questionCount && (
                  <p className='mt-1 text-sm text-red-600'>
                    {formErrors.questionCount}
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-neutral-700 mb-1'>
                  Marks Distribution
                </label>
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
                onClick={() => setShowQuestionDetailsModal(true)}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 text-sm font-medium ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
                aria-label='Edit Questions'
              >
                Add Your Question
              </button>
              {isQuizComplete && (
                <button
                  onClick={() => setShowQuizModel(true)}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 text-sm font-medium ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading}
                  aria-label='Live Preview Quiz'
                >
                  Live Preview
                </button>
              )}
              <button
                onClick={formMode === 'add' ? handleAddQuiz : handleSaveQuiz}
                className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-200 text-sm font-medium ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
                aria-label={
                  formMode === 'add' ? 'Save new quiz' : 'Save quiz changes'
                }
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

      
      {/* Table Assessment */}
      {!formMode && (
        <>
          <div className='mb-6'>
            <input
              type='text'
              value={searchTerm}
              onChange={handleSearch}
              placeholder='Search by title...'
              className='p-2 border rounded-md w-full md:w-1/3 mb-4 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-neutral-900 placeholder-neutral-400'
              aria-label='Search quizzes'
            />
          </div>
          {quizzes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th
                      className='py-3 px-4 text-center text-sm font-medium text-neutral-700 cursor-pointer hover:bg-gray-200'
                      onClick={() => handleSort('title')}
                      aria-label='Sort by title'
                    >
                      Title{' '}
                      {sortConfig.key === 'title' &&
                        (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th
                      className='py-3 px-4 text-center text-sm font-medium text-neutral-700 cursor-pointer hover:bg-gray-200'
                      onClick={() => handleSort('dueDate')}
                      aria-label='Sort by due date'
                    >
                      Due Date{' '}
                      {sortConfig.key === 'dueDate' &&
                        (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th
                      className='py-3 px-4 text-center text-sm font-medium text-neutral-700 cursor-pointer hover:bg-gray-200'
                      onClick={() => handleSort('passingScore')}
                      aria-label='Sort by passing score'
                    >
                      Pass Score (%){' '}
                      {sortConfig.key === 'passingScore' &&
                        (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th
                      className='py-3 px-4 text-center text-sm font-medium text-neutral-700 cursor-pointer hover:bg-gray-200'
                      onClick={() => handleSort('totalMarks')}
                      aria-label='Sort by total marks'
                    >
                      Total Marks{' '}
                      {sortConfig.key === 'totalMarks' &&
                        (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th
                      className='py-3 px-4 text-center text-sm font-medium text-neutral-700 cursor-pointer hover:bg-gray-200'
                      onClick={() => handleSort('answeredStudents')}
                      aria-label='Sort by answered students'
                    >
                      Answered Students{' '}
                      {sortConfig.key === 'answeredStudents' &&
                        (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th className='py-3 px-4 text-center text-sm font-medium text-neutral-700'>
                      Actions
                    </th>
                    
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
                        <td className='py-4 px-4 text-center align-middle text-sm text-neutral-900'>
                          {quiz.title}
                        </td>
                        <td className='py-4 px-4 text-center align-middle text-sm text-neutral-600'>
                          {quiz.dueDate}
                        </td>
                        <td className="py-4 px-4 text-center align-middle text-sm text-neutral-600">
                          {quiz.passingScore !== null ? `${quiz.passingScore}%` : 'N/A'}
                        </td>
                        <td className='py-4 px-4 text-center align-middle text-sm text-neutral-600'>
                          {quiz.totalMarks}
                        </td>
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
                              onClick={() => handleEditQuiz(quiz)}
                              disabled={isLoading}
                              className={`p-2 rounded-full hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition duration-200 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              aria-label={`Edit quiz ${quiz.title}`}
                              title='Edit'
                            >
                              <CircleFadingPlus className='w-5 h-5' />
                            </button>
                            
                            <button
                              onClick={() => handleAddQuestions(quiz)}
                              disabled={isLoading}
                              className={`p-2 rounded-full hover:bg-yellow-100 text-yellow-600 hover:text-yellow-800 transition duration-200 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              aria-label={`Add questions to quiz ${quiz.title}`}
                              title='Add Questions'
                            >
                             <Edit className='w-5 h-5' />
                            </button>
                            <button
                              onClick={() => handlePreviewQuestions(quiz)}
                              disabled={isLoading}
                              className={`p-2 rounded-full hover:bg-purple-100 text-purple-600 hover:text-purple-800 transition duration-200 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              aria-label={`Preview questions for quiz ${quiz.title}`}
                              title='Preview Questions'
                            >
                              <Eye className='w-5 h-5' />
                            </button>
                            <button
                              onClick={() => handleDeleteQuiz(quiz.id)}
                              disabled={isLoading}
                              className={`p-2 rounded-full hover:bg-red-100 text-red-600 hover:text-red-800 transition duration-200 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              aria-label={`Delete quiz ${quiz.title}`}
                              title='Delete'
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
              {Array.from(
                { length: Math.ceil(quizzes.length / quizzesPerPage) },
                (_, i) => i + 1
              ).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg transition-all duration-200 text-sm ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-neutral-700 hover:bg-gray-300'
                  }`}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={
                  currentPage === Math.ceil(quizzes.length / quizzesPerPage)
                }
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
          setShowQuestionPreviewModal(false)
          setSelectedOption(null)
        }}
        questionPage={questionPage}
        currentQuestion={currentQuestion}
        marksDistribution={marksDistribution}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        formData={formData}
      />
    </div>
  )
}

export default QuizzesTab
