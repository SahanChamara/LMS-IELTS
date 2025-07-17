import React, { useState } from 'react';
import { Save, Calculator } from 'lucide-react';

const GradingForm = ({
  submission,
  onUpdate,
  onSave,
  onFinalize,
  saving
}) => {
  const [overallFeedback, setOverallFeedback] = useState(submission.feedback || '');
  const [status, setStatus] = useState(submission.status || 'submitted');

  const calculateTotalScore = () => {
    return submission.answers.reduce((total, answer) => total + (answer.score || 0), 0);
  };

  const handleOverallFeedbackChange = (feedback) => {
    setOverallFeedback(feedback);
    onUpdate({ ...submission, feedback });
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    onUpdate({ ...submission, status: newStatus });
  };

  const totalScore = calculateTotalScore();
  const percentage = Math.round((totalScore / submission.maxScore) * 100);

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (percentage >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getGradeLetter = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-lg shadow-md">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Overall Grading & Feedback
          </h2>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(percentage)} border`}>
              Grade: {getGradeLetter(percentage)}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-gray-300">
              {totalScore} / {submission.maxScore} ({percentage}%)
            </span>
          </div>
        </div>
      </div>
      <div className="p-6 pt-0 space-y-6">
        {/* Score Breakdown */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-3">Score Breakdown</h4>
          <div className="space-y-2">
            {submission.questions.map((question, index) => {
              const answer = submission.answers.find((a) => a.questionId === question.id);
              return (
                <div key={question.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Question {index + 1} ({question.type})
                  </span>
                  <span className="font-medium">
                    {answer?.score || 0} / {question.points}
                  </span>
                </div>
              );
            })}
            <div className="border-t pt-2 flex items-center justify-between font-bold">
              <span>Total Score</span>
              <span>{totalScore} / {submission.maxScore}</span>
            </div>
          </div>
        </div>

        {/* Overall Feedback */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Feedback
          </label>
          <textarea
            placeholder="Provide overall feedback for the student's performance..."
            value={overallFeedback}
            onChange={(e) => handleOverallFeedbackChange(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            This feedback will be visible to the student along with their score.
          </p>
        </div>

        {/* Status Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Status
          </label>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="submitted">Submitted (Pending Review)</option>
            <option value="graded">Graded (Partial Review)</option>
            <option value="reviewed">Reviewed (Complete)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {status === 'submitted' && 'Submission is pending review'}
            {status === 'graded' && 'Submission has been graded but may need additional review'}
            {status === 'reviewed' && 'Submission review is complete and final'}
          </p>
        </div>

        {/* Performance Insights */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Performance Insights</h4>
          <div className="space-y-2 text-sm text-blue-700">
            <div className="flex justify-between">
              <span>Questions Answered:</span>
              <span>{submission.answers.filter((a) => a.answer).length} / {submission.questions.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Questions Graded:</span>
              <span>{submission.answers.filter((a) => a.score !== undefined).length} / {submission.questions.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Average Score per Question:</span>
              <span>{(totalScore / submission.questions.length).toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            onClick={onSave}
            disabled={saving}
            className={`px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 ${
              saving ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-100 text-gray-700'
            }`}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Progress'}
          </button>
          <button
            onClick={onFinalize}
            disabled={saving}
            className={`px-4 py-2 rounded-lg flex items-center ${
              saving ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            Finalize Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradingForm;