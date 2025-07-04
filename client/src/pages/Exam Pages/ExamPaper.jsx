import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, AlertCircle, Send } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import ListeningTest from "./ListeningTest";
import SpeakingTest from "./SpeakingTest";

/**
 * @typedef {Object} Exam
 * @property {string} id
 * @property {string} title
 * @property {number} duration
 * @property {number} questions
 * @property {"Beginner" | "Intermediate" | "Advanced"} difficulty
 * @property {"Reading" | "Writing" | "Listening" | "Speaking"} type
 * @property {string} description
 * @property {boolean} available
 * @property {Array} sections - Array of section objects with questions
 */

/**
 * @typedef {Object} ExamPaperProps
 * @property {Exam} exam
 * @property {() => void} onBack
 */

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {"mcq" | "reading" | "typing" | "essay" | "form-completion" | "matching" | "short-answer"} type
 * @property {string} question
 * @property {string[]=} options
 * @property {string=} passage
 */

const ExamPaper = ({ exam, onBack }) => {
  const [timeRemaining, setTimeRemaining] = useState(exam.duration * 60);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const showToast = (title, description, variant) => {
    const toastElement = document.createElement("div");
    toastElement.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
      variant === "destructive" ? "bg-red-500 text-white" : "bg-green-500 text-white"
    }`;
    toastElement.innerHTML = `<strong>${title}</strong><br>${description}`;
    document.body.appendChild(toastElement);
    setTimeout(() => document.body.removeChild(toastElement), 3000);
  };

  const questions = exam.sections
    ? exam.sections.flatMap((section) =>
        section.questions.map((q) => ({
          id: q._id,
          type: q.type,
          question: q.question,
          options: q.options || [],
          passage: q.passage || "",
        }))
      )
    : [];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.ctrlKey &&
        (e.key === "c" || e.key === "v" || e.key === "a" || e.key === "s" || e.key === "p")
      ) {
        e.preventDefault();
        showToast(
          "Action Blocked",
          "Copy, paste, and print functions are disabled during the exam.",
          "destructive"
        );
      }
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I") || (e.ctrlKey && e.key === "u")) {
        e.preventDefault();
        showToast(
          "Access Denied",
          "Developer tools are not allowed during the exam.",
          "destructive"
        );
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      showToast(
        "Action Blocked",
        "Right-click is disabled during the exam.",
        "destructive"
      );
    };

    const handleSelectStart = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("selectstart", handleSelectStart);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", handleSelectStart);
    };
  }, [showToast]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (exam.type === "Listening") {
    return (
      <ListeningTest
        exam={exam} // Pass the full exam object
        onComplete={(answers) => {
          console.log("Listening test completed:", answers);
          onBack();
        }}
        onBack={onBack}
      />
    );
  }

  if (exam.type === "Speaking") {
    return (
      <SpeakingTest
      exam={exam}
        onComplete={(recordings) => {
          console.log("Speaking test completed:", recordings);
          onBack();
        }}
        onBack={onBack}
      />
    );
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    showToast(
      "Exam Submitted Successfully",
      "Your answers have been recorded. You will receive your results soon."
    );
    onBack();
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-800 overflow-hidden">
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Sidebar />
      </aside>
      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg p-4 mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
              <p className="text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  timeRemaining < 300
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                <Clock className="h-5 w-5" />
                <span className="font-mono text-lg">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <button
                onClick={() => setShowSubmitDialog(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Submit Exam</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm border border-blue-200 sticky top-6 rounded-lg shadow">
                <div className="p-4">
                  <h3 className="text-lg font-semibold">Question Navigation</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {questions.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestion(index)}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          currentQuestion === index
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        } ${
                          answers[questions[index].id] ? "border-green-300" : ""
                        } relative`}
                      >
                        {index + 1}
                        {answers[questions[index].id] && (
                          <CheckCircle className="h-3 w-3 absolute -top-1 -right-1 text-green-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg shadow">
                <div className="p-6">
                  {currentQ.type === "reading" && currentQ.passage && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Reading Passage
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg text-gray-800 leading-relaxed">
                        {currentQ.passage}
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Question {currentQuestion + 1}
                    </h3>
                    <p className="text-gray-800 mb-4">{currentQ.question}</p>

                    {currentQ.type === "mcq" && currentQ.options && (
                      <div className="space-y-2">
                        {currentQ.options.map((option, index) => (
                          <label
                            key={index}
                            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <input
                              type="radio"
                              name={`question-${currentQ.id}`}
                              value={option}
                              checked={answers[currentQ.id] === option}
                              onChange={(e) =>
                                handleAnswerChange(currentQ.id, e.target.value)
                              }
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {currentQ.type === "typing" && (
                      <input
                        type="text"
                        placeholder="Type your answer here..."
                        value={answers[currentQ.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(currentQ.id, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}

                    {currentQ.type === "essay" && (
                      <textarea
                        placeholder="Write your essay here..."
                        value={answers[currentQ.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(currentQ.id, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-64 resize-none"
                      />
                    )}
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() =>
                        setCurrentQuestion(Math.max(0, currentQuestion - 1))
                      }
                      disabled={currentQuestion === 0}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentQuestion(
                          Math.min(questions.length - 1, currentQuestion + 1)
                        )
                      }
                      disabled={currentQuestion === questions.length - 1}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showSubmitDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white max-w-md w-full mx-4 rounded-lg shadow">
                <div className="p-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Confirm Submission
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    Are you sure you want to submit your exam? You cannot make
                    changes after submission.
                  </p>
                  <div className="text-sm text-gray-600 mb-4">
                    Answered: {Object.keys(answers).length} of {questions.length}{" "}
                    questions
                  </div>
                  <div className="flex space-x-3 p-6">
                    <button
                      onClick={() => setShowSubmitDialog(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    >
                      Continue Exam
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Submit Exam
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExamPaper;