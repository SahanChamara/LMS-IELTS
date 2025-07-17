import React, { useState } from 'react';
import { ArrowLeft, Play, Clock, Users, BookOpen, Edit3 } from 'lucide-react';
import Lecsidebar from "../../lecturepages/Lecsidebar";

const PreviewExam = ({ exam, onBack, onExamUpdated }) => {
  const [isToggling, setIsToggling] = useState(false);

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

  const handleToggleAvailability = async () => {
    setIsToggling(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedExam = {
        ...exam,
        available: !exam.available
      };
      
      onExamUpdated(updatedExam);
      showToast(
        exam.available ? "Exam Hidden" : "Exam Made Available",
        exam.available 
          ? "Students can no longer access this exam."
          : "Students can now access this exam."
      );
    } catch (error) {
      showToast("Error", "Failed to update exam availability.", "destructive");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-800 overflow-hidden">
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Lecsidebar />
      </aside>
      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg mr-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Preview Exam</h1>
              <p className="text-gray-600">Review your exam as students will see it</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleToggleAvailability}
              disabled={isToggling}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isToggling 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : exam.available 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isToggling ? 'Updating...' : exam.available ? 'Hide from Students' : 'Make Available'}
            </button>
          </div>
        </div>

        {/* Exam Overview */}
        <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg shadow-md mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{exam.title}</h2>
                <p className="text-gray-600 text-sm mt-2">{exam.description}</p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`
                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  ${
                    exam.type === 'Reading' ? 'bg-blue-100 text-blue-800' :
                    exam.type === 'Writing' ? 'bg-green-100 text-green-800' :
                    exam.type === 'Listening' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }
                `}>
                  {exam.type}
                </span>
                <span className={`
                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  ${exam.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
                `}>
                  {exam.available ? 'Available' : 'Hidden'}
                </span>
              </div>
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 flex items-center justify-center">
                  <Clock className="h-6 w-6 mr-2" />
                  {exam.duration}
                </p>
                <p className="text-sm text-gray-600">Minutes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 mr-2" />
                  {exam.sections || 0}
                </p>
                <p className="text-sm text-gray-600">Sections</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600 flex items-center justify-center">
                  <Edit3 className="h-6 w-6 mr-2" />
                  {exam.questions || 0}
                </p>
                <p className="text-sm text-gray-600">Questions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600 flex items-center justify-center">
                  <Users className="h-6 w-6 mr-2" />
                  0
                </p>
                <p className="text-sm text-gray-600">Submissions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Instructions */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">Exam Instructions</h2>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">General Instructions:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Read all questions carefully before answering</li>
                  <li>• You have {exam.duration} minutes to complete this exam</li>
                  <li>• Answer all questions to the best of your ability</li>
                  <li>• Make sure to review your answers before submitting</li>
                </ul>
              </div>
              
              {exam.type === 'Reading' && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Reading Test Instructions:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Read each passage carefully</li>
                    <li>• Answer questions based on the information in the passages</li>
                    <li>• Transfer your answers to the answer sheet</li>
                  </ul>
                </div>
              )}

              {exam.type === 'Writing' && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">Writing Test Instructions:</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Write at least 250 words for Task 2</li>
                    <li>• Write at least 150 words for Task 1</li>
                    <li>• Plan your response before writing</li>
                    <li>• Check your grammar and spelling</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Start Exam Button */}
        <div className="bg-white/80 backdrop-blur-sm border border-green-200 rounded-lg shadow-md">
          <div className="p-6 pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Ready to Begin?</h3>
              <p className="text-gray-600 mb-6">
                This is how students will see the exam start page. Click the button below to preview the exam experience.
              </p>
              <button
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 text-lg transition-colors"
              >
                <Play className="h-5 w-5" />
                Start Exam Preview
              </button>
            </div>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
};

export default PreviewExam;