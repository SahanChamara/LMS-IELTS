import React from 'react';
import { CheckCircle, MessageSquare, Clock, AlertTriangle } from 'lucide-react';

const QuestionReview = ({
  question,
  answer,
  index,
  isExpanded,
  onToggleExpansion,
  onScoreChange,
  onFeedbackChange,
  onAutoGrade
}) => {
  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case 'mcq':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'essay':
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case 'reading':
        return <Clock className="h-4 w-4 text-green-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    }
  };

  const getQuestionTypeBadge = (type) => {
    const colors = {
      mcq: 'bg-blue-100 text-blue-800',
      essay: 'bg-purple-100 text-purple-800',
      reading: 'bg-green-100 text-green-800',
      typing: 'bg-orange-100 text-orange-800',
      matching: 'bg-pink-100 text-pink-800',
      oral: 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const canAutoGrade = question.type === 'mcq' || question.type === 'matching';

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={() => onToggleExpansion(question.id)}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg flex items-center">
            {getQuestionTypeIcon(question.type)}
            <span className="ml-2">Question {index + 1}</span>
            <span className={`ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getQuestionTypeBadge(question.type)}`}>
              {question.type.toUpperCase()}
            </span>
            <span className="ml-3 text-sm font-normal text-gray-600">
              ({question.points} {question.points === 1 ? 'point' : 'points'})
            </span>
          </h2>
          <div className="flex items-center space-x-2">
            {answer?.score !== undefined && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                {answer.score} / {question.points}
              </span>
            )}
            <button className="px-2 py-1 text-xs">
              {isExpanded ? '−' : '+'}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 pt-0">
          <div className="space-y-4">
            {/* Question */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Question:</h4>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{question.question}</p>
            </div>

            {/* Passage (for reading questions) */}
            {question.passage && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Passage:</h4>
                <p className="text-gray-900 bg-blue-50 p-3 rounded-md text-sm">
                  {question.passage}
                </p>
              </div>
            )}

            {/* Options (for MCQ) */}
            {question.options && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Options:</h4>
                <div className="space-y-1">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{String.fromCharCode(65 + optIndex)}.</span>
                      <span className="text-sm">{option}</span>
                      {option === question.correctAnswer && (
                        <span className="inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Correct
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Student Answer */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Student Answer:</h4>
              <p className="text-gray-900 bg-yellow-50 p-3 rounded-md">
                {answer?.answer || 'No answer provided'}
              </p>
            </div>

            {/* Correct Answer */}
            {question.correctAnswer && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Correct Answer:</h4>
                <p className="text-gray-900 bg-green-50 p-3 rounded-md">
                  {question.correctAnswer}
                </p>
              </div>
            )}

            {/* Grading Section */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Score (0 - {question.points})
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max={question.points}
                      value={answer?.score || 0}
                      onChange={(e) => onScoreChange(question.id, Number(e.target.value))}
                      className="w-20 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                    />
                    {canAutoGrade && (
                      <button
                        onClick={() => onAutoGrade(question.id)}
                        className="px-2 py-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-xs transition-colors"
                      >
                        Auto Grade
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback
                  </label>
                  <textarea
                    placeholder="Provide feedback for the student..."
                    value={answer?.feedback || ''}
                    onChange={(e) => onFeedbackChange(question.id, e.target.value)}
                    rows={3}
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                  />
                </div>
              </div>
              
              {/* Rubric */}
              {question.rubric && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                  <h5 className="text-sm font-medium text-blue-800 mb-1">Grading Rubric:</h5>
                  <p className="text-sm text-blue-700">{question.rubric}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionReview;