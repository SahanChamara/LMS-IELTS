import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Download, Send, RotateCcw } from 'lucide-react';
import QuestionReview from './QuestionReview';
import SubmissionSummary from './SubmissionSummary';
// import GradingForm from './GradingForm';
// import FinalizeReviewModal from './FinalizeReviewModal';

const ReviewSubmission = ({ submission, onBack }) => {
  const [submissionDetails, setSubmissionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  
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

  // Enhanced mock data with more realistic content
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
      {
        id: 'q1',
        type: 'mcq',
        question: 'What is the main purpose of the IELTS test?',
        options: [
          'To test English proficiency for academic purposes',
          'To test general knowledge',
          'To test mathematical skills',
          'To test computer skills'
        ],
        correctAnswer: 'To test English proficiency for academic purposes',
        points: 1,
        rubric: 'Multiple choice question - 1 point for correct answer'
      },
      {
        id: 'q2',
        type: 'essay',
        question: 'Write an essay about the advantages and disadvantages of social media. (250 words minimum)',
        points: 5,
        rubric: 'Task Achievement (25%), Coherence & Cohesion (25%), Lexical Resource (25%), Grammatical Range & Accuracy (25%)'
      },
      {
        id: 'q3',
        type: 'reading',
        question: 'According to the passage, what are the three main factors that influence climate change?',
        passage: 'Climate change is influenced by various factors including greenhouse gas emissions, deforestation, and industrial activities. These human activities have significantly altered the Earth\'s atmospheric composition, leading to global warming and environmental changes that affect ecosystems worldwide.',
        points: 3,
        rubric: 'Reading comprehension - 1 point per correct factor identified'
      },
      {
        id: 'q4',
        type: 'essay',
        question: 'Describe a memorable experience from your childhood and explain why it was significant to you.',
        points: 4,
        rubric: 'Content and Organization (50%), Language Use and Grammar (30%), Vocabulary and Style (20%)'
      }
    ],
    answers: [
      {
        questionId: 'q1',
        answer: 'To test English proficiency for academic purposes',
        score: 1,
        autoGraded: true,
        feedback: 'Correct answer! Well done.'
      },
      {
        questionId: 'q2',
        answer: 'Social media has revolutionized the way we communicate and share information. On the positive side, it allows people to connect with friends and family across the globe, provides platforms for businesses to reach customers, and enables the rapid spread of information and awareness about important issues. However, social media also has significant drawbacks including privacy concerns, the spread of misinformation, cyberbullying, and addiction issues that can negatively impact mental health and productivity. The key is finding a balance between leveraging the benefits while being mindful of the potential risks.',
        score: undefined,
        feedback: undefined
      },
      {
        questionId: 'q3',
        answer: 'greenhouse gas emissions, deforestation, industrial activities',
        score: 3,
        autoGraded: false,
        feedback: 'Excellent! You identified all three main factors correctly.'
      },
      {
        questionId: 'q4',
        answer: 'One of my most memorable childhood experiences was learning to ride a bicycle when I was seven years old. My father spent countless hours teaching me in our backyard, holding the back of the bike as I pedaled nervously. The moment I realized he had let go and I was riding on my own was magical. This experience was significant because it taught me the importance of perseverance and trust, and it marked my first real sense of independence and accomplishment.',
        score: undefined,
        feedback: undefined
      }
    ]
  };

  useEffect(() => {
    fetchSubmissionDetails();
  }, []);

  const fetchSubmissionDetails = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmissionDetails(mockSubmissionDetails);
      // Expand first ungraded question by default
      const firstUngraded = mockSubmissionDetails.questions.find(q => {
        const answer = mockSubmissionDetails.answers.find(a => a.questionId === q.id);
        return answer?.score === undefined;
      });
      if (firstUngraded) {
        setExpandedQuestions(new Set([firstUngraded.id]));
      }
    } catch (error) {
      showToast("Error", "Failed to load submission details. Please try again.", "destructive");
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (questionId, score) => {
    if (!submissionDetails) return;

    const updatedAnswers = submissionDetails.answers.map(answer =>
      answer.questionId === questionId ? { ...answer, score } : answer
    );

    setSubmissionDetails({
      ...submissionDetails,
      answers: updatedAnswers
    });
  };

  const handleFeedbackChange = (questionId, feedback) => {
    if (!submissionDetails) return;

    const updatedAnswers = submissionDetails.answers.map(answer =>
      answer.questionId === questionId ? { ...answer, feedback } : answer
    );

    setSubmissionDetails({
      ...submissionDetails,
      answers: updatedAnswers
    });
  };

  const handleAutoGrade = (questionId) => {
    if (!submissionDetails) return;

    const question = submissionDetails.questions.find(q => q.id === questionId);
    const answer = submissionDetails.answers.find(a => a.questionId === questionId);
    
    if (!question || !answer) return;

    let score = 0;
    if (question.type === 'mcq' && question.correctAnswer) {
      score = answer.answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim() ? question.points : 0;
    }

    handleScoreChange(questionId, score);
    
    showToast("Auto-graded", `Question ${submissionDetails.questions.findIndex(q => q.id === questionId) + 1} has been automatically graded.`);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast("Success", "Review saved successfully.");
    } catch (error) {
      showToast("Error", "Failed to save review. Please try again.", "destructive");
    } finally {
      setSaving(false);
    }
  };

  const handleExportReview = async () => {
    try {
      // Simulate export functionality
      await new Promise(resolve => setTimeout(resolve, 500));
      
      showToast("Export Started", "Review export will be available for download shortly.");
    } catch (error) {
      showToast("Export Failed", "Unable to export review. Please try again.", "destructive");
    }
  };

  const handleSendToStudent = async () => {
    try {
      // Simulate sending notification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast("Notification Sent", "Student has been notified about the review update.");
    } catch (error) {
      showToast("Send Failed", "Failed to send notification. Please try again.", "destructive");
    }
  };

  const handleResetReview = async () => {
    if (!submissionDetails) return;

    const resetAnswers = submissionDetails.answers.map(answer => ({
      ...answer,
      score: answer.autoGraded ? answer.score : undefined,
      feedback: answer.autoGraded ? answer.feedback : undefined
    }));

    setSubmissionDetails({
      ...submissionDetails,
      answers: resetAnswers,
      feedback: ''
    });

    showToast("Review Reset", "Manual grades and feedback have been cleared.");
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
  const completionPercentage = Math.round((submissionDetails.answers.filter(a => a.score !== undefined).length / submissionDetails.questions.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg mr-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Review Submission</h1>
              <p className="text-gray-600 mt-1">
                {submissionDetails.studentName} • {submissionDetails.examTitle} • {submissionDetails.sectionTitle}
              </p>
              <div className="flex items-center mt-2 space-x-4">
                <span className="text-sm text-gray-500">
                  Progress: {completionPercentage}% graded
                </span>
                <span className="text-sm text-gray-500">
                  Score: {totalScore}/{submissionDetails.maxScore}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
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
          <SubmissionSummary 
            submission={submissionDetails}
            totalScore={totalScore}
          />
        </div>

        {/* Questions Review */}
        <div className="space-y-6 mb-8">
          {submissionDetails.questions.map((question, index) => {
            const answer = submissionDetails.answers.find(a => a.questionId === question.id);
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
    </div>
  );
};

export default ReviewSubmission;