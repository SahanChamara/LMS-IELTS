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
 */

/**
 * @typedef {Object} ExamPaperProps
 * @property {Exam} exam
 * @property {() => void} onBack
 */

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {"mcq" | "reading" | "typing" | "essay"} type
 * @property {string} question
 * @property {string[]=} options
 * @property {string=} passage
/** @type {React.FC<ExamPaperProps>} */

const ExamPaper = ({ exam, onBack }) => {
  // Always call hooks at the top level
  const [timeRemaining, setTimeRemaining] = useState(exam.duration * 60);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // Custom toast function as a replacement for useToast
  const showToast = (title, description, variant) => {
    const toastElement = document.createElement("div");
    toastElement.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
      variant === "destructive"
        ? "bg-red-500 text-white"
        : "bg-green-500 text-white"
    }`;
    toastElement.innerHTML = `<strong>${title}</strong><br>${description}`;
    document.body.appendChild(toastElement);
    setTimeout(() => document.body.removeChild(toastElement), 3000);
  };

  // Sample questions based on exam type
  const questions =
    exam.type === "Reading"
      ? [
          {
            id: "1",
            type: "reading",
            passage: `Climate change represents one of the most pressing challenges of our time. The scientific consensus is clear: human activities, particularly the burning of fossil fuels, are the primary drivers of recent climate change. The consequences are already visible in rising sea levels, more frequent extreme weather events, and shifts in precipitation patterns that affect agriculture and water supplies globally.

The transition to renewable energy sources such as solar, wind, and hydroelectric power is essential for reducing greenhouse gas emissions. Many countries have set ambitious targets for carbon neutrality, but achieving these goals requires not only technological innovation but also significant changes in policy, economics, and individual behavior.

Education plays a crucial role in addressing climate change. By understanding the science behind climate change and its impacts, individuals can make informed decisions about their energy consumption, transportation choices, and lifestyle habits. Furthermore, climate education empowers people to advocate for policy changes and support sustainable practices in their communities.`,
            question:
              "According to the passage, what is the primary cause of recent climate change?",
            options: [
              "Natural climate variations",
              "Solar radiation changes",
              "Human activities, particularly burning fossil fuels",
              "Volcanic eruptions",
            ],
          },
          {
            id: "2",
            type: "mcq",
            question:
              "Which of the following is mentioned as a consequence of climate change?",
            options: [
              "Increased volcanic activity",
              "Rising sea levels",
              "Reduced solar radiation",
              "Decreased oxygen levels",
            ],
          },
          {
            id: "3",
            type: "typing",
            question:
              "Complete the sentence: The transition to renewable energy sources is essential for _____ greenhouse gas emissions.",
          },
        ]
      : exam.type === "Writing"
      ? [
          {
            id: "1",
            type: "essay",
            question:
              "Task 1: The chart below shows the percentage of households in different income brackets in three cities. Summarize the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
          },
          {
            id: "2",
            type: "essay",
            question:
              "Task 2: Some people believe that technology has made our lives more complicated, while others argue that it has made life easier. Discuss both views and give your own opinion. Write at least 250 words.",
          },
        ]
      : [
          {
            id: "1",
            type: "mcq",
            question: "What is the capital of Australia?",
            options: ["Sydney", "Melbourne", "Canberra", "Perth"],
          },
          {
            id: "2",
            type: "typing",
            question:
              "Complete the sentence: The Great Wall of China was built to protect against _____.",
          },
        ];

  // Security measures
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Disable common shortcuts
      if (
        e.ctrlKey &&
        (e.key === "c" ||
          e.key === "v" ||
          e.key === "a" ||
          e.key === "s" ||
          e.key === "p")
      ) {
        e.preventDefault();
        showToast(
          "Action Blocked",
          "Copy, paste, and print functions are disabled during the exam.",
          "destructive"
        );
      }
      // Disable F12, Ctrl+Shift+I, Ctrl+U
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.key === "u")
      ) {
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

  // Timer
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

  // Handle Listening Test
  if (exam.type === "Listening") {
    return (
      <ListeningTest
        onComplete={(answers) => {
          console.log("Listening test completed:", answers);
          // In real app, save answers to backend
          onBack();
        }}
        onBack={onBack}
      />
    );
  }

  // Handle Speaking Test
  if (exam.type === "Speaking") {
    return (
      <SpeakingTest
        onComplete={(recordings) => {
          console.log("Speaking test completed:", recordings);
          // In real app, upload recordings to backend
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
    // In a real application, you would send the answers to a server
    showToast(
      "Exam Submitted Successfully",
      "Your answers have been recorded. You will receive your results soon."
    );
    onBack();
  };

  const currentQ = questions[currentQuestion];

  return (
    // <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <div className="flex h-screen bg-neutral-50 text-neutral-800 overflow-hidden">
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Sidebar />
      </aside>
      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
        <div className="max-w-6xl mx-auto">
          {/* Header with Timer */}
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
            {/* Question Navigation */}
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

            {/* Question Content */}
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

                  {/* Navigation Buttons */}
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

          {/* Submit Confirmation Dialog */}
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
                    Answered: {Object.keys(answers).length} of{" "}
                    {questions.length} questions
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
    // </div>
  );
};

export default ExamPaper;
