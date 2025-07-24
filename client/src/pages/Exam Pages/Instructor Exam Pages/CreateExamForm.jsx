import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import Lecsidebar from "../../lecturepages/Lecsidebar";
import { useAppDispatch } from '../../../redux/store-config/store';
import { createBasicExamAPI } from '../../../redux/features/examIeltsInstructorSlice';

const CreateExamForm = ({ onBack, onExamCreated, initialData, isEdit = false }) => {
  const dispatch = useAppDispatch();

  const [examData, setExamData] = useState(initialData || {
    title: '',
    duration: 60,
    type: '',
    difficulty: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
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

  const validateForm = () => {
    const newErrors = {};

    if (!examData.title.trim()) {
      newErrors.title = 'Exam title is required';
    }
    if (!examData.type) {
      newErrors.type = 'Exam type is required';
    }
    if (!examData.difficulty) {
      newErrors.difficulty = 'Difficulty level is required';
    }
    if (!examData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (examData.duration < 1) {
      newErrors.duration = 'Duration must be at least 1 minute';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setExamData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSaveAndContinue = async () => {
    if (!validateForm()) {
      showToast("Validation Error", "Please fix all errors before continuing.", "destructive");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      /* const newExam = isEdit ? {
        ...initialData,
        ...examData
      } : {
        id: Date.now().toString(),
        ...examData,
        questions: 0,
        status: 'draft',
        available: false,
        sections: 0,
        sectionsData: [],
        createdAt: new Date().toISOString().split('T')[0]
      }; 

      console.log("new exam mockk data", newExam); */      

      const newExam = {
        title: examData.title,
        description: examData.description,
        duration: examData.duration,
        difficulty: examData.difficulty,
        type: examData.type,
        createdBy: localStorage.getItem("user"),
      };    

      const result = await dispatch(createBasicExamAPI(newExam)).unwrap(); 
      onExamCreated(result);

      showToast(
        isEdit ? "Exam Updated" : "Exam Created",
        isEdit ? "Basic exam details updated successfully." : "Basic exam details saved successfully. Now add sections."
      );
    } catch (error) {      
      showToast("Error", `Failed to ${isEdit ? 'update' : 'create'} exam. Please try again.`, "destructive");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-800 overflow-hidden">
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Lecsidebar />
      </aside>
      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg mr-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? 'Edit Exam' : 'Create New Exam'}
            </h1>
            <p className="text-gray-600">Step 1 of 4: Basic Information</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span className="text-blue-600 font-medium">Basic Info</span>
            <span>Add Sections</span>
            <span>Add Questions</span>
            <span>Review & Publish</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full w-1/4 transition-all duration-300"></div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {isEdit ? 'Edit Exam Details' : 'Exam Details'}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {isEdit ? 'Update the basic information for your IELTS exam' : 'Provide the basic information for your IELTS exam'}
            </p>
          </div>
          <div className="p-6 pt-0 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Exam Title *</label>
              <input
                id="title"
                value={examData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., IELTS Academic Reading Test 1"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.title ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>

            {/* Type and Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Exam Type *</label>
                <select
                  id="type"
                  value={examData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.type ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
                >
                  <option value="">Select exam type</option>
                  <option value="Reading">Reading</option>
                  <option value="Writing">Writing</option>
                  <option value="Listening">Listening</option>
                  <option value="Speaking">Speaking</option>
                </select>
                {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Difficulty Level *</label>
                <select
                  id="difficulty"
                  value={examData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.difficulty ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
                >
                  <option value="">Select difficulty</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                {errors.difficulty && <p className="text-red-500 text-sm">{errors.difficulty}</p>}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes) *</label>
              <input
                id="duration"
                type="number"
                value={examData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                placeholder="60"
                min="1"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.duration ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
              />
              {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
              <textarea
                id="description"
                value={examData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide a detailed description of the exam content and objectives..."
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.description ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6">
              <button
                onClick={onBack}
                className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAndContinue}
                disabled={isLoading}
                className={`px-4 py-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <Save className="h-4 w-4 mr-2 animate-spin" />
                    {isEdit ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    {isEdit ? 'Update & Continue' : 'Save & Continue'}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
};

export default CreateExamForm;