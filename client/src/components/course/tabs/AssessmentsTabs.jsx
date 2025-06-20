import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getQuizByUnitId, postAssessmentMarks } from "../../../service/quizService";

// Define QuizInstructions
const QuizInstructions = ({
  assessment,
  onStart,
  onCancel,
  attemptNumber,
  attemptsLeft,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {assessment.title || "Untitled Assessment"}
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>You can't go back after submitting</li>
              <li>Passing score: {assessment.passPercentage}%</li>
              {assessment.dueDate && (
                <li>
                  Due: {new Date(assessment.dueDate).toLocaleDateString()}
                </li>
              )}
              <li>Total {assessment.totalMarks || "N/A"} marks</li>
              <li>CA Marks Percentage: {assessment.caMarksPercentage}%</li>
            </ul>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onStart}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Begin Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

QuizInstructions.propTypes = {
  assessment: PropTypes.object.isRequired,
  onStart: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  attemptNumber: PropTypes.number.isRequired,
  attemptsLeft: PropTypes.number.isRequired,
};

// Define Quiz
const Quiz = ({ questions, timeLimit, onComplete, onCancel, studentId, assessmentId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);
  const [timerActive, setTimerActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      handleSubmit();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, timerActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const calculateScore = () => {
    return questions.reduce((score, question, index) => {
      if (question.type === "mcq" && answers[index] === question.correctAnswer) {
        return score + question.marks;
      }
      return score;
    }, 0);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setTimerActive(false);

    try {
      const score = calculateScore();
      const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

      // Post assessment marks to API
      const response = await postAssessmentMarks({
        student: localStorage.getItem("user"),
        assessment: assessmentId,
        maxMarks: totalMarks,
        weight: 10, // Hardcoded as per request body example
        marks: score,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to submit assessment marks");
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      onComplete(score, answers);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz. Please try again.");
      setIsSubmitting(false);
      setTimerActive(true); // Re-enable timer if submission fails
    }
  };

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-xl">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">
              Question {currentIndex + 1} of {questions.length}
            </h3>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                timeLeft < 60
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              Time left: {formatTime(timeLeft)}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-4 text-gray-900">
            {currentQuestion.text || "Untitled Question"}
            {currentQuestion.marks > 1 && (
              <span className="ml-2 text-sm text-gray-500">
                ({currentQuestion.marks} marks)
              </span>
            )}
          </h4>
          {currentQuestion.type === "mcq" && (
            <div className="space-y-3">
              {(currentQuestion.options || []).map((option, idx) => (
                <div
                  key={idx}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    answers[currentIndex] === idx
                      ? "bg-indigo-50 border-indigo-600"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handleAnswer(idx)}
                >
                  <div className="flex items-center">
                    <div
                      className={`flex-shrink-0 h-5 w-5 rounded-full border mr-3 flex items-center justify-center ${
                        answers[currentIndex] === idx
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-gray-400"
                      }`}
                    >
                      {answers[currentIndex] === idx && (
                        <svg
                          className="h-3 w-3"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div>{option || "No option provided"}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col-reverse md:flex-row justify-between gap-3">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel Quiz
          </button>
          <div className="flex gap-2 justify-end">
            {currentIndex > 0 && (
              <button
                onClick={handlePrev}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Previous
              </button>
            )}
            {currentIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={answers[currentIndex] === null || isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={answers[currentIndex] === null || isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Quiz"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Quiz.propTypes = {
  questions: PropTypes.array.isRequired,
  timeLimit: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  studentId: PropTypes.string.isRequired,
  assessmentId: PropTypes.string.isRequired,
};

// Define QuizResults
const QuizResults = ({ attempt, assessment, onClose, onRetry }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Assessment Results
            </h2>
            <p className="text-gray-600">
              {attempt.assessmentTitle || "Untitled Assessment"}
            </p>
          </div>
          <div className="flex gap-2">
            {attempt.attemptNumber < (assessment?.attemptsAllowed || 3) &&
              assessment?.status === "active" && (
                <button
                  onClick={onRetry}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
                >
                  Retry
                </button>
              )}
            <button
              onClick={onClose}
              className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-3xl font-bold text-center mb-1">
              {attempt.score}
            </div>
            <div className="text-sm text-gray-600 text-center">Your Score</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-3xl font-bold text-center mb-1">
              {attempt.totalMarks}
            </div>
            <div className="text-sm text-gray-600 text-center">
              Total Marks
            </div>
          </div>
          <div
            className={`p-4 rounded-lg ${
              attempt.passed
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            <div className="text-3xl font-bold text-center mb-1">
              {attempt.scorePercentage}%
            </div>
            <div className="text-sm text-center">
              {attempt.passed ? "Passed" : "Failed"} (Requires{" "}
              {assessment?.passPercentage || "N/A"}%)
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Question Breakdown</h3>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {showDetails ? "Hide details" : "Show details"}
            </button>
          </div>
          {showDetails ? (
            <div className="space-y-4">
              {attempt.questions.map((question, index) => (
                <div
                  key={question.id || index}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedQuestion === index
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedQuestion(index)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Q{index + 1}: {question.text || "Untitled Question"}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Your answer:{" "}
                        <span className="font-mono bg-gray-100 px-1 rounded">
                          {attempt.answers[index] !== null
                            ? question.options?.[attempt.answers[index]] ||
                              attempt.answers[index] || "No answer"
                            : "No answer"}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        question.type === "mcq" &&
                        attempt.answers[index] === question.correctAnswer
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {question.type === "mcq" &&
                      attempt.answers[index] === question.correctAnswer
                        ? `${question.marks} mark${question.marks !== 1 ? "s" : ""}`
                        : "0 marks"}
                    </span>
                  </div>
                  {selectedQuestion === index && question.type === "mcq" && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium text-gray-700">
                        Correct answer:{" "}
                        {question.options?.[question.correctAnswer] || "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {attempt.questions.map((question, index) => (
                <div
                  key={question.id || index}
                  className={`h-10 rounded-md flex items-center justify-center ${
                    question.type === "mcq" &&
                    attempt.answers[index] === question.correctAnswer
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                  title={`Q${index + 1}: ${question.text || "Untitled Question"}`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Return to Assessments
          </button>
        </div>
      </div>
    </div>
  );
};

QuizResults.propTypes = {
  attempt: PropTypes.object.isRequired,
  assessment: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
};

// Define QuizApp
function QuizApp({ assessments, unitId, studentId }) {
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'completed', 'pending'
  const [quizQuestions, setQuizQuestions] = useState({}); // Cache quiz questions by quiz ID

  // Log invalid assessments for debugging
  useEffect(() => {
    const invalidAssessments = assessments.filter(
      (assessment) => !assessment || !assessment._id || !assessment.title
    );
    if (invalidAssessments.length > 0) {
      console.warn("Invalid assessments detected:", invalidAssessments);
    }
  }, [assessments]);

  const startAssessment = (assessment) => {
    setActiveAssessment({
      ...assessment,
      id: assessment._id,
      timeLimit: assessment.duration,
      passingScore: assessment.passPercentage,
      attemptsAllowed: assessment.attemptsAllowed || 3,
    });
    setShowInstructions(true);
  };

  const getQuiz = async () => {
    try {
      const response = await getQuizByUnitId(activeAssessment.id);
      if (!response.success || !response.data) {
        throw new Error("Failed to fetch quiz questions");
      }

      // Transform the response data to match the expected question format
      const questions = response.data.map((quiz, index) => ({
        text: quiz.question || "Untitled Question",
        options: quiz.options[0] || [],
        correctAnswer: quiz.answer,
        marks: quiz.mark || 1,
        type: "mcq",
        id: quiz._id || `question-${index}`,
      }));

      // Cache questions by quiz ID
      const newQuizQuestions = response.data.reduce(
        (acc, quiz) => ({
          ...acc,
          [quiz._id]: {
            text: quiz.question || "Untitled Question",
            options: quiz.options[0] || [],
            correctAnswer: quiz.answer,
            marks: quiz.mark || 1,
            type: "mcq",
          },
        }),
        {}
      );
      setQuizQuestions((prev) => ({ ...prev, ...newQuizQuestions }));

      // Update activeAssessment with questions and totalMarks
      setActiveAssessment((prev) => ({
        ...prev,
        questions,
        totalMarks: questions.reduce((sum, q) => sum + q.marks, 0),
      }));

      // Proceed to the quiz
      setShowInstructions(false);
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
      alert("Failed to load quiz questions. Please try again.");
      setActiveAssessment(null);
      setShowInstructions(false);
    }
  };

  const handleQuizComplete = (score, answers) => {
    const totalMarks =
      activeAssessment.totalMarks ||
      activeAssessment.questions.reduce((sum, q) => sum + q.marks, 0);
    const scorePercentage = Math.round((score / totalMarks) * 100);
    const attemptNumber =
      attempts.filter((a) => a.assessmentId === activeAssessment._id).length + 1;

    const newAttempt = {
      assessmentId: activeAssessment._id,
      assessmentTitle: activeAssessment.title,
      attemptNumber,
      date: new Date(),
      score,
      totalMarks,
      scorePercentage,
      passed: scorePercentage >= activeAssessment.passPercentage,
      answers,
      questions: activeAssessment.questions,
    };

    setAttempts([...attempts, newAttempt]);
    setCurrentAttempt(newAttempt);
    setActiveAssessment(null);
    setShowInstructions(false);
    setShowResults(true);
  };

  return (
    <div className="max-w-8xl mx-auto p-4 md:p-6 rounded-lg">
      {assessments.length === 0 ? (
        <div className="text-center py-10">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No assessments found
          </h3>
          <p className="mt-1 text-gray-500">
            {searchTerm || filter !== "all"
              ? "Try adjusting your search or filter"
              : "No valid assessments available"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6">
          {assessments.map((assessment) => {
            const assessmentAttempts = attempts.filter(
              (a) => a.assessmentId === assessment._id
            );
            const lastAttempt = assessmentAttempts[0];
            const attemptsLeft =
              (assessment.attemptsAllowed || 3) - assessmentAttempts.length;

            return (
              <div
                key={assessment._id}
                className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          lastAttempt?.passed
                            ? "bg-green-100"
                            : assessmentAttempts.length > 0
                            ? "bg-yellow-100"
                            : "bg-gray-100"
                        }`}
                      >
                        {lastAttempt?.passed ? (
                          <svg
                            className="h-6 w-6 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : assessmentAttempts.length > 0 ? (
                          <span className="text-yellow-600 font-medium">!</span>
                        ) : (
                          <span className="text-gray-500 font-medium">?</span>
                        )}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {assessment.title}
                        </h2>
                        <p className="text-gray-600">
                          {assessment.description || "No description provided"}
                        </p>
                        {assessment.dueDate && (
                          <p className="text-sm text-gray-500">
                            Due: {new Date(assessment.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-500">
                        {assessment.questionsCount} Questions
                      </span>
                    </div>
                    {lastAttempt && (
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          Last attempt: {lastAttempt.score}/{lastAttempt.totalMarks}
                        </p>
                        <p
                          className={`text-sm font-medium ${
                            lastAttempt.passed
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {lastAttempt.scorePercentage}% (
                          {lastAttempt.passed ? "Passed" : "Failed"})
                        </p>
                      </div>
                    )}
                    <button
                      onClick={() => startAssessment(assessment)}
                      disabled={
                        attemptsLeft <= 0 || assessment.status === "inactive"
                      }
                      className={`px-4 py-2 rounded-md transition-colors ${
                        attemptsLeft <= 0 || assessment.status === "inactive"
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      {assessmentAttempts.length > 0 ? "Retake" : "Start"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showInstructions && activeAssessment && (
        <QuizInstructions
          assessment={activeAssessment}
          onStart={getQuiz}
          onCancel={() => setActiveAssessment(null)}
          attemptNumber={
            attempts.filter((a) => a.assessmentId === activeAssessment._id)
              .length + 1
          }
          attemptsLeft={
            (activeAssessment.attemptsAllowed || 3) -
            attempts.filter((a) => a.assessmentId === activeAssessment._id).length
          }
        />
      )}

      {activeAssessment && !showInstructions && activeAssessment.questions && (
        <Quiz
          questions={activeAssessment.questions}
          timeLimit={activeAssessment.duration}
          onComplete={handleQuizComplete}
          onCancel={() => setActiveAssessment(null)}
          studentId={studentId}
          assessmentId={activeAssessment.id}
        />
      )}

      {showResults && currentAttempt && (
        <QuizResults
          attempt={currentAttempt}
          assessment={assessments.find(
            (a) => a._id === currentAttempt.assessmentId
          )}
          onClose={() => setShowResults(false)}
          onRetry={() => {
            setShowResults(false);
            startAssessment(
              assessments.find((a) => a._id === currentAttempt.assessmentId)
            );
          }}
        />
      )}
    </div>
  );
}

QuizApp.propTypes = {
  assessments: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      questionsCount: PropTypes.number.isRequired,
      duration: PropTypes.number.isRequired,
      passPercentage: PropTypes.number.isRequired,
      totalMarks: PropTypes.number.isRequired,
      caMarksPercentage: PropTypes.number.isRequired,
      description: PropTypes.string,
      status: PropTypes.oneOf(["active", "inactive"]),
      dueDate: PropTypes.string,
    })
  ).isRequired,
  unitId: PropTypes.string.isRequired,
  studentId: PropTypes.string.isRequired,
};

export default QuizApp;