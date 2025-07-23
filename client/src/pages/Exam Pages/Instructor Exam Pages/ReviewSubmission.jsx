import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Download, Send, RotateCcw } from 'lucide-react';
import QuestionReview from './QuestionReview';
import SubmissionSummary from './SubmissionSummary';
import GradingForm from './GradingForm';
import FinalizeReviewModal from './FinalizeReviewModal';
import Lecsidebar from "../../lecturepages/Lecsidebar";

const ReviewSubmission = ({ submission, onBack }) => {
  const [submissionDetails, setSubmissionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());

  const showToast = (title, description, variant) => {
    const toastElement = document.createElement('div');
    toastElement.className = `fixed top-4 right-4 p-3 rounded-lg shadow-lg ${
      variant === 'destructive' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
    } text-sm`;
    toastElement.innerHTML = `<strong>${title}</strong><br>${description}`;
    document.body.appendChild(toastElement);
    setTimeout(() => document.body.removeChild(toastElement), 3000);
  };

  const mockSubmissionDetails = {
    _id: submission._id,
    studentId: submission.studentId,
    studentName: submission.studentName,
    examId: submission.examId,
    examTitle: submission.examTitle,
    sectionId: submission.sectionId,
    sectionTitle: submission.sectionTitle,
    submissionDate: submission.submissionDate,
    status: submission.status,
    totalScore: submission.totalScore,
    feedback: submission.feedback,
    maxScore: submission.maxScore,
    questions: [
      // ... (unchanged)
    ],
    answers: [
      // ... (unchanged)
    ],
  };

  useEffect(() => {
    fetchSubmissionDetails();
  }, []);

  const fetchSubmissionDetails = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmissionDetails(mockSubmissionDetails);
      const firstUngraded = mockSubmissionDetails.questions.find((q) => {
        const answer = mockSubmissionDetails.answers.find((a) => a.questionId === q.id);
        return answer?.score === undefined;
      });
      if (firstUngraded) {
        setExpandedQuestions(new Set([firstUngraded.id]));
      }
    } catch (error) {
      showToast('Error', 'Failed to load submission details. Please try again.', 'destructive');
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (questionId, score) => {
    if (!submissionDetails) return;
    const updatedAnswers = submissionDetails.answers.map((answer) =>
      answer.questionId === questionId ? { ...answer, score } : answer
    );
    setSubmissionDetails({ ...submissionDetails, answers: updatedAnswers });
  };

  const handleFeedbackChange = (questionId, feedback) => {
    if (!submissionDetails) return;
    const updatedAnswers = submissionDetails.answers.map((answer) =>
      answer.questionId === questionId ? { ...answer, feedback } : answer
    );
    setSubmissionDetails({ ...submissionDetails, answers: updatedAnswers });
  };

  const handleAutoGrade = (questionId) => {
    if (!submissionDetails) return;
    const question = submissionDetails.questions.find((q) => q.id === questionId);
    const answer = submissionDetails.answers.find((a) => a.questionId === questionId);
    if (!question || !answer) return;
    let score = 0;
    if (question.type === 'mcq' && question.correctAnswer) {
      score =
        answer.answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()
          ? question.points
          : 0;
    }
    handleScoreChange(questionId, score);
    showToast(
      'Auto-graded',
      `Question ${submissionDetails.questions.findIndex((q) => q.id === questionId) + 1} has been automatically graded.`
    );
  };

  const toggleQuestionExpansion = (questionId) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const calculateTotalScore = () => {
    if (!submissionDetails) return 0;
    return submissionDetails.answers.reduce((total, answer) => total + (answer.score || 0), 0);
  };

  const handleSaveReview = async () => {
    if (!submissionDetails) return;
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast('Success', 'Review saved successfully.');
    } catch (error) {
      showToast('Error', 'Failed to save review. Please try again.', 'destructive');
    } finally {
      setSaving(false);
    }
  };

  const handleExportReview = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      showToast('Export Started', 'Review export will be available for download shortly.');
    } catch (error) {
      showToast('Export Failed', 'Unable to export review. Please try again.', 'destructive');
    }
  };

  const handleSendToStudent = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast('Notification Sent', 'Student has been notified about the review update.');
    } catch (error) {
      showToast('Send Failed', 'Failed to send notification. Please try again.', 'destructive');
    }
  };

  const handleResetReview = async () => {
    if (!submissionDetails) return;
    const resetAnswers = submissionDetails.answers.map((answer) => ({
      ...answer,
      score: answer.autoGraded ? answer.score : undefined,
      feedback: answer.autoGraded ? answer.feedback : undefined,
    }));
    setSubmissionDetails({ ...submissionDetails, answers: resetAnswers, feedback: '' });
    showToast('Review Reset', 'Manual grades and feedback have been cleared.');
  };

  const handleFinalizeReview = () => {
    setShowFinalizeModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!submissionDetails) return null;

  const totalScore = calculateTotalScore();
  const completionPercentage = Math.round(
    (submissionDetails.answers.filter((a) => a.score !== undefined).length / submissionDetails.questions.length) * 100
  );

  return (
    <div className="flex flex-col h-screen bg-neutral-50 text-neutral-800 overflow-hidden">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 z-10 w-64 h-full bg-white shadow-lg lg:block hidden">
        <Lecsidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pt-10 ml-0 lg:ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
            <div className="flex items-center flex-wrap gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to List
              </button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Review Submission</h1>
                <p className="text-sm lg:text-base text-gray-600 mt-1">
                  {submissionDetails.studentName} • {submissionDetails.examTitle} •{' '}
                  {submissionDetails.sectionTitle}
                </p>
                <div className="flex items-center mt-2 space-x-4 text-sm lg:text-base">
                  <span className="text-gray-500">Progress: {completionPercentage}% graded</span>
                  <span className="text-gray-500">Score: {totalScore}/{submissionDetails.maxScore}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={handleExportReview}
                className="px-3 py-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg flex items-center gap-2 text-sm transition-colors"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={handleSendToStudent}
                className="px-3 py-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg flex items-center gap-2 text-sm transition-colors"
              >
                <Send className="h-4 w-4" />
                Notify Student
              </button>
              <button
                onClick={handleResetReview}
                className="px-3 py-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg flex items-center gap-2 text-sm transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              <button
                onClick={handleSaveReview}
                disabled={saving}
                className={`px-3 py-1 flex items-center gap-2 text-sm rounded-lg ${
                  saving
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 transition-colors'
                }`}
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Progress'}
              </button>
              <button
                onClick={handleFinalizeReview}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
              >
                Finalize Review
              </button>
            </div>
          </div>

          {/* Submission Summary */}
          <div className="mb-6">
            <SubmissionSummary submission={submissionDetails} totalScore={totalScore} />
          </div>

          {/* Questions Review */}
          <div className="space-y-6 mb-8">
            {submissionDetails.questions.map((question, index) => {
              const answer = submissionDetails.answers.find((a) => a.questionId === question.id);
              return (
                <QuestionReview
                  key={question.id}
                  question={question}
                  answer={answer}
                  index={index}
                  isExpanded={expandedQuestions.has(question.id)}
                  onToggleExpansion={toggleQuestionExpansion}
                  onScoreChange={handleScoreChange}
                  onFeedbackChange={handleFeedbackChange}
                  onAutoGrade={handleAutoGrade}
                />
              );
            })}
          </div>

          {/* Overall Grading Form */}
          <GradingForm
            submission={submissionDetails}
            onUpdate={setSubmissionDetails}
            onSave={handleSaveReview}
            onFinalize={handleFinalizeReview}
            saving={saving}
          />

          {/* Finalize Modal */}
          {showFinalizeModal && (
            <FinalizeReviewModal
              submission={submissionDetails}
              onClose={() => setShowFinalizeModal(false)}
              onConfirm={onBack}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default ReviewSubmission;