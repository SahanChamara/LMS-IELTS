import React, { useEffect, useState } from "react";
import {
  Plus,
  BookOpen,
  Users,
  Clock,
  Edit3,
  Eye,
  FileCheck,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import CreateExamForm from "./CreateExamForm";
import EditExamForm from "./EditExamForm";
import PreviewExam from "./PreviewExam";
import SubmissionList from "./SubmissionList";
import Lecsidebar from "../../lecturepages/Lecsidebar";
import { useAppDispatch, useAppSelector } from "../../../redux/store-config/store";
import { getAllExamsAPI } from "../../../redux/features/examIeltsInstructorSlice";

const InstructorDashboard = () => {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(getAllExamsAPI());
  }, []);
  
  const { examsIns, loading, error } = useAppSelector((state) => state.examIeltsInstructor);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showReviewSubmissions, setShowReviewSubmissions] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [exams, setExams] = useState(examsIns);

  const handleCreateExam = () => {
    setShowCreateForm(true);
  };
  

  const handleEditExam = (exam) => {
    setSelectedExam(exam);
    setShowEditForm(true);
  };

  const handlePreviewExam = (exam) => {
    setSelectedExam(exam);
    setShowPreview(true);
  };

  const handleReviewSubmissions = () => {
    setShowReviewSubmissions(true);
  };

  const handleExamCreated = (newExam) => {
    setExams({...exams, newExam});
    setShowCreateForm(false);
  };

  const handleExamUpdated = (updatedExam) => {
    setExams(
      exams.map((exam) => (exam._id === updatedExam._id ? updatedExam : exam)) // Use _id for consistency
    );
    setShowEditForm(false);
    setShowPreview(false);
    setSelectedExam(null);
  };

  const handleBackToDashboard = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setShowPreview(false);
    setShowReviewSubmissions(false);
    setSelectedExam(null);
  };

  console.log("exams", exams);
  console.log("exams Ins", examsIns);

  if (error) return <div>Error: {error}</div>;

  if (showCreateForm) {
    return (
      <CreateExamForm
        onBack={handleBackToDashboard}
        onExamCreated={handleExamCreated}
      />
    );
  }

  if (showEditForm && selectedExam) {
    return (
      <EditExamForm
        exam={selectedExam}
        onBack={handleBackToDashboard}
        onExamUpdated={handleExamUpdated}
      />
    );
  }

  if (showPreview && selectedExam) {
    return (
      <PreviewExam
        exam={selectedExam}
        onBack={handleBackToDashboard}
        onExamUpdated={handleExamUpdated}
      />
    );
  }

  if (showReviewSubmissions) {
    return <SubmissionList />;
  }

  const publishedExams = Object.values(exams).filter((exam) => exam.status === "published");
  const draftExams = Object.values(exams).filter((exam) => exam.status === "draft");
  const totalSubmissions = Object.values(exams).reduce(
    (sum, exam) => sum + (exam.submissions || 0),
    0
  );
  const pendingReviews = 8; // Mock data
  const averageScore = Math.round(
    Object.values(exams).reduce((sum, exam) => sum + (exam.averageScore || 0), 0) /
      (Object.values(exams).length || 1) // Avoid division by zero
  );

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-800 overflow-hidden">
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Lecsidebar />
      </aside>
      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Instructor Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Manage your IELTS examination system
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleReviewSubmissions}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors"
              >
                <FileCheck className="h-5 w-5" />
                Review Submissions
                {pendingReviews > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                    {pendingReviews}
                  </span>
                )}
              </button>
              <button
                onClick={handleCreateExam}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-lg transition-colors"
              >
                <Plus className="h-5 w-5" />
                Create New Exam
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Skeleton for loading state will be handled in the Exams Grid below */}
          </div>

          {/* Exams Grid */}
          <div className="space-y-6">
            {/* Published Exams */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Published Exams
                </h2>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                  {loading ? '...' : publishedExams.length} Active
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={index}
                        className="bg-white/80 backdrop-blur-sm border border-green-200 rounded-lg shadow-md animate-pulse"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2 space-x-4">
                            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                          </div>
                          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                        </div>
                        <div className="p-4 pt-0">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm space-x-4">
                              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                            </div>
                            <div className="flex items-center justify-between text-sm space-x-4">
                              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                              <div className="text-center">
                                <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-1"></div>
                                <div className="h-3 bg-gray-300 rounded w-1/3 mx-auto"></div>
                              </div>
                              <div className="text-center">
                                <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-1"></div>
                                <div className="h-3 bg-gray-300 rounded w-1/3 mx-auto"></div>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  : publishedExams.map((exam) => (
                      <div
                        key={exam._id}
                        className="bg-white/80 backdrop-blur-sm border border-green-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`
                                inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                ${
                                  exam.type === "Reading"
                                    ? "bg-blue-100 text-blue-800"
                                    : exam.type === "Writing"
                                    ? "bg-green-100 text-green-800"
                                    : exam.type === "Listening"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-orange-100 text-orange-800"
                                }
                              `}
                            >
                              {exam.type}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-300">
                              Published
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {exam.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {exam.description}
                          </p>
                        </div>
                        <div className="p-4 pt-0">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {exam.duration} minutes
                              </span>
                              <span>{exam.totalQuestions} questions</span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span
                                className={`
                                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                                  ${
                                    exam.difficulty === "Beginner"
                                      ? "border-green-300 text-green-700"
                                      : exam.difficulty === "Intermediate"
                                      ? "border-yellow-300 text-yellow-700"
                                      : "border-red-300 text-red-700"
                                  }
                                `}
                              >
                                {exam.difficulty}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                              <div className="text-center">
                                <p className="text-lg font-semibold text-blue-600">
                                  {exam.submissions || 0}
                                </p>
                                <p className="text-xs text-gray-500">Submissions</p>
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-semibold text-green-600">
                                  {exam.averageScore || 0}%
                                </p>
                                <p className="text-xs text-gray-500">Avg Score</p>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => handleEditExam(exam)}
                                className="flex-1 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-sm transition-colors"
                              >
                                <Edit3 className="h-4 w-4 mr-1 inline" />
                                Edit
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            {/* Draft Exams */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Draft Exams
                </h2>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-orange-50 text-orange-700 text-sm font-medium">
                  {loading ? '...' : draftExams.length} In Progress
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={index}
                        className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-lg shadow-md animate-pulse"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2 space-x-4">
                            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                          </div>
                          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                        </div>
                        <div className="p-4 pt-0">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm space-x-4">
                              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                            </div>
                            <div className="flex items-center justify-between text-sm space-x-4">
                              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  : draftExams.map((exam) => (
                      <div
                        key={exam._id}
                        className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`
                                inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                ${
                                  exam.type === "Reading"
                                    ? "bg-blue-100 text-blue-800"
                                    : exam.type === "Writing"
                                    ? "bg-green-100 text-green-800"
                                    : exam.type === "Listening"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-orange-100 text-orange-800"
                                }
                              `}
                            >
                              {exam.type}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-medium border border-orange-300">
                              Draft
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {exam.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {exam.description}
                          </p>
                        </div>
                        <div className="p-4 pt-0">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {exam.duration} minutes
                              </span>
                              <span>{exam.totalQuestions} questions</span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span
                                className={`
                                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                                  ${
                                    exam.difficulty === "Beginner"
                                      ? "border-green-300 text-green-700"
                                      : exam.difficulty === "Intermediate"
                                      ? "border-yellow-300 text-yellow-700"
                                      : "border-red-300 text-red-700"
                                  }
                                `}
                              >
                                {exam.difficulty}
                              </span>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => handleEditExam(exam)}
                                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                              >
                                <Edit3 className="h-4 w-4 mr-1 inline" />
                                Continue Editing
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboard;