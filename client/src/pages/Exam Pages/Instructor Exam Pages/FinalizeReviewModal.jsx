import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, User, Calendar, FileText, Star } from 'lucide-react';

const FinalizeReviewModal = ({
  submission,
  onClose,
  onConfirm
}) => {
  const [finalizing, setFinalizing] = useState(false);

  const showToast = (title, description, variant) => {
    const toastElement = document.createElement("div");
    toastElement.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
      variant === "destructive" ? "bg-red-500 text-white" : "bg-green-500 text-white"
    }`;
    toastElement.innerHTML = `<strong>${title}</strong><br>${description}`;
    document.body.appendChild(toastElement);
    setTimeout(() => document.body.removeChild(toastElement), 3000);
  };

  const calculateTotalScore = () => {
    return submission.answers.reduce((total, answer) => total + (answer.score || 0), 0);
  };

  const getCompletionStatus = () => {
    const gradedQuestions = submission.answers.filter((a) => a.score !== undefined).length;
    const totalQuestions = submission.questions.length;
    return { graded: gradedQuestions, total: totalQuestions };
  };

  const handleConfirm = async () => {
    setFinalizing(true);
    
    try {
      // Simulate API call to finalize review
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast(
        "Review Finalized",
        "The submission has been successfully reviewed and the student has been notified."
      );
      
      onConfirm();
    } catch (error) {
      showToast(
        "Error",
        "Failed to finalize review. Please try again.",
        "destructive"
      );
    } finally {
      setFinalizing(false);
    }
  };

  const totalScore = calculateTotalScore();
  const percentage = Math.round((totalScore / submission.maxScore) * 100);
  const completionStatus = getCompletionStatus();
  const isFullyGraded = completionStatus.graded === completionStatus.total;

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeLetter = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white max-w-2xl w-full mx-4 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b">
          <h2 className="flex items-center text-xl font-bold">
            <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
            Finalize Review
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Warning if not fully graded */}
          {!isFullyGraded && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  <h4 className="font-medium text-yellow-800">Incomplete Grading</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    {completionStatus.total - completionStatus.graded} question(s) still need to be graded.
                    You can still finalize the review, but ungraded questions will receive 0 points.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Student Info */}
          <div className="bg-white border border-gray-200 rounded-lg shadow">
            <div className="p-6 pt-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">{submission.studentName}</h3>
                    <p className="text-sm text-gray-600">{submission.examTitle}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {new Date(submission.submissionDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className={`text-2xl font-bold ${getGradeColor(percentage)}`}>
                    {getGradeLetter(percentage)}
                  </div>
                  <div className="text-sm text-gray-600">Grade</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {totalScore} / {submission.maxScore}
                  </div>
                  <div className="text-sm text-gray-600">{percentage}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Review Summary */}
          <div className="bg-white border border-gray-200 rounded-lg shadow">
            <div className="p-6 pt-0">
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Review Summary
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Questions Graded:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    isFullyGraded ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                  } border border-gray-300`}>
                    {completionStatus.graded} / {completionStatus.total}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Overall Feedback:</span>
                  <span className="text-sm text-gray-900">
                    {submission.feedback ? 'Provided' : 'Not provided'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-gray-300">
                    {submission.status === 'reviewed' ? 'Complete Review' : 'Partial Review'}
                  </span>
                </div>
              </div>

              {/* Feedback Preview */}
              {submission.feedback && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h5 className="text-sm font-medium text-blue-800 mb-1">Overall Feedback:</h5>
                  <p className="text-sm text-blue-700">{submission.feedback}</p>
                </div>
              )}
            </div>
          </div>

          {/* Performance Breakdown */}
          <div className="bg-white border border-gray-200 rounded-lg shadow">
            <div className="p-6 pt-0">
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Question Breakdown
              </h4>
              
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {submission.questions.map((question, index) => {
                  const answer = submission.answers.find((a) => a.questionId === question.id);
                  return (
                    <div key={question.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Q{index + 1}</span>
                        <span className="inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium border border-gray-300">
                          {question.type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {answer?.score !== undefined ? answer.score : 0} / {question.points}
                        </span>
                        {answer?.score === undefined && (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={finalizing}
            className={`px-4 py-2 border border-gray-300 rounded-lg ${
              finalizing ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-100 text-gray-700'
            }`}
          >
            Back to Review
          </button>
          <button
            onClick={handleConfirm}
            disabled={finalizing}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              finalizing ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {finalizing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Finalizing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm & Finalize
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalizeReviewModal;