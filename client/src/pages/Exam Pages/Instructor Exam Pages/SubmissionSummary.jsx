import React from 'react';
import { User, Calendar, Clock, Target, Award } from 'lucide-react';

const SubmissionSummary = ({
  submission,
  totalScore
}) => {
  const percentage = Math.round((totalScore / submission.maxScore) * 100);
  const completedQuestions = submission.answers.filter(a => a.answer).length;
  const gradedQuestions = submission.answers.filter(a => a.score !== undefined).length;

  const getStatusBadge = (status) => {
    const colors = {
      submitted: 'bg-yellow-100 text-yellow-800',
      graded: 'bg-blue-100 text-blue-800',
      reviewed: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md">
      <div className="p-6">
        <h2 className="flex items-center justify-between text-xl font-semibold text-gray-900">
          <span className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Submission Summary
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(submission.status)}`}>
            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
          </span>
        </h2>
      </div>
      <div className="p-6 pt-0 space-y-6">
        {/* Student & Exam Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium text-gray-600">Student:</span>
              <span className="ml-2 text-gray-900">{submission.studentName}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium text-gray-600">Submitted:</span>
              <span className="ml-2 text-gray-900">
                {new Date(submission.submissionDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <span className="font-medium text-gray-600">Exam:</span>
              <span className="ml-2 text-gray-900">{submission.examTitle}</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="font-medium text-gray-600">Section:</span>
              <span className="ml-2 text-gray-900">{submission.sectionTitle}</span>
            </div>
          </div>
        </div>

        {/* Score Overview */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Score Overview
            </h4>
            <span className={`text-lg font-bold ${getPerformanceColor(percentage)}`}>
              {totalScore} / {submission.maxScore} ({percentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%`, backgroundColor: getPerformanceColor(percentage).replace('text-', 'bg-') }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>0</span>
            <span>Performance: {percentage >= 80 ? 'Excellent' : percentage >= 60 ? 'Good' : 'Needs Improvement'}</span>
            <span>{submission.maxScore}</span>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{completedQuestions}</div>
            <div className="text-sm text-gray-600">Questions Answered</div>
            <div className="text-xs text-gray-500">of {submission.questions.length}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{gradedQuestions}</div>
            <div className="text-sm text-gray-600">Questions Graded</div>
            <div className="text-xs text-gray-500">of {submission.questions.length}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {Math.round((gradedQuestions / submission.questions.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Review Progress</div>
            <div className="text-xs text-gray-500">completion</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSummary;