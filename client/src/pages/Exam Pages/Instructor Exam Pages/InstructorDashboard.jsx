import React, { useState } from 'react';
import { Plus, BookOpen, Users, Clock, Edit3, Eye, FileCheck, TrendingUp, AlertCircle } from 'lucide-react';
import CreateExamForm from './CreateExamForm';
/*import EditExamForm from '@/components/instructor/EditExamForm';
import PreviewExam from '@/components/instructor/PreviewExam';
import SubmissionList from '@/components/instructor/SubmissionList';
import RecentActivityFeed from '@/components/instructor/RecentActivityFeed';
import QuickActionsPanel from '@/components/instructor/QuickActionsPanel'; */

const InstructorDashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showReviewSubmissions, setShowReviewSubmissions] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [exams, setExams] = useState([
    {
      id: '1',
      title: 'IELTS Academic Reading Test 1',
      duration: 60,
      questions: 40,
      difficulty: 'Intermediate',
      type: 'Reading',
      description: 'Complete academic reading test with 3 passages',
      status: 'published',
      available: true,
      sections: 3,
      createdAt: '2024-01-15',
      submissions: 24,
      averageScore: 78
    },
    {
      id: '2',
      title: 'IELTS Listening Practice',
      duration: 40,
      questions: 30,
      difficulty: 'Beginner',
      type: 'Listening',
      description: 'Basic listening comprehension test',
      status: 'draft',
      available: false,
      sections: 4,
      createdAt: '2024-01-20',
      submissions: 0,
      averageScore: 0
    },
    {
      id: '3',
      title: 'IELTS Writing Task 1 & 2',
      duration: 90,
      questions: 2,
      difficulty: 'Advanced',
      type: 'Writing',
      description: 'Academic writing tasks with detailed rubrics',
      status: 'published',
      available: true,
      sections: 2,
      createdAt: '2024-01-18',
      submissions: 18,
      averageScore: 72
    }
  ]);

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
    setExams([...exams, newExam]);
    setShowCreateForm(false);
  };

  const handleExamUpdated = (updatedExam) => {
    setExams(exams.map(exam => exam.id === updatedExam.id ? updatedExam : exam));
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

  const handleViewAnalytics = () => {
    console.log('View Analytics - Feature coming soon');
  };

  if (showCreateForm) {
    return <CreateExamForm onBack={handleBackToDashboard} onExamCreated={handleExamCreated} />;
  }

  if (showEditForm && selectedExam) {
    return <EditExamForm exam={selectedExam} onBack={handleBackToDashboard} onExamUpdated={handleExamUpdated} />;
  }

  if (showPreview && selectedExam) {
    return <PreviewExam exam={selectedExam} onBack={handleBackToDashboard} onExamUpdated={handleExamUpdated} />;
  }

  if (showReviewSubmissions) {
    return <SubmissionList />;
  }

  const publishedExams = exams.filter(exam => exam.status === 'published');
  const draftExams = exams.filter(exam => exam.status === 'draft');
  const totalSubmissions = exams.reduce((sum, exam) => sum + (exam.submissions || 0), 0);
  const pendingReviews = 8; // Mock data
  const averageScore = Math.round(exams.reduce((sum, exam) => sum + (exam.averageScore || 0), 0) / exams.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Instructor Dashboard</h1>
            <p className="text-lg text-gray-600">Manage your IELTS examination system</p>
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

        {/* Enhanced Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Exams</h3>
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{exams.length}</p>
            <p className="text-sm text-gray-500 mt-1">+2 this week</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Published Exams</h3>
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{publishedExams.length}</p>
            <p className="text-sm text-gray-500 mt-1">{`${publishedExams.length}/${exams.length} active`}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Submissions</h3>
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600">{totalSubmissions}</p>
            <p className="text-sm text-gray-500 mt-1">+12 today</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Average Score</h3>
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-orange-600">{`${averageScore}%`}</p>
            <p className="text-sm text-gray-500 mt-1">+3% this month</p>
          </div>
        </div> */}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Activity Feed */}
          {/* <div className="lg:col-span-2">
            <RecentActivityFeed />
          </div> */}

          {/* Quick Actions Panel */}
          {/* <div>
            <QuickActionsPanel
              onCreateExam={handleCreateExam}
              onReviewSubmissions={handleReviewSubmissions}
              onViewAnalytics={handleViewAnalytics}
            />
          </div> */}
        </div>

        {/* Pending Reviews Alert */}
        {pendingReviews > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg mb-8">
            <div className="p-6 flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-800">Pending Reviews</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  You have {pendingReviews} submissions waiting for review.
                </p>
              </div>
              <button
                onClick={handleReviewSubmissions}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
              >
                Review Now
              </button>
            </div>
          </div>
        )}

        {/* Exams Grid */}
        <div className="space-y-6">
          {/* Published Exams */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">Published Exams</h2>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                {publishedExams.length} Active
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedExams.map((exam) => (
                <div key={exam.id} className="bg-white/80 backdrop-blur-sm border border-green-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
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
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-300">
                        Published
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{exam.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{exam.description}</p>
                  </div>
                  <div className="p-4 pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {exam.duration} minutes
                        </span>
                        <span>{exam.questions} questions</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{exam.sections} sections</span>
                        <span className={`
                          inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                          ${
                            exam.difficulty === 'Beginner' ? 'border-green-300 text-green-700' :
                            exam.difficulty === 'Intermediate' ? 'border-yellow-300 text-yellow-700' :
                            'border-red-300 text-red-700'
                          }
                        `}>
                          {exam.difficulty}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                        <div className="text-center">
                          <p className="text-lg font-semibold text-blue-600">{exam.submissions || 0}</p>
                          <p className="text-xs text-gray-500">Submissions</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-green-600">{exam.averageScore || 0}%</p>
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
                        <button
                          onClick={() => handlePreviewExam(exam)}
                          className="flex-1 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-sm transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-1 inline" />
                          Preview
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
              <h2 className="text-2xl font-semibold text-gray-900">Draft Exams</h2>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-orange-50 text-orange-700 text-sm font-medium">
                {draftExams.length} In Progress
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {draftExams.map((exam) => (
                <div key={exam.id} className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
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
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-medium border border-orange-300">
                        Draft
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{exam.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{exam.description}</p>
                  </div>
                  <div className="p-4 pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {exam.duration} minutes
                        </span>
                        <span>{exam.questions} questions</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{exam.sections} sections</span>
                        <span className={`
                          inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                          ${
                            exam.difficulty === 'Beginner' ? 'border-green-300 text-green-700' :
                            exam.difficulty === 'Intermediate' ? 'border-yellow-300 text-yellow-700' :
                            'border-red-300 text-red-700'
                          }
                        `}>
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
    </div>
  );
};

export default InstructorDashboard;